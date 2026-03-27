import { CONSTANTS } from '../CONSTANTS';
import type { PlantState, WateringMode } from '@pi-plants/shared';

const { BACKEND_URL, ENDPOINTS } = CONSTANTS;
const { SET_WATERING_MODE } = ENDPOINTS;

export const postWateringMode = async (plantIndex: number, mode: WateringMode): Promise<PlantState | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}${SET_WATERING_MODE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plantIndex, mode }),
    });
    return res.json() as Promise<PlantState>;
  } catch (error) {
    console.log(error);
  }
};