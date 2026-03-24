import { ChevronLeft } from 'lucide-react';
import { PlantSummary } from './PlantSummary';
import { WateringMode } from './WateringMode';
import { Button } from './ui/button';
import type { PlantState } from '@pi-plants/shared';
import type { UpdatePlantFn } from '../types';

interface Props {
  selectedPlant: PlantState;
  updatePlant: UpdatePlantFn;
}

export const SelectedPlant = ({ selectedPlant, updatePlant }: Props) => (
  <div className="max-w-md">
    <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => updatePlant()}>
      <ChevronLeft className="h-4 w-4 mr-1" />
      All plants
    </Button>
    <PlantSummary plant={selectedPlant} updatePlant={updatePlant} allowEditing />
    <WateringMode plant={selectedPlant} updatePlant={updatePlant} />
  </div>
);
