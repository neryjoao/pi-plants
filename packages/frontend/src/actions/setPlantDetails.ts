import axios from 'axios';
import { CONSTANTS } from '../CONSTANTS';

const { BACKEND_URL, ENDPOINTS } = CONSTANTS;
const { POST_PLANT_NAME, POST_WATER_THRESHOLD } = ENDPOINTS;

export const postPlantName = async (name: string, plantIndex: number): Promise<unknown> => {
  try {
    const response = await axios.post(`${BACKEND_URL}${POST_PLANT_NAME}`, {
      key: 'name',
      value: name,
      plantIndex,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const postWaterThreshold = async (threshold: number, plantIndex: number): Promise<unknown> => {
  try {
    const response = await axios.post(`${BACKEND_URL}${POST_WATER_THRESHOLD}`, {
      key: 'waterThreshold',
      value: threshold,
      plantIndex,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
