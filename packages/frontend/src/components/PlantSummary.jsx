import React, {useState, useEffect} from 'react';
import styles from './plantSummary.module.scss';
import {EditableName} from './EditableName';
import {MoistureLevel} from './MoistureLevel';
import _get from 'lodash/get'

export const PlantSummary = ({plant, updatePlant, allowEditing}) => {
    const [currentLevel, setCurrentLevel] = useState();
    const [editing, setEditing] = useState();
    const [plantName, setPlantName] = useState(plant.name);

    useEffect(() => {
        setCurrentLevel(_get(plant, `moistureLevel`));
    }, [plant])

    return <div {...{
        className: styles.plantSummary,
        onClick: () => !allowEditing && updatePlant && updatePlant(plant)
    }}>
        {!editing ?
            <h3 {...{
                className: styles.plantName,
                onClick: () => allowEditing && setEditing(true)
            }}>{plantName}
            </h3> :
            <EditableName {...{
                plant,
                updatePlant,
                setEditing,
                plantName,
                setPlantName,

            }}/>}
        <MoistureLevel {...{plant, updatePlant, currentLevel, allowEditing}}/>

    </div>
}
