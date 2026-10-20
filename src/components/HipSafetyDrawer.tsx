import React, { useState } from 'react';
import { X, ShieldAlert, Award, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { PROGRESSION_PHASES, THR_SAFETY_RULES } from '../data/workoutPlan';

interface HipSafetyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HipSafetyDrawer: React.FC<HipSafetyDrawerProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'progression' | 'assessment'>('rules');

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: 620, maxHeight: '88vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--rose)'
            }}>
              <ShieldAlert size={22} />
            </div>
            <div>
              <h3 className="modal-title font-display">THR Rehab & Safety</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Right Total Hip Replacement Protocol (~3 Months Post-Op)
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
          gridTemplateColumns: 'repeat(3, 1fr)',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-md)',
          padding: 4,
          gap: 4,
          marginBottom: 16
        }}>
          <button
            type="button"
            className="session-btn"
            style={{
              padding: '8px 4px',
              fontSize: '0.8rem',
              background: activeTab === 'rules' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: activeTab === 'rules' ? '#fff' : 'var(--text-secondary)'
            }}
            onClick={() => setActiveTab('rules')}
          >
            Safety Rules
          </button>
          <button
            type="button"
            className="session-btn"
            style={{
              padding: '8px 4px',
              fontSize: '0.8rem',
              background: activeTab === 'progression' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: activeTab === 'progression' ? '#fff' : 'var(--text-secondary)'
            }}
            onClick={() => setActiveTab('progression')}
          >
            12-Wk Plan
          </button>
          <button
            type="button"
            className="session-btn"
            style={{
              padding: '8px 4px',
              fontSize: '0.8rem',
              background: activeTab === 'assessment' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: activeTab === 'assessment' ? '#fff' : 'var(--text-secondary)'
            }}
            onClick={() => setActiveTab('assessment')}
          >
            Hip Profile
          </button>
        </div>

        {/* TAB 1: SAFETY RULES */}
        {activeTab === 'rules' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              display: 'flex',
              gap: 10
            }}>
              <AlertTriangle size={20} color="var(--rose)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: '0.82rem', color: '#fecdd3', lineHeight: 1.4 }}>
                <strong>Anterior Hip Pinch Warning:</strong> Because you are ~3 months post-right THR,
                never push through a sharp pinch at the front of the hip. Deep flexion and loaded rotation
                must remain strictly pain-free.
              </div>
            </div>

            {THR_SAFETY_RULES.map((rule, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <CheckCircle size={16} color="var(--primary-light)" />
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-white)' }}>{rule.title}</strong>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
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
              borderRadius: 'var(--radius-md)',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              fontSize: '0.82rem',
              color: 'var(--cyan-light)'
            }}>
              Progress variables one at a time (e.g. reps OR weight, never both simultaneously).
            </div>

            {PROGRESSION_PHASES.map((phase, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span className="badge badge-gym">{phase.weeks}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--cyan-light)', fontWeight: 600 }}>Phase {idx + 1}</span>
                </div>
                <h4 style={{ fontSize: '1rem', color: 'var(--text-white)', margin: '6px 0 2px' }}>{phase.title}</h4>
                <div style={{ fontSize: '0.82rem', color: 'var(--primary-light)', fontWeight: 600, marginBottom: 8 }}>
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

        {/* TAB 3: HIP PROFILE & CLINICAL NOTES */}
        {activeTab === 'assessment' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Award size={18} color="var(--accent-purple)" />
                <strong style={{ fontSize: '0.9rem', color: '#ddd6fe' }}>Right QL & Pelvic Alignment</strong>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                Tightness does not automatically mean weakness. Lateral pelvic tilt cannot be confidently
                attributed solely to the QL without an in-person assessment. We train both lateral trunk strength
                and gentle mobility without assuming one muscle explains everything.
              </p>
            </div>

            <div style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Info size={18} color="var(--cyan-light)" />
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-white)' }}>Key Loading Rules</strong>
              </div>
              <ul style={{ paddingLeft: 18, margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li>Leave 3–4 Repetitions in Reserve (RIR) on all compound exercises.</li>
                <li>Rest 90–150 seconds on compounds, 60–90 seconds on accessory movements.</li>
                <li>Use stable supports for standing hip abduction—keep pelvis level without hiking.</li>
                <li>Monitor the 24-hour response after every workout.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
