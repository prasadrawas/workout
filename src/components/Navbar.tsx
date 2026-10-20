import { useState, useRef, useEffect, type FC } from 'react';
import { 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  History, 
  Calendar, 
  Scale, 
  X, 
  Check, 
  Dumbbell, 
  Layers, 
  ChevronDown, 
  Download, 
  Settings2, 
  Plus, 
  Trash2,
  TrendingDown,
  TrendingUp,
  Minus
} from 'lucide-react';
import { getTodayDayOfWeek } from '../utils/storage';
import type { DayOfWeek, WeightLogEntry, WorkoutPlan } from '../types/workout';

interface NavbarProps {
  unit: 'kg' | 'lbs';
  userWeightKg: number;
  onUpdateWeight: (weightKg: number, note?: string) => void;
  weightLogs: WeightLogEntry[];
  onDeleteWeightLog?: (id: string) => void;
  onToggleUnit: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSafetyGuide: () => void;
  onOpenHistory: () => void;
  currentDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
  plans: WorkoutPlan[];
  activePlanId: string;
  activePlanName?: string;
  onSelectPlan: (planId: string) => void;
  onOpenPlanManager: () => void;
}

export const Navbar: FC<NavbarProps> = ({
  unit,
  userWeightKg,
  onUpdateWeight,
  weightLogs,
  onDeleteWeightLog,
  onToggleUnit,
  soundEnabled,
  onToggleSound,
  onOpenSafetyGuide,
  onOpenHistory,
  currentDay,
  onSelectDay,
  plans,
  activePlanId,
  activePlanName,
  onSelectPlan,
  onOpenPlanManager
}) => {
  const today = getTodayDayOfWeek();
  const isViewingToday = currentDay === today;

  // Plan dropdown state
  const [planDropdownOpen, setPlanDropdownOpen] = useState(false);
  const planDropdownRef = useRef<HTMLDivElement>(null);

  // Weight Modal State
  const [weightModalOpen, setWeightModalOpen] = useState(false);
  const displayWeight = unit === 'kg' ? userWeightKg : Math.round(userWeightKg * 2.20462);
  const [tempWeight, setTempWeight] = useState(displayWeight.toString());
  const [tempNote, setTempNote] = useState('');

  // Close plan dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (planDropdownRef.current && !planDropdownRef.current.contains(e.target as Node)) {
        setPlanDropdownOpen(false);
      }
    }
    if (planDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [planDropdownOpen]);

  const handleOpenWeight = () => {
    const current = unit === 'kg' ? userWeightKg : Math.round(userWeightKg * 2.20462);
    setTempWeight(current.toString());
    setTempNote('');
    setWeightModalOpen(true);
  };

  const handleSaveWeight = () => {
    const val = parseFloat(tempWeight);
    if (!isNaN(val) && val > 0) {
      const inKg = unit === 'kg' ? val : val / 2.20462;
      onUpdateWeight(Math.round(inKg * 10) / 10, tempNote.trim() || undefined);
    }
    setWeightModalOpen(false);
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = './plan.example.json';
    link.download = 'plan.example.json';
    link.click();
    setPlanDropdownOpen(false);
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <div className="brand" onClick={() => onSelectDay(today)}>
            <div className="brand-icon-wrap" title="Workout">
              <Dumbbell size={22} strokeWidth={2.4} />
            </div>
            <div>
              <span className="brand-title">Workout</span>
              <span className="brand-subtitle">By Prasad Rawas</span>
            </div>
          </div>

          <div className="nav-actions">
            {/* Active Workout Plan Switcher Dropdown */}
            <div className="plan-switcher-container" ref={planDropdownRef}>
              <button
                className={`btn-plan-switcher ${planDropdownOpen ? 'active' : ''}`}
                title="Switch Workout Plan"
                onClick={() => setPlanDropdownOpen(!planDropdownOpen)}
              >
                <Layers size={14} className="plan-switcher-icon" />
                <span className="plan-switcher-text">{activePlanName || 'Plan'}</span>
                <ChevronDown size={12} className={`plan-switcher-chevron ${planDropdownOpen ? 'rotate' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {planDropdownOpen && (
                <div className="plan-dropdown-menu">
                  <div className="plan-dropdown-header">
                    <span>Available Workout Plans</span>
                  </div>

                  <div className="plan-dropdown-list">
                    {plans.map((p) => {
                      const isActive = p.id === activePlanId;
                      return (
                        <button
                          key={p.id}
                          className={`plan-dropdown-item ${isActive ? 'selected' : ''}`}
                          onClick={() => {
                            onSelectPlan(p.id);
                            setPlanDropdownOpen(false);
                          }}
                        >
                          <div className="plan-item-info">
                            <span className="plan-item-title">{p.name}</span>
                            {p.focusTag && <span className="plan-item-tag">{p.focusTag}</span>}
                          </div>
                          {isActive && <Check size={14} color="var(--accent-light)" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="plan-dropdown-divider" />

                  <div className="plan-dropdown-footer">
                    <button
                      className="dropdown-footer-btn"
                      onClick={() => {
                        setPlanDropdownOpen(false);
                        onOpenPlanManager();
                      }}
                    >
                      <Settings2 size={14} />
                      <span>Manage & Edit Plans</span>
                    </button>

                    <button
                      className="dropdown-footer-btn highlight"
                      onClick={handleDownloadTemplate}
                      title="Download plan.example.json template"
                    >
                      <Download size={14} />
                      <span>Download .example Template</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

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

            {/* Body Weight for Calorie Calculation & Weight History */}
            <button
              className="btn-icon font-display"
              style={{ width: 'auto', padding: '0 10px', fontSize: '0.78rem', gap: 4 }}
              title="Log Body Weight & View Weight History"
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

      {/* Body Weight Logging Modal */}
      {weightModalOpen && (
        <div className="modal-backdrop" onClick={() => setWeightModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title font-display">Log Body Weight</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Accurate physiological calorie calculations & weight tracking
                </span>
              </div>
              <button type="button" className="btn-close" onClick={() => setWeightModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{
              background: 'var(--bg-secondary)',
              padding: '12px',
              borderRadius: 'var(--radius)',
              marginBottom: 16,
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45,
              border: '1px solid var(--border)'
            }}>
              <strong>Formula:</strong> Calories = Duration (min) × [ (MET × 3.5 × Weight in kg) / 200 ].
              Logging your weight updates the live calorie burn calculations and stores a timestamped log in your history.
            </div>

            {/* Weight Input Row */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="number"
                  step="0.1"
                  className="notes-input-textarea"
                  style={{
                    minHeight: 48,
                    height: 48,
                    margin: 0,
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)'
                  }}
                  value={tempWeight}
                  onChange={(e) => setTempWeight(e.target.value)}
                  placeholder="0.0"
                  autoFocus
                />
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-light)' }}>
                  {unit}
                </span>
              </div>

              {/* Optional note */}
              <input
                type="text"
                className="form-input"
                style={{ fontSize: '0.82rem', padding: '8px 12px' }}
                value={tempNote}
                onChange={(e) => setTempNote(e.target.value)}
                placeholder="Optional note (e.g., Morning fasted, Post workout...)"
              />
            </div>

            <button
              type="button"
              className="btn-complete-session"
              style={{ width: '100%', margin: '0 0 16px' }}
              onClick={handleSaveWeight}
            >
              <Plus size={18} />
              <span>Log Weight & Save to History</span>
            </button>

            {/* Recent Weight Logs */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-white)' }}>
                  Recent Weight Logs
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {weightLogs.length} logged
                </span>
              </div>

              {weightLogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  No weigh-ins logged yet. Enter your weight above and click "Log Weight"!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
                  {weightLogs.slice(0, 10).map((log, index) => {
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
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '8px 10px',
                          fontSize: '0.8rem'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-white)' }}>
                              {unit === 'kg' ? `${log.weightKg} kg` : `${Math.round(log.weightKg * 2.20462 * 10) / 10} lbs`}
                            </span>
                            {diffText && (
                              <span style={{
                                fontSize: '0.72rem',
                                color: isDown ? 'var(--accent-light)' : isUp ? 'var(--amber)' : 'var(--text-muted)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 2,
                                fontWeight: 600
                              }}>
                                {isDown ? <TrendingDown size={11} /> : isUp ? <TrendingUp size={11} /> : <Minus size={11} />}
                                {diffText}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                            {log.date} {log.time ? `• ${log.time}` : ''} {log.note ? `• "${log.note}"` : ''}
                          </div>
                        </div>

                        {onDeleteWeightLog && (
                          <button
                            type="button"
                            className="btn-delete-ex"
                            style={{ width: 24, height: 24 }}
                            onClick={() => onDeleteWeightLog(log.id)}
                            title="Delete this weigh-in entry"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
