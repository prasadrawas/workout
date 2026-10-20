import type { DayPlan, ProgressionPhase, WarmupItem, WorkoutPlan } from '../types/workout';

export const MORNING_WARMUP_ROUTINE: WarmupItem[] = [
  {
    id: 'warmup-bike',
    name: 'Stationary bike',
    target: '5 minutes, easy resistance',
    durationSec: 300,
    completed: false,
    note: 'Gentle cadence, focus on smooth bilateral hip range without impingement'
  },
  {
    id: 'warmup-hip-flexor',
    name: 'Gentle hip-flexor stretch',
    target: '2 × 20–30 seconds per side',
    durationSec: 30,
    completed: false,
    note: 'Tall spine, posterior pelvic tuck. Absolutely NO pinching in front of right hip!'
  },
  {
    id: 'warmup-calf',
    name: 'Standing calf stretch',
    target: '2 × 20–30 seconds per side',
    durationSec: 30,
    completed: false,
    note: 'Heel flat on ground, knee straight then slight bend'
  },
  {
    id: 'warmup-ql',
    name: 'Gentle QL / side-body stretch',
    target: '2 × 20 seconds per side',
    durationSec: 20,
    completed: false,
    note: 'No forced side-bending; gently lengthen lateral flank'
  },
  {
    id: 'warmup-pelvic-tilts',
    name: 'Supported pelvic tilts',
    target: '10 slow repetitions',
    completed: false,
    note: 'Hold stable bar/counter. Feel anterior vs posterior control, keep pelvis level'
  },
  {
    id: 'warmup-sit-to-stand',
    name: 'Sit-to-stand or shallow squat rehearsal',
    target: '1–2 × 8 reps',
    completed: false,
    note: 'Only if completely pain-free; focus on equal weight distribution'
  }
];

