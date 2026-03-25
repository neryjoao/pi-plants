import fs from 'fs';
import path from 'path';
import type { PlantConfig } from '@pi-plants/shared';
import type { Pot } from '../../components/Pot';
import { insertReading, initPlantSetting, getPlantSettings } from '../../database';

const PLANT_DETAILS_PATH = path.join(__dirname, '../plantsDetails.json');

export const getData = (): PlantConfig[] => {
  const hardwareConfigs = JSON.parse(fs.readFileSync(PLANT_DETAILS_PATH, 'utf-8')) as PlantConfig[];

  hardwareConfigs.forEach((config, plantIndex) => {
    initPlantSetting({
      plantIndex,
      name: config.name,
      isAutomatic: config.isAutomatic,
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
      isAutomatic: setting.isAutomatic,
      waterThreshold: setting.threshold,
      isOn: setting.isOn,
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
    isAutomatic: pot.isAutomatic,
    threshold: pot.waterThreshold,
  });
};