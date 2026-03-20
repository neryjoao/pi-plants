import styles from './wateringMode.module.scss';
import { postWateringMode } from '../actions/setWateringMode';
import { postWatering } from '../actions/setWatering';
import cloneDeep from 'lodash/cloneDeep';
import type { PlantState } from '@pi-plants/shared';
import type { UpdatePlantFn } from '../types';

interface Props {
  plant: PlantState;
  updatePlant: UpdatePlantFn;
}

const selectedStyles = { backgroundColor: 'green', color: 'white' };
const notSelectedStyles = { backgroundColor: 'gainsboro', color: 'black' };

export const WateringMode = ({ plant, updatePlant }: Props) => {
  const { isAutomatic, isOn, plantIndex } = plant;

  const onToggleWateringMode = (setAutomatic: boolean) => {
    if (isAutomatic !== setAutomatic) {
      updatePlant({ ...cloneDeep(plant), isAutomatic: setAutomatic }, () =>
        postWateringMode(setAutomatic, plantIndex)
      );
    }
  };

  const onToggleWatering = (setIsOn: boolean) => {
    if (!isAutomatic && isOn !== setIsOn) {
      updatePlant({ ...cloneDeep(plant), isOn: setIsOn }, () =>
        postWatering(setIsOn, plantIndex)
      );
    }
  };

  const automaticButtonStyle = isAutomatic ? selectedStyles : notSelectedStyles;
  const manualButtonStyle = isAutomatic ? notSelectedStyles : selectedStyles;
  const isOnButtonStyle = isAutomatic ? notSelectedStyles : isOn ? selectedStyles : notSelectedStyles;
  const isOffButtonStyle = isAutomatic ? notSelectedStyles : isOn ? notSelectedStyles : selectedStyles;

  return (
    <>
      <h2>Watering Mode</h2>
      <div className={styles.wateringMode}>
        <span className={styles.mode} style={automaticButtonStyle} onClick={() => onToggleWateringMode(true)}>
          Automatic
        </span>
        <span className={styles.mode} style={manualButtonStyle} onClick={() => onToggleWateringMode(false)}>
          Manual
        </span>
      </div>
      <h2>Water on/off</h2>
      <div>
        <span className={styles.mode} style={isOnButtonStyle} onClick={() => onToggleWatering(true)}>
          On
        </span>
        <span className={styles.mode} style={isOffButtonStyle} onClick={() => onToggleWatering(false)}>
          Off
        </span>
      </div>
    </>
  );
};
