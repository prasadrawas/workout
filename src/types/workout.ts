export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type SessionType = 'morning' | 'evening';

export type PinchStatus = 'none' | 'mild' | 'pinch' | 'stopped';

export interface SetLog {
  setNumber: number;
  targetReps: string;
  weight: string;
  reps: string;
  completed: boolean;
  pinchStatus?: PinchStatus;
}

export interface Exercise {
  id: string;
  name: string;
  targetSets: number;
  targetReps: string;
  defaultRestSec: number;
  category: 'legs' | 'push' | 'pull' | 'core' | 'hip-rehab' | 'mobility' | 'cardio';
  notes?: string;
  isTimeBased?: boolean;
  rightHipFocus?: boolean;
  met?: number; // Metabolic Equivalent of Task (Compendium of Physical Activities)
  durationSecPerSet?: number; // Estimated active duration per set in seconds
}

export interface WarmupItem {
  id: string;
  name: string;
  target: string;
  durationSec?: number;
  completed: boolean;
  note?: string;
  met?: number;
}

export interface SessionPlan {
  id: string;
  title: string;
  subtitle: string;
  location: 'Gym' | 'Home';
  durationEstimate: string;
  description?: string;
  exercises: Exercise[];
  hasWarmup?: boolean;
}

export interface DayPlan {
  dayId: DayOfWeek;
  dayName: string;
  shortName: string;
  morning: SessionPlan;
  evening: SessionPlan;
}

export interface SessionProgress {
  sessionId: string; // e.g. "monday-morning"
  completed: boolean;
  completedAt?: string;
  painScore?: number; // 0-10
  pinchReported?: boolean;
  sessionNotes?: string;
  caloriesBurned?: number;
  sets: Record<string, SetLog[]>; // exerciseId -> SetLog[]
  warmupCompleted?: Record<string, boolean>; // warmupItemId -> boolean
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  focusTag?: string;
  isCustom?: boolean;
  days: DayPlan[];
}

export interface WeekProgress {
  weekId: string; // e.g. "2026-W43"
  activePlanId?: string;
  unit: 'kg' | 'lbs';
  userWeightKg: number; // For accurate calorie expenditure calculation
  soundEnabled: boolean;
  sessions: Record<string, SessionProgress>; // sessionId -> SessionProgress
}

export interface HistoryEntry {
  id: string;
  planId?: string;
  planName?: string;
  date: string;
  dayName: string;
  sessionTitle: string;
  sessionType: SessionType;
  durationMinutes?: number;
  completedSetsCount: number;
  totalSetsCount: number;
  caloriesBurned?: number;
  painScore?: number;
  pinchReported: boolean;
  notes?: string;
}

export interface ProgressionPhase {
  title: string;
  weeks: string;
  goal: string;
  recommendations: string[];
}

export interface WeightLogEntry {
  id: string;
  date: string;
  time: string;
  timestamp: number;
  weightKg: number;
  displayWeight: number;
  unit: 'kg' | 'lbs';
  note?: string;
}
