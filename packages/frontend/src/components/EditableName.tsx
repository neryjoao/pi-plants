import styles from './editableName.module.scss';
import { Icon } from '../icons/Icon';
import { postPlantName } from '../actions/setPlantDetails';
import type { PlantState } from '@pi-plants/shared';
import type { UpdatePlantFn } from '../types';

interface Props {
  plant: PlantState;
  updatePlant: UpdatePlantFn;
  setEditing: (editing: boolean) => void;
  plantName: string;
  setPlantName: (name: string) => void;
}

export const EditableName = ({ plant, updatePlant, setEditing, plantName, setPlantName }: Props) => {
  const onClickConfirm = async () => {
    const updated = await postPlantName(plantName, plant.plantIndex);
    if (updated) updatePlant(updated);
    setEditing(false);
  };

  const onClickCancel = () => {
    setPlantName(plant.name);
    setEditing(false);
  };

  return (
    <form onSubmit={() => setEditing(false)} className={styles.form}>
      <input
        type="text"
        value={plantName}
        className={styles.editingName}
        onChange={(e) => setPlantName(e.target.value)}
      />
      <Icon name="check" wrapperProps={{ onClick: onClickConfirm, className: styles.iconWrapper }} />
      <Icon name="cross" wrapperProps={{ onClick: onClickCancel, className: styles.iconWrapper }} />
    </form>
  );
};
