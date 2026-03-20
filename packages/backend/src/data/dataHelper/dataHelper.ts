import fs from 'fs';
import path from 'path';
import set from 'lodash/set';
import moment from 'moment';
import type { PlantConfig, SensorReading } from '@pi-plants/shared';
import type { Pot } from '../../components/Pot';

const PLANT_DETAILS_PATH = path.join(__dirname, '../plantsDetails.json');
const DATA_READS_PATH = path.join(__dirname, '../dataReads.json');

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
  const { name, isAutomatic, waterThreshold, plantIndex, moistureSensor, pump } = pot;
  const { isOn } = pump;
  const { moistureLevel } = moistureSensor;
  const date = moment().add(2, 'hours').format('DD-MM-YYYY HH:mm');

  const storedData: SensorReading[][] = JSON.parse(
    fs.readFileSync(DATA_READS_PATH, 'utf-8')
  );

  const isFiveMinuteInterval = moment().minutes() % 5 === 0;

  if (isFiveMinuteInterval) {
    if (!storedData[plantIndex].find((record) => record.date === date)) {
      storedData[plantIndex].push({ name, isAutomatic, waterThreshold, moistureLevel, isOn, date });
    }
    fs.writeFileSync(DATA_READS_PATH, JSON.stringify(storedData));
  }
};