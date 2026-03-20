import { extractPotDetails } from '../helper';
import { Pot } from './Pot';
import type { PlantState } from '@pi-plants/shared';

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

  toggleWateringMode(potIndex: number): void {
    this.pots[potIndex].toggleWateringMode();
  }

  getMoistureLevel(potIndex: number): number {
    return this.pots[potIndex].getMoistureLevel();
  }

  setWaterThreshold(potIndex: number, newLevel: number): void {
    this.pots[potIndex].setWaterThreshold(newLevel);
  }

  getPot(potIndex: number): PlantState {
    return extractPotDetails(this.pots[potIndex], potIndex);
  }
}