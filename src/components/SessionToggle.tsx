import type { FC } from 'react';
import { Dumbbell, Home, CheckCircle2 } from 'lucide-react';
import type { SessionType } from '../types/workout';

interface SessionToggleProps {
  currentSession: SessionType;
  onSelectSession: (type: SessionType) => void;
  morningCompleted?: boolean;
  eveningCompleted?: boolean;
}

export const SessionToggle: FC<SessionToggleProps> = ({
  currentSession,
  onSelectSession,
  morningCompleted,
  eveningCompleted
}) => {
  return (
    <div className="session-switch">
      <button
        type="button"
        className={`session-btn gym ${currentSession === 'morning' ? 'active' : ''}`}
        onClick={() => onSelectSession('morning')}
      >
        <Dumbbell size={18} />
        <span>Morning · Gym</span>
        {morningCompleted && <CheckCircle2 size={16} color="#10b981" />}
      </button>

      <button
        type="button"
        className={`session-btn home ${currentSession === 'evening' ? 'active' : ''}`}
        onClick={() => onSelectSession('evening')}
      >
        <Home size={18} />
        <span>Evening · Home</span>
        {eveningCompleted && <CheckCircle2 size={16} color="#10b981" />}
      </button>
    </div>
  );
};
