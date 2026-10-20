import { useState, useEffect } from 'react';
import { WORKOUT_PLAN } from './data/workoutPlan';
import type { DayOfWeek, HistoryEntry, SessionType, SetLog, WeekProgress } from './types/workout';
import {
  addHistoryEntry,
  getTodayDayOfWeek,
  loadHistory,
  loadWeekProgress,
  resetCurrentWeek,
  saveWeekProgress
} from './utils/storage';
import { playCountdownTick, playRestCompleteChime } from './utils/audio';
import { calculateSessionCalories } from './utils/calories';
import { Navbar } from './components/Navbar';
import { DaySelector } from './components/DaySelector';
import { SessionToggle } from './components/SessionToggle';
import { GymWarmupCard } from './components/GymWarmupCard';
import { ExerciseCard } from './components/ExerciseCard';
import { RestTimerDock } from './components/RestTimerDock';
import { RestTimerModal } from './components/RestTimerModal';
import { HipSafetyDrawer } from './components/HipSafetyDrawer';
import { HistoryModal } from './components/HistoryModal';
import { SessionSummaryCard } from './components/SessionSummaryCard';
import { MapPin, Clock, Sparkles, Flame } from 'lucide-react';

export function App() {
  const [currentDay, setCurrentDay] = useState<DayOfWeek>(() => getTodayDayOfWeek());
  
  // Intelligent session default: evening if after 5 PM
  const [currentSession, setCurrentSession] = useState<SessionType>(() => {
    const hour = new Date().getHours();
    return hour >= 17 ? 'evening' : 'morning';
  });

  const [progress, setProgress] = useState<WeekProgress>(() => loadWeekProgress());
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());

  // Rest Timer State
  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(90);
  const [timerExerciseName, setTimerExerciseName] = useState('');

  // Modals
  const [safetyDrawerOpen, setSafetyDrawerOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  // Sync progress to localStorage
  useEffect(() => {
    saveWeekProgress(progress);
  }, [progress]);

  // Rest timer countdown interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            playRestCompleteChime(progress.soundEnabled);
            setTimerRunning(false);
            return 0;
          }
          if (prev <= 4 && prev > 1) {
            playCountdownTick(progress.soundEnabled);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timeLeft, progress.soundEnabled]);

  // Selected Day Plan
  const selectedDayPlan = WORKOUT_PLAN.find((d) => d.dayId === currentDay) || WORKOUT_PLAN[0];
  const activeSessionPlan = currentSession === 'morning' ? selectedDayPlan.morning : selectedDayPlan.evening;

  // Active Session Progress
  const sessionProgress = progress.sessions[activeSessionPlan.id] || {
    sessionId: activeSessionPlan.id,
    completed: false,
    sets: {},
    warmupCompleted: {},
    painScore: 0,
    pinchReported: false,
    sessionNotes: ''
  };

  // Calculate Progress %
  let totalSets = 0;
  let completedSets = 0;
  activeSessionPlan.exercises.forEach((ex) => {
    totalSets += ex.targetSets;
    const sets = sessionProgress.sets?.[ex.id] || [];
    completedSets += sets.filter((s) => s.completed).length;
  });

  const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  // Calculate Session Calories using Compendium MET formula
  const sessionCalories = calculateSessionCalories(
    activeSessionPlan,
    sessionProgress,
    progress.userWeightKg || 75
  );

  // Handlers for Sets
  const handleUpdateSet = (exerciseId: string, setIndex: number, updated: Partial<SetLog>) => {
    setProgress((prev) => {
      const currentSessionData = prev.sessions[activeSessionPlan.id] || {
        sessionId: activeSessionPlan.id,
        completed: false,
        sets: {},
        warmupCompleted: {}
      };

      const exerciseSets = [...(currentSessionData.sets[exerciseId] || [])];
      exerciseSets[setIndex] = {
        ...exerciseSets[setIndex],
        ...updated
      };

      return {
        ...prev,
        sessions: {
          ...prev.sessions,
          [activeSessionPlan.id]: {
            ...currentSessionData,
            sets: {
              ...currentSessionData.sets,
              [exerciseId]: exerciseSets
            }
          }
        }
      };
    });
  };

  // Handlers for Warmup items
  const handleToggleWarmupItem = (itemId: string) => {
    setProgress((prev) => {
      const currentSessionData = prev.sessions[activeSessionPlan.id] || {
        sessionId: activeSessionPlan.id,
        completed: false,
        sets: {},
        warmupCompleted: {}
      };

      const prevCompleted = !!currentSessionData.warmupCompleted?.[itemId];
      return {
        ...prev,
        sessions: {
          ...prev.sessions,
          [activeSessionPlan.id]: {
            ...currentSessionData,
            warmupCompleted: {
              ...currentSessionData.warmupCompleted,
              [itemId]: !prevCompleted
            }
          }
        }
      };
    });
  };

  // Complete Session
  const handleCompleteSession = (painScore: number, pinchReported: boolean, notes: string, caloriesBurned: number) => {
    setProgress((prev) => {
      const currentSessionData = prev.sessions[activeSessionPlan.id];
      return {
        ...prev,
        sessions: {
          ...prev.sessions,
          [activeSessionPlan.id]: {
            ...currentSessionData,
            completed: true,
            completedAt: new Date().toISOString(),
            painScore,
            pinchReported,
            sessionNotes: notes,
            caloriesBurned
          }
        }
      };
    });

    // Record into history
    const newEntry: HistoryEntry = {
      id: `${activeSessionPlan.id}-${Date.now()}`,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      dayName: selectedDayPlan.dayName,
      sessionTitle: activeSessionPlan.title,
      sessionType: currentSession,
      completedSetsCount: completedSets,
      totalSetsCount: totalSets,
      caloriesBurned,
      painScore,
      pinchReported,
      notes
    };
    addHistoryEntry(newEntry);
    setHistory(loadHistory());
  };

  const handleUncompleteSession = () => {
    setProgress((prev) => {
      const currentSessionData = prev.sessions[activeSessionPlan.id];
      return {
        ...prev,
        sessions: {
          ...prev.sessions,
          [activeSessionPlan.id]: {
            ...currentSessionData,
            completed: false
          }
        }
      };
    });
  };

  // Timer controls
  const handleStartRestTimer = (exerciseName: string, durationSec: number) => {
    setTimerExerciseName(exerciseName);
    setTotalTime(durationSec);
    setTimeLeft(durationSec);
    setTimerRunning(true);
    setTimerModalOpen(true);
  };

  const handleToggleTimerPlay = () => {
    if (timeLeft === 0) {
      setTimeLeft(totalTime);
      setTimerRunning(true);
    } else {
      setTimerRunning((prev) => !prev);
    }
  };

  const handleResetTimer = () => {
    setTimeLeft(totalTime);
    setTimerRunning(false);
  };

  const handleSetTimerPreset = (presetSeconds: number) => {
    setTotalTime(presetSeconds);
    setTimeLeft(presetSeconds);
    setTimerRunning(true);
  };

  const handleAdjustTimerTime = (deltaSeconds: number) => {
    setTimeLeft((prev) => Math.max(0, prev + deltaSeconds));
  };

  // Reset current week
  const handleResetWeek = () => {
    const fresh = resetCurrentWeek();
    setProgress(fresh);
  };

  return (
    <div>
      <Navbar
        unit={progress.unit}
        userWeightKg={progress.userWeightKg || 75}
        onUpdateWeight={(w) => setProgress((p) => ({ ...p, userWeightKg: w }))}
        onToggleUnit={() => setProgress((p) => ({ ...p, unit: p.unit === 'kg' ? 'lbs' : 'kg' }))}
        soundEnabled={progress.soundEnabled}
        onToggleSound={() => setProgress((p) => ({ ...p, soundEnabled: !p.soundEnabled }))}
        onOpenSafetyGuide={() => setSafetyDrawerOpen(true)}
        onOpenHistory={() => setHistoryModalOpen(true)}
        currentDay={currentDay}
        onSelectDay={setCurrentDay}
      />

      <main className="app-container">
        {/* Day Carousel */}
        <DaySelector
          selectedDay={currentDay}
          onSelectDay={setCurrentDay}
          progress={progress}
        />

        {/* Morning vs Evening Switch */}
        <SessionToggle
          currentSession={currentSession}
          onSelectSession={setCurrentSession}
          morningCompleted={progress.sessions[selectedDayPlan.morning.id]?.completed}
          eveningCompleted={progress.sessions[selectedDayPlan.evening.id]?.completed}
        />

        {/* Session Header Banner */}
        <div className="glass-panel session-banner">
          <div className="banner-meta">
            <span className={`badge ${currentSession === 'morning' ? 'badge-gym' : 'badge-home'}`}>
              <MapPin size={12} />
              {activeSessionPlan.location}
            </span>
            <span className="badge badge-duration">
              <Clock size={12} />
              {activeSessionPlan.durationEstimate}
            </span>
            <span className="badge badge-calories" title="Compendium formula: (MET × 3.5 × weight) / 200 × time">
              <Flame size={12} />
              {sessionCalories.burnedKcal} / {sessionCalories.totalKcal} kcal
            </span>
            {sessionProgress.completed && (
              <span className="badge badge-completed">
                <Sparkles size={12} /> Completed
              </span>
            )}
          </div>

          <h2 className="banner-title font-display">{activeSessionPlan.title}</h2>
          <p className="banner-subtitle">{activeSessionPlan.subtitle}</p>

          <div className="banner-progress-row">
            <div className="progress-bar-wrap">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="progress-text">
              {completedSets} of {totalSets} sets ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Morning Gym Warmup Checklist (shown on morning sessions with warmups) */}
        {currentSession === 'morning' && activeSessionPlan.hasWarmup && (
          <GymWarmupCard
            completedMap={sessionProgress.warmupCompleted || {}}
            onToggleItem={handleToggleWarmupItem}
            onStartTimer={handleStartRestTimer}
            userWeightKg={progress.userWeightKg || 75}
            soundEnabled={progress.soundEnabled}
          />
        )}

        {/* Exercises List */}
        <div className="exercises-list">
          {activeSessionPlan.exercises.map((exercise) => {
            const exerciseSets = sessionProgress.sets?.[exercise.id] || Array.from({ length: exercise.targetSets }, (_, i) => ({
              setNumber: i + 1,
              targetReps: exercise.targetReps,
              weight: '',
              reps: '',
              completed: false,
              pinchStatus: 'none' as const
            }));

            return (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                sets={exerciseSets}
                unit={progress.unit}
                userWeightKg={progress.userWeightKg || 75}
                soundEnabled={progress.soundEnabled}
                onUpdateSet={(setIndex, updated) => handleUpdateSet(exercise.id, setIndex, updated)}
                onStartRestTimer={handleStartRestTimer}
              />
            );
          })}
        </div>

        {/* Session Summary & Hip Reflection Card */}
        <SessionSummaryCard
          session={activeSessionPlan}
          progress={sessionProgress}
          userWeightKg={progress.userWeightKg || 75}
          soundEnabled={progress.soundEnabled}
          onCompleteSession={handleCompleteSession}
          onUncompleteSession={handleUncompleteSession}
        />
      </main>

      {/* Floating Rest Timer Dock */}
      {timeLeft > 0 && !timerModalOpen && (
        <RestTimerDock
          timeLeft={timeLeft}
          totalTime={totalTime}
          isRunning={timerRunning}
          exerciseName={timerExerciseName}
          onTogglePlay={handleToggleTimerPlay}
          onOpenModal={() => setTimerModalOpen(true)}
        />
      )}

      {/* Full Rest Timer Modal */}
      <RestTimerModal
        isOpen={timerModalOpen}
        timeLeft={timeLeft}
        totalTime={totalTime}
        isRunning={timerRunning}
        exerciseName={timerExerciseName}
        onClose={() => {
          setTimerModalOpen(false);
          setTimerRunning(false);
          setTimeLeft(0);
        }}
        onMinimize={() => setTimerModalOpen(false)}
        onTogglePlay={handleToggleTimerPlay}
        onReset={handleResetTimer}
        onSetPreset={handleSetTimerPreset}
        onAdjustTime={handleAdjustTimerTime}
      />

      {/* THR Safety & 12-Week Progression Drawer */}
      <HipSafetyDrawer
        isOpen={safetyDrawerOpen}
        onClose={() => setSafetyDrawerOpen(false)}
      />

      {/* History, Trends & JSON Backup Modal */}
      <HistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        history={history}
        progress={progress}
        onResetWeek={handleResetWeek}
        onDataImported={() => {
          setProgress(loadWeekProgress());
          setHistory(loadHistory());
        }}
      />
    </div>
  );
}

export default App;
