import styles from './editableName.module.scss';
import { Icon } from '../icons/Icon';
import { postWaterThreshold } from '../actions/setPlantDetails';
import type { PlantState } from '@pi-plants/shared';
import type { UpdatePlantFn } from '../types';

interface Props {
  plant: PlantState;
  updatePlant: UpdatePlantFn;
  waterThreshold: number;
  setWaterThreshold: (threshold: number) => void;
  setEditing: (editing: boolean) => void;
}

export const EditableMoisture = ({ plant, updatePlant, waterThreshold, setWaterThreshold, setEditing }: Props) => {
  const onClickConfirm = async () => {
    const updated = await postWaterThreshold(waterThreshold, plant.plantIndex);
    if (updated) updatePlant(updated);
    setEditing(false);
  };

  const onClickCancel = () => {
    setWaterThreshold(plant.waterThreshold);
    setEditing(false);
  };

  return (
    <form onSubmit={() => setEditing(false)} className={styles.form}>
      <input
        type="number"
        value={waterThreshold}
        className={styles.editingName}
        onChange={(e) => setWaterThreshold(Number(e.target.value))}
      />
      <Icon name="check" wrapperProps={{ onClick: onClickConfirm, className: styles.iconWrapper }} />
      <Icon name="cross" wrapperProps={{ onClick: onClickCancel, className: styles.iconWrapper }} />
    </form>
  );
};
