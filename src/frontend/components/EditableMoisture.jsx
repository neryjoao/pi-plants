import React from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import _set from 'lodash/set';
import styles from './editableName.module.scss';
import {Icon} from '../icons/Icon';
import {postWaterThreshold} from '../actions/setPlantDetails';

export const EditableMoisture = ({plant, waterThreshold, setWaterThreshold, updatePlant, setEditing}) => {
    const onCLickConfirm = () => {
        const clonedPlant = _cloneDeep(plant);
        _set(clonedPlant, `waterThreshold`, waterThreshold);
        updatePlant(clonedPlant, () => postWaterThreshold(waterThreshold, plant.plantIndex));
        setEditing(false);
    }

    const onClickCancel = () => {
        setWaterThreshold(plant.waterThreshold);
        setEditing(false);
    }

    return <form {...{
        onSubmit: () => setEditing(false),
        className: styles.form
    }}>
        <input {...{
            type: 'number',
            value: waterThreshold,
            className: styles.editingName,
            onChange: (event) => setWaterThreshold(event.target.value)
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
