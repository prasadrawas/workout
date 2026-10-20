import type { DayOfWeek, HistoryEntry, SetLog, WeekProgress } from '../types/workout';
import { WORKOUT_PLAN } from '../data/workoutPlan';

const STORAGE_KEY_PROGRESS = 'hipstrong_workout_progress_v1';
const STORAGE_KEY_HISTORY = 'hipstrong_workout_history_v1';

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

export function initializeDefaultProgress(): WeekProgress {
  const currentWeekId = getCurrentWeekId();
  const sessions: Record<string, any> = {};

  WORKOUT_PLAN.forEach((day) => {
    // Morning session
    const morningSets: Record<string, SetLog[]> = {};
    day.morning.exercises.forEach((ex) => {
      morningSets[ex.id] = Array.from({ length: ex.targetSets }, (_, i) => ({
        setNumber: i + 1,
        targetReps: ex.targetReps,
        weight: '',
        reps: '',
        completed: false,
        pinchStatus: 'none'
      }));
    });

    sessions[day.morning.id] = {
      sessionId: day.morning.id,
      completed: false,
      sets: morningSets,
      warmupCompleted: {},
      painScore: 0,
      pinchReported: false,
      sessionNotes: ''
    };

    // Evening session
    const eveningSets: Record<string, SetLog[]> = {};
    day.evening.exercises.forEach((ex) => {
      eveningSets[ex.id] = Array.from({ length: ex.targetSets }, (_, i) => ({
        setNumber: i + 1,
        targetReps: ex.targetReps,
        weight: '',
        reps: '',
        completed: false,
        pinchStatus: 'none'
      }));
    });

    sessions[day.evening.id] = {
      sessionId: day.evening.id,
      completed: false,
      sets: eveningSets,
      painScore: 0,
      pinchReported: false,
      sessionNotes: ''
    };
  });

  return {
    weekId: currentWeekId,
    unit: 'kg',
    userWeightKg: 75,
    soundEnabled: true,
    sessions
  };
}

export function loadWeekProgress(): WeekProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (!raw) return initializeDefaultProgress();
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.sessions) return initializeDefaultProgress();
    if (!parsed.userWeightKg) parsed.userWeightKg = 75;
    return parsed;
  } catch (e) {
    console.error('Failed to load progress from localStorage', e);
    return initializeDefaultProgress();
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

export function resetCurrentWeek(): WeekProgress {
  const newProgress = initializeDefaultProgress();
  saveWeekProgress(newProgress);
  return newProgress;
}

export function exportBackupJSON(): string {
  const data = {
    exportDate: new Date().toISOString(),
    progress: loadWeekProgress(),
    history: loadHistory()
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupJSON(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (data.progress) {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(data.progress));
    }
    if (data.history && Array.isArray(data.history)) {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(data.history));
    }
    return true;
  } catch (e) {
    console.error('Failed to import backup JSON', e);
    return false;
  }
}
