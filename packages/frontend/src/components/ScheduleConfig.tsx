import { useState } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { ScheduleEntry } from '@pi-plants/shared';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface TimeEntry {
  time: string;
  duration: number; // seconds
}

interface Props {
  schedule: ScheduleEntry[];
  onSave: (entries: ScheduleEntry[]) => void;
  onCancel: () => void;
}

export const ScheduleConfig = ({ schedule, onSave, onCancel }: Props) => {
  const initialDays = schedule[0]?.days ?? [];
  const [setupType, setSetupType] = useState<'frequency' | 'specific'>(
    schedule.length > 0 ? 'specific' : 'frequency'
  );
  const [allDays, setAllDays] = useState(initialDays.length === 0);
  const [selectedDays, setSelectedDays] = useState<number[]>(
    initialDays.length > 0 ? initialDays : [1, 2, 3, 4, 5]
  );
  const [timesPerDay, setTimesPerDay] = useState(2);
  const [freqDuration, setFreqDuration] = useState(30);
  const [entries, setEntries] = useState<TimeEntry[]>(
    schedule.length > 0
      ? schedule.map(e => ({ time: e.time, duration: e.duration }))
      : [{ time: '08:00', duration: 30 }]
  );

  const effectiveDays = (): number[] => (allDays ? [] : selectedDays);

  const frequencyEntries = (): TimeEntry[] => {
    const intervalMins = Math.floor((24 * 60) / timesPerDay);
    return Array.from({ length: timesPerDay }, (_, i) => {
      const totalMins = i * intervalMins;
      return {
        time: `${String(Math.floor(totalMins / 60)).padStart(2, '0')}:${String(totalMins % 60).padStart(2, '0')}`,
        duration: freqDuration,
      };
    });
  };

  const handleSave = () => {
    const timeEntries = setupType === 'frequency' ? frequencyEntries() : entries;
    const days = effectiveDays();
    onSave(timeEntries.map(e => ({ time: e.time, duration: e.duration, days })));
  };

  const addEntry = () => setEntries(prev => [...prev, { time: '12:00', duration: 30 }]);
  const removeEntry = (i: number) => setEntries(prev => prev.filter((_, idx) => idx !== i));
  const updateEntry = (i: number, field: keyof TimeEntry, value: string | number) =>
    setEntries(prev => prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));

  const toggleDay = (day: number) =>
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort((a, b) => a - b)
    );

  return (
    <div className="space-y-4 pt-1">
      {/* Setup type */}
      <div>
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">Setup type</p>
        <div className="flex gap-2">
          <Button
            variant={setupType === 'frequency' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSetupType('frequency')}
          >
            By frequency
          </Button>
          <Button
            variant={setupType === 'specific' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSetupType('specific')}
          >
            Specific times
          </Button>
        </div>
      </div>

      {/* Frequency mode */}
      {setupType === 'frequency' && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-32">Times per day</span>
            <Input
              type="number"
              value={timesPerDay}
              min={1}
              max={24}
              onChange={e => setTimesPerDay(Math.max(1, Math.min(24, Number(e.target.value))))}
              className="h-7 w-16 text-sm px-2"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-32">Duration (sec)</span>
            <Input
              type="number"
              value={freqDuration}
              min={1}
              onChange={e => setFreqDuration(Math.max(1, Number(e.target.value)))}
              className="h-7 w-16 text-sm px-2"
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Watering times</p>
            <div className="flex flex-wrap gap-1.5">
              {frequencyEntries().map((e, i) => (
                <span key={i} className="text-xs bg-muted px-2 py-1 rounded-md font-mono">
                  {e.time}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Specific times mode */}
      {setupType === 'specific' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground px-5 mb-0.5">
            <span className="w-28">Time</span>
            <span>Duration (sec)</span>
          </div>
          {entries.map((entry, i) => (
            <div key={i} className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <Input
                type="time"
                value={entry.time}
                onChange={e => updateEntry(i, 'time', e.target.value)}
                className="h-7 w-28 text-sm px-2"
              />
              <Input
                type="number"
                value={entry.duration}
                min={1}
                onChange={e => updateEntry(i, 'duration', Math.max(1, Number(e.target.value)))}
                className="h-7 w-16 text-sm px-2"
              />
              {entries.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-400 hover:text-red-600"
                  onClick={() => removeEntry(i)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" className="mt-1" onClick={addEntry}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add time slot
          </Button>
        </div>
      )}

      {/* Day selection */}
      <div>
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">Days</p>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={allDays}
              onChange={e => setAllDays(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Every day</span>
          </label>
          {!allDays && (
            <div className="flex gap-1 flex-wrap">
              {DAY_LABELS.map((label, day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`text-xs px-2 py-1 rounded-md border transition-colors ${
                    selectedDays.includes(day)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button size="sm" onClick={handleSave}>
          Save &amp; enable schedule
        </Button>
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};