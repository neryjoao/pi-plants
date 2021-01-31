import React from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import _set from 'lodash/set';
import styles from './editableName.module.scss'
import {Icon} from '../icons/Icon';
import {postPlantName} from '../actions/setPlantDetails';

export const EditableName = ({plant, updatePlant, setEditing, plantName, setPlantName}) => {
    const onCLickConfirm = () => {
        const clonedPlant = _cloneDeep(plant);
        _set(clonedPlant, `name`, plantName);
        updatePlant(clonedPlant, () => postPlantName(plantName, plant.plantIndex));
        setEditing(false);
    }

    const onClickCancel = () => {
        setPlantName(plant.name);
        setEditing(false);
    }

    return <form {...{
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
    </form>
}
