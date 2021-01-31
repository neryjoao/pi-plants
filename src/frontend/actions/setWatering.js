import {CONSTANTS} from '../CONSTANTS';
import axios from 'axios';

const { BACKEND_URL , ENDPOINTS} = CONSTANTS,
    { TOGGLE_WATERING } = ENDPOINTS;

export const postWatering = async (isOn,  plantIndex) => {
    const axiosData = {
        method: `POST`,
        url: `${BACKEND_URL}${TOGGLE_WATERING}`,
        data: {
            key: 'isOn',
            value: isOn,
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
