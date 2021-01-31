import React from 'react';
import {PlantSummary} from './PlantSummary';
import {WateringMode} from './WateringMode';
import {Icon} from '../icons/Icon';

export const SelectedPlant = ({selectedPlant, updatePlant}) => {
    return <div>
        <div onClick={() => updatePlant()}>
            <Icon {...{
                name: `home`
            }}/>
        </div>
        <PlantSummary {...{plant: selectedPlant, updatePlant, allowEditing: true}}/>
        <WateringMode {...{plant: selectedPlant, updatePlant}}/>
    </div>;
}
