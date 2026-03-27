import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { EditableName } from './EditableName';
import { MoistureLevel } from './MoistureLevel';
import { cn } from '@/lib/utils';
import type { PlantState } from '@pi-plants/shared';
import type { UpdatePlantFn } from '../types';

interface Props {
  plant: PlantState;
  updatePlant: UpdatePlantFn;
  allowEditing?: boolean;
}

export const PlantSummary = ({ plant, updatePlant, allowEditing }: Props) => {
  const [editing, setEditing] = useState(false);
  const [plantName, setPlantName] = useState(plant.name);

  return (
    <Card
      className={cn(
        'transition-all',
        !allowEditing && 'cursor-pointer hover:shadow-md hover:border-primary/40',
      )}
      onClick={() => !allowEditing && updatePlant(plant)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          {!editing ? (
            <CardTitle
              className={cn('text-base', allowEditing && 'cursor-pointer hover:text-primary')}
              onClick={(e) => {
                if (allowEditing) {
                  e.stopPropagation();
                  setEditing(true);
                }
              }}
            >
              {plantName}
            </CardTitle>
          ) : (
            <EditableName
              plant={plant}
              updatePlant={updatePlant}
              setEditing={setEditing}
              plantName={plantName}
              setPlantName={setPlantName}
            />
          )}
          <div className="flex gap-1 shrink-0">
            <Badge variant={plant.wateringMode === 'automatic' ? 'default' : plant.wateringMode === 'scheduled' ? 'warning' : 'muted'}>
              {plant.wateringMode === 'automatic' ? 'Auto' : plant.wateringMode === 'scheduled' ? 'Scheduled' : 'Manual'}
            </Badge>
            {plant.isOn && <Badge variant="success">Watering</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <MoistureLevel plant={plant} updatePlant={updatePlant} allowEditing={allowEditing} />
      </CardContent>
    </Card>
  );
};
