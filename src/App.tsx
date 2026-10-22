import { useState, useEffect } from 'react';
import { DEFAULT_PLAN } from './data/plans';
import type { DayOfWeek, HistoryEntry, SessionType, SetLog, WeekProgress, WorkoutPlan, WeightLogEntry } from './types/workout';
import {
  addHistoryEntry,
  addWeightLogEntry,
  deleteWeightLogEntry,
  ensurePlanSessions,
  getActivePlanId,
  getTodayDayOfWeek,
  loadHistory,
  loadWeekProgress,
  loadWeightLogs,
  loadWorkoutPlans,
  resetCurrentWeek,
  saveActivePlanId,
  saveWeekProgress,
  saveWorkoutPlans
} from './utils/storage';
import { playCountdownTick, playRestCompleteChime } from './utils/audio';
import { calculateSessionCalories } from './utils/calories';
import { Navbar } from './components/Navbar';
import { DaySelector } from './components/DaySelector';
import { SessionToggle } from './components/SessionToggle';
import { GymWarmupCard } from './components/GymWarmupCard';
import { WarmupSectionCard } from './components/WarmupSectionCard';
import { DailyRehabSectionCard } from './components/DailyRehabSectionCard';
import { ExerciseCard } from './components/ExerciseCard';
import { RestTimerDock } from './components/RestTimerDock';
import { RestTimerModal } from './components/RestTimerModal';
import { HipSafetyDrawer } from './components/HipSafetyDrawer';
import { HistoryModal } from './components/HistoryModal';
import { SessionSummaryCard } from './components/SessionSummaryCard';
import { PlanManagerModal } from './components/PlanManagerModal';
import { MapPin, Clock, Sparkles, Flame, Dumbbell } from 'lucide-react';

