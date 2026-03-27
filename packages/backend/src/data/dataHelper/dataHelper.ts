import fs from 'fs';
import path from 'path';
import type { PlantConfig, WateringMode } from '@pi-plants/shared';
import type { Pot } from '../../components/Pot';
import { insertReading, initPlantSetting, getPlantSettings, getSchedule } from '../../database';

const PLANT_DETAILS_PATH = path.join(__dirname, '../plantsDetails.json');

export const getData = (): PlantConfig[] => {
  // Support both old (isAutomatic) and new (wateringMode) JSON format
  const raw = JSON.parse(fs.readFileSync(PLANT_DETAILS_PATH, 'utf-8')) as Array<Record<string, unknown>>;
  const hardwareConfigs: PlantConfig[] = raw.map(c => ({
    ...(c as Omit<PlantConfig, 'wateringMode'>),
    wateringMode: (c.wateringMode as WateringMode | undefined) ?? (c.isAutomatic ? 'automatic' : 'manual'),
  }));

  hardwareConfigs.forEach((config, plantIndex) => {
    initPlantSetting({
      plantIndex,
      name: config.name,
      wateringMode: config.wateringMode,
      threshold: config.waterThreshold,
      isOn: config.isOn,
    });
  });

  const settingsMap = new Map(getPlantSettings().map(s => [s.plantIndex, s]));

  return hardwareConfigs.map((config, plantIndex) => {
    const setting = settingsMap.get(plantIndex);
    if (!setting) return config;
    return {
      ...config,
      name: setting.name,
      wateringMode: setting.wateringMode,
      waterThreshold: setting.threshold,
      isOn: setting.isOn,
      schedule: getSchedule(plantIndex),
    };
  });
};

export const storeDataRead = (pot: Pot): void => {
  if (new Date().getMinutes() % 5 !== 0) return;

  insertReading({
    plantIndex: pot.plantIndex,
    name: pot.name,
    moisture: pot.moistureSensor.moistureLevel,
    isOn: pot.pump.isOn,
    isAutomatic: pot.wateringMode === 'automatic',
    threshold: pot.waterThreshold,
  });
};