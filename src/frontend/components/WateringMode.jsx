import React from 'react';
import styles from './wateringMode.module.scss';
import {toggleWateringMode} from '../actions/setWateringMode';

export const WateringMode = ({isAutomatic, waterThreshold, isOn, plantIndex, updatePlant}) => {

    const selectedStyles = {
        backgroundColor: 'green',
        color: 'white',
    },
        notSelectedStyles = {
            backgroundColor: 'gainsboro',
            color: 'black',
        };

    const onClick = (setAutomatic) => {
        if (isAutomatic !== setAutomatic) {
            toggleWateringMode(plantIndex).then(response => {
                updatePlant(response);
            });
        }
    }

    const automaticButtonStyle = isAutomatic ? selectedStyles : notSelectedStyles,
        manualButtonStyle = isAutomatic ? notSelectedStyles : selectedStyles;
    return <>
        <h2>Watering Mode</h2>
        <div>
            <span className={styles.mode} style={automaticButtonStyle} onClick={() => onClick(true)}>Automatic</span>
            <span className={styles.mode} style={manualButtonStyle} onClick={() => onClick(false)}>Manual</span>
        </div>
        <div>
            {/*{isAutomatic ? }*/}
        </div>
    </>
}
