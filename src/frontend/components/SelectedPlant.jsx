import React from 'react';
import {PlantSummary} from './PlantSummary';

export const SelectedPlant = ({selectedPlant, setSelectedPlant}) => {
    return <div>
        <div onClick={() => setSelectedPlant(undefined)}>Back home</div>
        <PlantSummary {...{plant: selectedPlant}}/>
    </div>;
}
