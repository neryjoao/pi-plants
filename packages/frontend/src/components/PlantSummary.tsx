import { useState, useEffect } from 'react';
import styles from './plantSummary.module.scss';
import { EditableName } from './EditableName';
import { MoistureLevel } from './MoistureLevel';
import type { PlantState } from '@pi-plants/shared';
import type { UpdatePlantFn } from '../types';

interface Props {
  plant: PlantState;
  updatePlant: UpdatePlantFn;
  allowEditing?: boolean;
}

export const PlantSummary = ({ plant, updatePlant, allowEditing }: Props) => {
  const [currentLevel, setCurrentLevel] = useState<number>();
  const [editing, setEditing] = useState(false);
  const [plantName, setPlantName] = useState(plant.name);

  useEffect(() => {
    setCurrentLevel(plant.moistureLevel);
  }, [plant]);

  return (
    <div
      className={styles.plantSummary}
      onClick={() => !allowEditing && updatePlant(plant)}
    >
      {!editing ? (
        <h3
          className={styles.plantName}
          onClick={() => allowEditing && setEditing(true)}
        >
          {plantName}
        </h3>
      ) : (
        <EditableName
          plant={plant}
          updatePlant={updatePlant}
          setEditing={setEditing}
          plantName={plantName}
          setPlantName={setPlantName}
        />
      )}
      <MoistureLevel
        plant={plant}
        updatePlant={updatePlant}
        currentLevel={currentLevel}
        allowEditing={allowEditing}
      />
    </div>
  );
};
