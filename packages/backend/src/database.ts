import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import type { PlantReading } from '@pi-plants/shared';

const DB_PATH = path.join(__dirname, '../data/readings.db');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS readings (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    plant_index  INTEGER NOT NULL,
    name         TEXT    NOT NULL,
    moisture     REAL    NOT NULL,
    is_on        INTEGER NOT NULL,
    is_automatic INTEGER NOT NULL,
    threshold    REAL    NOT NULL,
    recorded_at  TEXT    NOT NULL
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_reading
    ON readings (plant_index, strftime('%Y-%m-%dT%H:%M', recorded_at));

  CREATE INDEX IF NOT EXISTS idx_readings_plant_time
    ON readings (plant_index, recorded_at);

  CREATE TABLE IF NOT EXISTS plant_settings (
    plant_index  INTEGER PRIMARY KEY,
    name         TEXT    NOT NULL,
    is_automatic INTEGER NOT NULL,
    threshold    REAL    NOT NULL,
    is_on        INTEGER NOT NULL
  );
`);

interface ReadingRow {
  id: number;
  plant_index: number;
  name: string;
  moisture: number;
  is_on: number;
  is_automatic: number;
  threshold: number;
  recorded_at: string;
}

const toPlantReading = (row: ReadingRow): PlantReading => ({
  id: row.id,
  plantIndex: row.plant_index,
  name: row.name,
  moisture: row.moisture,
  isOn: Boolean(row.is_on),
  isAutomatic: Boolean(row.is_automatic),
  threshold: row.threshold,
  recordedAt: row.recorded_at,
});

const stmtInsert = db.prepare(`
  INSERT OR IGNORE INTO readings
    (plant_index, name, moisture, is_on, is_automatic, threshold, recorded_at)
  VALUES
    (@plant_index, @name, @moisture, @is_on, @is_automatic, @threshold, @recorded_at)
`);

const stmtQuery = db.prepare(`
  SELECT * FROM readings
  WHERE plant_index = ? AND recorded_at BETWEEN ? AND ?
  ORDER BY recorded_at
`);

const stmtPrune = db.prepare(
  `DELETE FROM readings WHERE recorded_at < datetime('now', '-30 days')`
);

export const insertReading = (data: {
  plantIndex: number;
  name: string;
  moisture: number;
  isOn: boolean;
  isAutomatic: boolean;
  threshold: number;
}): void => {
  stmtInsert.run({
    plant_index: data.plantIndex,
    name: data.name,
    moisture: data.moisture,
    is_on: data.isOn ? 1 : 0,
    is_automatic: data.isAutomatic ? 1 : 0,
    threshold: data.threshold,
    recorded_at: new Date().toISOString(),
  });
};

export const queryReadings = (plantIndex: number, from: string, to: string): PlantReading[] =>
  (stmtQuery.all(plantIndex, from, to) as ReadingRow[]).map(toPlantReading);

export const pruneOldReadings = (): void => {
  stmtPrune.run();
};

interface PlantSettingRow {
  plant_index: number;
  name: string;
  is_automatic: number;
  threshold: number;
  is_on: number;
}

export interface PlantSetting {
  plantIndex: number;
  name: string;
  isAutomatic: boolean;
  threshold: number;
  isOn: boolean;
}

const stmtInitSetting = db.prepare(`
  INSERT OR IGNORE INTO plant_settings (plant_index, name, is_automatic, threshold, is_on)
  VALUES (@plant_index, @name, @is_automatic, @threshold, @is_on)
`);

const stmtGetSettings = db.prepare(`SELECT * FROM plant_settings ORDER BY plant_index`);

const stmtUpdateName     = db.prepare(`UPDATE plant_settings SET name = ? WHERE plant_index = ?`);
const stmtUpdateAutomatic = db.prepare(`UPDATE plant_settings SET is_automatic = ? WHERE plant_index = ?`);
const stmtUpdateThreshold = db.prepare(`UPDATE plant_settings SET threshold = ? WHERE plant_index = ?`);
const stmtUpdateIsOn      = db.prepare(`UPDATE plant_settings SET is_on = ? WHERE plant_index = ?`);

export const initPlantSetting = (data: PlantSetting): void => {
  stmtInitSetting.run({
    plant_index: data.plantIndex,
    name: data.name,
    is_automatic: data.isAutomatic ? 1 : 0,
    threshold: data.threshold,
    is_on: data.isOn ? 1 : 0,
  });
};

export const getPlantSettings = (): PlantSetting[] =>
  (stmtGetSettings.all() as PlantSettingRow[]).map(row => ({
    plantIndex: row.plant_index,
    name: row.name,
    isAutomatic: Boolean(row.is_automatic),
    threshold: row.threshold,
    isOn: Boolean(row.is_on),
  }));

export const updatePlantName      = (plantIndex: number, name: string): void => { stmtUpdateName.run(name, plantIndex); };
export const updatePlantAutomatic = (plantIndex: number, isAutomatic: boolean): void => { stmtUpdateAutomatic.run(isAutomatic ? 1 : 0, plantIndex); };
export const updatePlantThreshold = (plantIndex: number, threshold: number): void => { stmtUpdateThreshold.run(threshold, plantIndex); };
export const updatePlantIsOn      = (plantIndex: number, isOn: boolean): void => { stmtUpdateIsOn.run(isOn ? 1 : 0, plantIndex); };
