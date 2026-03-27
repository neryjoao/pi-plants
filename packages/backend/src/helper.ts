import type { PlantState } from '@pi-plants/shared';
import type { Pot } from './components/Pot';

const dryLevel = 650;
const wetLevel = 340;

export const extractPotDetails = (pot: Pot, plantIndex: number): PlantState => {
  const { name, wateringMode, waterThreshold, schedule } = pot;
  const { moistureLevel } = pot.moistureSensor;
  const { isOn } = pot.pump;

  return { name, wateringMode, waterThreshold, moistureLevel, isOn, plantIndex, schedule };
};

export const moistureLevelToPercentage = (value: number): number => {
  const raw = Math.round(100 - ((value - wetLevel) / (dryLevel - wetLevel)) * 100);
  return Math.min(100, Math.max(0, raw));
};

export const percentageToMoistureLevel = (percentage: number): number => {
  return Math.round(((100 - percentage) / 100) * (dryLevel - wetLevel) + wetLevel);
};