import { PlantSummary } from './PlantSummary';
import { WateringMode } from './WateringMode';
import { Icon } from '../icons/Icon';
import type { PlantState } from '@pi-plants/shared';
import type { UpdatePlantFn } from '../types';

interface Props {
  selectedPlant: PlantState;
  updatePlant: UpdatePlantFn;
}

export const SelectedPlant = ({ selectedPlant, updatePlant }: Props) => (
  <div>
    <div onClick={() => updatePlant()}>
      <Icon name="home" />
    </div>
    <PlantSummary plant={selectedPlant} updatePlant={updatePlant} allowEditing />
    <WateringMode plant={selectedPlant} updatePlant={updatePlant} />
  </div>
);
