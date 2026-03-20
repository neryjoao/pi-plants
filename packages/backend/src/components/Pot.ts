import { Pump } from './Pump';
import { MoistureSensor } from './MoistureSensor';
import { storeDataRead } from '../data/dataHelper/dataHelper';
import { ArduinoBoard } from './ArduinoBoard';
import type { PlantConfig } from '@pi-plants/shared';

export class Pot {
  pump: Pump;
  moistureSensor: MoistureSensor;
  name: string;
  isAutomatic: boolean;
  waterThreshold: number;
  plantIndex: number;

  constructor(board: ArduinoBoard, config: PlantConfig & { plantIndex: number }) {
    const { name, pumpPin, moisterPin, frequency, waterThreshold, isAutomatic, plantIndex } = config;

    this.pump = new Pump(board, pumpPin);
    this.name = name;
    this.isAutomatic = isAutomatic;
    this.waterThreshold = waterThreshold;
    this.plantIndex = plantIndex;

    this.moistureSensor = new MoistureSensor(board, moisterPin, frequency, () => {
      console.log(`Moisture Level [${this.name}]: ${this.moistureSensor.moistureLevel}`);
      storeDataRead(this);
      if (this.isAutomatic) {
        this.waterPlants();
      }
    });
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

  toggleWater(): void {
    this.pump.toggle();
  }

  toggleWateringMode(): void {
    this.isAutomatic = !this.isAutomatic;
  }

  getMoistureLevel(): number {
    return this.moistureSensor.getMoistureLevel();
  }

  setWaterThreshold(newLevel: number): void {
    this.waterThreshold = newLevel;
  }
}