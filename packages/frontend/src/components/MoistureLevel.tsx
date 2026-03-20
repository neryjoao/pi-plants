import { useState } from 'react';
import styles from './plantSummary.module.scss';
import { EditableMoisture } from './EditableMoisture';
import type { PlantState } from '@pi-plants/shared';
import type { UpdatePlantFn } from '../types';

interface Props {
  plant: PlantState;
  updatePlant: UpdatePlantFn;
  currentLevel?: number;
  allowEditing?: boolean;
}

export const MoistureLevel = ({ plant, updatePlant, currentLevel, allowEditing }: Props) => {
  const [editing, setEditing] = useState(false);
  const [waterThreshold, setWaterThreshold] = useState(plant.waterThreshold);

  return (
    <div className={styles.moistureLevel}>
      <div
        className={styles.currentMoistureLevel}
        style={{ width: `${currentLevel}%`, backgroundColor: '#7ed321' }}
      />
      <div className={styles.backgroundBar} />
      <div className={styles.waterThreshold} style={{ marginLeft: `${waterThreshold}%` }} />
      {!editing ? (
        <div
          style={{ marginLeft: `${waterThreshold - 2}%` }}
          className={styles.thresholdValue}
          onClick={() => allowEditing && setEditing(true)}
        >
          {waterThreshold}
        </div>
      ) : (
        <EditableMoisture
          plant={plant}
          updatePlant={updatePlant}
          waterThreshold={waterThreshold}
          setWaterThreshold={setWaterThreshold}
          setEditing={setEditing}
        />
      )}
    </div>
  );
};
