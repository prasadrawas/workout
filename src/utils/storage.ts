import type { DayOfWeek, HistoryEntry, SessionPlan, SetLog, WeekProgress, WeightLogEntry, WorkoutPlan } from '../types/workout';
import { BUNDLED_JSON_PLANS, DEFAULT_PLAN } from '../data/plans';

const STORAGE_KEY_PROGRESS = 'hipstrong_workout_progress_v1';
const STORAGE_KEY_HISTORY = 'hipstrong_workout_history_v1';
const STORAGE_KEY_PLANS = 'hipstrong_workout_plans_v2';
const STORAGE_KEY_ACTIVE_PLAN = 'hipstrong_active_plan_id_v2';
const STORAGE_KEY_WEIGHT_LOGS = 'hipstrong_weight_logs_v1';

export function getTodayDayOfWeek(): DayOfWeek {
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayIndex = new Date().getDay();
  return days[dayIndex];
}

export function getCurrentWeekId(): string {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
  const weekNum = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

// -------------------------------------------------------------
// WORKOUT PLANS MANAGEMENT (Auto-discovers all src/data/plans/*.json)
// -------------------------------------------------------------
export function loadWorkoutPlans(): WorkoutPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLANS);
    const planMap = new Map<string, WorkoutPlan>();

    // 1. Register all bundled JSON plans from src/data/plans/
    BUNDLED_JSON_PLANS.forEach((p) => planMap.set(p.id, p));

    // 2. Merge any user-saved / custom plans from localStorage
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((p: WorkoutPlan) => {
          if (p && p.id) {
            planMap.set(p.id, p);
          }
        });
      }
    }

    return Array.from(planMap.values());
  } catch (e) {
    console.error('Failed to load plans from localStorage', e);
    return BUNDLED_JSON_PLANS;
  }
}

export function saveWorkoutPlans(plans: WorkoutPlan[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(plans));
  } catch (e) {
    console.error('Failed to save plans to localStorage', e);
  }
}

const STORAGE_KEY_DEFAULT_MIGRATION = 'hipstrong_plan_default_v2_applied';

export function getActivePlanId(): string {
  try {
    const migrated = localStorage.getItem(STORAGE_KEY_DEFAULT_MIGRATION);
    if (migrated !== DEFAULT_PLAN.id) {
      localStorage.setItem(STORAGE_KEY_DEFAULT_MIGRATION, DEFAULT_PLAN.id);
      localStorage.setItem(STORAGE_KEY_ACTIVE_PLAN, DEFAULT_PLAN.id);
      return DEFAULT_PLAN.id;
    }
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_PLAN);
    if (saved) return saved;
  } catch (e) {
    console.error('Failed to get active plan id', e);
  }
  return DEFAULT_PLAN.id;
}

export function saveActivePlanId(planId: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_PLAN, planId);
  } catch (e) {
    console.error('Failed to save active plan id', e);
  }
}

export function exportPlanJSON(plan: WorkoutPlan): string {
  return JSON.stringify(plan, null, 2);
}

export function importPlanJSON(jsonStr: string): WorkoutPlan | null {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || !parsed.name || !Array.isArray(parsed.days)) {
      throw new Error('Invalid workout plan structure. Must contain name and days array.');
    }
    const cleanPlan: WorkoutPlan = {
      id: parsed.id || `custom-plan-${Date.now()}`,
      name: parsed.name,
      description: parsed.description || 'Imported custom workout plan',
      focusTag: parsed.focusTag || 'Custom Plan',
      isCustom: true,
      days: parsed.days
    };
    return cleanPlan;
  } catch (e) {
    console.error('Failed to parse plan JSON', e);
    return null;
  }
}

// -------------------------------------------------------------
// PROGRESS INITIALIZATION & MERGING
// -------------------------------------------------------------
function buildSessionProgress(session: SessionPlan) {
  const sets: Record<string, SetLog[]> = {};
  session.exercises.forEach((ex) => {
    sets[ex.id] = Array.from({ length: ex.targetSets }, (_, i) => ({
      setNumber: i + 1,
      targetReps: ex.targetReps,
      weight: '',
      reps: '',
      completed: false,
      pinchStatus: 'none'
    }));
  });

  return {
    sessionId: session.id,
    completed: false,
    sets,
    warmupCompleted: {},
    painScore: 0,
    pinchReported: false,
    sessionNotes: ''
  };
}