export const WORKOUT_PLAN: DayPlan[] = [
  // MONDAY
  {
    dayId: 'monday',
    dayName: 'Monday',
    shortName: 'Mon',
    morning: {
      id: 'monday-morning',
      title: 'Lower body A + Push',
      subtitle: 'Strength emphasis: controlled leg loading, glutes and chest',
      location: 'Gym',
      durationEstimate: 'Up to 2 hours (incl. warm-up & rest)',
      hasWarmup: true,
      exercises: [
        {
          id: 'mon-m-1',
          name: 'Leg press (shallow-to-moderate range)',
          targetSets: 3,
          targetReps: '10–12',
          defaultRestSec: 120,
          category: 'legs',
          rightHipFocus: true,
          notes: 'Keep in comfortable shallow range. Do NOT allow hip to bend past cleared angle or pinch at front.'
        },
        {
          id: 'mon-m-2',
          name: 'Seated hamstring curl',
          targetSets: 3,
          targetReps: '10–15',
          defaultRestSec: 90,
          category: 'legs',
          notes: 'Controlled eccentric return. Keep hips stable in the seat without tilting.'
        },
        {
          id: 'mon-m-3',
          name: 'Supported low step-up',
          targetSets: 2,
          targetReps: '8 each leg',
          defaultRestSec: 90,
          category: 'legs',
          rightHipFocus: true,
          notes: 'Use a low step (4-6 in). Support hands on rails. Drive through right heel; watch for hip hiking.'
        },
        {
          id: 'mon-m-4',
          name: 'Hip abductor machine (light & controlled)',
          targetSets: 2,
          targetReps: '12–15',
          defaultRestSec: 90,
          category: 'hip-rehab',
          rightHipFocus: true,
          notes: 'Pause 1 sec at peak abduction. Builds lateral glute stability.'
        },
        {
          id: 'mon-m-5',
          name: 'Machine chest press',
          targetSets: 3,
          targetReps: '8–12',
          defaultRestSec: 90,
          category: 'push',
          notes: 'Feet planted flat and stable without arching low back.'
        },
        {
          id: 'mon-m-6',
          name: 'Incline dumbbell press',
          targetSets: 3,
          targetReps: '8–12',
          defaultRestSec: 90,
          category: 'push',
          notes: '30-45 degree bench. Smooth press, controlled descent.'
        },
        {
          id: 'mon-m-7',
          name: 'Cable triceps pushdown',
          targetSets: 2,
          targetReps: '12–15',
          defaultRestSec: 60,
          category: 'push',
          notes: 'Keep elbows tucked, brace core with neutral pelvis.'
        },
        {
          id: 'mon-m-8',
          name: 'Pallof press (light cable resistance)',
          targetSets: 2,
          targetReps: '10 each side',
          defaultRestSec: 60,
          category: 'core',
          notes: 'Athletic stance, level pelvis. Resists trunk rotation, protects spine.'
        }
      ]
    },
    evening: {
      id: 'monday-evening',
      title: 'Hip flexors, QL and Pelvic Control',
      subtitle: 'Targeted rehabilitation and lighter accessory work',
      location: 'Home',
      durationEstimate: '45–60 minutes',
      exercises: [
        {
          id: 'mon-e-1',
          name: 'Gentle hip-flexor stretch',
          targetSets: 2,
          targetReps: '30 sec each side',
          defaultRestSec: 30,
          category: 'mobility',
          isTimeBased: true,
          notes: 'Mild tension only. Stop immediately if any front pinch occurs.'
        },
        {
          id: 'mon-e-2',
          name: 'Gentle standing QL stretch',
          targetSets: 2,
          targetReps: '20 sec each side',
          defaultRestSec: 30,
          category: 'mobility',
          isTimeBased: true,
          notes: 'Lengthen side ribs. Do not crank or force lateral bend.'
        },
        {
          id: 'mon-e-3',
          name: 'Supine pelvic tilts',
          targetSets: 2,
          targetReps: '12 reps',
          defaultRestSec: 45,
          category: 'core',
          notes: 'Flatten lower back into mat, feel lower abdominals engage.'
        },
        {
          id: 'mon-e-4',
          name: 'Glute bridges',
          targetSets: 3,
          targetReps: '12 reps',
          defaultRestSec: 60,
          category: 'hip-rehab',
          rightHipFocus: true,
          notes: 'Squeeze glutes at top, maintain level hips, do not overextend lumbar spine.'
        },
        {
          id: 'mon-e-5',
          name: 'Side-lying hip abduction (bodyweight)',
          targetSets: 2,
          targetReps: '10 each side',
          defaultRestSec: 60,
          category: 'hip-rehab',
          rightHipFocus: true,
          notes: 'No ankle weights initially. Slight backward angle, toe pointing slightly down.'
        },
        {
          id: 'mon-e-6',
          name: 'Banded clamshells',
          targetSets: 2,
          targetReps: '15 each side',
          defaultRestSec: 60,
          category: 'hip-rehab',
          rightHipFocus: true,
          notes: 'Light resistance band around knees. Pelvis stays perpendicular to floor.'
        },
        {
          id: 'mon-e-7',
          name: 'Dead bug',
          targetSets: 3,
          targetReps: '8 each side',
          defaultRestSec: 60,
          category: 'core',
          notes: 'Opposite arm/leg reach within comfortable hip range.'
        },
        {
          id: 'mon-e-8',
          name: 'Side plank from knees (if pain-free)',
          targetSets: 2,
          targetReps: '15–20 sec each side',
          defaultRestSec: 45,
          category: 'core',
          isTimeBased: true,
          notes: 'Braces lateral sling (QL & glute medius) without excessive hip load.'
        }
      ]
    }
  },

  // TUESDAY
  {
    dayId: 'tuesday',
    dayName: 'Tuesday',
    shortName: 'Tue',
    morning: {
      id: 'tuesday-morning',
      title: 'Upper Body Pull + Unilateral Legs',
      subtitle: 'Strength emphasis: back, biceps and right-leg control',
      location: 'Gym',
      durationEstimate: 'Up to 2 hours',
      hasWarmup: true,
      exercises: [
        {
          id: 'tue-m-1',
          name: 'Chest-supported row',
          targetSets: 3,
          targetReps: '8–12',
          defaultRestSec: 90,
          category: 'pull',
          notes: 'Chest stays anchored, squeeze shoulder blades back smoothly.'
        },
        {
          id: 'tue-m-2',
          name: 'Lat pulldown (comfortable grip)',
          targetSets: 3,
          targetReps: '8–12',
          defaultRestSec: 90,
          category: 'pull',
          notes: 'Medium or neutral grip. Pull smoothly toward collarbone.'
        },
        {
          id: 'tue-m-3',
          name: 'Supported low step-up or sit-to-stand',
          targetSets: 2,
          targetReps: '8 each leg',
          defaultRestSec: 90,
          category: 'legs',
          rightHipFocus: true,
          notes: 'Right-side focus: controlled descent, level pelvis, no knee collapse.'
        },
        {
          id: 'tue-m-4',
          name: 'Seated hamstring curl',
          targetSets: 2,
          targetReps: '12 reps',
          defaultRestSec: 90,
          category: 'legs',
          notes: 'Maintain knee alignment, slow 2-second negative.'
        },
        {
          id: 'tue-m-5',
          name: 'Machine rear-delt fly',
          targetSets: 2,
          targetReps: '12–15',
          defaultRestSec: 60,
          category: 'pull',
          notes: 'Upper back and posture support. Avoid shrugging.'
        },
        {
          id: 'tue-m-6',
          name: 'Dumbbell biceps curl',
          targetSets: 3,
          targetReps: '10–12',
          defaultRestSec: 60,
          category: 'pull',
          notes: 'Standing or seated tall with solid core bracing.'
        },
        {
          id: 'tue-m-7',
          name: 'Cable anti-rotation hold',
          targetSets: 2,
          targetReps: '20 sec each side',
          defaultRestSec: 60,
          category: 'core',
          isTimeBased: true,
          notes: 'Isometric core strength resisting rotational torque.'
        }
      ]
    },
    evening: {
      id: 'tuesday-evening',
      title: 'Glute and Hip Stability',
      subtitle: 'Evening home session with bands and core stability',
      location: 'Home',
      durationEstimate: 'Around 1 hour',
      exercises: [
        {
          id: 'tue-e-1',
          name: 'Gentle hip-flexor and calf stretching',
          targetSets: 2,
          targetReps: '8–10 min total',
          defaultRestSec: 30,
          category: 'mobility',
          isTimeBased: true,
          notes: 'Start slowly, let tissues warm up. Never force end ranges.'
        },
        {
          id: 'tue-e-2',
          name: 'Banded clamshells',
          targetSets: 3,
          targetReps: '12–15 each side',
          defaultRestSec: 60,
          category: 'hip-rehab',
          rightHipFocus: true,
          notes: 'Keep hips stacked vertically. Feel deep glute engagement.'
        },
        {
          id: 'tue-e-3',
          name: 'Standing banded hip abduction',
          targetSets: 3,
          targetReps: '12 each side',
          defaultRestSec: 60,
          category: 'hip-rehab',
          rightHipFocus: true,
          notes: 'Use a stable support. Keep pelvis level rather than hiking right hip.'
        },
        {
          id: 'tue-e-4',
          name: 'Supported standing hip extension',
          targetSets: 2,
          targetReps: '12 each side',
          defaultRestSec: 60,
          category: 'hip-rehab',
          rightHipFocus: true,
          notes: 'Band optional. Move from glute, do not arch lower back.'
        },
        {
          id: 'tue-e-5',
          name: 'Glute bridge',
          targetSets: 2,
          targetReps: '12 reps',
          defaultRestSec: 60,
          category: 'hip-rehab',
          notes: 'Even bilateral drive through both heels.'
        },
        {
          id: 'tue-e-6',
          name: 'Bird dog',
          targetSets: 3,
          targetReps: '8 each side',
          defaultRestSec: 60,
          category: 'core',
          notes: 'Keep hip square to ground as leg extends back.'
        },
        {
          id: 'tue-e-7',
          name: 'Suitcase hold with light dumbbell',
          targetSets: 3,
          targetReps: '20 sec each side',
          defaultRestSec: 60,
          category: 'core',
          isTimeBased: true,
          notes: 'Challenges lateral trunk and QL. Stand tall, zero tilting.'
        }
      ]
    }
  },

  // WEDNESDAY
  {
    dayId: 'wednesday',
    dayName: 'Wednesday',
    shortName: 'Wed',
    morning: {
      id: 'wednesday-morning',
      title: 'Upper Body Strength + Light Legs',
      subtitle: 'Emphasis: shoulders, arms and recovery from heavier leg work',
      location: 'Gym',
      durationEstimate: 'Up to 2 hours',
      hasWarmup: true,
      exercises: [
        {
          id: 'wed-m-1',
          name: 'Seated machine shoulder press (if comfortable)',
          targetSets: 3,
          targetReps: '8–12',
          defaultRestSec: 90,
          category: 'push',
          notes: 'Avoid flared elbows. Neutral grip if available.'
        },
        {
          id: 'wed-m-2',
          name: 'Seated cable row',
          targetSets: 3,
          targetReps: '10–12',
          defaultRestSec: 90,
          category: 'pull',
          notes: 'Upright posture, drive elbows back smoothly.'
        },
        {
          id: 'wed-m-3',
          name: 'Machine chest fly (comfortable range)',
          targetSets: 2,
          targetReps: '12 reps',
          defaultRestSec: 75,
          category: 'push',
          notes: 'Moderate stretch across chest, do not over-extend shoulders.'
        },
        {
          id: 'wed-m-4',
          name: 'Leg extension (light and controlled)',
          targetSets: 2,
          targetReps: '12 reps',
          defaultRestSec: 75,
          category: 'legs',
          rightHipFocus: true,
          notes: 'Light quad stimulation, 2-sec hold at top, smooth lowering.'
        },
        {
          id: 'wed-m-5',
          name: 'Seated hamstring curl',
          targetSets: 2,
          targetReps: '12 reps',
          defaultRestSec: 75,
          category: 'legs',
          notes: 'Light recovery volume for posterior chain.'
        },
        {
          id: 'wed-m-6',
          name: 'Cable biceps curl',
          targetSets: 2,
          targetReps: '12 reps',
          defaultRestSec: 60,
          category: 'pull',
          notes: 'Constant cable tension, controlled tempo.'
        },
        {
          id: 'wed-m-7',
          name: 'Triceps rope extension',
          targetSets: 2,
          targetReps: '12 reps',
          defaultRestSec: 60,
          category: 'push',
          notes: 'Spread the rope at bottom contraction.'
        },
        {
          id: 'wed-m-8',
          name: 'Dead bug (comfortable range)',
          targetSets: 2,
          targetReps: '8 each side',
          defaultRestSec: 60,
          category: 'core',
          notes: 'Maintain neutral lumbar curvature throughout.'
        }
      ]
    },
    evening: {
      id: 'wednesday-evening',
      title: 'Mobility and Recovery',
      subtitle: 'Gentle evening recovery, no figure-four or forced rotation',
      location: 'Home',
      durationEstimate: '40–50 minutes',
      exercises: [
        {
          id: 'wed-e-1',
          name: 'Gentle hip-flexor stretch',
          targetSets: 2,
          targetReps: '30 sec each side',
          defaultRestSec: 30,
          category: 'mobility',
          isTimeBased: true,
          notes: 'Mild tension only. Keep torso upright.'
        },
        {
          id: 'wed-e-2',
          name: 'Gentle QL stretch',
          targetSets: 2,
          targetReps: '20 sec each side',
          defaultRestSec: 30,
          category: 'mobility',
          isTimeBased: true,
          notes: 'Gentle side reach, breathe into the ribs.'
        },
        {
          id: 'wed-e-3',
          name: 'Heel slides in comfortable range',
          targetSets: 2,
          targetReps: '10 reps',
          defaultRestSec: 45,
          category: 'mobility',
          rightHipFocus: true,
          notes: 'Slide right heel on floor/towel. Stop well before any pinch!'
        },
        {
          id: 'wed-e-4',
          name: 'Supported hip-abduction movement',
          targetSets: 2,
          targetReps: '10 each side',
          defaultRestSec: 45,
          category: 'hip-rehab',
          rightHipFocus: true,
          notes: 'Gentle active range of motion, standing with support.'
        },
        {
          id: 'wed-e-5',
          name: 'Pelvic tilts',
          targetSets: 2,
          targetReps: '12 reps',
          defaultRestSec: 45,
          category: 'core',
          notes: 'Supine on mat, relaxed breathing.'
        },
        {
          id: 'wed-e-6',
          name: 'Easy walking or cycling',
          targetSets: 1,
          targetReps: '10–15 min',
          defaultRestSec: 60,
          category: 'cardio',
          isTimeBased: true,
          notes: 'Very light pace, flushes legs and promotes joint lubrication.'
        }
      ]
    }
  },

  // THURSDAY
  {
    dayId: 'thursday',
    dayName: 'Thursday',
    shortName: 'Thu',
    morning: {
      id: 'thursday-morning',
      title: 'Lower body B + Upper Accessories',
      subtitle: 'Strength emphasis: posterior chain and controlled functional leg strength',
      location: 'Gym',
      durationEstimate: 'Up to 2 hours',
      hasWarmup: true,
      exercises: [
        {
          id: 'thu-m-1',
          name: 'Leg press (moderate range)',
          targetSets: 3,
          targetReps: '10 reps',
          defaultRestSec: 120,
          category: 'legs',
          rightHipFocus: true,
          notes: 'Keep range strictly within comfortable, pinch-free limits. 3-4 RIR.'
        },
        {
          id: 'thu-m-2',
          name: 'Glute bridge (cleared & pain-free)',
          targetSets: 3,
          targetReps: '10–12 reps',
          defaultRestSec: 90,
          category: 'hip-rehab',
          rightHipFocus: true,
          notes: 'Can use light dumbbell across hips if cleared. Squeeze right glute intentionally.'
        },
        {
          id: 'thu-m-3',
          name: 'Seated hamstring curl',
          targetSets: 3,
          targetReps: '10–12',
          defaultRestSec: 90,
          category: 'legs',
          notes: 'Focus on full posterior chain control.'
        },
        {
          id: 'thu-m-4',
          name: 'Supported step-up',
          targetSets: 2,
          targetReps: '8 each leg',
          defaultRestSec: 90,
          category: 'legs',
          rightHipFocus: true,
          notes: 'Hold rail for balance. Focus on pushing through heel and keeping pelvis level.'
        },
        {
          id: 'thu-m-5',
          name: 'Hip abductor machine (light)',
          targetSets: 2,
          targetReps: '12–15',
          defaultRestSec: 75,
          category: 'hip-rehab',
          rightHipFocus: true,
          notes: 'Maintain steady tempo, avoid slamming weights.'
        },
        {
          id: 'thu-m-6',
          name: 'Machine chest press',
          targetSets: 2,
          targetReps: '10–12',
          defaultRestSec: 75,
          category: 'push',
          notes: 'Upper body accessory maintenance.'
        },
        {
          id: 'thu-m-7',
          name: 'Chest-supported row',
          targetSets: 2,
          targetReps: '10–12',
          defaultRestSec: 75,
          category: 'pull',
          notes: 'Solid upper back squeeze.'
        },
        {
          id: 'thu-m-8',
          name: 'Farmer carry (light and even)',
          targetSets: 3,
          targetReps: '20–30 seconds',
          defaultRestSec: 60,
          category: 'core',
          isTimeBased: true,
          notes: 'Equal light dumbbells. Walk with tall posture and level pelvis; no waddling.'
        }
      ]
    },
    evening: {
      id: 'thursday-evening',
      title: 'Glute Strength and Trunk Stability',
      subtitle: 'Resistance bands and pelvic leveling',
      location: 'Home',
      durationEstimate: '45–60 minutes',
      exercises: [
        {
          id: 'thu-e-1',
          name: 'Hip-flexor and side-body stretching',
          targetSets: 2,
          targetReps: '8–10 min total',
          defaultRestSec: 30,
          category: 'mobility',
          isTimeBased: true,
          notes: 'Smooth, relaxed stretches.'
        },
        {
          id: 'thu-e-2',
          name: 'Glute bridges',
          targetSets: 3,
          targetReps: '12 reps',
          defaultRestSec: 60,
          category: 'hip-rehab',
          rightHipFocus: true,
          notes: 'Hold 2 seconds at top contraction.'
        },
        {
          id: 'thu-e-3',
          name: 'Banded clamshells',
          targetSets: 3,
          targetReps: '15 each side',
          defaultRestSec: 60,
          category: 'hip-rehab',
          rightHipFocus: true,
          notes: 'Focus on right glute medius activation.'
        },
        {
          id: 'thu-e-4',
          name: 'Side-lying hip abduction',
          targetSets: 2,
          targetReps: '10 each side',
          defaultRestSec: 60,
          category: 'hip-rehab',
          rightHipFocus: true,
          notes: 'Controlled lift, pause at top, lower slowly.'
        },
        {
          id: 'thu-e-5',
          name: 'Standing banded hip abduction',
          targetSets: 2,
          targetReps: '12 each side',
          defaultRestSec: 60,
          category: 'hip-rehab',
          rightHipFocus: true,
          notes: 'Support with hands, keep trunk vertical.'
        },
        {
          id: 'thu-e-6',
          name: 'Bird dog',
          targetSets: 3,
          targetReps: '8 each side',
          defaultRestSec: 60,
          category: 'core',
          notes: 'Reach arm and opposite leg without rotating pelvis.'
        },
        {
          id: 'thu-e-7',
          name: 'Side plank from knees (if cleared)',
          targetSets: 2,
          targetReps: '15–20 sec each side',
          defaultRestSec: 45,
          category: 'core',
          isTimeBased: true,
          notes: 'Shoulders, hips, and knees in one straight line.'
        }
      ]
    }
  },

  // FRIDAY
  {
    dayId: 'friday',
    dayName: 'Friday',
    shortName: 'Fri',
    morning: {
      id: 'friday-morning',
      title: 'Upper Body Push/Pull + Legs',
      subtitle: 'Strength emphasis: balanced full-body training',
      location: 'Gym',
      durationEstimate: 'Up to 2 hours',
      hasWarmup: true,
      exercises: [
        {
          id: 'fri-m-1',
          name: 'Chest-supported row',
          targetSets: 3,
          targetReps: '10 reps',
          defaultRestSec: 90,
          category: 'pull',
          notes: 'Firm brace on bench, strong rhomboid squeeze.'
        },
        {
          id: 'fri-m-2',
          name: 'Machine chest press',
          targetSets: 3,
          targetReps: '10 reps',
          defaultRestSec: 90,
          category: 'push',
          notes: 'Controlled pressing motion.'
        },
        {
          id: 'fri-m-3',
          name: 'Lat pulldown',
          targetSets: 2,
          targetReps: '10–12',
          defaultRestSec: 90,
          category: 'pull',
          notes: 'Wide or neutral grip.'
        },
        {
          id: 'fri-m-4',
          name: 'Leg extension (light)',
          targetSets: 2,
          targetReps: '12 reps',
          defaultRestSec: 75,
          category: 'legs',
          rightHipFocus: true,
          notes: 'Quadriceps strength without axial hip loading.'
        },
        {
          id: 'fri-m-5',
          name: 'Seated hamstring curl',
          targetSets: 2,
          targetReps: '12 reps',
          defaultRestSec: 75,
          category: 'legs',
          notes: 'Balance quad work with hamstring isolation.'
        },
        {
          id: 'fri-m-6',
          name: 'Supported standing hip abduction',
          targetSets: 2,
          targetReps: '10 each leg',
          defaultRestSec: 60,
          category: 'hip-rehab',
          rightHipFocus: true,
          notes: 'Slow eccentric control on right leg.'
        },
        {
          id: 'fri-m-7',
          name: 'Dumbbell lateral raise',
          targetSets: 2,
          targetReps: '12–15',
          defaultRestSec: 60,
          category: 'push',
          notes: 'Light weight, focus on side deltoids.'
        },
        {
          id: 'fri-m-8',
          name: 'Biceps curl + triceps pushdown',
          targetSets: 2,
          targetReps: '12 each',
          defaultRestSec: 60,
          category: 'push',
          notes: 'Arm superset to conclude upper-body training.'
        }
      ]
    },
    evening: {
      id: 'friday-evening',
      title: 'QL, Core and Pelvic Control',
      subtitle: 'Targeting lateral trunk and hip synergy',
      location: 'Home',
      durationEstimate: '45–55 minutes',
      exercises: [
        {
          id: 'fri-e-1',
          name: 'Gentle hip-flexor stretch',
          targetSets: 2,
          targetReps: '30 sec each side',
          defaultRestSec: 30,
          category: 'mobility',
          isTimeBased: true,
          notes: 'Keep front of right hip calm and un-pinched.'
        },
        {
          id: 'fri-e-2',
          name: 'Gentle QL stretch',
          targetSets: 2,
          targetReps: '20 sec each side',
          defaultRestSec: 30,
          category: 'mobility',
          isTimeBased: true,
          notes: 'Side lengthening without twisting.'
        },
        {
          id: 'fri-e-3',
          name: 'Dead bug',
          targetSets: 3,
          targetReps: '8 each side',
          defaultRestSec: 60,
          category: 'core',
          notes: 'Anti-extension core control.'
        },
        {
          id: 'fri-e-4',
          name: 'Bird dog',
          targetSets: 2,
          targetReps: '8 each side',
          defaultRestSec: 60,
          category: 'core',
          notes: 'Maintain neutral spine and level hips.'
        },
        {
          id: 'fri-e-5',
          name: 'Suitcase hold (light dumbbell)',
          targetSets: 3,
          targetReps: '20 sec each side',
          defaultRestSec: 60,
          category: 'core',
          isTimeBased: true,
          notes: 'Should challenge lateral trunk/QL. Do not lean to one side.'
        },
        {
          id: 'fri-e-6',
          name: 'Glute bridge',
          targetSets: 2,
          targetReps: '12 reps',
          defaultRestSec: 60,
          category: 'hip-rehab',
          rightHipFocus: true,
          notes: 'Ensure right glute is firing as strongly as left.'
        },
        {
          id: 'fri-e-7',
          name: 'Banded clamshells',
          targetSets: 2,
          targetReps: '12 each side',
          defaultRestSec: 60,
          category: 'hip-rehab',
          rightHipFocus: true,
          notes: 'Light band, smooth reps.'
        }
      ]
    }
  },

  // SATURDAY
  {
    dayId: 'saturday',
    dayName: 'Saturday',
    shortName: 'Sat',
    morning: {
      id: 'saturday-morning',
      title: 'Full-Body Technique + Conditioning',
      subtitle: 'Keep light: focus on movement quality rather than fatigue',
      location: 'Gym',
      durationEstimate: '60–75 minutes',
      hasWarmup: false,
      exercises: [
        {
          id: 'sat-m-1',
          name: 'Stationary bike',
          targetSets: 1,
          targetReps: '10 minutes, easy',
          defaultRestSec: 60,
          category: 'cardio',
          isTimeBased: true,
          notes: 'Smooth, relaxed cycling.'
        },
        {
          id: 'sat-m-2',
          name: 'Sit-to-stand',
          targetSets: 2,
          targetReps: '10 reps',
          defaultRestSec: 75,
          category: 'legs',
          rightHipFocus: true,
          notes: 'Stand up using both legs evenly. Control down.'
        },
        {
          id: 'sat-m-3',
          name: 'Supported step-up',
          targetSets: 2,
          targetReps: '8 each leg',
          defaultRestSec: 75,
          category: 'legs',
          rightHipFocus: true,
          notes: 'Technique drill: zero hip hike, level pelvis.'
        },
        {
          id: 'sat-m-4',
          name: 'Chest-supported row',
          targetSets: 2,
          targetReps: '12 reps',
          defaultRestSec: 60,
          category: 'pull',
          notes: 'Light weight, flawless mechanics.'
        },
        {
          id: 'sat-m-5',
          name: 'Machine chest press',
          targetSets: 2,
          targetReps: '12 reps',
          defaultRestSec: 60,
          category: 'push',
          notes: 'Light weight, steady cadence.'
        },
        {
          id: 'sat-m-6',
          name: 'Standing hip abduction',
          targetSets: 2,
          targetReps: '10 each leg',
          defaultRestSec: 60,
          category: 'hip-rehab',
          rightHipFocus: true,
          notes: 'Bodyweight or very light band.'
        },
        {
          id: 'sat-m-7',
          name: 'Pallof press',
          targetSets: 2,
          targetReps: '10 each side',
          defaultRestSec: 60,
          category: 'core',
          notes: 'Anti-rotation core brace.'
        }
      ]
    },
    evening: {
      id: 'saturday-evening',
      title: 'Light Mobility',
      subtitle: 'Gentle resetting and active recovery',
      location: 'Home',
      durationEstimate: '30–45 minutes',
      exercises: [
        {
          id: 'sat-e-1',
          name: 'Gentle stretching',
          targetSets: 1,
          targetReps: '10 minutes',
          defaultRestSec: 30,
          category: 'mobility',
          isTimeBased: true,
          notes: 'General gentle full-body and hip stretching.'
        },
        {
          id: 'sat-e-2',
          name: 'Comfortable heel slides',
          targetSets: 2,
          targetReps: '10 reps',
          defaultRestSec: 45,
          category: 'mobility',
          rightHipFocus: true,
          notes: 'Keep knee tracking in line with hip.'
        },
        {
          id: 'sat-e-3',
          name: 'Pelvic tilts',
          targetSets: 2,
          targetReps: '12 reps',
          defaultRestSec: 45,
          category: 'core',
          notes: 'Gentle coordination of anterior and posterior tilt.'
        },
        {
          id: 'sat-e-4',
          name: 'Easy banded clamshells',
          targetSets: 2,
          targetReps: '12 reps',
          defaultRestSec: 60,
          category: 'hip-rehab',
          notes: 'Lightest band, feeling glute turn on.'
        },
        {
          id: 'sat-e-5',
          name: 'Optional easy walk',
          targetSets: 1,
          targetReps: '10–20 minutes',
          defaultRestSec: 60,
          category: 'cardio',
          isTimeBased: true,
          notes: 'Flat surface, comfortable walking stride.'
        }
      ]
    }
  },

  // SUNDAY
  {
    dayId: 'sunday',
    dayName: 'Sunday',
    shortName: 'Sun',
    morning: {
      id: 'sunday-morning',
      title: 'Recovery / Easy Cardio',
      subtitle: 'Restorative movement, no heavy leg training or forced rotation',
      location: 'Gym',
      durationEstimate: '30–45 minutes',
      hasWarmup: false,
      exercises: [
        {
          id: 'sun-m-1',
          name: 'Easy walk or stationary bike',
          targetSets: 1,
          targetReps: '15–20 minutes, easy',
          defaultRestSec: 60,
          category: 'cardio',
          isTimeBased: true,
          notes: 'Gentle joint nutrition. Zero breathless fatigue.'
        },
        {
          id: 'sun-m-2',
          name: 'Gentle hip-flexor, calf and side-body stretch',
          targetSets: 2,
          targetReps: '10–15 min total',
          defaultRestSec: 30,
          category: 'mobility',
          isTimeBased: true,
          notes: 'Relaxed breathing. Do not force any range.'
        }
      ]
    },
    evening: {
      id: 'sunday-evening',
      title: 'Recovery Only',
      subtitle: 'Gentle stretching only. No ankle weights or hard core drills.',
      location: 'Home',
      durationEstimate: '20–30 minutes',
      exercises: [
        {
          id: 'sun-e-1',
          name: 'Gentle hip-flexor and QL stretches',
          targetSets: 2,
          targetReps: '10 min total',
          defaultRestSec: 30,
          category: 'mobility',
          isTimeBased: true,
          notes: 'Gentle relaxation before sleep.'
        },
        {
          id: 'sun-e-2',
          name: 'Easy walking (if comfortable)',
          targetSets: 1,
          targetReps: '10–15 min',
          defaultRestSec: 30,
          category: 'cardio',
          isTimeBased: true,
          notes: 'Enjoyable stroll. If hip feels fatigued, rest completely instead.'
        }
      ]
    }
  }
];

