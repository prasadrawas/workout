import type { Exercise, SessionPlan, SessionProgress, WarmupItem } from '../types/workout';
import { MORNING_WARMUP_ROUTINE } from '../data/workoutPlan';

/**
 * SCIENTIFIC CALORIE EXPENDITURE FORMULA
 *
 * Source: Compendium of Physical Activities (Ainsworth et al.)
 *
 * Formula:
 *   Calories (kcal) = Duration (minutes) × [ (MET × 3.5 × Weight (kg)) / 200 ]
 *
 * Where:
 *   - MET: Metabolic Equivalent of Task
 *          1 MET = 3.5 mL O₂ / kg / min (resting metabolic rate)
 *   - Weight: Body weight in kilograms
 *   - 200: Conversion factor from mL O₂ / min to kcal / min (1 L O₂ ≈ 5 kcal)
 */

export const DEFAULT_BODY_WEIGHT_KG = 75; // ~165 lbs

// Standard MET values from the Compendium of Physical Activities
export const CATEGORY_DEFAULT_MET: Record<string, number> = {
  legs: 5.2,       // Moderate-to-vigorous resistance training (leg press, step-ups)
  push: 4.5,       // Machine & dumbbell presses
  pull: 4.5,       // Rows, pulldowns, curls
  core: 3.8,       // Pallof press, dead bugs, bird dogs, planks
  'hip-rehab': 3.5,// Targeted bands, glute bridges, clamshells, hip abduction
  mobility: 2.3,   // Mild stretching, QL lengthening, hip-flexor mobility
  cardio: 5.0      // Easy stationary cycling (50-100W) or brisk walking
};

/**
 * Calculates raw calories burned given MET, body weight in kg, and duration in minutes.
 */
export function calculateCaloriesFromMET(met: number, weightKg: number, durationMinutes: number): number {
  if (weightKg <= 0 || durationMinutes <= 0 || met <= 0) return 0;
  // Exact Compendium formula:
  const kcalPerMinute = (met * 3.5 * weightKg) / 200;
  return Math.round(kcalPerMinute * durationMinutes);
}

/**
 * Resolves the effective MET for an exercise
 */
export function getExerciseMET(exercise: Exercise): number {
  if (exercise.met && exercise.met > 0) return exercise.met;
  return CATEGORY_DEFAULT_MET[exercise.category] || 4.0;
}

/**
 * Estimates active duration in minutes for a set or exercise
 */
export function getSetDurationMinutes(exercise: Exercise): number {
  if (exercise.durationSecPerSet && exercise.durationSecPerSet > 0) {
    return exercise.durationSecPerSet / 60;
  }

  // If time-based, parse from targetReps (e.g. "20–30 seconds", "10 minutes, easy")
  if (exercise.isTimeBased) {
    const text = exercise.targetReps.toLowerCase();
    if (text.includes('minute')) {
      const match = text.match(/(\d+)/);
      if (match) return parseInt(match[1], 10);
      return 10;
    }
    if (text.includes('sec')) {
      const match = text.match(/(\d+)/);
      const seconds = match ? parseInt(match[1], 10) : 30;
      const isEachSide = text.includes('each');
      return ((seconds * (isEachSide ? 2 : 1)) + (exercise.defaultRestSec || 30)) / 60;
    }
  }

  // Standard resistance set: ~40 seconds active work + rest recovery period
  // Active work: ~40 sec (0.67 min) at full exercise MET
  // Recovery period: ~60-90 sec elevated post-exercise oxygen consumption
  // In exercise physiology, a resistance training set block accounts for ~1.5 - 2.0 min
  const workSec = 40;
  const restSec = Math.min(exercise.defaultRestSec || 60, 90);
  return (workSec + restSec * 0.5) / 60;
}

/**
 * Calculates calories for an exercise: both total potential and currently burned based on completed sets.
 */
export function getExerciseCalories(
  exercise: Exercise,
  completedSetsCount: number,
  weightKg: number = DEFAULT_BODY_WEIGHT_KG
): { burnedKcal: number; totalKcal: number; met: number; durationPerSetMin: number } {
  const met = getExerciseMET(exercise);
  const durationPerSet = getSetDurationMinutes(exercise);

  const totalDuration = durationPerSet * exercise.targetSets;
  const completedDuration = durationPerSet * completedSetsCount;

  const totalKcal = Math.max(1, calculateCaloriesFromMET(met, weightKg, totalDuration));
  const burnedKcal = completedSetsCount === 0 
    ? 0 
    : completedSetsCount >= exercise.targetSets 
      ? totalKcal 
      : Math.max(1, calculateCaloriesFromMET(met, weightKg, completedDuration));

  return {
    burnedKcal,
    totalKcal,
    met,
    durationPerSetMin: Number(durationPerSet.toFixed(1))
  };
}

/**
 * Calculates calories for warmup items
 */
export function getWarmupCalories(
  item: WarmupItem,
  isCompleted: boolean,
  weightKg: number = DEFAULT_BODY_WEIGHT_KG
): { burnedKcal: number; totalKcal: number } {
  const met = item.met || (item.id === 'warmup-bike' ? 5.0 : 2.5);
  let durationMinutes = 1.0;

  if (item.durationSec) {
    durationMinutes = item.durationSec / 60;
  } else if (item.target.includes('minute')) {
    const match = item.target.match(/(\d+)/);
    durationMinutes = match ? parseInt(match[1], 10) : 5;
  } else {
    durationMinutes = 1.5;
  }

  const totalKcal = Math.max(1, calculateCaloriesFromMET(met, weightKg, durationMinutes));
  return {
    burnedKcal: isCompleted ? totalKcal : 0,
    totalKcal
  };
}

/**
 * Calculates total session calories (completed and estimated total)
 */
export function calculateSessionCalories(
  session: SessionPlan,
  sessionProgress: SessionProgress | undefined,
  weightKg: number = DEFAULT_BODY_WEIGHT_KG
): { burnedKcal: number; totalKcal: number } {
  let burned = 0;
  let total = 0;

  // 1. Warmup items (if morning gym session has warmup)
  if (session.hasWarmup) {
    MORNING_WARMUP_ROUTINE.forEach((item) => {
      const isCompleted = !!sessionProgress?.warmupCompleted?.[item.id];
      const { burnedKcal, totalKcal } = getWarmupCalories(item, isCompleted, weightKg);
      burned += burnedKcal;
      total += totalKcal;
    });
  }

  // 2. Exercises
  session.exercises.forEach((ex) => {
    const sets = sessionProgress?.sets?.[ex.id] || [];
    const completedCount = sets.filter((s) => s.completed).length;
    const { burnedKcal, totalKcal } = getExerciseCalories(ex, completedCount, weightKg);
    burned += burnedKcal;
    total += totalKcal;
  });

  return {
    burnedKcal: burned,
    totalKcal: total
  };
}
