import { Pump } from './Pump';
import { MoistureSensor } from './MoistureSensor';
import { storeDataRead } from '../data/dataHelper/dataHelper';
import { ArduinoBoard } from './ArduinoBoard';
import type { PlantConfig, ScheduleEntry, WateringMode } from '@pi-plants/shared';

export class Pot {
  pump: Pump;
  moistureSensor: MoistureSensor;
  name: string;
  wateringMode: WateringMode;
  waterThreshold: number;
  plantIndex: number;
  schedule: ScheduleEntry[] = [];

  private scheduleInitTimer: ReturnType<typeof setTimeout> | undefined;
  private scheduleTimer: ReturnType<typeof setInterval> | undefined;
  private lastExecutedKey: Map<string, string> = new Map();

  constructor(board: ArduinoBoard, config: PlantConfig & { plantIndex: number; schedule?: ScheduleEntry[] }) {
    const { name, pumpPin, moisterPin, frequency, waterThreshold, wateringMode, plantIndex } = config;

    this.pump = new Pump(board, pumpPin);
    this.name = name;
    this.wateringMode = wateringMode;
    this.waterThreshold = waterThreshold;
    this.plantIndex = plantIndex;
    this.schedule = config.schedule ?? [];

    this.moistureSensor = new MoistureSensor(board, moisterPin, frequency, () => {
      console.log(`Moisture Level [${this.name}]: ${this.moistureSensor.moistureLevel}`);
      storeDataRead(this);
      if (this.wateringMode === 'automatic') {
        this.waterPlants();
      }
    });

    if (this.wateringMode === 'scheduled') {
      this.activateSchedule();
    }
  }

  private waterPlants(): void {
    const { moistureLevel } = this.moistureSensor;
    if (
      (moistureLevel > this.waterThreshold && this.pump.isOn) ||
      (moistureLevel <= this.waterThreshold && !this.pump.isOn)
    ) {
      this.pump.toggle();
    }
  }

  private activateSchedule(): void {
    this.checkScheduleEntries();
    const msToNextMinute = 60000 - (Date.now() % 60000);
    this.scheduleInitTimer = setTimeout(() => {
      this.scheduleInitTimer = undefined;
      this.checkScheduleEntries();
      this.scheduleTimer = setInterval(() => this.checkScheduleEntries(), 60000);
    }, msToNextMinute);
  }

  private deactivateSchedule(): void {
    if (this.scheduleInitTimer !== undefined) {
      clearTimeout(this.scheduleInitTimer);
      this.scheduleInitTimer = undefined;
    }
    if (this.scheduleTimer !== undefined) {
      clearInterval(this.scheduleTimer);
      this.scheduleTimer = undefined;
    }
    if (this.pump.isOn) {
      this.pump.close();
    }
  }

  private checkScheduleEntries(): void {
    if (this.wateringMode !== 'scheduled') return;
    const now = new Date();
    const currentDay = now.getDay();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hh}:${mm}`;
    const dateKey = `${now.toDateString()} ${currentTime}`;

    for (const entry of this.schedule) {
      if (entry.time !== currentTime) continue;
      const appliesToday = entry.days.length === 0 || entry.days.includes(currentDay);
      if (!appliesToday) continue;

      const entryKey = `${this.plantIndex}-${entry.time}-${entry.days.join(',')}`;
      if (this.lastExecutedKey.get(entryKey) === dateKey) continue;

      this.lastExecutedKey.set(entryKey, dateKey);
      console.log(`Scheduled watering [${this.name}]: ON for ${entry.duration}s`);
      this.pump.open();
      setTimeout(() => {
        if (this.wateringMode === 'scheduled') {
          this.pump.close();
          console.log(`Scheduled watering [${this.name}]: OFF`);
        }
      }, entry.duration * 1000);
    }
  }

  toggleWater(): void {
    this.pump.toggle();
  }

  setWateringMode(mode: WateringMode): void {
    const prev = this.wateringMode;
    this.wateringMode = mode;

    if (prev === 'scheduled' && mode !== 'scheduled') {
      this.deactivateSchedule();
    } else if (prev !== 'scheduled' && mode === 'scheduled') {
      this.activateSchedule();
    }
  }

  setSchedule(entries: ScheduleEntry[]): void {
    this.schedule = entries;
    if (this.wateringMode === 'scheduled') {
      this.deactivateSchedule();
      this.activateSchedule();
    }
  }

  getMoistureLevel(): number {
    return this.moistureSensor.getMoistureLevel();
  }

  setWaterThreshold(newLevel: number): void {
    this.waterThreshold = newLevel;
  }
}