export function App() {
  const [currentDay, setCurrentDay] = useState<DayOfWeek>(() => getTodayDayOfWeek());
  
  // Intelligent session default: evening if after 5 PM
  const [currentSession, setCurrentSession] = useState<SessionType>(() => {
    const hour = new Date().getHours();
    return hour >= 17 ? 'evening' : 'morning';
  });

  // Workout Plans Management
  const [plans, setPlans] = useState<WorkoutPlan[]>(() => loadWorkoutPlans());
  const [activePlanId, setActivePlanId] = useState<string>(() => getActivePlanId());
  const [planManagerOpen, setPlanManagerOpen] = useState(false);

  // Active Plan Resolution
  const activePlan = plans.find((p) => p.id === activePlanId) || DEFAULT_PLAN || plans[0];

  const [progress, setProgress] = useState<WeekProgress>(() => loadWeekProgress(activePlan));
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());
  const [weightLogs, setWeightLogs] = useState<WeightLogEntry[]>(() => loadWeightLogs());

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

  // Handle Switching Active Plan
  const handleSelectPlan = (newPlanId: string) => {
    const nextPlan = plans.find((p) => p.id === newPlanId);
    if (nextPlan) {
      setActivePlanId(newPlanId);
      saveActivePlanId(newPlanId);
      setProgress((prev) => ensurePlanSessions(prev, nextPlan));
    }
  };

  // Handle Saving Updated Plans list
  const handleSavePlans = (updatedPlans: WorkoutPlan[]) => {
    setPlans(updatedPlans);
    saveWorkoutPlans(updatedPlans);
    const currentStillExists = updatedPlans.some((p) => p.id === activePlanId);
    if (!currentStillExists && updatedPlans.length > 0) {
      handleSelectPlan(updatedPlans[0].id);
    }
  };

  // Selected Day Plan from Active Plan
  const selectedDayPlan = activePlan.days.find((d) => d.dayId === currentDay) || activePlan.days[0];
  const activeSessionPlan = (currentSession === 'morning' ? selectedDayPlan?.morning : selectedDayPlan?.evening) || selectedDayPlan?.morning;

  // Active Session Progress
  const sessionProgress = (activeSessionPlan && progress.sessions[activeSessionPlan.id]) || {
    sessionId: activeSessionPlan?.id || 'default-session',
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
  if (activeSessionPlan?.exercises) {
    activeSessionPlan.exercises.forEach((ex) => {
      totalSets += ex.targetSets;
      const sets = sessionProgress.sets?.[ex.id] || [];
      completedSets += sets.filter((s) => s.completed).length;
    });
  }

  const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  // Calculate Session Calories using Compendium MET formula
  const sessionCalories = activeSessionPlan
    ? calculateSessionCalories(
        activeSessionPlan,
        sessionProgress,
        progress.userWeightKg || 75
      )
    : { burnedKcal: 0, totalKcal: 0 };

  // Handlers for Sets
  const handleUpdateSet = (exerciseId: string, setIndex: number, updated: Partial<SetLog>) => {
    if (!activeSessionPlan) return;
    setProgress((prev) => {
      const currentSessionData = prev.sessions[activeSessionPlan.id] || {
        sessionId: activeSessionPlan.id,
        completed: false,
        sets: {},
        warmupCompleted: {}
      };

      const targetExercise = activeSessionPlan.exercises.find(e => e.id === exerciseId);
      const defaultSetsCount = targetExercise?.targetSets || 1;
      const defaultTargetReps = targetExercise?.targetReps || '';

      const baseSets = currentSessionData.sets[exerciseId] || Array.from(
        { length: defaultSetsCount },
        (_, i) => ({
          setNumber: i + 1,
          targetReps: defaultTargetReps,
          weight: '',
          reps: '',
          completed: false,
          pinchStatus: 'none' as const
        })
      );

      const exerciseSets = [...baseSets];
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
    if (!activeSessionPlan) return;
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
    if (!activeSessionPlan) return;
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

    // Record into history with plan tags
    const newEntry: HistoryEntry = {
      id: `${activeSessionPlan.id}-${Date.now()}`,
      planId: activePlan.id,
      planName: activePlan.name,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      dayName: selectedDayPlan?.dayName || 'Day',
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
    if (!activeSessionPlan) return;
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
    const fresh = resetCurrentWeek(activePlan);
    setProgress(fresh);
  };

  // Weight Logging Handlers
  const handleUpdateWeight = (weightKg: number, note?: string) => {
    setProgress((p) => ({ ...p, userWeightKg: weightKg }));
    const now = new Date();
    const newLog: WeightLogEntry = {
      id: `weight-${Date.now()}`,
      date: now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      time: now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      weightKg,
      displayWeight: progress.unit === 'kg' ? weightKg : Math.round(weightKg * 2.20462 * 10) / 10,
      unit: progress.unit,
      note
    };
    addWeightLogEntry(newLog);
    setWeightLogs(loadWeightLogs());
  };

  const handleDeleteWeightLog = (id: string) => {
    deleteWeightLogEntry(id);
    setWeightLogs(loadWeightLogs());
  };

  return (
    <div>
      <Navbar
        unit={progress.unit}
        userWeightKg={progress.userWeightKg || 75}
        onUpdateWeight={handleUpdateWeight}
        weightLogs={weightLogs}
        onDeleteWeightLog={handleDeleteWeightLog}
        onToggleUnit={() => setProgress((p) => ({ ...p, unit: p.unit === 'kg' ? 'lbs' : 'kg' }))}
        soundEnabled={progress.soundEnabled}
        onToggleSound={() => setProgress((p) => ({ ...p, soundEnabled: !p.soundEnabled }))}
        onOpenSafetyGuide={() => setSafetyDrawerOpen(true)}
        onOpenHistory={() => setHistoryModalOpen(true)}
        currentDay={currentDay}
        onSelectDay={setCurrentDay}
        plans={plans}
        activePlanId={activePlan.id}
        activePlanName={activePlan.name}
        onSelectPlan={handleSelectPlan}
        onOpenPlanManager={() => setPlanManagerOpen(true)}
      />

      <main className="app-container">
        {/* Day Carousel */}
        <DaySelector
          selectedDay={currentDay}
          onSelectDay={setCurrentDay}
          progress={progress}
        />

        {/* Morning vs Evening Switch */}
        {selectedDayPlan && (
          <SessionToggle
            currentSession={currentSession}
            onSelectSession={setCurrentSession}
            morningCompleted={progress.sessions[selectedDayPlan.morning?.id]?.completed}
            eveningCompleted={progress.sessions[selectedDayPlan.evening?.id]?.completed}
          />
        )}

        {/* Session Header Banner */}
        {activeSessionPlan && (
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
        )}

        {/* Morning Gym Warmup Checklist (shown on legacy plans with hasWarmup: true) */}
        {currentSession === 'morning' && activeSessionPlan?.hasWarmup && (
          <GymWarmupCard
            completedMap={sessionProgress.warmupCompleted || {}}
            onToggleItem={handleToggleWarmupItem}
            onStartTimer={handleStartRestTimer}
            userWeightKg={progress.userWeightKg || 75}
            soundEnabled={progress.soundEnabled}
          />
        )}

        {/* Morning & Evening Sections: 1. Warm-Up Flow -> 2. Daily Must-Do Rehab -> 3. Main Workout */}
        {(() => {
          const isWarmupEx = (ex: any) =>
            ex.section === 'warmup' || (typeof ex.id === 'string' && ex.id.match(/-s\d+$/) !== null);

          const isDailyRehabEx = (ex: any) =>
            ex.section === 'daily-rehab' || (typeof ex.id === 'string' && ex.id.match(/-d0[2-8]$/) !== null);

          const warmupStretches = activeSessionPlan?.exercises.filter(isWarmupEx) || [];
          const dailyRehabExercises = activeSessionPlan?.exercises.filter(isDailyRehabEx) || [];
          const mainExercises = activeSessionPlan?.exercises.filter((ex) => !isWarmupEx(ex) && !isDailyRehabEx(ex)) || [];

          return (
            <>
              {/* 1. Warm-Up & Stretch Flow Card with Section-level Guided Timer */}
              {warmupStretches.length > 0 && (
                <WarmupSectionCard
                  stretches={warmupStretches}
                  sessionProgress={sessionProgress}
                  soundEnabled={progress.soundEnabled}
                  unit={progress.unit}
                  userWeightKg={progress.userWeightKg || 75}
                  onUpdateSet={handleUpdateSet}
                  onStartRestTimer={handleStartRestTimer}
                />
              )}

              {/* 2. Daily Must-Do Hip & Ankle Rehab Section (Collapsible & Auto-collapses on finish) */}
              {dailyRehabExercises.length > 0 && (
                <DailyRehabSectionCard
                  exercises={dailyRehabExercises}
                  sessionProgress={sessionProgress}
                  soundEnabled={progress.soundEnabled}
                  unit={progress.unit}
                  userWeightKg={progress.userWeightKg || 75}
                  onUpdateSet={handleUpdateSet}
                  onStartRestTimer={handleStartRestTimer}
                />
              )}

              {/* 3. Main Workout Exercises List */}
              {activeSessionPlan && (
                <div className="exercises-list">
                  {(warmupStretches.length > 0 || dailyRehabExercises.length > 0) && mainExercises.length > 0 && (
                    <div className="section-header-divider">
                      <div className="section-header-title">
                        <Dumbbell size={18} color="#6366f1" />
                        <span>Main Workout Session</span>
                      </div>
                      <span className="section-header-count">{mainExercises.length} Exercises</span>
                    </div>
                  )}

                  {activeSessionPlan.exercises.length === 0 ? (
                    <div className="empty-exercises-notice" style={{ textAlign: 'center', padding: '30px 16px' }}>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>No exercises planned for this session yet.</p>
                      <button 
                        className="btn-tool-action primary" 
                        style={{ margin: '0 auto' }}
                        onClick={() => setPlanManagerOpen(true)}
                      >
                        Edit Routine in Plan Manager
                      </button>
                    </div>
                  ) : (
                    mainExercises.map((exercise) => {
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
                    })
                  )}
                </div>
              )}
            </>
          );
        })()}

        {/* Session Summary & Hip Reflection Card */}
        {activeSessionPlan && (
          <SessionSummaryCard
            session={activeSessionPlan}
            progress={sessionProgress}
            userWeightKg={progress.userWeightKg || 75}
            soundEnabled={progress.soundEnabled}
            onCompleteSession={handleCompleteSession}
            onUncompleteSession={handleUncompleteSession}
          />
        )}
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
        weightLogs={weightLogs}
        onResetWeek={handleResetWeek}
        onDataImported={() => {
          setPlans(loadWorkoutPlans());
          setActivePlanId(getActivePlanId());
          setProgress(loadWeekProgress());
          setHistory(loadHistory());
          setWeightLogs(loadWeightLogs());
        }}
      />

      {/* Multi-Plan Manager & Plan Editor Modal */}
      <PlanManagerModal
        isOpen={planManagerOpen}
        onClose={() => setPlanManagerOpen(false)}
        plans={plans}
        activePlanId={activePlan.id}
        onSelectPlan={handleSelectPlan}
        onSavePlans={handleSavePlans}
      />
    </div>
  );
}

export default App;
