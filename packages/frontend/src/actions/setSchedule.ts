import { CONSTANTS } from '../CONSTANTS';
import type { PlantState, ScheduleEntry } from '@pi-plants/shared';

const { BACKEND_URL, ENDPOINTS } = CONSTANTS;
const { POST_SCHEDULE } = ENDPOINTS;

export const postSchedule = async (plantIndex: number, entries: ScheduleEntry[]): Promise<PlantState | undefined> => {
  try {
    const res = await fetch(`${BACKEND_URL}${POST_SCHEDULE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plantIndex, entries }),
    });
    return res.json() as Promise<PlantState>;
  } catch (error) {
    console.log(error);
  }
};