import { Check, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
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
    <form
      onSubmit={(e) => { e.preventDefault(); void onClickConfirm(); }}
      className="flex items-center gap-1.5 flex-1"
      onClick={(e) => e.stopPropagation()}
    >
      <Input
        autoFocus
        value={plantName}
        onChange={(e) => setPlantName(e.target.value)}
        className="h-7 text-sm font-semibold"
      />
      <Button type="submit" size="icon" variant="ghost" className="h-7 w-7 shrink-0 text-green-600 hover:text-green-700">
        <Check className="h-4 w-4" />
      </Button>
      <Button type="button" size="icon" variant="ghost" className="h-7 w-7 shrink-0 text-red-500 hover:text-red-600" onClick={onClickCancel}>
        <X className="h-4 w-4" />
      </Button>
    </form>
  );
};
