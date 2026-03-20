import React, {useState} from 'react';
import styles from './plantSummary.module.scss';
import {EditableMoisture} from './EditableMoisture';

export const MoistureLevel = ({plant, updatePlant, currentLevel, allowEditing}) => {
    const [editing, setEditing] = useState();
    const [waterThreshold, setWaterThreshold] = useState(plant.waterThreshold);

    return <div className={styles.moistureLevel}>
        <div {...{
            className: styles.currentMoistureLevel,
            style: {
                width: `${currentLevel}%`,
                backgroundColor: `#7ed321`
            }
        }}
        />
        <div className={styles.backgroundBar}/>
        <div className={styles.waterThreshold} style={{
            marginLeft: `${waterThreshold}%`
        }}/>
        {!editing ?
            <div {...{
                style: {marginLeft: `${waterThreshold-2}%`},
                className: styles.thresholdValue,
                onClick: () => allowEditing && setEditing(true)
            }}>
                {waterThreshold}
            </div> :
        <EditableMoisture {...{
            plant,
            updatePlant,
            waterThreshold,
            setWaterThreshold,
            setEditing
        }}/>}
    </div>
}
