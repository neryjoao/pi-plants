import React, {useState, useEffect} from 'react';
import styles from './plantSummary.module.scss';
import _cloneDeep from 'lodash/cloneDeep';
import _set from 'lodash/set';
import {Icon} from '../icons/Icon';

export const PlantSummary = ({plant, updatePlant, allowEditing}) => {
    const [currentLevel, setCurrentLevel] = useState();
    const {moistureLevel} = plant || {}
    const [editing, setEditing] = useState();
    const [plantName, setPlantName] = useState(plant.name);

    const {waterThreshold} = plant;

    useEffect(() => {
        setCurrentLevel(moistureLevel);
    }, [])

    const onCLickConfirm = () => {
        const clonedPlant = _cloneDeep(plant);
        _set(clonedPlant, `name`, plantName);
        updatePlant(clonedPlant);
        setEditing(false);
    }

    const onClickCancel = () => {
        setPlantName(plant.name);
        setEditing(false);
    }


    return <div {...{
        className: styles.plantSummary,
        onClick: () => !allowEditing && updatePlant && updatePlant(plant)
    }}>
        {!editing ? <h3 {...{
                className: styles.plantName,
                onClick: () => allowEditing && setEditing(true)
            }}>{plantName}
        </h3> :
            <form {...{
                onSubmit: () => setEditing(false),
                className: styles.form
            }}>
                <input {...{
                    type: 'text',
                    value: plantName,
                    className: styles.editingName,
                    onChange: (event) => setPlantName(event.target.value)
                }}/>
                <Icon {...{
                    name: 'check',
                    wrapperProps: {
                        onClick: onCLickConfirm,
                        className: styles.iconWrapper
                    },
                }}/>
                <Icon {...{
                    name: 'cross',
                    wrapperProps: {
                        onClick: onClickCancel,
                        className: styles.iconWrapper
                    }
                }}/>
            </form>}

        <div className={styles.moistureLevel}>
            <div className={styles.waterThreshold} style={{
                marginLeft: `${waterThreshold}%`
            }}/>
            <div {...{
                className: styles.currentMoistureLevel,
                style: {
                    width: `${currentLevel}%`,
                    backgroundColor: `#7ed321`
                }
            }}
            />
            <div className={styles.backgroundBar}/>
        </div>
    </div>
}
