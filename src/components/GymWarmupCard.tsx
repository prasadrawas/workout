import { useState, type FC } from 'react';
import { ChevronDown, ChevronUp, Flame, Check, Timer } from 'lucide-react';
import { MORNING_WARMUP_ROUTINE } from '../data/workoutPlan';
import type { WarmupItem } from '../types/workout';
import { playSetCompletePop } from '../utils/audio';
import { getWarmupCalories } from '../utils/calories';

interface GymWarmupCardProps {
  completedMap: Record<string, boolean>;
  onToggleItem: (id: string) => void;
  onStartTimer: (name: string, durationSec: number) => void;
  userWeightKg?: number;
  soundEnabled: boolean;
}

export const GymWarmupCard: FC<GymWarmupCardProps> = ({
  completedMap,
  onToggleItem,
  onStartTimer,
  userWeightKg = 75,
  soundEnabled
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const completedCount = MORNING_WARMUP_ROUTINE.filter(item => completedMap[item.id]).length;
  const totalCount = MORNING_WARMUP_ROUTINE.length;

  let totalWarmupKcal = 0;
  let burnedWarmupKcal = 0;
  MORNING_WARMUP_ROUTINE.forEach(item => {
    const isChecked = !!completedMap[item.id];
    const { burnedKcal, totalKcal } = getWarmupCalories(item, isChecked, userWeightKg);
    burnedWarmupKcal += burnedKcal;
    totalWarmupKcal += totalKcal;
  });

  const handleToggle = (item: WarmupItem) => {
    const willBeChecked = !completedMap[item.id];
    if (willBeChecked) {
      playSetCompletePop(soundEnabled);
    }
    onToggleItem(item.id);
  };

  return (
    <div className="glass-panel warmup-card">
      <div className="warmup-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="warmup-title-wrap">
          <Flame size={20} color="#06b6d4" />
          <div>
            <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Gym Warm-Up & Stretching</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              15–20 minutes · Essential before lower body loading
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="tag-calories" style={{ fontSize: '0.72rem' }}>
            <Flame size={12} />
            {completedCount > 0 ? `${burnedWarmupKcal} / ${totalWarmupKcal} kcal` : `~${totalWarmupKcal} kcal`}
          </span>
          <span className="warmup-badge-count">
            {completedCount} of {totalCount}
          </span>
          {isOpen ? <ChevronUp size={18} color="var(--text-secondary)" /> : <ChevronDown size={18} color="var(--text-secondary)" />}
        </div>
      </div>

      {isOpen && (
        <div className="warmup-list">
          {MORNING_WARMUP_ROUTINE.map((item) => {
            const isChecked = !!completedMap[item.id];
            const { burnedKcal, totalKcal } = getWarmupCalories(item, isChecked, userWeightKg);

            return (
              <div
                key={item.id}
                className={`warmup-item ${isChecked ? 'completed' : ''}`}
              >
                <button
                  type="button"
                  className={`warmup-checkbox ${isChecked ? 'checked' : ''}`}
                  onClick={() => handleToggle(item)}
                >
                  {isChecked && <Check size={14} strokeWidth={3} />}
                </button>

                <div className="warmup-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="warmup-item-name">{item.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--amber)', fontWeight: 600 }}>
                        {isChecked ? `🔥 ${burnedKcal} kcal` : `~${totalKcal} kcal`}
                      </span>
                      {item.durationSec && (
                        <button
                          type="button"
                          className="btn-rest-timer"
                          style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartTimer(item.name, item.durationSec!);
                          }}
                        >
                          <Timer size={12} />
                          <span>{item.durationSec >= 60 ? `${item.durationSec / 60}m` : `${item.durationSec}s`}</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="warmup-item-target">{item.target}</div>
                  {item.note && <div className="warmup-item-note">{item.note}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
