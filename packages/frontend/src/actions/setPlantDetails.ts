import axios from 'axios';
import { CONSTANTS } from '../CONSTANTS';
import type { PlantState } from '@pi-plants/shared';

const { BACKEND_URL, ENDPOINTS } = CONSTANTS;
const { POST_PLANT_NAME, POST_WATER_THRESHOLD } = ENDPOINTS;

export const postPlantName = async (name: string, plantIndex: number): Promise<PlantState | undefined> => {
  try {
    const response = await axios.post<PlantState>(`${BACKEND_URL}${POST_PLANT_NAME}`, { value: name, plantIndex });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const postWaterThreshold = async (threshold: number, plantIndex: number): Promise<PlantState | undefined> => {
  try {
    const response = await axios.post<PlantState>(`${BACKEND_URL}${POST_WATER_THRESHOLD}`, { value: threshold, plantIndex });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};