export const PROGRESSION_PHASES: ProgressionPhase[] = [
  {
    weeks: 'Weeks 1–2',
    title: 'Establish Control',
    goal: 'Master machine mechanics and observe right-left asymmetries',
    recommendations: [
      'Learn gym machine paths and safe stoppers',
      'Use conservative loads with 3–4 Repetitions In Reserve (RIR)',
      'Prioritize smooth repetitions, level pelvis, and completely pain-free movement',
      'Track any right-left discrepancy in force output or fatigue'
    ]
  },
  {
    weeks: 'Weeks 3–4',
    title: 'Build Strength',
    goal: 'Gradually progress load while confirming comfort 24 hours later',
    recommendations: [
      'If your hip remains comfortable during exercise and the following day, gradually increase reps or weight',
      'Progress only ONE variable at a time (reps OR weight, never both)',
      'Keep anterior pinch rating at 0 (pain-free)',
      'Do not increase range of motion and weight simultaneously'
    ]
  },
  {
    weeks: 'Weeks 5–8',
    title: 'Progress Functional Strength',
    goal: 'Advance single-leg loading with physiotherapist clearance',
    recommendations: [
      'Assess readiness for greater leg-press loads with your physiotherapist',
      'Introduce slightly higher step-ups if pelvic tilt remains controlled',
      'Add more demanding single-leg work and progressive trunk-stability exercises',
      'Begin testing functional daily patterns with balanced hip drive'
    ]
  },
  {
    weeks: 'Weeks 9–12',
    title: 'Reassess and Refine',
    goal: 'Evaluate symmetry, gait mechanics, and mobility progression',
    recommendations: [
      'Compare right and left strength symmetry on machines and step-ups',
      'Review walking gait and pelvis leveling with physiotherapist',
      'Progress toward your long-term athletic goals based on measured ability, not calendar alone',
      'Refine evening mobility based on updated pelvic and QL assessments'
    ]
  }
];

