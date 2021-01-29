import React from 'react';
import styles from './wateringMode.module.scss';
import {toggleWateringMode} from '../actions/setWateringMode';
import {toggleWatering} from '../actions/setWatering';

export const WateringMode = ({isAutomatic, waterThreshold, isOn, plantIndex, updatePlant}) => {

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
            toggleWateringMode(plantIndex).then(response => {
                updatePlant(response);
            });
        }
    }

    const onToggleWatering = (setIsOn) => {
        if (!isAutomatic && isOn !== setIsOn) {
            toggleWatering(plantIndex).then(response => {
                updatePlant(response)
            })
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
