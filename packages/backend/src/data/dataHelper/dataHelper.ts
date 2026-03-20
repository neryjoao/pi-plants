import fs from 'fs';
import path from 'path';
import set from 'lodash/set';
import type { PlantConfig } from '@pi-plants/shared';
import type { Pot } from '../../components/Pot';
import { insertReading } from '../../database';

const PLANT_DETAILS_PATH = path.join(__dirname, '../plantsDetails.json');

export const getData = (filePath: string = PLANT_DETAILS_PATH): PlantConfig[] => {
  const storedData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(storedData);
};

export const updatePlantsDetails = (key: string, value: unknown, plantIndex: number): void => {
  const updatedData = getData();
  set(updatedData, `[${plantIndex}].${key}`, value);
  fs.writeFileSync(PLANT_DETAILS_PATH, JSON.stringify(updatedData));
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
