import {CONSTANTS} from '../CONSTANTS';
import axios from 'axios';
import _get from 'lodash/get'

const { BACKEND_URL , ENDPOINTS} = CONSTANTS,
    { GET_SYSTEM_DETAILS } = ENDPOINTS;

export const fetchPlantsDetails = async () => {
    const axiosData = {
        method: 'GET',
        url: `${BACKEND_URL}${GET_SYSTEM_DETAILS}`
    }

    const mockedData = _get(window, `plants.details`);

    if (mockedData) {
        return mockedData;
    }

    try {
        const response = await axios(axiosData);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
