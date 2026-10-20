import { useState, type FC } from 'react';
import { CheckCircle2, Award, AlertTriangle, RotateCcw, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { SessionPlan, SessionProgress } from '../types/workout';
import { playRestCompleteChime } from '../utils/audio';
import { calculateSessionCalories } from '../utils/calories';

interface SessionSummaryCardProps {
  session: SessionPlan;
  progress?: SessionProgress;
  userWeightKg?: number;
  soundEnabled: boolean;
  onCompleteSession: (painScore: number, pinchReported: boolean, notes: string, caloriesBurned: number) => void;
  onUncompleteSession: () => void;
}

export const SessionSummaryCard: FC<SessionSummaryCardProps> = ({
  session,
  progress,
  userWeightKg = 75,
  soundEnabled,
  onCompleteSession,
  onUncompleteSession
}) => {
  const isCompleted = progress?.completed ?? false;

  const [painScore, setPainScore] = useState<number>(progress?.painScore ?? 0);
  const [pinchReported, setPinchReported] = useState<boolean>(progress?.pinchReported ?? false);
  const [notes, setNotes] = useState<string>(progress?.sessionNotes ?? '');

  // Calculate completed sets
  let totalSets = 0;
  let completedSets = 0;
  session.exercises.forEach(ex => {
    totalSets += ex.targetSets;
    const exerciseSets = progress?.sets?.[ex.id] || [];
    completedSets += exerciseSets.filter(s => s.completed).length;
  });

  // Calculate session calories based on Compendium formula
  const { burnedKcal, totalKcal } = calculateSessionCalories(session, progress, userWeightKg);

  const handleFinish = () => {
    // Grand celebration
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#8b5cf6', '#fbbf24']
    });

    playRestCompleteChime(soundEnabled);

    onCompleteSession(painScore, pinchReported, notes, burnedKcal);
  };

  return (
    <div className="session-summary-box glass-panel">
      {isCompleted ? (
        <div>
          <div className="finish-icon-wrap">
            <CheckCircle2 size={30} strokeWidth={2.5} />
          </div>
          <h3 className="finish-title font-display">Session Completed!</h3>
          <p className="finish-desc">
            Outstanding work on your {session.title.toLowerCase()}. Your recovery improves through consistent, progressive consistency.
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 10,
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            marginBottom: 16
          }}>
            <span>Logged: {completedSets}/{totalSets} sets</span>
            <span>·</span>
            <span style={{ color: 'var(--amber)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Flame size={14} /> {progress?.caloriesBurned || burnedKcal} kcal burned
            </span>
            <span>·</span>
            <span>Hip comfort: {painScore}/10</span>
            <span>·</span>
            <span>{pinchReported ? '⚠️ Pinch noted' : '🟢 Pain-free'}</span>
          </div>

          <div>
            <button
              type="button"
              className="btn-preset"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, margin: '0 auto' }}
              onClick={onUncompleteSession}
            >
              <RotateCcw size={14} />
              <span>Reopen Session</span>
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="finish-icon-wrap" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan-light)' }}>
            <Award size={28} />
          </div>
          <h3 className="finish-title font-display">Session Summary & Reflection</h3>
          <p className="finish-desc">
            You've completed <strong>{completedSets} of {totalSets} sets</strong>. Estimated energy burn: <strong style={{ color: 'var(--amber)' }}>🔥 {burnedKcal} / {totalKcal} kcal</strong>. Take a moment to log your right hip sensation before finishing.
          </p>

          <div className="comfort-slider-wrap">
            <div className="comfort-label-row">
              <span style={{ fontWeight: 600, color: 'var(--text-white)' }}>Right Hip Discomfort / Fatigue:</span>
              <span className="comfort-score-badge">
                {painScore === 0 ? '0 (Completely Pain-free)' : painScore <= 3 ? `${painScore}/10 (Mild / Safe)` : `${painScore}/10 (Noticeable)`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={painScore}
              onChange={(e) => setPainScore(parseInt(e.target.value))}
              className="comfort-range-input"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
              <span>0 (None)</span>
              <span>5 (Moderate)</span>
              <span>10 (Severe)</span>
            </div>

            {/* Anterior Pinch Checkbox */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 14,
              cursor: 'pointer',
              fontSize: '0.82rem',
              color: 'var(--text-primary)',
              padding: '6px 8px',
              borderRadius: 'var(--radius-sm)',
              background: pinchReported ? 'rgba(244, 63, 94, 0.12)' : 'transparent',
              border: pinchReported ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid transparent'
            }}>
              <input
                type="checkbox"
                checked={pinchReported}
                onChange={(e) => setPinchReported(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--rose)' }}
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {pinchReported && <AlertTriangle size={14} color="var(--rose)" />}
                Experienced sharp front-hip pinch during bending/squatting
              </span>
            </label>

            {/* Notes input */}
            <textarea
              className="notes-input-textarea"
              placeholder="Session notes (e.g., weights used, pelvic alignment feel, energy level)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn-complete-session"
            onClick={handleFinish}
          >
            <CheckCircle2 size={18} />
            <span>Complete & Log {session.title} ({burnedKcal} kcal)</span>
          </button>
        </div>
      )}
    </div>
  );
};
