import { CONSTANTS } from '../CONSTANTS';
import type { PlantState } from '@pi-plants/shared';

const { BACKEND_URL, ENDPOINTS } = CONSTANTS;
const { TOGGLE_WATERING } = ENDPOINTS;

export const postWatering = async (plantIndex: number): Promise<PlantState | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}${TOGGLE_WATERING}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plantIndex }),
    });
    return res.json() as Promise<PlantState>;
  } catch (error) {
    console.log(error);
  }
};