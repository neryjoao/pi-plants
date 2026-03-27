export type WateringMode = 'automatic' | 'manual' | 'scheduled';

export interface ScheduleEntry {
  id?: number;
  time: string;     // "HH:MM" 24h format
  duration: number; // seconds
  days: number[];   // 0–6 (0 = Sun); empty = every day
}

export interface PlantConfig {
  pumpPin: number;
  moisterPin: string;
  frequency: number;
  waterThreshold: number;
  wateringMode: WateringMode;
  name: string;
  isOn: boolean;
}

export interface PlantState {
  name: string;
  wateringMode: WateringMode;
  waterThreshold: number;
  moistureLevel: number;
  isOn: boolean;
  plantIndex: number;
  schedule: ScheduleEntry[];
}

export interface PlantReading {
  id: number;
  plantIndex: number;
  name: string;
  moisture: number;
  isOn: boolean;
  isAutomatic: boolean;
  threshold: number;
  recordedAt: string; // ISO 8601
}
