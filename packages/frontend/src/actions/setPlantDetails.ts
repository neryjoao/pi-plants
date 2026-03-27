import { CONSTANTS } from '../CONSTANTS';
import type { PlantState } from '@pi-plants/shared';

const { BACKEND_URL, ENDPOINTS } = CONSTANTS;
const { POST_PLANT_NAME, POST_WATER_THRESHOLD } = ENDPOINTS;

export const postPlantName = async (name: string, plantIndex: number): Promise<PlantState | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}${POST_PLANT_NAME}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: name, plantIndex }),
    });
    return res.json() as Promise<PlantState>;
  } catch (error) {
    console.log(error);
  }
};

export const postWaterThreshold = async (threshold: number, plantIndex: number): Promise<PlantState | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}${POST_WATER_THRESHOLD}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: threshold, plantIndex }),
    });
    return res.json() as Promise<PlantState>;
  } catch (error) {
    console.log(error);
  }
};