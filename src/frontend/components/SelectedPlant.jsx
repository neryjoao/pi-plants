import React from 'react';
import {PlantSummary} from './PlantSummary';
import {WateringMode} from './WateringMode';
import {Icon} from '../icons/Icon';

export const SelectedPlant = ({selectedPlant, updatePlant}) => {
    const {isAutomatic, waterThreshold, isOn, plantIndex} = selectedPlant || {};

    return <div>
        <div onClick={() => updatePlant()}>
            <Icon {...{
                name: `home`
            }}/>
        </div>
        <PlantSummary {...{plant: selectedPlant, updatePlant, allowEditing: true}}/>
        <WateringMode {...{isAutomatic, waterThreshold, isOn, plantIndex, updatePlant}}/>
    </div>;
}
