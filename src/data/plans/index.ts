import type { WorkoutPlan } from '../../types/workout';

// Automatically glob and import all JSON plans in this directory (excluding *.example.json)
const jsonPlanModules = import.meta.glob<WorkoutPlan | { default: WorkoutPlan }>(
  './*.json',
  { eager: true }
);

export const DEFAULT_PLAN_ID = 'post-thr-fullbody-v2';

const allPlans: WorkoutPlan[] = Object.entries(jsonPlanModules)
  .filter(([path]) => !path.includes('.example.'))
  .map(([, mod]) => {
    const plan = (mod as any).default || mod;
    return plan as WorkoutPlan;
  })
  .filter((plan): plan is WorkoutPlan => !!plan && !!plan.id && !!plan.name && Array.isArray(plan.days));

// Prioritize post-thr-fullbody-v2 as the primary default plan at index 0
export const BUNDLED_JSON_PLANS: WorkoutPlan[] = allPlans.sort((a, b) => {
  if (a.id === DEFAULT_PLAN_ID) return -1;
  if (b.id === DEFAULT_PLAN_ID) return 1;
  return a.name.localeCompare(b.name);
});

export const DEFAULT_PLAN: WorkoutPlan =
  BUNDLED_JSON_PLANS.find((p) => p.id === DEFAULT_PLAN_ID) || BUNDLED_JSON_PLANS[0];

