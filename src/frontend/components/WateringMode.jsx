import React from 'react';
import styles from './wateringMode.module.scss';
import {postWateringMode} from '../actions/setWateringMode';
import {postWatering} from '../actions/setWatering';
import _cloneDeep from 'lodash/cloneDeep';
import _set from 'lodash/set';

export const WateringMode = ({plant, updatePlant}) => {

    const {isAutomatic, isOn, plantIndex} = plant || {}

    const selectedStyles = {
        backgroundColor: 'green',
        color: 'white',
    },
        notSelectedStyles = {
            backgroundColor: 'gainsboro',
            color: 'black',
        };

    const onToggleWateringMode = (setAutomatic) => {
        if (isAutomatic !== setAutomatic) {
            const clonedPlant = _cloneDeep(plant);
            _set(clonedPlant, `isAutomatic`, setAutomatic);
            updatePlant(clonedPlant, () => postWateringMode(setAutomatic, plantIndex));
        }
    }

    const onToggleWatering = (setIsOn) => {
        if (!isAutomatic && isOn !== setIsOn) {
            const clonedPlant = _cloneDeep(plant);
            _set(clonedPlant, `isOn`, setIsOn);
            updatePlant(clonedPlant, () => postWatering(setIsOn, plantIndex));
        }
    }

    const automaticButtonStyle = isAutomatic ? selectedStyles : notSelectedStyles,
        manualButtonStyle = isAutomatic ? notSelectedStyles : selectedStyles,
        isOnButtonStyle = isAutomatic ? notSelectedStyles :
            isOn ? selectedStyles : notSelectedStyles,
        isOffButtonStyle = isAutomatic ? notSelectedStyles :
            isOn ? notSelectedStyles : selectedStyles;

        return <>
        <h2>Watering Mode</h2>
        <div className={styles.wateringMode}>
            <span className={styles.mode} style={automaticButtonStyle} onClick={() => onToggleWateringMode(true)}>Automatic</span>
            <span className={styles.mode} style={manualButtonStyle} onClick={() => onToggleWateringMode(false)}>Manual</span>
        </div>
        <div>
            <span className={styles.mode} style={isOnButtonStyle} onClick={() => onToggleWatering(true)}>On</span>
            <span className={styles.mode} style={isOffButtonStyle} onClick={() => onToggleWatering(false)}>Off</span>
        </div>
    </>
}
