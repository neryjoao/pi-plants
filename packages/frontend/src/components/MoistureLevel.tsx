import { useState } from 'react';
import { Droplets } from 'lucide-react';
import { EditableMoisture } from './EditableMoisture';
import { cn } from '@/lib/utils';
import type { PlantState } from '@pi-plants/shared';
import type { UpdatePlantFn } from '../types';

interface Props {
  plant: PlantState;
  updatePlant: UpdatePlantFn;
  allowEditing?: boolean;
}

export const MoistureLevel = ({ plant, updatePlant, allowEditing }: Props) => {
  const [editing, setEditing] = useState(false);
  const [waterThreshold, setWaterThreshold] = useState(plant.waterThreshold);
  const level = plant.moistureLevel;
  const isHealthy = level >= waterThreshold;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Droplets className="h-3.5 w-3.5" />
          <span>Moisture</span>
        </div>
        <span className={cn('font-medium tabular-nums', isHealthy ? 'text-green-600' : 'text-amber-600')}>
          {level}%
        </span>
      </div>

      <div className="relative h-2.5 bg-muted rounded-full overflow-visible">
        <div
          className={cn('h-full rounded-full transition-all', isHealthy ? 'bg-green-500' : 'bg-amber-400')}
          style={{ width: `${level}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-foreground/25 rounded-full"
          style={{ left: `${waterThreshold}%` }}
        />
      </div>

      <div className="flex justify-end">
        {!editing ? (
          <button
            className={cn(
              'text-xs text-muted-foreground',
              allowEditing && 'hover:text-foreground cursor-pointer underline-offset-2 hover:underline',
            )}
            onClick={() => allowEditing && setEditing(true)}
          >
            Threshold: {waterThreshold}%
          </button>
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
    </div>
  );
};
