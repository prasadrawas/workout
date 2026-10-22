import { useState, useEffect, useRef, type FC } from 'react';
import { 
  Flame, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  ChevronDown, 
  ChevronUp, 
  Volume2, 
  VolumeX, 
  X, 
  Check, 
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Exercise, SessionProgress, SetLog } from '../types/workout';
import { ExerciseCard } from './ExerciseCard';
import { 
  playCountdownTick, 
  playRestCompleteChime, 
  playHoldStartBeep, 
  speakText, 
  cancelSpeech 
} from '../utils/audio';
import { getExerciseCalories } from '../utils/calories';

interface WarmupSectionCardProps {
  stretches: Exercise[];
  sessionProgress: SessionProgress;
  soundEnabled: boolean;
  unit: 'kg' | 'lbs';
  userWeightKg?: number;
  onUpdateSet: (exerciseId: string, setIndex: number, updated: Partial<SetLog>) => void;
  onStartRestTimer: (name: string, durationSec: number) => void;
}

export const WarmupSectionCard: FC<WarmupSectionCardProps> = ({
  stretches,
  sessionProgress,
  soundEnabled,
  unit,
  userWeightKg = 75,
  onUpdateSet,
  onStartRestTimer
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFlowActive, setIsFlowActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<'hold' | 'rest'>('hold');
  const [timeLeft, setTimeLeft] = useState(60);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // References for active timer state
  const phaseRef = useRef(phase);
  const currentIdxRef = useRef(currentIdx);
  const voiceEnabledRef = useRef(voiceEnabled);
  const soundEnabledRef = useRef(soundEnabled);
  const stretchesRef = useRef(stretches);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    currentIdxRef.current = currentIdx;
  }, [currentIdx]);

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
  }, [voiceEnabled]);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    stretchesRef.current = stretches;
  }, [stretches]);

  // Calculate completed count and total calories
  let completedCount = 0;
  let totalKcal = 0;
  let burnedKcal = 0;

  stretches.forEach((st) => {
    const sSets = sessionProgress.sets?.[st.id] || [];
    const isDone = sSets.length > 0 && sSets.every(s => s.completed);
    if (isDone) completedCount++;

    const cal = getExerciseCalories(st, isDone ? 1 : 0, userWeightKg);
    totalKcal += cal.totalKcal;
    burnedKcal += cal.burnedKcal;
  });

  const allCompleted = stretches.length > 0 && completedCount === stretches.length;

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      cancelSpeech();
    };
  }, []);

  // Interval timer loop for guided routine
  useEffect(() => {
    if (!isFlowActive || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        // Ticks for final 3 seconds
        if (prev <= 4 && prev > 1) {
          playCountdownTick(soundEnabledRef.current);
        }

        if (prev <= 1) {
          const currentPhase = phaseRef.current;
          const currentStretch = stretchesRef.current[currentIdxRef.current];

          if (currentPhase === 'hold') {
            // 30s Hold Completed!
            playRestCompleteChime(soundEnabledRef.current);

            // Automatically check off set
            if (currentStretch) {
              onUpdateSet(currentStretch.id, 0, { completed: true });
            }

            // Check if routine is finished
            if (currentIdxRef.current >= stretchesRef.current.length - 1) {
              confetti({
                particleCount: 50,
                spread: 75,
                origin: { y: 0.6 }
              });
              speakText(
                'Warm-up and stretch routine complete! Great job!',
                voiceEnabledRef.current && soundEnabledRef.current
              );
              setIsFlowActive(false);
              return 0;
            }

            // Move to 12-second REST
            setPhase('rest');
            const nextStretch = stretchesRef.current[currentIdxRef.current + 1];
            speakText(
              `Rest twelve seconds. Next: ${nextStretch ? nextStretch.name : 'next stretch'}`,
              voiceEnabledRef.current && soundEnabledRef.current
            );
            return 12;
          } else {
            // 12s Rest Completed! Transition to next stretch 60s Hold
            const nextIdx = currentIdxRef.current + 1;
            setCurrentIdx(nextIdx);
            setPhase('hold');
            const nextStretch = stretchesRef.current[nextIdx];
            playHoldStartBeep(soundEnabledRef.current);
            speakText(
              `${nextStretch ? nextStretch.name : 'Next stretch'}, sixty seconds hold`,
              voiceEnabledRef.current && soundEnabledRef.current
            );
            return 60;
          }
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFlowActive, isPaused, onUpdateSet]);

  // Handler to start or resume the guided routine
  const handleStartFlow = () => {
    // If not currently running, initialize
    if (!isFlowActive) {
      // Find first incomplete stretch or start from 0
      const firstIncompleteIdx = stretches.findIndex(st => {
        const sSets = sessionProgress.sets?.[st.id] || [];
        return !(sSets.length > 0 && sSets.every(s => s.completed));
      });
      const startIdx = firstIncompleteIdx >= 0 ? firstIncompleteIdx : 0;
      setCurrentIdx(startIdx);
      setPhase('hold');
      setTimeLeft(60);
      setIsPaused(false);
      setIsFlowActive(true);

      const targetStretch = stretches[startIdx];
      playHoldStartBeep(soundEnabled);
      speakText(
        `Starting warm-up. ${targetStretch.name}, sixty seconds hold`,
        voiceEnabled && soundEnabled
      );
    } else {
      setIsPaused(!isPaused);
    }
  };

  const handleStopFlow = () => {
    setIsFlowActive(false);
    setIsPaused(false);
    cancelSpeech();
  };

  const handleSkipNext = () => {
    if (currentIdx < stretches.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setPhase('hold');
      setTimeLeft(60);
      const nextStretch = stretches[nextIdx];
      playHoldStartBeep(soundEnabled);
      speakText(
        `${nextStretch ? nextStretch.name : 'Next stretch'}, sixty seconds hold`,
        voiceEnabled && soundEnabled
      );
    }
  };

  const handleSkipPrev = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      setPhase('hold');
      setTimeLeft(60);
      const prevStretch = stretches[prevIdx];
      playHoldStartBeep(soundEnabled);
      speakText(
        `${prevStretch ? prevStretch.name : 'Previous stretch'}, sixty seconds hold`,
        voiceEnabled && soundEnabled
      );
    }
  };

  const handleRestartCurrent = () => {
    setTimeLeft(phase === 'hold' ? 60 : 12);
    const targetStretch = stretches[currentIdx];
    if (phase === 'hold') {
      playHoldStartBeep(soundEnabled);
      speakText(
        `Restarting ${targetStretch.name}, sixty seconds hold`,
        voiceEnabled && soundEnabled
      );
    }
  };

  const currentStretch = stretches[currentIdx] || stretches[0];
  const nextStretch = currentIdx < stretches.length - 1 ? stretches[currentIdx + 1] : null;

  // Circular progress calculations
  const totalPhaseTime = phase === 'hold' ? 60 : 12;
  const progressRatio = Math.max(0, Math.min(1, timeLeft / totalPhaseTime));
  const circleRadius = 58;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className={`glass-panel warmup-section-card ${isFlowActive ? 'active-flow' : ''}`}>
      {/* Header bar */}
      <div className="warmup-section-header">
        <div className="warmup-section-title-wrap">
          <div className="warmup-icon-badge">
            <Flame size={20} color="#06b6d4" />
          </div>
          <div>
            <div className="warmup-title-row">
              <h3 className="warmup-section-title">Warm-Up & Stretch Flow</h3>
              <span className="warmup-pill-tag">
                {stretches.length} Stretches · 60s + 12s
              </span>
            </div>
            <p className="warmup-section-subtitle">
              Daily hip mobility, pelvic control & posterior chain priming (~20 min)
            </p>
          </div>
        </div>

        <div className="warmup-header-stats">
          <span className="tag-calories" title="Estimated calories for routine">
            <Flame size={12} />
            ~{totalKcal} kcal
          </span>
          <span className={`warmup-progress-badge ${allCompleted ? 'all-done' : ''}`}>
            {allCompleted ? <Check size={13} /> : null}
            {completedCount} of {stretches.length} done
          </span>
        </div>
      </div>

      {/* Main Action Bar (when flow is idle) */}
      {!isFlowActive && (
        <div className="warmup-action-bar">
          <button
            className={`btn-start-flow ${allCompleted ? 'completed-flow' : ''}`}
            onClick={handleStartFlow}
          >
            <Play size={16} fill="currentColor" />
            <span>{allCompleted ? 'Repeat Guided Stretch Flow' : 'Start Guided Stretch Flow (60s / 12s)'}</span>
          </button>

          <button
            className="btn-toggle-exercises-list"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Hide stretch cards' : 'Show all stretch cards'}
          >
            <span>{isExpanded ? 'Hide Details' : 'View Poses'}</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      )}

      {/* ACTIVE GUIDED TIMER PLAYER */}
      {isFlowActive && (
        <div className={`guided-player-container ${isFullscreen ? 'fullscreen-mode' : ''}`}>
          {/* Top Player Control Strip */}
          <div className="player-top-strip">
            <div className="player-stretch-badge">
              <Sparkles size={14} color="#06b6d4" />
              <span>Stretch {currentIdx + 1} of {stretches.length}</span>
            </div>

            <div className="player-top-actions">
              <button
                className={`player-mini-btn ${voiceEnabled ? 'active' : ''}`}
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                title={voiceEnabled ? 'Mute voice announcements' : 'Enable voice announcements'}
              >
                {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button
                className="player-mini-btn"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen timer'}
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                className="player-mini-btn danger"
                onClick={handleStopFlow}
                title="Stop guided routine"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Routine Level Progress Bar */}
          <div className="player-routine-progress-track">
            <div
              className="player-routine-progress-fill"
              style={{
                width: `${((currentIdx + (phase === 'rest' ? 1 : 0.5)) / stretches.length) * 100}%`
              }}
            />
          </div>

          {/* Main Visual Countdown & Phase */}
          <div className="player-hero-box">
            <div className={`player-phase-chip ${phase}`}>
              <span className="phase-pulse-dot" />
              {phase === 'hold' ? 'HOLD ACTIVE • 60s' : 'REST & PREPARE NEXT • 12s'}
            </div>

            <div className="player-countdown-display">
              <svg className="player-circle-svg" viewBox="0 0 140 140">
                <circle
                  className="player-circle-bg"
                  cx="70"
                  cy="70"
                  r={circleRadius}
                />
                <circle
                  className={`player-circle-progress ${phase} ${timeLeft <= 3 ? 'pulse-tick' : ''}`}
                  cx="70"
                  cy="70"
                  r={circleRadius}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="player-countdown-numbers">
                <span className="player-number">{String(timeLeft).padStart(2, '0')}</span>
                <span className="player-unit">sec</span>
              </div>
            </div>

            {/* Current Stretch Information */}
            <div className="player-stretch-info">
              <h2 className="player-stretch-name">{currentStretch.name}</h2>
              {currentStretch.rightHipFocus && (
                <span className="player-right-hip-badge">
                  🎯 Right Leg Priority
                </span>
              )}
              {currentStretch.notes && (
                <p className="player-stretch-notes">{currentStretch.notes}</p>
              )}
            </div>

            {/* Next Up Preview */}
            {nextStretch && (
              <div className="player-next-preview">
                <span className="next-label">Next Up:</span>
                <span className="next-name">{nextStretch.name}</span>
              </div>
            )}
          </div>

          {/* Player Navigation & Controls Bar */}
          <div className="player-controls-bar">
            <button
              className="player-ctrl-btn secondary"
              onClick={handleSkipPrev}
              disabled={currentIdx === 0}
              title="Previous stretch"
            >
              <SkipBack size={18} />
              <span className="ctrl-btn-label">Prev</span>
            </button>

            <button
              className="player-ctrl-btn secondary"
              onClick={handleRestartCurrent}
              title="Restart current stretch"
            >
              <RotateCcw size={18} />
              <span className="ctrl-btn-label">Reset</span>
            </button>

            <button
              className={`player-ctrl-btn play-pause-btn ${isPaused ? 'paused' : 'playing'}`}
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? 'Resume timer' : 'Pause timer'}
            >
              {isPaused ? <Play size={22} fill="currentColor" /> : <Pause size={22} fill="currentColor" />}
            </button>

            <button
              className="player-ctrl-btn secondary"
              onClick={handleSkipNext}
              disabled={currentIdx >= stretches.length - 1}
              title="Skip to next stretch"
            >
              <SkipForward size={18} />
              <span className="ctrl-btn-label">Next</span>
            </button>
          </div>
        </div>
      )}

      {/* EXPANDABLE LIST OF INDIVIDUAL STRETCH CARDS */}
      {isExpanded && (
        <div className="warmup-exercises-details-list">
          <div className="warmup-exercises-banner">
            <span>Individual Stretch Poses ({stretches.length})</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Check off automatically during guided flow or tap manually below
            </span>
          </div>

          <div className="stretches-grid">
            {stretches.map((st) => {
              const exerciseSets = sessionProgress.sets?.[st.id] || Array.from(
                { length: st.targetSets },
                (_, i) => ({
                  setNumber: i + 1,
                  targetReps: st.targetReps,
                  weight: '',
                  reps: '',
                  completed: false,
                  pinchStatus: 'none' as const
                })
              );

              return (
                <ExerciseCard
                  key={st.id}
                  exercise={st}
                  sets={exerciseSets}
                  unit={unit}
                  userWeightKg={userWeightKg}
                  soundEnabled={soundEnabled}
                  onUpdateSet={(setIndex, updated) => onUpdateSet(st.id, setIndex, updated)}
                  onStartRestTimer={onStartRestTimer}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
