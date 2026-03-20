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

export interface SensorReading {
  name: string;
  isAutomatic: boolean;
  waterThreshold: number;
  moistureLevel: number;
  isOn: boolean;
  date: string;
}
