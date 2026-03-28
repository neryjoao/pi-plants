import { Thermometer, Droplets } from 'lucide-react';
import type { EnvironmentState } from '@pi-plants/shared';

interface Props {
  env: EnvironmentState;
}

export const EnvironmentSummary = ({ env }: Props) => (
  <div className="flex items-center gap-4 text-sm text-muted-foreground">
    <div className="flex items-center gap-1.5">
      <Thermometer className="h-4 w-4 text-amber-500" />
      <span className="font-medium tabular-nums text-foreground">{env.temperature.toFixed(1)}°C</span>
    </div>
    <div className="flex items-center gap-1.5">
      <Droplets className="h-4 w-4 text-blue-400" />
      <span className="font-medium tabular-nums text-foreground">{env.humidity.toFixed(1)}%</span>
    </div>
  </div>
);