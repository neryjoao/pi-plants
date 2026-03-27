import axios from 'axios';
import { CONSTANTS } from '../CONSTANTS';
import type { PlantState, ScheduleEntry } from '@pi-plants/shared';

const { BACKEND_URL, ENDPOINTS } = CONSTANTS;
const { POST_SCHEDULE } = ENDPOINTS;

export const postSchedule = async (plantIndex: number, entries: ScheduleEntry[]): Promise<PlantState | undefined> => {
  try {
    const response = await axios.post<PlantState>(`${BACKEND_URL}${POST_SCHEDULE}`, { plantIndex, entries });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};