export const THR_SAFETY_RULES = [
  {
    title: 'Do not train right leg to exhaustion',
    description: 'Give the right leg priority through careful exercise selection and precision technique, never by forcing extra sets after form deteriorates or when limping begins.'
  },
  {
    title: 'Respect the anterior hip pinch',
    description: 'Never push through a sharp pinch at the front of the hip during bending, squatting, or leg press. Reduce range of motion to stay strictly pain-free.'
  },
  {
    title: 'No forced cross-legged or figure-four positions',
    description: 'Limited rotation and anterior pinch deserve clinical clearance. Never force rotation by pushing your right knee down.'
  },
  {
    title: 'Do not assume stretching fixes pelvic tilt',
    description: 'Pelvic tilt can stem from hip strength imbalance, movement habits, or leg-length differences. Train both trunk strength and hip stability.'
  },
  {
    title: 'The 24-Hour Rule',
    description: 'Always monitor the next 24 hours. If pain, pinching, stiffness, or limping worsens, reduce load or range for the next session.'
  },
  {
    title: 'When to Stop Immediately',
    description: 'Stop for sharp hip pain, a new limp, sudden loss of function, or feeling of instability. Seek clinical assessment if severe.'
  }
];

export const DEFAULT_THR_PLAN: WorkoutPlan = {
  id: 'thr-recovery-dual',
  name: 'THR Hip Recovery & Full Body (7-Day Dual)',
  description: 'Dual-session program: morning gym strength & unilateral right-hip priority, plus evening home mobility & pelvic alignment.',
  focusTag: 'THR Recovery & Strength',
  isCustom: false,
  days: WORKOUT_PLAN
};

