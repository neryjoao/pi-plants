import { Cpu, Hand, Droplets } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { postWateringMode } from '../actions/setWateringMode';
import { postWatering } from '../actions/setWatering';
import type { PlantState } from '@pi-plants/shared';
import type { UpdatePlantFn } from '../types';

interface Props {
  plant: PlantState;
  updatePlant: UpdatePlantFn;
}

export const WateringMode = ({ plant, updatePlant }: Props) => {
  const { isAutomatic, isOn, plantIndex } = plant;

  const onToggleWateringMode = async (setAutomatic: boolean) => {
    if (isAutomatic !== setAutomatic) {
      const updated = await postWateringMode(setAutomatic, plantIndex);
      if (updated) updatePlant(updated);
    }
  };

  const onToggleWatering = async (setIsOn: boolean) => {
    if (!isAutomatic && isOn !== setIsOn) {
      const updated = await postWatering(setIsOn, plantIndex);
      if (updated) updatePlant(updated);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Watering Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">Mode</p>
          <div className="flex gap-2">
            <Button
              variant={isAutomatic ? 'default' : 'outline'}
              size="sm"
              onClick={() => onToggleWateringMode(true)}
            >
              <Cpu className="h-3.5 w-3.5 mr-1.5" />
              Automatic
            </Button>
            <Button
              variant={!isAutomatic ? 'default' : 'outline'}
              size="sm"
              onClick={() => onToggleWateringMode(false)}
            >
              <Hand className="h-3.5 w-3.5 mr-1.5" />
              Manual
            </Button>
          </div>
        </div>

        {!isAutomatic && (
          <div>
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">
              Water pump
            </p>
            <div className="flex gap-2">
              <Button variant={isOn ? 'default' : 'outline'} size="sm" onClick={() => onToggleWatering(true)}>
                <Droplets className="h-3.5 w-3.5 mr-1.5" />
                On
              </Button>
              <Button
                variant={!isOn ? 'default' : 'outline'}
                size="sm"
                onClick={() => onToggleWatering(false)}
              >
                Off
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
