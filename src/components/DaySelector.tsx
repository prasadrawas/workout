import type { FC } from 'react';
import type { DayOfWeek, WeekProgress } from '../types/workout';
import { WORKOUT_PLAN } from '../data/workoutPlan';
import { getTodayDayOfWeek } from '../utils/storage';

interface DaySelectorProps {
  selectedDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
  progress: WeekProgress;
}

export const DaySelector: FC<DaySelectorProps> = ({
  selectedDay,
  onSelectDay,
  progress
}) => {
  const today = getTodayDayOfWeek();

  return (
    <div className="day-selector-wrap">
      <div className="day-selector">
        {WORKOUT_PLAN.map((day) => {
          const isSelected = selectedDay === day.dayId;
          const isToday = today === day.dayId;

          const morningSession = progress.sessions[day.morning.id];
          const eveningSession = progress.sessions[day.evening.id];

          const morningDone = morningSession?.completed;
          const eveningDone = eveningSession?.completed;

          // Check if any sets were done in this day
          let hasPartial = false;
          if (!morningDone && morningSession) {
            hasPartial = Object.values(morningSession.sets || {}).some(sets => sets.some(s => s.completed));
          }
          if (!hasPartial && !eveningDone && eveningSession) {
            hasPartial = Object.values(eveningSession.sets || {}).some(sets => sets.some(s => s.completed));
          }

          let statusClass = '';
          if (morningDone && eveningDone) {
            statusClass = 'completed';
          } else if (morningDone || eveningDone || hasPartial) {
            statusClass = 'partial';
          }

          return (
            <button
              key={day.dayId}
              type="button"
              className={`day-pill ${isSelected ? 'active' : ''} ${isToday ? 'today' : ''} ${statusClass}`}
              onClick={() => onSelectDay(day.dayId)}
            >
              <span className="day-name">{day.shortName}</span>
              <div className="day-status" title={statusClass === 'completed' ? 'Both sessions completed' : statusClass === 'partial' ? 'In progress' : 'Not started'} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
