import { useState, useRef, type FC, type ChangeEvent } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Flame, 
  Scale, 
  TrendingDown, 
  TrendingUp, 
  Minus,
  Dumbbell
} from 'lucide-react';
import type { HistoryEntry, WeekProgress, WeightLogEntry } from '../types/workout';
import { exportBackupJSON, importBackupJSON } from '../utils/storage';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  progress: WeekProgress;
  weightLogs: WeightLogEntry[];
  onResetWeek: () => void;
  onDataImported: () => void;
}

export const HistoryModal: FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  progress,
  weightLogs,
  onResetWeek,
  onDataImported
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'workouts' | 'weights'>('workouts');

  if (!isOpen) return null;

  // Calculate statistics
  const completedSessionsCount = Object.values(progress.sessions).filter(s => s.completed).length;
  let totalSetsDone = 0;
  Object.values(progress.sessions).forEach(sess => {
    Object.values(sess.sets || {}).forEach(sets => {
      totalSetsDone += sets.filter(s => s.completed).length;
    });
  });

  const totalCaloriesBurned = history.reduce((sum, h) => sum + (h.caloriesBurned || 0), 0);

  // Weight statistics
  const latestWeight = weightLogs[0]?.weightKg || progress.userWeightKg || 75;
  const oldestWeight = weightLogs[weightLogs.length - 1]?.weightKg || latestWeight;
  const totalWeightDiff = Math.round((latestWeight - oldestWeight) * 10) / 10;

  const handleExport = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importBackupJSON(content);
        if (success) {
          alert('Data imported successfully!');
          onDataImported();
        } else {
          alert('Invalid backup file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    if (window.confirm('Are you sure you want to reset this week? This will uncheck sets for the current week while keeping your past history and weight logs intact.')) {
      onResetWeek();
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: 580, maxHeight: '88vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h3 className="modal-title font-display">History & Logs</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Week {progress.weekId} · Workout history & bodyweight tracking
            </span>
          </div>
          <button type="button" className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher: Workouts vs Weight Logs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: 3,
          gap: 3,
          marginBottom: 16
        }}>
          <button
            type="button"
            className="btn-session-pill"
            style={{
              padding: '8px 4px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: activeTab === 'workouts' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'workouts' ? '#fff' : 'var(--text-secondary)'
            }}
            onClick={() => setActiveTab('workouts')}
          >
            <Dumbbell size={15} />
            <span>Workout Sessions ({history.length})</span>
          </button>

          <button
            type="button"
            className="btn-session-pill"
            style={{
              padding: '8px 4px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: activeTab === 'weights' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'weights' ? '#fff' : 'var(--text-secondary)'
            }}
            onClick={() => setActiveTab('weights')}
          >
            <Scale size={15} />
            <span>Body Weight Logs ({weightLogs.length})</span>
          </button>
        </div>

        {/* ========================================================
            TAB 1: WORKOUT SESSIONS HISTORY
            ======================================================== */}
        {activeTab === 'workouts' && (
          <>
            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 8,
              marginBottom: 16
            }}>
              <div style={{
                background: 'var(--bg-card)',
                padding: '12px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  This Week
                </span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-white)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                  {completedSessionsCount} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>sessions</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-light)' }}>
                  {totalSetsDone} sets completed
                </span>
              </div>

              <div style={{
                background: 'var(--bg-card)',
                padding: '12px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  All-Time Energy
                </span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--amber)', marginTop: 2, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Flame size={20} color="var(--amber)" />
                  {totalCaloriesBurned} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>kcal</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Across {history.length} logged workouts
                </span>
              </div>
            </div>

            {/* Recent Session Logs */}
            <h4 style={{ fontSize: '0.92rem', marginBottom: 10, color: 'var(--text-white)' }}>
              Completed Sessions History
            </h4>

            {history.length === 0 ? (
              <div style={{
                padding: 24,
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                marginBottom: 16
              }}>
                No completed sessions recorded yet. Finish a workout and tap "Complete Session" to log it here!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {history.slice(0, 15).map((entry) => (
                  <div
                    key={entry.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius)',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <CheckCircle2 size={15} color="var(--accent-light)" />
                        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-white)' }}>
                          {entry.dayName} · {entry.sessionTitle}
                        </span>
                        {entry.planName && (
                          <span className="badge-tag" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                            {entry.planName}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{entry.date}</span>
                        <span>·</span>
                        <span>{entry.completedSetsCount} sets</span>
                        {entry.caloriesBurned ? (
                          <>
                            <span>·</span>
                            <span style={{ color: 'var(--amber)', fontWeight: 600 }}>🔥 {entry.caloriesBurned} kcal</span>
                          </>
                        ) : null}
                      </div>
                      {entry.notes && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-light)', marginTop: 4, fontStyle: 'italic' }}>
                          "{entry.notes}"
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      {entry.pinchReported ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: '0.72rem',
                          color: '#fda4af',
                          background: 'rgba(239, 68, 68, 0.15)',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-full)'
                        }}>
                          <AlertCircle size={11} /> Pinch
                        </span>
                      ) : (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: '0.72rem',
                          color: 'var(--accent-light)',
                          background: 'var(--accent-glow)',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-full)'
                        }}>
                          <ShieldCheck size={11} /> Safe
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ========================================================
            TAB 2: BODY WEIGHT LOGS HISTORY
            ======================================================== */}
        {activeTab === 'weights' && (
          <>
            {/* Weight Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 8,
              marginBottom: 16
            }}>
              <div style={{
                background: 'var(--bg-card)',
                padding: '12px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Current Weight
                </span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-white)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                  {progress.unit === 'kg' ? `${latestWeight} kg` : `${Math.round(latestWeight * 2.20462 * 10) / 10} lbs`}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-light)' }}>
                  Active in calorie calculation
                </span>
              </div>

              <div style={{
                background: 'var(--bg-card)',
                padding: '12px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Net Weight Change
                </span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: totalWeightDiff < 0 ? 'var(--accent-light)' : totalWeightDiff > 0 ? 'var(--amber)' : 'var(--text-white)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                  {totalWeightDiff > 0 ? `+${totalWeightDiff}` : totalWeightDiff} kg
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Across {weightLogs.length} logged weigh-ins
                </span>
              </div>
            </div>

            <h4 style={{ fontSize: '0.92rem', marginBottom: 10, color: 'var(--text-white)' }}>
              Weight Logs & Timeline
            </h4>

            {weightLogs.length === 0 ? (
              <div style={{
                padding: 24,
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                marginBottom: 16
              }}>
                No weight entries logged yet. Tap the weight button in the header bar to log your weight anytime!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {weightLogs.map((log, index) => {
                  const prevLog = weightLogs[index + 1];
                  let diffText = '';
                  let isDown = false;
                  let isUp = false;

                  if (prevLog) {
                    const diff = Math.round((log.weightKg - prevLog.weightKg) * 10) / 10;
                    if (diff > 0) {
                      diffText = `+${diff} kg`;
                      isUp = true;
                    } else if (diff < 0) {
                      diffText = `${diff} kg`;
                      isDown = true;
                    }
                  }

                  return (
                    <div
                      key={log.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius)',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-mono)', color: 'var(--text-white)' }}>
                            {progress.unit === 'kg' ? `${log.weightKg} kg` : `${Math.round(log.weightKg * 2.20462 * 10) / 10} lbs`}
                          </span>
                          {diffText && (
                            <span style={{
                              fontSize: '0.75rem',
                              color: isDown ? 'var(--accent-light)' : isUp ? 'var(--amber)' : 'var(--text-muted)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 2,
                              fontWeight: 700
                            }}>
                              {isDown ? <TrendingDown size={12} /> : isUp ? <TrendingUp size={12} /> : <Minus size={12} />}
                              {diffText}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                          {log.date} {log.time ? `• ${log.time}` : ''}
                        </div>
                        {log.note && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent-light)', marginTop: 2, fontStyle: 'italic' }}>
                            "{log.note}"
                          </div>
                        )}
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span className="badge-tag" style={{ fontSize: '0.72rem' }}>
                          Weigh-In #{weightLogs.length - index}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Data Portability & Backup Section */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: 16,
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            className="btn-preset"
            style={{ flex: 1, minWidth: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 14px' }}
            onClick={handleExport}
          >
            <Download size={15} />
            <span>Export Backup (JSON)</span>
          </button>

          <button
            type="button"
            className="btn-preset"
            style={{ flex: 1, minWidth: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 14px' }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={15} />
            <span>Import JSON</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".json"
            onChange={handleFileChange}
          />

          <button
            type="button"
            className="btn-preset"
            style={{ minWidth: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 14px', color: '#fda4af' }}
            onClick={handleConfirmReset}
          >
            <RotateCcw size={15} />
            <span>Reset Week</span>
          </button>
        </div>
      </div>
    </div>
  );
};
