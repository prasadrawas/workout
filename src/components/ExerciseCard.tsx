import type { FC } from 'react';
import { Shield, Timer, Check, Plus, Minus, AlertTriangle, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Exercise, PinchStatus, SetLog } from '../types/workout';
import { playSetCompletePop } from '../utils/audio';
import { getExerciseCalories } from '../utils/calories';

interface ExerciseCardProps {
  exercise: Exercise;
  sets: SetLog[];
  unit: 'kg' | 'lbs';
  userWeightKg?: number;
  soundEnabled: boolean;
  onUpdateSet: (setIndex: number, updated: Partial<SetLog>) => void;
  onStartRestTimer: (exerciseName: string, durationSec: number) => void;
}

export const ExerciseCard: FC<ExerciseCardProps> = ({
  exercise,
  sets,
  unit,
  userWeightKg = 75,
  soundEnabled,
  onUpdateSet,
  onStartRestTimer
}) => {
  const completedSetsCount = sets.filter(s => s.completed).length;
  const allSetsCompleted = sets.length > 0 && completedSetsCount === sets.length;

  // Calorie calculations based on Compendium MET formula
  const { burnedKcal, totalKcal, met } = getExerciseCalories(exercise, completedSetsCount, userWeightKg);

  // Exercise pinch status is the most severe among sets, or current set's pinch
  const currentPinchStatus: PinchStatus = sets.find(s => s.pinchStatus === 'pinch')?.pinchStatus
    || sets.find(s => s.pinchStatus === 'mild')?.pinchStatus
    || sets[0]?.pinchStatus
    || 'none';

  const handleToggleSet = (index: number) => {
    const set = sets[index];
    const willBeCompleted = !set.completed;

    if (willBeCompleted) {
      playSetCompletePop(soundEnabled);

      // If this completion makes ALL sets completed, trigger gentle confetti!
      const otherSetsDone = sets.filter((_, i) => i !== index).every(s => s.completed);
      if (otherSetsDone) {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.75 },
          colors: ['#10b981', '#06b6d4', '#8b5cf6']
        });
      }

      // Automatically offer or start rest timer if not last set
      if (index < sets.length - 1 && exercise.defaultRestSec > 0) {
        onStartRestTimer(exercise.name, exercise.defaultRestSec);
      }
    }

    onUpdateSet(index, { completed: willBeCompleted });
  };

  const handleStepWeight = (index: number, delta: number) => {
    const currentVal = parseFloat(sets[index].weight) || 0;
    const nextVal = Math.max(0, currentVal + delta);
    onUpdateSet(index, { weight: nextVal === 0 ? '' : nextVal.toString() });
  };

  const handleStepReps = (index: number, delta: number) => {
    const currentVal = parseInt(sets[index].reps) || 0;
    const nextVal = Math.max(0, currentVal + delta);
    onUpdateSet(index, { reps: nextVal === 0 ? '' : nextVal.toString() });
  };

  const handlePinchChange = (status: PinchStatus) => {
    // Update all sets for this exercise to reflect current sensation
    sets.forEach((_, idx) => {
      onUpdateSet(idx, { pinchStatus: status });
    });
  };

  return (
    <div className={`exercise-card ${allSetsCompleted ? 'all-done' : ''}`}>
      <div className="exercise-header">
        <div className="exercise-title-area">
          <div className="exercise-tags">
            {exercise.rightHipFocus && (
              <span className="tag-hip-focus">
                <Shield size={12} />
                Right Hip Priority
              </span>
            )}
            <span className="tag-category">{exercise.category}</span>
            <span
              className="tag-calories"
              title={`Compendium formula: (${met} MET × 3.5 × ${userWeightKg}kg) / 200 × duration`}
            >
              <Flame size={12} />
              {completedSetsCount > 0 ? `${burnedKcal} / ${totalKcal} kcal` : `~${totalKcal} kcal`}
            </span>
          </div>

          <h3 className="exercise-name">{exercise.name}</h3>
          <div className="exercise-target">Target: {exercise.targetSets} × {exercise.targetReps}</div>
        </div>

        <button
          type="button"
          className="btn-rest-timer"
          title={`Start ${exercise.defaultRestSec}s rest countdown`}
          onClick={() => onStartRestTimer(exercise.name, exercise.defaultRestSec)}
        >
          <Timer size={14} />
          <span>{exercise.defaultRestSec}s Rest</span>
        </button>
      </div>

      {exercise.notes && (
        <div className="exercise-notes">
          {exercise.notes}
        </div>
      )}

      {/* Sets Table */}
      <div className="sets-table">
        <div className="sets-header">
          <div style={{ textAlign: 'center' }}>Set</div>
          <div>{unit.toUpperCase()}</div>
          <div>Reps</div>
          <div style={{ textAlign: 'center' }}>Done</div>
        </div>

        {sets.map((set, idx) => (
          <div
            key={idx}
            className={`set-row ${set.completed ? 'completed' : ''}`}
          >
            <div className="set-index">{set.setNumber}</div>

            {/* Weight Input with Steppers */}
            <div className="input-with-controls">
              <button
                type="button"
                className="step-btn"
                tabIndex={-1}
                onClick={() => handleStepWeight(idx, unit === 'kg' ? -2.5 : -5)}
              >
                <Minus size={12} />
              </button>
              <input
                type="number"
                step={unit === 'kg' ? '2.5' : '5'}
                className="set-input"
                placeholder="—"
                value={set.weight}
                onChange={(e) => onUpdateSet(idx, { weight: e.target.value })}
              />
              <button
                type="button"
                className="step-btn"
                tabIndex={-1}
                onClick={() => handleStepWeight(idx, unit === 'kg' ? 2.5 : 5)}
              >
                <Plus size={12} />
              </button>
            </div>

            {/* Reps Input with Steppers */}
            <div className="input-with-controls">
              <button
                type="button"
                className="step-btn"
                tabIndex={-1}
                onClick={() => handleStepReps(idx, -1)}
              >
                <Minus size={12} />
              </button>
              <input
                type="number"
                className="set-input"
                placeholder={exercise.targetReps.split('–')[0] || '10'}
                value={set.reps}
                onChange={(e) => onUpdateSet(idx, { reps: e.target.value })}
              />
              <button
                type="button"
                className="step-btn"
                tabIndex={-1}
                onClick={() => handleStepReps(idx, 1)}
              >
                <Plus size={12} />
              </button>
            </div>

            {/* Set Checkbox Button */}
            <button
              type="button"
              className={`set-check-btn ${set.completed ? 'checked' : ''}`}
              title={set.completed ? 'Mark uncompleted' : 'Mark completed'}
              onClick={() => handleToggleSet(idx)}
            >
              <Check size={18} strokeWidth={set.completed ? 3 : 2} />
            </button>
          </div>
        ))}
      </div>

      {/* Hip Pinch & Sensation Monitor for this exercise */}
      <div className="exercise-bottom-bar">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Right Hip Sensation:
        </span>

        <div className="pinch-selector">
          <button
            type="button"
            className={`pinch-chip ${currentPinchStatus === 'none' ? 'active none' : ''}`}
            onClick={() => handlePinchChange('none')}
          >
            🟢 Pain-Free
          </button>
          <button
            type="button"
            className={`pinch-chip ${currentPinchStatus === 'mild' ? 'active mild' : ''}`}
            onClick={() => handlePinchChange('mild')}
          >
            🟡 Mild Tension
          </button>
          <button
            type="button"
            className={`pinch-chip ${currentPinchStatus === 'pinch' ? 'active pinch' : ''}`}
            onClick={() => handlePinchChange('pinch')}
          >
            🔴 Front Pinch ⚠️
          </button>
        </div>
      </div>

      {currentPinchStatus === 'pinch' && (
        <div style={{
          marginTop: '10px',
          padding: '8px 12px',
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.78rem',
          color: '#fecdd3'
        }}>
          <AlertTriangle size={16} color="var(--rose)" style={{ flexShrink: 0 }} />
          <span>
            <strong>THR Warning:</strong> Do not push through front hip pinch. Reduce your range of motion or stop this exercise immediately.
          </span>
        </div>
      )}
    </div>
  );
};
