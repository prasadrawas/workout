import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Award, AlertTriangle, CheckCircle, Info, Activity, ClipboardCheck, Check } from 'lucide-react';
import { 
  PROGRESSION_PHASES, 
  THR_SAFETY_RULES, 
  RIGHT_LEG_QL_RULES, 
  DAILY_CARDIO_SCHEDULE, 
  WEEKLY_PROGRESS_QUESTIONS 
} from '../data/workoutPlan';

interface HipSafetyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY_WEEKLY_ANSWERS = 'hipstrong_weekly_review_v1';

export const HipSafetyDrawer: React.FC<HipSafetyDrawerProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'progression' | 'cardio' | 'assessment' | 'review'>('rules');
  const [reviewAnswers, setReviewAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WEEKLY_ANSWERS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WEEKLY_ANSWERS, JSON.stringify(reviewAnswers));
    } catch (e) {
      console.error(e);
    }
  }, [reviewAnswers]);

  if (!isOpen) return null;

  const handleSelectAnswer = (qId: string, optionLabel: string) => {
    setReviewAnswers(prev => ({ ...prev, [qId]: optionLabel }));
  };

  const handleSaveReview = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: 640, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--rose)',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="modal-title font-display">THR Protocol & Guide</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Right Total Hip Replacement (~3 Months Post-Op)
              </span>
            </div>
          </div>

          <button type="button" className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
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
              padding: '6px 2px',
              fontSize: '0.72rem',
              background: activeTab === 'rules' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'rules' ? '#fff' : 'var(--text-secondary)'
            }}
            onClick={() => setActiveTab('rules')}
          >
            Safety
          </button>
          <button
            type="button"
            className="btn-session-pill"
            style={{
              padding: '6px 2px',
              fontSize: '0.72rem',
              background: activeTab === 'progression' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'progression' ? '#fff' : 'var(--text-secondary)'
            }}
            onClick={() => setActiveTab('progression')}
          >
            12-Wk Plan
          </button>
          <button
            type="button"
            className="btn-session-pill"
            style={{
              padding: '6px 2px',
              fontSize: '0.72rem',
              background: activeTab === 'cardio' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'cardio' ? '#fff' : 'var(--text-secondary)'
            }}
            onClick={() => setActiveTab('cardio')}
          >
            Cardio
          </button>
          <button
            type="button"
            className="btn-session-pill"
            style={{
              padding: '6px 2px',
              fontSize: '0.72rem',
              background: activeTab === 'assessment' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'assessment' ? '#fff' : 'var(--text-secondary)'
            }}
            onClick={() => setActiveTab('assessment')}
          >
            Right Leg & QL
          </button>
          <button
            type="button"
            className="btn-session-pill"
            style={{
              padding: '6px 2px',
              fontSize: '0.72rem',
              background: activeTab === 'review' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'review' ? '#fff' : 'var(--text-secondary)'
            }}
            onClick={() => setActiveTab('review')}
          >
            Review
          </button>
        </div>

        {/* TAB 1: SAFETY RULES */}
        {activeTab === 'rules' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              gap: 10
            }}>
              <AlertTriangle size={20} color="var(--rose)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: '0.82rem', color: '#fca5a5', lineHeight: 1.45 }}>
                <strong>Anterior Hip Pinch Warning:</strong> Because you still occasionally experience a sharp pinch at the front of the hip during deeper bending:
                have your physiotherapist assess it before progressing to deeper squats or loaded hip flexion. Surgeon clearance for strength training does not mean every range of motion is appropriate.
              </div>
            </div>

            {THR_SAFETY_RULES.map((rule, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <CheckCircle size={16} color="var(--accent-light)" />
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-white)' }}>{rule.title}</strong>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                  {rule.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: 12-WEEK PROGRESSION */}
        {activeTab === 'progression' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-glow)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              fontSize: '0.82rem',
              color: 'var(--accent-light)',
              lineHeight: 1.45
            }}>
              💡 <strong>Progression Rule:</strong> You don’t have to increase weight every week. Progress when technique is stable and symptoms do not worsen during exercise or over the following 24 hours.
            </div>

            {PROGRESSION_PHASES.map((phase, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span className="badge-active" style={{ fontSize: '0.72rem' }}>{phase.weeks}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-light)', fontFamily: 'var(--font-mono)' }}>Phase {idx + 1}</span>
                </div>
                <h4 style={{ fontSize: '0.98rem', color: 'var(--text-white)', margin: '6px 0 2px' }}>{phase.title}</h4>
                <div style={{ fontSize: '0.82rem', color: 'var(--accent-light)', fontWeight: 600, marginBottom: 8 }}>
                  Goal: {phase.goal}
                </div>
                <ul style={{ paddingLeft: 18, margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {phase.recommendations.map((rec, rIdx) => (
                    <li key={rIdx}>{rec}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: DAILY CARDIO PLAN */}
        {activeTab === 'cardio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              display: 'flex',
              gap: 10
            }}>
              <Activity size={20} color="var(--accent-light)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                <strong style={{ color: 'var(--text-white)' }}>Consolidated Daily Cardio (Weeks 1–12):</strong>
                <p style={{ margin: '4px 0 0' }}>
                  Stretch gently first, then use cardio to warm up. Total warm-up: 15–25 minutes.
                  Home static cycling is separate and excluded from the gym warm-up.
                </p>
              </div>
            </div>

            <div style={{
              overflowX: 'auto',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>Day</th>
                    <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>Treadmill</th>
                    <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>Elliptical</th>
                    <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {DAILY_CARDIO_SCHEDULE.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text-white)' }}>{row.dayName}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-light)' }}>{row.treadmill}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-light)' }}>{row.elliptical}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45
            }}>
              ⚠️ <strong>Duration Targets:</strong> These durations are targets, not mandatory minimums. Shorten or skip a machine if you develop pain, fatigue or a limp. Don’t automatically increase incline, resistance and duration together.
            </div>
          </div>
        )}

        {/* TAB 4: RIGHT LEG & QL */}
        {activeTab === 'assessment' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius)',
              background: 'var(--accent-glow)',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Award size={18} color="var(--accent-light)" />
                <strong style={{ fontSize: '0.9rem', color: '#fff' }}>How to Train the Right Leg and QL Effectively</strong>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                Your right side deserves extra attention, but the priority is better quality and capacity, not simply more sets.
              </p>
            </div>

            {RIGHT_LEG_QL_RULES.map((rule, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Info size={16} color="var(--accent-light)" />
                  <strong style={{ fontSize: '0.88rem', color: 'var(--text-white)' }}>{rule.title}</strong>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                  {rule.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: WEEKLY PROGRESS TRACKER */}
        {activeTab === 'review' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              display: 'flex',
              gap: 10
            }}>
              <ClipboardCheck size={20} color="var(--accent-light)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                <strong style={{ color: 'var(--text-white)' }}>Weekly Progress Tracker:</strong>
                <p style={{ margin: '4px 0 0' }}>
                  Use this once per week to judge whether the program is working. Record your responses below to monitor your recovery trajectory.
                </p>
              </div>
            </div>

            {WEEKLY_PROGRESS_QUESTIONS.map((q) => (
              <div
                key={q.id}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-white)' }}>
                    {q.category}
                  </span>
                  {reviewAnswers[q.id] && (
                    <span className="badge-active" style={{ fontSize: '0.72rem' }}>Answered</span>
                  )}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {q.prompt}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {q.options.map((opt, oIdx) => {
                    const isSelected = reviewAnswers[q.id] === opt.label;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectAnswer(q.id, opt.label)}
                        style={{
                          textAlign: 'left',
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: isSelected ? 'var(--accent-glow)' : 'var(--bg-secondary)',
                          border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
                          color: isSelected ? '#fff' : 'var(--text-secondary)',
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? 600 : 400,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'var(--transition)'
                        }}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check size={16} color="var(--accent-light)" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn-complete-session"
              style={{ width: '100%', margin: '8px 0 0' }}
              onClick={handleSaveReview}
            >
              {savedSuccess ? (
                <>
                  <Check size={18} />
                  <span>Weekly Review Saved!</span>
                </>
              ) : (
                <>
                  <ClipboardCheck size={18} />
                  <span>Save Weekly Review</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
