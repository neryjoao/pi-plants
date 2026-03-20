import React from 'react';
import { PlantSummary } from './PlantSummary';
import _isArray from 'lodash/isArray';

export const Plants = ({plantDetails, updatePlant}) => {
    const renderPlantsSummary = () => {
        console.log(`this is what I have ${JSON.stringify(plantDetails)}`)
        return plantDetails.map(plant => {
            return <PlantSummary {...{plant, updatePlant}} />
        });
    };
    const dataFetched = _isArray(plantDetails);

    return <div>
        {dataFetched ?
            <>
                {renderPlantsSummary()}
            </>:
            `Fetching data...`
        }
    </div>
}
