import axios from 'axios';
import { CONSTANTS } from '../CONSTANTS';
import type { PlantState } from '@pi-plants/shared';

const { BACKEND_URL, ENDPOINTS } = CONSTANTS;
const { TOGGLE_WATERING } = ENDPOINTS;

export const postWatering = async (isOn: boolean, plantIndex: number): Promise<PlantState | undefined> => {
  try {
    const response = await axios.post<PlantState>(`${BACKEND_URL}${TOGGLE_WATERING}`, {
      key: 'isOn',
      value: isOn,
      plantIndex,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
