export interface PlantConfig {
  pumpPin: number;
  moisterPin: string;
  frequency: number;
  waterThreshold: number;
  isAutomatic: boolean;
  name: string;
  isOn: boolean;
}

export interface PlantState {
  name: string;
  isAutomatic: boolean;
  waterThreshold: number;
  moistureLevel: number;
  isOn: boolean;
  plantIndex: number;
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
