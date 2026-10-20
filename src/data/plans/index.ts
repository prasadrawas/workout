import type { WorkoutPlan } from '../../types/workout';

// Automatically glob and import all JSON plans in this directory (excluding *.example.json)
const jsonPlanModules = import.meta.glob<WorkoutPlan | { default: WorkoutPlan }>(
  './*.json',
  { eager: true }
);

export const BUNDLED_JSON_PLANS: WorkoutPlan[] = Object.entries(jsonPlanModules)
  .filter(([path]) => !path.includes('.example.'))
  .map(([, mod]) => {
    const plan = (mod as any).default || mod;
    return plan as WorkoutPlan;
  })
  .filter((plan): plan is WorkoutPlan => !!plan && !!plan.id && !!plan.name && Array.isArray(plan.days));

export const DEFAULT_PLAN: WorkoutPlan = BUNDLED_JSON_PLANS[0];
