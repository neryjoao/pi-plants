import {CONSTANTS} from '../CONSTANTS';
import axios from 'axios';
import _get from 'lodash/get';
import _set from 'lodash/set';

const { BACKEND_URL , ENDPOINTS} = CONSTANTS,
    { TOGGLE_WATERING_MODE } = ENDPOINTS;

export const toggleWateringMode = async (index) => {
    const axiosData = {
        method: `POST`,
        url: `${BACKEND_URL}${TOGGLE_WATERING_MODE}?index=${index}`,
    }

    const storedMockedData = _get(window, `plants.details[${index}]`);

    if (storedMockedData) {
        _set(storedMockedData, `plantIndex`, !_get(storedMockedData, `plantIndex`));
        return storedMockedData;
    }

    try {
        const response = await axios(axiosData);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
