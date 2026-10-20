import { useState, type FC } from 'react';
import { Volume2, VolumeX, ShieldAlert, History, Calendar, Scale, X, Check } from 'lucide-react';
import { getTodayDayOfWeek } from '../utils/storage';
import type { DayOfWeek } from '../types/workout';

interface NavbarProps {
  unit: 'kg' | 'lbs';
  userWeightKg: number;
  onUpdateWeight: (weightKg: number) => void;
  onToggleUnit: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSafetyGuide: () => void;
  onOpenHistory: () => void;
  currentDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
}

export const Navbar: FC<NavbarProps> = ({
  unit,
  userWeightKg,
  onUpdateWeight,
  onToggleUnit,
  soundEnabled,
  onToggleSound,
  onOpenSafetyGuide,
  onOpenHistory,
  currentDay,
  onSelectDay
}) => {
  const today = getTodayDayOfWeek();
  const isViewingToday = currentDay === today;

  const [weightModalOpen, setWeightModalOpen] = useState(false);
  const displayWeight = unit === 'kg' ? userWeightKg : Math.round(userWeightKg * 2.20462);
  const [tempWeight, setTempWeight] = useState(displayWeight.toString());

  const handleOpenWeight = () => {
    const current = unit === 'kg' ? userWeightKg : Math.round(userWeightKg * 2.20462);
    setTempWeight(current.toString());
    setWeightModalOpen(true);
  };

  const handleSaveWeight = () => {
    const val = parseFloat(tempWeight);
    if (!isNaN(val) && val > 0) {
      const inKg = unit === 'kg' ? val : val / 2.20462;
      onUpdateWeight(Math.round(inKg * 10) / 10);
    }
    setWeightModalOpen(false);
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <div className="brand" onClick={() => onSelectDay(today)}>
            <div className="brand-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <span className="brand-title">HipStrong</span>
              <span className="brand-subtitle">THR 2-Session Tracker</span>
            </div>
          </div>

          <div className="nav-actions">
            {/* Jump to Today Button if viewing other day */}
            {!isViewingToday && (
              <button
                className="btn-icon"
                title="Jump to Today's Workout"
                onClick={() => onSelectDay(today)}
              >
                <Calendar size={18} />
              </button>
            )}

            {/* Body Weight for Calorie Calculation */}
            <button
              className="btn-icon font-display"
              style={{ width: 'auto', padding: '0 10px', fontSize: '0.78rem', gap: 4 }}
              title="Body Weight for Calorie Calculation"
              onClick={handleOpenWeight}
            >
              <Scale size={14} color="var(--primary-light)" />
              <span>{displayWeight} {unit}</span>
            </button>

            {/* Unit Toggle */}
            <button
              className="btn-icon font-display"
              style={{ fontWeight: 700, fontSize: '0.8rem' }}
              title={`Switch to ${unit === 'kg' ? 'lbs' : 'kg'}`}
              onClick={onToggleUnit}
            >
              {unit.toUpperCase()}
            </button>

            {/* Sound Toggle */}
            <button
              className={`btn-icon ${soundEnabled ? 'active' : ''}`}
              title={soundEnabled ? 'Mute Timer Sounds' : 'Unmute Timer Sounds'}
              onClick={onToggleSound}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {/* THR Safety & 12-Week Progression Guide */}
            <button
              className="btn-icon"
              title="THR Recovery & Progression Rules"
              onClick={onOpenSafetyGuide}
            >
              <ShieldAlert size={18} />
            </button>

            {/* History & Data Backup */}
            <button
              className="btn-icon"
              title="History, Trends & Backup"
              onClick={onOpenHistory}
            >
              <History size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Body Weight Modal */}
      {weightModalOpen && (
        <div className="modal-backdrop" onClick={() => setWeightModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 360 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title font-display">Body Weight</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Used in Compendium Calorie Formula
                </span>
              </div>
              <button type="button" className="btn-close" onClick={() => setWeightModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              marginBottom: 16,
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.4
            }}>
              <strong>Formula:</strong> Calories = Duration (min) × [ (MET × 3.5 × Weight in kg) / 200 ].
              Setting your accurate weight ensures physiological precision for every exercise.
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <input
                type="number"
                step="0.5"
                className="notes-input-textarea"
                style={{
                  minHeight: 46,
                  height: 46,
                  margin: 0,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  fontFamily: 'var(--font-display)'
                }}
                value={tempWeight}
                onChange={(e) => setTempWeight(e.target.value)}
                autoFocus
              />
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-light)' }}>
                {unit}
              </span>
            </div>

            <button
              type="button"
              className="btn-complete-session"
              style={{ width: '100%', margin: 0 }}
              onClick={handleSaveWeight}
            >
              <Check size={18} />
              <span>Save Body Weight</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