export const UPPER_LOWER_STRENGTH_PLAN: WorkoutPlan = {
  id: 'upper-lower-hypertrophy',
  name: 'Upper / Lower Hypertrophy Split (7-Day)',
  description: 'Balanced muscle-building split with dedicated upper, lower, core, and recovery days.',
  focusTag: 'Hypertrophy & Strength',
  isCustom: false,
  days: [
    {
      dayId: 'monday',
      dayName: 'Monday',
      shortName: 'Mon',
      morning: {
        id: 'ul-mon-morning',
        title: 'Upper Body A (Chest, Back & Delts)',
        subtitle: 'Primary compound upper push & pull focus',
        location: 'Gym',
        durationEstimate: '50-60 min',
        description: 'Heavy compound pressing and rowing with strict eccentric control.',
        hasWarmup: true,
        exercises: [
          {
            id: 'ul-bench-press',
            name: 'Dumbbell Flat Bench Press',
            targetSets: 4,
            targetReps: '8–10 reps',
            defaultRestSec: 90,
            category: 'push',
            met: 4.8,
            durationSecPerSet: 45,
            notes: 'Plant feet flat, control the descent, explode up.'
          },
          {
            id: 'ul-chest-supported-row',
            name: 'Chest-Supported Incline Row',
            targetSets: 4,
            targetReps: '10–12 reps',
            defaultRestSec: 90,
            category: 'pull',
            met: 4.8,
            durationSecPerSet: 45,
            notes: 'Squeeze shoulder blades without arching lower back.'
          },
          {
            id: 'ul-overhead-press',
            name: 'Seated Dumbbell Shoulder Press',
            targetSets: 3,
            targetReps: '10–12 reps',
            defaultRestSec: 75,
            category: 'push',
            met: 4.0,
            durationSecPerSet: 40,
            notes: 'Neutral grip is shoulder-friendly; core braced.'
          },
          {
            id: 'ul-lat-pulldown',
            name: 'Wide-Grip Lat Pulldown',
            targetSets: 3,
            targetReps: '10–12 reps',
            defaultRestSec: 75,
            category: 'pull',
            met: 4.2,
            durationSecPerSet: 40,
            notes: 'Drive elbows down into your back pockets.'
          },
          {
            id: 'ul-tricep-rope',
            name: 'Cable Triceps Rope Pushdown',
            targetSets: 3,
            targetReps: '12–15 reps',
            defaultRestSec: 60,
            category: 'push',
            met: 3.5,
            durationSecPerSet: 35,
            notes: 'Lock elbows at your sides.'
          }
        ]
      },
      evening: {
        id: 'ul-mon-evening',
        title: 'Chest & Shoulder Decompression',
        subtitle: 'Restorative mobility and postural reset',
        location: 'Home',
        durationEstimate: '15-20 min',
        description: 'Gentle stretches to open anterior shoulder capsule and thoracic spine.',
        exercises: [
          {
            id: 'ul-doorway-pec',
            name: 'Doorway Pec Stretch',
            targetSets: 2,
            targetReps: '30s hold per side',
            defaultRestSec: 30,
            category: 'mobility',
            isTimeBased: true,
            met: 2.3,
            durationSecPerSet: 30,
            notes: 'Gentle opening; avoid over-stretching the front shoulder capsule.'
          },
          {
            id: 'ul-child-pose',
            name: 'Child’s Pose with Lat Reach',
            targetSets: 2,
            targetReps: '40s hold',
            defaultRestSec: 30,
            category: 'mobility',
            isTimeBased: true,
            met: 2.3,
            durationSecPerSet: 40,
            notes: 'Walk hands side-to-side to gently stretch lats.'
          }
        ]
      }
    },
    {
      dayId: 'tuesday',
      dayName: 'Tuesday',
      shortName: 'Tue',
      morning: {
        id: 'ul-tue-morning',
        title: 'Lower Body A (Quads & Calves Focus)',
        subtitle: 'Bilateral & unilateral knee-dominant development',
        location: 'Gym',
        durationEstimate: '50-60 min',
        hasWarmup: true,
        exercises: [
          {
            id: 'ul-leg-press-quad',
            name: 'Seated Leg Press (Mid Foot)',
            targetSets: 4,
            targetReps: '10–12 reps',
            defaultRestSec: 90,
            category: 'legs',
            met: 5.5,
            durationSecPerSet: 50,
            notes: 'Controlled eccentric, avoid lower back rounding.'
          },
          {
            id: 'ul-goblet-squat',
            name: 'Dumbbell Goblet Squat (to bench)',
            targetSets: 3,
            targetReps: '10–12 reps',
            defaultRestSec: 90,
            category: 'legs',
            met: 5.5,
            durationSecPerSet: 45,
            notes: 'Stay within pain-free knee & hip range.'
          },
          {
            id: 'ul-leg-extension',
            name: 'Seated Leg Extension',
            targetSets: 3,
            targetReps: '12–15 reps',
            defaultRestSec: 60,
            category: 'legs',
            met: 3.8,
            durationSecPerSet: 40,
            notes: 'Hold at top for 1s squeeze.'
          },
          {
            id: 'ul-standing-calf',
            name: 'Standing Calf Raise',
            targetSets: 4,
            targetReps: '15 reps',
            defaultRestSec: 60,
            category: 'legs',
            met: 3.5,
            durationSecPerSet: 40,
            notes: 'Full deep stretch at bottom, high peak on big toes.'
          }
        ]
      },
      evening: {
        id: 'ul-tue-evening',
        title: 'Quad & Hip Flexor Reset',
        subtitle: 'Targeted lower body release',
        location: 'Home',
        durationEstimate: '15-20 min',
        exercises: [
          {
            id: 'ul-couch-stretch',
            name: 'Gentle Half-Kneeling Hip Stretch',
            targetSets: 2,
            targetReps: '30s hold per side',
            defaultRestSec: 30,
            category: 'mobility',
            isTimeBased: true,
            met: 2.3,
            durationSecPerSet: 30,
            notes: 'Maintain neutral pelvis; avoid anterior pinch.'
          },
          {
            id: 'ul-figure-four-gentle',
            name: 'Supine Glute Stretch (Gentle)',
            targetSets: 2,
            targetReps: '30s hold per side',
            defaultRestSec: 30,
            category: 'mobility',
            isTimeBased: true,
            met: 2.3,
            durationSecPerSet: 30,
            notes: 'Gentle stretch across lateral hip.'
          }
        ]
      }
    },
    {
      dayId: 'wednesday',
      dayName: 'Wednesday',
      shortName: 'Wed',
      morning: {
        id: 'ul-wed-morning',
        title: 'Active Recovery & Core Stability',
        subtitle: 'Cardiovascular flow and trunk endurance',
        location: 'Gym',
        durationEstimate: '35-45 min',
        hasWarmup: true,
        exercises: [
          {
            id: 'ul-incline-treadmill',
            name: 'Incline Treadmill Walk (or Elliptical)',
            targetSets: 1,
            targetReps: '20 minutes steady state',
            defaultRestSec: 0,
            category: 'cardio',
            isTimeBased: true,
            met: 4.5,
            durationSecPerSet: 1200,
            notes: 'Comfortable Zone 2 pace, tall posture.'
          },
          {
            id: 'ul-deadbug-core',
            name: 'Deadbug Control',
            targetSets: 3,
            targetReps: '10 reps per side',
            defaultRestSec: 60,
            category: 'core',
            met: 3.8,
            durationSecPerSet: 40,
            notes: 'Lower back pinned firmly to the mat.'
          },
          {
            id: 'ul-side-plank-core',
            name: 'Side Plank from Knees/Feet',
            targetSets: 3,
            targetReps: '25s hold per side',
            defaultRestSec: 45,
            category: 'core',
            isTimeBased: true,
            met: 3.8,
            durationSecPerSet: 25,
            notes: 'Shoulder stacked directly over elbow, pelvis lifted high.'
          }
        ]
      },
      evening: {
        id: 'ul-wed-evening',
        title: 'Midweek Spinal & Thoracic Flow',
        subtitle: 'Spine decompression and breathing',
        location: 'Home',
        durationEstimate: '15 min',
        exercises: [
          {
            id: 'ul-cat-cow',
            name: 'Cat-Camel Gentle Flow',
            targetSets: 2,
            targetReps: '10 smooth reps',
            defaultRestSec: 30,
            category: 'mobility',
            met: 2.3,
            durationSecPerSet: 45,
            notes: 'Rhythmic breath-coordinated spinal articulation.'
          },
          {
            id: 'ul-open-book',
            name: 'Side-Lying Thoracic Open Book',
            targetSets: 2,
            targetReps: '8 reps per side',
            defaultRestSec: 30,
            category: 'mobility',
            met: 2.3,
            durationSecPerSet: 40,
            notes: 'Keep hips stacked, rotate ribcage smoothly.'
          }
        ]
      }
    },
    {
      dayId: 'thursday',
      dayName: 'Thursday',
      shortName: 'Thu',
      morning: {
        id: 'ul-thu-morning',
        title: 'Upper Body B (Shoulders, Arms & Upper Back)',
        subtitle: 'Hypertrophy and posture support',
        location: 'Gym',
        durationEstimate: '50-60 min',
        hasWarmup: true,
        exercises: [
          {
            id: 'ul-incline-db-press',
            name: 'Incline Dumbbell Press (30°)',
            targetSets: 4,
            targetReps: '10–12 reps',
            defaultRestSec: 90,
            category: 'push',
            met: 4.8,
            durationSecPerSet: 45,
            notes: 'Upper chest emphasis with neutral wrist alignment.'
          },
          {
            id: 'ul-seated-cable-row',
            name: 'Seated Neutral-Grip Cable Row',
            targetSets: 4,
            targetReps: '10–12 reps',
            defaultRestSec: 75,
            category: 'pull',
            met: 4.5,
            durationSecPerSet: 45,
            notes: 'Maintain tall spine, row to belly button.'
          },
          {
            id: 'ul-lateral-raise',
            name: 'Dumbbell Lateral Raise',
            targetSets: 4,
            targetReps: '12–15 reps',
            defaultRestSec: 60,
            category: 'push',
            met: 3.5,
            durationSecPerSet: 35,
            notes: 'Lead slightly with elbows, no swinging.'
          },
          {
            id: 'ul-face-pull',
            name: 'Cable Face Pull (Rope)',
            targetSets: 3,
            targetReps: '15 reps',
            defaultRestSec: 60,
            category: 'pull',
            met: 3.5,
            durationSecPerSet: 40,
            notes: 'External rotation at finish; pulls to eye level.'
          },
          {
            id: 'ul-incline-curl',
            name: 'Incline Dumbbell Bicep Curl',
            targetSets: 3,
            targetReps: '10–12 reps',
            defaultRestSec: 60,
            category: 'pull',
            met: 3.5,
            durationSecPerSet: 35,
            notes: 'Full stretch at bottom, squeeze at peak.'
          }
        ]
      },
      evening: {
        id: 'ul-thu-evening',
        title: 'Neck & Upper Back Release',
        subtitle: 'Relieve upper body tension',
        location: 'Home',
        durationEstimate: '15 min',
        exercises: [
          {
            id: 'ul-upper-trap-stretch',
            name: 'Seated Upper Trapezius Stretch',
            targetSets: 2,
            targetReps: '30s hold per side',
            defaultRestSec: 30,
            category: 'mobility',
            isTimeBased: true,
            met: 2.3,
            durationSecPerSet: 30,
            notes: 'Very gentle ear-to-shoulder guidance.'
          },
          {
            id: 'ul-cross-body-shoulder',
            name: 'Posterior Shoulder Stretch',
            targetSets: 2,
            targetReps: '30s hold per side',
            defaultRestSec: 30,
            category: 'mobility',
            isTimeBased: true,
            met: 2.3,
            durationSecPerSet: 30,
            notes: 'Keep shoulders relaxed down away from ears.'
          }
        ]
      }
    },
    {
      dayId: 'friday',
      dayName: 'Friday',
      shortName: 'Fri',
      morning: {
        id: 'ul-fri-morning',
        title: 'Lower Body B (Glutes & Hamstring Chain)',
        subtitle: 'Posterior chain strength and hip hinge',
        location: 'Gym',
        durationEstimate: '50-60 min',
        hasWarmup: true,
        exercises: [
          {
            id: 'ul-romanian-deadlift',
            name: 'Dumbbell Romanian Deadlift (RDL)',
            targetSets: 4,
            targetReps: '10–12 reps',
            defaultRestSec: 90,
            category: 'legs',
            met: 5.5,
            durationSecPerSet: 45,
            notes: 'Hips push back, shins vertical, flat neutral back.'
          },
          {
            id: 'ul-lying-leg-curl',
            name: 'Lying or Seated Hamstring Curl',
            targetSets: 4,
            targetReps: '10–12 reps',
            defaultRestSec: 75,
            category: 'legs',
            met: 4.0,
            durationSecPerSet: 40,
            notes: 'Control eccentric return without slamming plates.'
          },
          {
            id: 'ul-hip-thrust-machine',
            name: 'Machine Hip Thrust or Glute Bridge',
            targetSets: 3,
            targetReps: '12 reps',
            defaultRestSec: 75,
            category: 'legs',
            met: 4.5,
            durationSecPerSet: 45,
            notes: 'Drive through heels, squeeze glutes at top lockout.'
          },
          {
            id: 'ul-seated-calf',
            name: 'Seated Calf Raise',
            targetSets: 3,
            targetReps: '15 reps',
            defaultRestSec: 60,
            category: 'legs',
            met: 3.5,
            durationSecPerSet: 40,
            notes: 'Soleus bias, slow controlled pause.'
          }
        ]
      },
      evening: {
        id: 'ul-fri-evening',
        title: 'Hamstring & Glute Flush',
        subtitle: 'Post-hinge lower body recovery',
        location: 'Home',
        durationEstimate: '15-20 min',
        exercises: [
          {
            id: 'ul-hamstring-strap',
            name: 'Supine Hamstring Stretch with Towel/Strap',
            targetSets: 2,
            targetReps: '40s hold per side',
            defaultRestSec: 30,
            category: 'mobility',
            isTimeBased: true,
            met: 2.3,
            durationSecPerSet: 40,
            notes: 'Gentle pull; opposite leg stays straight on floor.'
          },
          {
            id: 'ul-piriformis-stretch',
            name: 'Supported Glute / Piriformis Stretch',
            targetSets: 2,
            targetReps: '30s hold per side',
            defaultRestSec: 30,
            category: 'mobility',
            isTimeBased: true,
            met: 2.3,
            durationSecPerSet: 30,
            notes: 'Relax pelvis and breathe deeply into tension.'
          }
        ]
      }
    },
    {
      dayId: 'saturday',
      dayName: 'Saturday',
      shortName: 'Sat',
      morning: {
        id: 'ul-sat-morning',
        title: 'Full Body Conditioning & Arms',
        subtitle: 'Dynamic full-body workout & stamina',
        location: 'Gym',
        durationEstimate: '45-50 min',
        hasWarmup: true,
        exercises: [
          {
            id: 'ul-kettlebell-deadlift',
            name: 'Kettlebell / Dumbbell Suitcase Carry',
            targetSets: 3,
            targetReps: '40 seconds per side',
            defaultRestSec: 60,
            category: 'core',
            isTimeBased: true,
            met: 4.5,
            durationSecPerSet: 40,
            notes: 'Walk tall with zero side tilting or leaning.'
          },
          {
            id: 'ul-cable-chest-fly',
            name: 'Cable High-to-Low Fly',
            targetSets: 3,
            targetReps: '12–15 reps',
            defaultRestSec: 60,
            category: 'push',
            met: 3.8,
            durationSecPerSet: 40,
            notes: 'Wide hug motion, feel chest contract.'
          },
          {
            id: 'ul-cable-hammer-curl',
            name: 'Rope Hammer Curl',
            targetSets: 3,
            targetReps: '12 reps',
            defaultRestSec: 60,
            category: 'pull',
            met: 3.5,
            durationSecPerSet: 35,
            notes: 'Targets brachialis and forearms.'
          },
          {
            id: 'ul-overhead-extension',
            name: 'Cable Overhead Tricep Extension',
            targetSets: 3,
            targetReps: '12 reps',
            defaultRestSec: 60,
            category: 'push',
            met: 3.5,
            durationSecPerSet: 35,
            notes: 'Long head tricep stretch and squeeze.'
          }
        ]
      },
      evening: {
        id: 'ul-sat-evening',
        title: 'Weekend Full-Body Relaxation',
        subtitle: 'Whole-body joint unwind',
        location: 'Home',
        durationEstimate: '15 min',
        exercises: [
          {
            id: 'ul-reclined-twist',
            name: 'Reclined Gentle Supine Twist',
            targetSets: 2,
            targetReps: '45s hold per side',
            defaultRestSec: 30,
            category: 'mobility',
            isTimeBased: true,
            met: 2.3,
            durationSecPerSet: 45,
            notes: 'Both shoulders grounded on floor.'
          },
          {
            id: 'ul-legs-up-wall',
            name: 'Legs-Up-The-Wall Circulatory Rest',
            targetSets: 1,
            targetReps: '5 minutes passive rest',
            defaultRestSec: 0,
            category: 'mobility',
            isTimeBased: true,
            met: 1.5,
            durationSecPerSet: 300,
            notes: 'Venous return, nervous system down-regulation.'
          }
        ]
      }
    },
    {
      dayId: 'sunday',
      dayName: 'Sunday',
      shortName: 'Sun',
      morning: {
        id: 'ul-sun-morning',
        title: 'Rest & Outdoor Nature Walk',
        subtitle: 'Low-impact active recovery & sunshine',
        location: 'Home',
        durationEstimate: '30-45 min',
        exercises: [
          {
            id: 'ul-sunday-walk',
            name: 'Casual Outdoor Walk',
            targetSets: 1,
            targetReps: '30–45 minutes brisk walk',
            defaultRestSec: 0,
            category: 'cardio',
            isTimeBased: true,
            met: 3.3,
            durationSecPerSet: 2100,
            notes: 'Promotes blood circulation, joint lubrication, and mental recharge.'
          }
        ]
      },
      evening: {
        id: 'ul-sun-evening',
        title: 'Weekly Reset & Deep Breathing',
        subtitle: 'Preparation for the coming training week',
        location: 'Home',
        durationEstimate: '15 min',
        exercises: [
          {
            id: 'ul-deep-belly-breathing',
            name: 'Diaphragmatic Box Breathing',
            targetSets: 1,
            targetReps: '5 minutes (4s in, 4s hold, 4s out, 4s hold)',
            defaultRestSec: 0,
            category: 'mobility',
            isTimeBased: true,
            met: 1.3,
            durationSecPerSet: 300,
            notes: 'Activates parasympathetic rest and digest recovery.'
          }
        ]
      }
    }
  ]
};

export const PRESET_PLANS: WorkoutPlan[] = [
  DEFAULT_THR_PLAN,
  UPPER_LOWER_STRENGTH_PLAN
];

