import React, {useState, useEffect} from 'react';
import {Plants} from './components/Plants';
import {SelectedPlant} from './components/SelectedPlant';
import styles from './app.module.scss';
import _cloneDeep from 'lodash/cloneDeep';
import _get from 'lodash/get';
import {CONSTANTS} from './CONSTANTS';

const { BACKEND_URL , ENDPOINTS} = CONSTANTS,
    { GET_SYSTEM_DETAILS } = ENDPOINTS;

export const App = () => {
    const [plantDetails, setPlantDetails] = useState();
    const [selectedPlant, setSelectedPlant] = useState();

    useEffect(() => {
        const url = `${BACKEND_URL}${GET_SYSTEM_DETAILS}`
        const source = new EventSource(url);

        source.onmessage = event => {
            setPlantDetails(JSON.parse(event.data));
        }
    }, [])

    useEffect(() => {
        if (selectedPlant) {
            const {plantIndex} = selectedPlant || {};
            setSelectedPlant(plantDetails[plantIndex]);
        }
    }, [selectedPlant, setSelectedPlant, plantDetails])

    const updatePlant = (plant, callback) => {
        setSelectedPlant(plant);
        if (plant) {
            const plantDetailsClone = _cloneDeep(plantDetails);
            plantDetailsClone.splice(_get(plant, `plantIndex`), 1, plant);

            callback ?
                callback().then(() => {
                    setPlantDetails(plantDetailsClone);
                }) :
                setPlantDetails(plantDetailsClone);
        }
    }

    return <div className={styles.frame}>
        <h3 className={styles.header}>MY PLANTS</h3>
        {selectedPlant ?
            <SelectedPlant {...{selectedPlant, updatePlant}}/> :
            plantDetails ? <Plants {...{
                plantDetails,
                updatePlant
            }}/> : null}
    </div>;
};
