import {CONSTANTS} from '../CONSTANTS';
import axios from 'axios';

const { BACKEND_URL , ENDPOINTS} = CONSTANTS,
    { TOGGLE_WATERING_MODE } = ENDPOINTS;

export const postWateringMode = async (isAutomatic, plantIndex) => {
    const axiosData = {
        method: `POST`,
        url: `${BACKEND_URL}${TOGGLE_WATERING_MODE}`,
        data: {
            key: 'isAutomatic',
            value: isAutomatic,
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
