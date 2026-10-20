import { useRef, type FC, type ChangeEvent } from 'react';
import { X, Download, Upload, RotateCcw, CheckCircle2, ShieldCheck, AlertCircle, Flame } from 'lucide-react';
import type { HistoryEntry, WeekProgress } from '../types/workout';
import { exportBackupJSON, importBackupJSON } from '../utils/storage';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  progress: WeekProgress;
  onResetWeek: () => void;
  onDataImported: () => void;
}

export const HistoryModal: FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  progress,
  onResetWeek,
  onDataImported
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExport = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hipstrong-backup-${new Date().toISOString().slice(0, 10)}.json`;
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
    if (window.confirm('Are you sure you want to reset this week? This will uncheck sets for the current week while keeping your past history intact.')) {
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
            <h3 className="modal-title font-display">Weekly History & Analytics</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Week {progress.weekId} · Compendium Calorie Tracking
            </span>
          </div>
          <button type="button" className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 8,
          marginBottom: 16
        }}>
          <div style={{
            padding: '12px 10px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-light)', fontFamily: 'var(--font-display)' }}>
              {completedSessionsCount}/14
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Sessions Done
            </div>
          </div>

          <div style={{
            padding: '12px 10px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--cyan-light)', fontFamily: 'var(--font-display)' }}>
              {totalSetsDone}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Sets Lifted
            </div>
          </div>

          <div style={{
            padding: '12px 10px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--amber)', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <Flame size={18} />
              {totalCaloriesBurned > 0 ? totalCaloriesBurned.toLocaleString() : '0'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total kcal Burned
            </div>
          </div>

          <div style={{
            padding: '12px 10px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#c4b5fd', fontFamily: 'var(--font-display)' }}>
              {history.length}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Logged History
            </div>
          </div>
        </div>

        {/* Scientific Formula Note */}
        <div style={{
          padding: '10px 12px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          fontSize: '0.76rem',
          color: '#fed7aa',
          lineHeight: 1.4,
          marginBottom: 16
        }}>
          <strong>Physiological Calorie Formula:</strong> Calories = Time (min) × [ (MET × 3.5 × {progress.userWeightKg}kg) / 200 ].
          MET values are derived from the Compendium of Physical Activities for each movement.
        </div>

        {/* Backup and Reset Buttons */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 20,
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            className="btn-preset"
            style={{ flex: 1, minWidth: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 14px' }}
            onClick={handleExport}
          >
            <Download size={15} />
            <span>Export JSON</span>
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

        {/* Recent Session Logs */}
        <h4 style={{ fontSize: '0.95rem', marginBottom: 10, color: 'var(--text-white)' }}>
          Recent Logged Sessions
        </h4>

        {history.length === 0 ? (
          <div style={{
            padding: 24,
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            No completed sessions recorded yet. Finish a workout and click "Complete Session" to log it here!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.slice(0, 10).map((entry) => (
              <div
                key={entry.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={15} color="var(--primary-light)" />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-white)' }}>
                      {entry.dayName} · {entry.sessionTitle}
                    </span>
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
                    <div style={{ fontSize: '0.75rem', color: 'var(--cyan-light)', marginTop: 4, fontStyle: 'italic' }}>
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
                      color: 'var(--rose)',
                      background: 'rgba(244, 63, 94, 0.15)',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <AlertCircle size={12} /> Pinch Noted
                    </span>
                  ) : (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.72rem',
                      color: 'var(--primary-light)',
                      background: 'rgba(16, 185, 129, 0.15)',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <ShieldCheck size={12} /> Pain-free
                    </span>
                  )}
                  {entry.painScore !== undefined && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      Comfort: {entry.painScore}/10
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
