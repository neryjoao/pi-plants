import type { PlantState } from '@pi-plants/shared';

export type UpdatePlantFn = (plant?: PlantState, callback?: () => Promise<unknown>) => void;
