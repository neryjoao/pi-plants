import { PlantSummary } from './PlantSummary';
import type { PlantState } from '@pi-plants/shared';
import type { UpdatePlantFn } from '../types';

interface Props {
  plantDetails: PlantState[];
  updatePlant: UpdatePlantFn;
}

export const Plants = ({ plantDetails, updatePlant }: Props) => (
  <div>
    {plantDetails.map((plant) => (
      <PlantSummary key={plant.plantIndex} plant={plant} updatePlant={updatePlant} />
    ))}
  </div>
);
