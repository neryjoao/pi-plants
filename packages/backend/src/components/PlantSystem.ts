import { extractPotDetails } from '../helper';
import { Pot } from './Pot';
import type { PlantState, ScheduleEntry, WateringMode } from '@pi-plants/shared';

export class PlantSystem {
  private pots: Pot[];

  constructor(pots: Pot[]) {
    this.pots = pots;
  }

  getPlantsDetails(): PlantState[] {
    return this.pots.map((pot, plantIndex) => extractPotDetails(pot, plantIndex));
  }

  getName(potIndex: number): string {
    return this.pots[potIndex].name;
  }

  setName(potIndex: number, newName: string): void {
    this.pots[potIndex].name = newName;
  }

  toggleWater(potIndex: number): void {
    this.pots[potIndex].toggleWater();
  }

  setWateringMode(potIndex: number, mode: WateringMode): void {
    this.pots[potIndex].setWateringMode(mode);
  }

  getMoistureLevel(potIndex: number): number {
    return this.pots[potIndex].getMoistureLevel();
  }

  setWaterThreshold(potIndex: number, newLevel: number): void {
    this.pots[potIndex].setWaterThreshold(newLevel);
  }

  setSchedule(potIndex: number, entries: ScheduleEntry[]): void {
    this.pots[potIndex].setSchedule(entries);
  }

  getPot(potIndex: number): PlantState {
    return extractPotDetails(this.pots[potIndex], potIndex);
  }
}