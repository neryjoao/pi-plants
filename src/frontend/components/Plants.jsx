import React from 'react';
import { PlantSummary } from './PlantSummary';
import _isArray from 'lodash/isArray';
import styles from './plants.module.scss';

export const Plants = ({plantDetails, setSelectedPlant}) => {
    const renderPlantsSummary = () => {
        console.log(`this is what I have ${JSON.stringify(plantDetails)}`)
        return plantDetails.map(plant => {
            return <PlantSummary {...{plant, setSelectedPlant}} />
        });
    };
    const dataFetched = _isArray(plantDetails);

    return <div className={styles.frame}>
        {dataFetched ?
            <>
                <h3 className={styles.header}>MY PLANTS</h3>
                {renderPlantsSummary()}
            </>:
            `Fetching data...`
        }
    </div>
}
