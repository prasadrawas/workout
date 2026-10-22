import { useState, useEffect, useRef, type FC } from 'react';
import { 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Flame, 
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Exercise, SessionProgress, SetLog } from '../types/workout';
import { ExerciseCard } from './ExerciseCard';
import { getExerciseCalories } from '../utils/calories';

interface DailyRehabSectionCardProps {
  exercises: Exercise[];
  sessionProgress: SessionProgress;
  soundEnabled: boolean;
  unit: 'kg' | 'lbs';
  userWeightKg?: number;
  onUpdateSet: (exerciseId: string, setIndex: number, updated: Partial<SetLog>) => void;
  onStartRestTimer: (name: string, durationSec: number) => void;
}

export const DailyRehabSectionCard: FC<DailyRehabSectionCardProps> = ({
  exercises,
  sessionProgress,
  soundEnabled,
  unit,
  userWeightKg = 75,
  onUpdateSet,
  onStartRestTimer
}) => {
  // Calculate completed count and calories
  let completedCount = 0;
  let totalKcal = 0;
  let burnedKcal = 0;

  exercises.forEach((ex) => {
    const sets = sessionProgress.sets?.[ex.id] || [];
    const isDone = sets.length > 0 && sets.every((s) => s.completed);
    if (isDone) completedCount++;

    const cal = getExerciseCalories(ex, isDone ? ex.targetSets : 0, userWeightKg);
    totalKcal += cal.totalKcal;
    burnedKcal += cal.burnedKcal;
  });

  const allCompleted = exercises.length > 0 && completedCount === exercises.length;

  // Auto-collapse state: initial value is true if already all completed
  const [isCollapsed, setIsCollapsed] = useState(() => allCompleted);
  const prevAllCompletedRef = useRef(allCompleted);

  // Auto-collapse when all exercises become completed
  useEffect(() => {
    if (allCompleted && !prevAllCompletedRef.current) {
      // Just completed all daily rehab exercises!
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#a78bfa', '#8b5cf6', '#10b981']
      });
      // Smoothly auto-collapse
      setIsCollapsed(true);
    }
    prevAllCompletedRef.current = allCompleted;
  }, [allCompleted]);

  return (
    <div className={`glass-panel daily-rehab-section-card ${allCompleted ? 'section-all-done' : ''}`}>
      {/* Header Bar */}
      <div 
        className="rehab-section-header" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        role="button"
        tabIndex={0}
      >
        <div className="rehab-section-title-wrap">
          <div className="rehab-icon-badge">
            <ShieldCheck size={20} color="#a78bfa" />
          </div>
          <div>
            <div className="rehab-title-row">
              <h3 className="rehab-section-title">Daily Must-Do Hip & Ankle Rehab</h3>
              <span className="rehab-pill-tag">
                {exercises.length} Exercises · Daily Essentials
              </span>
            </div>
            <p className="rehab-section-subtitle">
              Glute activation, pelvic tilt control, single-leg balance & ankle stability
            </p>
          </div>
        </div>

        <div className="rehab-header-stats">
          <span className="tag-calories" title="Estimated calories for routine">
            <Flame size={12} />
            ~{totalKcal} kcal
          </span>
          <span className={`rehab-progress-badge ${allCompleted ? 'all-done' : ''}`}>
            {allCompleted ? <Check size={13} /> : null}
            {completedCount} of {exercises.length} done
          </span>
          <button 
            className="rehab-collapse-btn" 
            aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
          >
            {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>
      </div>

      {/* Collapsed State Banner */}
      {isCollapsed && (
        <div 
          className={`rehab-collapsed-banner ${allCompleted ? 'completed' : ''}`}
          onClick={() => setIsCollapsed(false)}
        >
          {allCompleted ? (
            <div className="collapsed-banner-content">
              <span className="check-bubble"><Check size={14} /></span>
              <span className="banner-text">All {exercises.length} Daily Rehab Exercises Completed</span>
              <span className="banner-subtext">Tap to review or edit</span>
            </div>
          ) : (
            <div className="collapsed-banner-content">
              <Sparkles size={14} color="#a78bfa" />
              <span className="banner-text">{completedCount} of {exercises.length} completed</span>
              <span className="banner-subtext">Tap to view daily rehab exercises</span>
            </div>
          )}
        </div>
      )}

      {/* Expanded Exercises List */}
      {!isCollapsed && (
        <div className="rehab-exercises-list">
          {exercises.map((exercise) => {
            const exerciseSets = sessionProgress.sets?.[exercise.id] || Array.from(
              { length: exercise.targetSets },
              (_, i) => ({
                setNumber: i + 1,
                targetReps: exercise.targetReps,
                weight: '',
                reps: '',
                completed: false,
                pinchStatus: 'none' as const
              })
            );

            return (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                sets={exerciseSets}
                unit={unit}
                userWeightKg={userWeightKg}
                soundEnabled={soundEnabled}
                onUpdateSet={(setIndex, updated) => onUpdateSet(exercise.id, setIndex, updated)}
                onStartRestTimer={onStartRestTimer}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
