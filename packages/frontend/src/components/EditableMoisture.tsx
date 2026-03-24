import { Check, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
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
    <form
      onSubmit={(e) => { e.preventDefault(); void onClickConfirm(); }}
      className="flex items-center gap-1.5"
    >
      <span className="text-xs text-muted-foreground">Threshold:</span>
      <Input
        type="number"
        autoFocus
        value={waterThreshold}
        onChange={(e) => setWaterThreshold(Number(e.target.value))}
        className="h-6 w-16 text-xs px-2"
        min={0}
        max={100}
      />
      <Button type="submit" size="icon" variant="ghost" className="h-6 w-6 text-green-600 hover:text-green-700" onClick={() => void onClickConfirm()}>
        <Check className="h-3 w-3" />
      </Button>
      <Button type="button" size="icon" variant="ghost" className="h-6 w-6 text-red-500 hover:text-red-600" onClick={onClickCancel}>
        <X className="h-3 w-3" />
      </Button>
    </form>
  );
};
