import React from 'react';
import {PlantSummary} from './PlantSummary';
import {WateringMode} from './WateringMode';

export const SelectedPlant = ({selectedPlant, updatePlant}) => {
    const {isAutomatic, waterThreshold, isOn, plantIndex} = selectedPlant || {};

    return <div>
        <div onClick={() => updatePlant(undefined)}>Back home</div>
        <PlantSummary {...{plant: selectedPlant}}/>
        <WateringMode {...{isAutomatic, waterThreshold, isOn, plantIndex, updatePlant}}/>
    </div>;
}
