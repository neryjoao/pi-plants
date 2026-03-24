import { PlantSummary } from './PlantSummary';
import type { PlantState } from '@pi-plants/shared';
import type { UpdatePlantFn } from '../types';

interface Props {
  plantDetails: PlantState[];
  updatePlant: UpdatePlantFn;
}

export const Plants = ({ plantDetails, updatePlant }: Props) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {plantDetails.map((plant) => (
      <PlantSummary key={plant.plantIndex} plant={plant} updatePlant={updatePlant} />
    ))}
  </div>
);