export function initializeDefaultProgress(plan?: WorkoutPlan): WeekProgress {
  const currentWeekId = getCurrentWeekId();
  const targetPlan = plan || DEFAULT_PLAN;
  const sessions: Record<string, any> = {};

  targetPlan.days.forEach((day) => {
    if (day.morning) {
      sessions[day.morning.id] = buildSessionProgress(day.morning);
    }
    if (day.evening) {
      sessions[day.evening.id] = buildSessionProgress(day.evening);
    }
  });

  return {
    weekId: currentWeekId,
    activePlanId: targetPlan.id,
    unit: 'kg',
    userWeightKg: 75,
    soundEnabled: true,
    sessions
  };
}

export function ensurePlanSessions(progress: WeekProgress, plan: WorkoutPlan): WeekProgress {
  const updatedSessions = { ...progress.sessions };
  let modified = false;

  plan.days.forEach((day) => {
    [day.morning, day.evening].forEach((session) => {
      if (!session) return;
      if (!updatedSessions[session.id]) {
        updatedSessions[session.id] = buildSessionProgress(session);
        modified = true;
      } else {
        // Ensure all exercises in this session have sets initialized
        const existingSession = { ...updatedSessions[session.id] };
        let sessionModified = false;
        const currentSets = { ...(existingSession.sets || {}) };

        session.exercises.forEach((ex) => {
          if (!currentSets[ex.id] || currentSets[ex.id].length === 0) {
            currentSets[ex.id] = Array.from({ length: ex.targetSets }, (_, i) => ({
              setNumber: i + 1,
              targetReps: ex.targetReps,
              weight: '',
              reps: '',
              completed: false,
              pinchStatus: 'none'
            }));
            sessionModified = true;
          }
        });

        if (sessionModified) {
          existingSession.sets = currentSets;
          updatedSessions[session.id] = existingSession;
          modified = true;
        }
      }
    });
  });

  if (modified || progress.activePlanId !== plan.id) {
    return {
      ...progress,
      activePlanId: plan.id,
      sessions: updatedSessions
    };
  }

  return progress;
}

export function loadWeekProgress(plan?: WorkoutPlan): WeekProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (!raw) return initializeDefaultProgress(plan);
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.sessions) return initializeDefaultProgress(plan);
    if (!parsed.userWeightKg) parsed.userWeightKg = 75;
    if (plan) {
      return ensurePlanSessions(parsed, plan);
    }
    return parsed;
  } catch (e) {
    console.error('Failed to load progress from localStorage', e);
    return initializeDefaultProgress(plan);
  }
}

export function saveWeekProgress(progress: WeekProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load history', e);
    return [];
  }
}

export function addHistoryEntry(entry: HistoryEntry): void {
  try {
    const history = loadHistory();
    const updated = [entry, ...history.filter(h => h.id !== entry.id)].slice(0, 100);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to add history entry', e);
  }
}

export function resetCurrentWeek(plan?: WorkoutPlan): WeekProgress {
  const newProgress = initializeDefaultProgress(plan);
  saveWeekProgress(newProgress);
  return newProgress;
}

export function loadWeightLogs(): WeightLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WEIGHT_LOGS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load weight logs', e);
    return [];
  }
}

export function addWeightLogEntry(entry: WeightLogEntry): void {
  try {
    const current = loadWeightLogs();
    const updated = [entry, ...current.filter(w => w.id !== entry.id)].slice(0, 300);
    localStorage.setItem(STORAGE_KEY_WEIGHT_LOGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save weight log', e);
  }
}

export function deleteWeightLogEntry(id: string): void {
  try {
    const current = loadWeightLogs();
    const updated = current.filter(w => w.id !== id);
    localStorage.setItem(STORAGE_KEY_WEIGHT_LOGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete weight log', e);
  }
}

export function exportBackupJSON(): string {
  const data = {
    exportDate: new Date().toISOString(),
    plans: loadWorkoutPlans(),
    activePlanId: getActivePlanId(),
    progress: loadWeekProgress(),
    history: loadHistory(),
    weightLogs: loadWeightLogs()
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupJSON(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (data.plans && Array.isArray(data.plans)) {
      saveWorkoutPlans(data.plans);
    }
    if (data.activePlanId) {
      saveActivePlanId(data.activePlanId);
    }
    if (data.progress) {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(data.progress));
    }
    if (data.history && Array.isArray(data.history)) {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(data.history));
    }
    if (data.weightLogs && Array.isArray(data.weightLogs)) {
      localStorage.setItem(STORAGE_KEY_WEIGHT_LOGS, JSON.stringify(data.weightLogs));
    }
    return true;
  } catch (e) {
    console.error('Failed to import backup JSON', e);
    return false;
  }
}

