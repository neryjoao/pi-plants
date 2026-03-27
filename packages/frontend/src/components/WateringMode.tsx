import { useState } from 'react';
import { Cpu, Hand, Droplets, CalendarClock, Pencil } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ScheduleConfig } from './ScheduleConfig';
import { postWateringMode } from '../actions/setWateringMode';
import { postSchedule } from '../actions/setSchedule';
import { postWatering } from '../actions/setWatering';
import type { PlantState, ScheduleEntry, WateringMode as WateringModeType } from '@pi-plants/shared';
import type { UpdatePlantFn } from '../types';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Props {
  plant: PlantState;
  updatePlant: UpdatePlantFn;
}

export const WateringMode = ({ plant, updatePlant }: Props) => {
  const { wateringMode, isOn, plantIndex, schedule } = plant;
  const [editingSchedule, setEditingSchedule] = useState(false);

  const onSetMode = async (mode: WateringModeType) => {
    if (wateringMode === mode) return;
    if (mode === 'scheduled') {
      setEditingSchedule(true);
      return;
    }
    const updated = await postWateringMode(plantIndex, mode);
    if (updated) updatePlant(updated);
  };

  const onSaveSchedule = async (entries: ScheduleEntry[]) => {
    const saved = await postSchedule(plantIndex, entries);
    if (!saved) return;
    const activated = await postWateringMode(plantIndex, 'scheduled');
    if (activated) {
      // Merge in the saved schedule since postWateringMode response may not include it yet
      updatePlant({ ...activated, schedule: entries });
    }
    setEditingSchedule(false);
  };

  const onCancelSchedule = () => {
    setEditingSchedule(false);
  };

  const onToggleWatering = async (setIsOn: boolean) => {
    if (wateringMode === 'manual' && isOn !== setIsOn) {
      const updated = await postWatering(plantIndex);
      if (updated) updatePlant(updated);
    }
  };

  const formatScheduleSummary = (entries: ScheduleEntry[]): string => {
    if (entries.length === 0) return 'No times set';
    const times = entries.map(e => e.time).join(', ');
    const days = entries[0]?.days ?? [];
    const dayStr = days.length === 0 ? 'every day' : days.map(d => DAY_LABELS[d]).join(', ');
    return `${times} — ${dayStr}`;
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Watering Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode selector */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">Mode</p>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={wateringMode === 'automatic' ? 'default' : 'outline'}
              size="sm"
              onClick={() => void onSetMode('automatic')}
            >
              <Cpu className="h-3.5 w-3.5 mr-1.5" />
              Automatic
            </Button>
            <Button
              variant={wateringMode === 'manual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => void onSetMode('manual')}
            >
              <Hand className="h-3.5 w-3.5 mr-1.5" />
              Manual
            </Button>
            <Button
              variant={wateringMode === 'scheduled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => void onSetMode('scheduled')}
            >
              <CalendarClock className="h-3.5 w-3.5 mr-1.5" />
              Scheduled
            </Button>
          </div>
        </div>

        {/* Manual pump controls */}
        {wateringMode === 'manual' && (
          <div>
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">
              Water pump
            </p>
            <div className="flex gap-2">
              <Button variant={isOn ? 'default' : 'outline'} size="sm" onClick={() => void onToggleWatering(true)}>
                <Droplets className="h-3.5 w-3.5 mr-1.5" />
                On
              </Button>
              <Button variant={!isOn ? 'default' : 'outline'} size="sm" onClick={() => void onToggleWatering(false)}>
                Off
              </Button>
            </div>
          </div>
        )}

        {/* Scheduled mode: summary or editor */}
        {wateringMode === 'scheduled' && !editingSchedule && (
          <div>
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">
              Schedule
            </p>
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-foreground">{formatScheduleSummary(schedule)}</p>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => setEditingSchedule(true)}>
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
            {schedule.length > 0 && (
              <div className="mt-2 space-y-1">
                {schedule.map((e, i) => {
                  const days = e.days.length === 0 ? 'Every day' : e.days.map(d => DAY_LABELS[d]).join(', ');
                  return (
                    <div key={i} className="text-xs text-muted-foreground flex gap-3">
                      <span className="font-mono">{e.time}</span>
                      <span>{e.duration}s</span>
                      <span>{days}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Schedule editor */}
        {editingSchedule && (
          <div>
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">
              Configure schedule
            </p>
            <ScheduleConfig
              schedule={schedule}
              onSave={entries => void onSaveSchedule(entries)}
              onCancel={onCancelSchedule}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};