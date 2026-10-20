import React from 'react';
import { Pause, Play, Maximize2 } from 'lucide-react';

interface RestTimerDockProps {
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  exerciseName: string;
  onTogglePlay: () => void;
  onOpenModal: () => void;
}

export const RestTimerDock: React.FC<RestTimerDockProps> = ({
  timeLeft,
  totalTime,
  isRunning,
  exerciseName,
  onTogglePlay,
  onOpenModal
}) => {
  if (timeLeft <= 0) return null;

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes > 0 ? `${minutes}:` : ''}${String(seconds).padStart(minutes > 0 ? 2 : 1, '0')}`;

  return (
    <div className="rest-timer-dock" onClick={onOpenModal}>
      <div className="rest-timer-ring-sm">
        <svg className="rest-timer-ring-svg" viewBox="0 0 44 44">
          <circle
            className="ring-circle-bg"
            cx="22"
            cy="22"
            r={radius}
            strokeWidth="3.5"
            fill="none"
          />
          <circle
            className="ring-circle-progress"
            cx="22"
            cy="22"
            r={radius}
            strokeWidth="3.5"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="timer-seconds-text" style={{ position: 'absolute', fontSize: '0.8rem' }}>
          {timeFormatted}
        </span>
      </div>

      <div className="timer-dock-info">
        <span className="timer-dock-label">Resting</span>
        <span className="timer-dock-title">{exerciseName || 'Next Set'}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px' }}>
        <button
          type="button"
          className="btn-icon"
          style={{ width: 32, height: 32 }}
          onClick={(e) => {
            e.stopPropagation();
            onTogglePlay();
          }}
          title={isRunning ? 'Pause' : 'Resume'}
        >
          {isRunning ? <Pause size={14} /> : <Play size={14} />}
        </button>

        <button
          type="button"
          className="btn-icon"
          style={{ width: 32, height: 32 }}
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal();
          }}
          title="Expand Timer"
        >
          <Maximize2 size={14} />
        </button>
      </div>
    </div>
  );
};
