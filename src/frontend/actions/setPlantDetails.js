import {CONSTANTS} from '../CONSTANTS';
import axios from 'axios';

const { BACKEND_URL , ENDPOINTS} = CONSTANTS,
    { POST_PLANT_NAME, POST_WATER_THRESHOLD } = ENDPOINTS;

export const postPlantName = async (name, plantIndex) => {
    const axiosData = {
        method: 'POST',
        url: `${BACKEND_URL}${POST_PLANT_NAME}`,
        data: {
            key: 'name',
            value: name,
            plantIndex
        }
    }

    try {
        const response = await axios(axiosData);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const postWaterThreshold = async (threshold, plantIndex) => {
    const axiosData = {
        method: 'POST',
        url: `${BACKEND_URL}${POST_WATER_THRESHOLD}`,
        data: {
            key: 'waterThreshold',
            value: threshold,
            plantIndex
        }
    }

    try {
        const response = await axios(axiosData);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
