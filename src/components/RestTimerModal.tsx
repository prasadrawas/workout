import React from 'react';
import { X, Play, Pause, RotateCcw, Plus, Minus, Minimize2 } from 'lucide-react';

interface RestTimerModalProps {
  isOpen: boolean;
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  exerciseName: string;
  onClose: () => void;
  onMinimize: () => void;
  onTogglePlay: () => void;
  onReset: () => void;
  onSetPreset: (seconds: number) => void;
  onAdjustTime: (deltaSeconds: number) => void;
}

export const RestTimerModal: React.FC<RestTimerModalProps> = ({
  isOpen,
  timeLeft,
  totalTime,
  isRunning,
  exerciseName,
  onClose,
  onMinimize,
  onTogglePlay,
  onReset,
  onSetPreset,
  onAdjustTime
}) => {
  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="modal-backdrop" onClick={onMinimize}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title font-display">Rest Interval</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {exerciseName ? `Targeting: ${exerciseName}` : 'Recovery between sets'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              className="btn-close"
              title="Minimize to floating pill"
              onClick={onMinimize}
            >
              <Minimize2 size={16} />
            </button>
            <button
              type="button"
              className="btn-close"
              title="Close Timer"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Circular Progress Display */}
        <div style={{ position: 'relative', width: 170, height: 170, margin: '10px auto' }}>
          <svg style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
            <circle
              className="ring-circle-bg"
              cx="85"
              cy="85"
              r={radius}
              strokeWidth="8"
              fill="none"
            />
            <circle
              className="ring-circle-progress"
              cx="85"
              cy="85"
              r={radius}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span className="timer-display-huge" style={{ margin: 0, fontSize: '2.5rem' }}>
              {timeFormatted}
            </span>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--cyan-light)', fontWeight: 700, letterSpacing: '0.05em' }}>
              {isRunning ? 'Counting Down' : timeLeft === 0 ? 'Rest Complete!' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Presets */}
        <div className="timer-presets" style={{ marginTop: 16 }}>
          {[60, 90, 120, 150].map((presetSec) => (
            <button
              key={presetSec}
              type="button"
              className={`btn-preset ${totalTime === presetSec ? 'active' : ''}`}
              onClick={() => onSetPreset(presetSec)}
            >
              {presetSec}s
            </button>
          ))}
        </div>

        {/* Adjust Buttons (-15s, +15s) */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
          <button
            type="button"
            className="btn-preset"
            style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 4 }}
            onClick={() => onAdjustTime(-15)}
          >
            <Minus size={14} /> 15s
          </button>
          <button
            type="button"
            className="btn-preset"
            style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 4 }}
            onClick={() => onAdjustTime(15)}
          >
            <Plus size={14} /> 15s
          </button>
        </div>

        {/* Main Controls */}
        <div className="timer-controls-row">
          <button
            type="button"
            className="btn-icon"
            style={{ width: 44, height: 44 }}
            title="Reset Timer"
            onClick={onReset}
          >
            <RotateCcw size={18} />
          </button>

          <button
            type="button"
            className="btn-timer-primary"
            style={{ minWidth: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            onClick={onTogglePlay}
          >
            {isRunning ? (
              <>
                <Pause size={18} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={18} />
                <span>{timeLeft === 0 ? 'Restart' : 'Resume'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
