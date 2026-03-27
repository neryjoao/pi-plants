import axios from 'axios';
import { CONSTANTS } from '../CONSTANTS';
import type { PlantState, WateringMode } from '@pi-plants/shared';

const { BACKEND_URL, ENDPOINTS } = CONSTANTS;
const { SET_WATERING_MODE } = ENDPOINTS;

export const postWateringMode = async (plantIndex: number, mode: WateringMode): Promise<PlantState | undefined> => {
  try {
    const response = await axios.post<PlantState>(`${BACKEND_URL}${SET_WATERING_MODE}`, { plantIndex, mode });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};