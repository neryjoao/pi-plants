import { useState, useEffect } from 'react';
import { Plants } from './components/Plants';
import { SelectedPlant } from './components/SelectedPlant';
import styles from './app.module.scss';
import { CONSTANTS } from './CONSTANTS';
import type { PlantState } from '@pi-plants/shared';
import type { UpdatePlantFn } from './types';

const { BACKEND_URL, ENDPOINTS } = CONSTANTS;
const { GET_SYSTEM_DETAILS } = ENDPOINTS;

export const App = () => {
  const [plantDetails, setPlantDetails] = useState<PlantState[]>();
  const [selectedPlant, setSelectedPlant] = useState<PlantState>();

  useEffect(() => {
    const source = new EventSource(`${BACKEND_URL}${GET_SYSTEM_DETAILS}`);
    source.onmessage = (event) => {
      setPlantDetails(JSON.parse(event.data) as PlantState[]);
    };
    return () => source.close();
  }, []);

  useEffect(() => {
    if (selectedPlant && plantDetails) {
      setSelectedPlant(plantDetails[selectedPlant.plantIndex]);
    }
  }, [plantDetails]); // eslint-disable-line react-hooks/exhaustive-deps

  const updatePlant: UpdatePlantFn = (plant) => {
    setSelectedPlant(plant);
    if (plant && plantDetails) {
      const updated = [...plantDetails];
      updated.splice(plant.plantIndex, 1, plant);
      setPlantDetails(updated);
    }
  };

  return (
    <div className={styles.frame}>
      <h3 className={styles.header}>MY PLANTS</h3>
      {selectedPlant ? (
        <SelectedPlant selectedPlant={selectedPlant} updatePlant={updatePlant} />
      ) : plantDetails ? (
        <Plants plantDetails={plantDetails} updatePlant={updatePlant} />
      ) : null}
    </div>
  );
};
