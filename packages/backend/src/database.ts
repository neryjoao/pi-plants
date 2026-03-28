import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import type { PlantReading, ScheduleEntry, WateringMode } from '@pi-plants/shared';

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
    plant_index   INTEGER PRIMARY KEY,
    name          TEXT    NOT NULL,
    is_automatic  INTEGER NOT NULL,
    threshold     REAL    NOT NULL,
    is_on         INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS environment_readings (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    temperature REAL NOT NULL,
    humidity    REAL NOT NULL,
    recorded_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_env_time ON environment_readings (recorded_at);

  CREATE TABLE IF NOT EXISTS plant_schedules (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    plant_index INTEGER NOT NULL,
    time        TEXT    NOT NULL,
    duration    INTEGER NOT NULL,
    days        TEXT    NOT NULL
  );
`);

// Migrate: add watering_mode column if it doesn't exist yet
try {
  db.exec(`ALTER TABLE plant_settings ADD COLUMN watering_mode TEXT`);
  // Back-fill from is_automatic
  db.exec(`UPDATE plant_settings SET watering_mode = CASE WHEN is_automatic = 1 THEN 'automatic' ELSE 'manual' END WHERE watering_mode IS NULL`);
} catch {
  // Column already exists — no-op
}

// ─── Readings ────────────────────────────────────────────────────────────────

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

// ─── Plant settings ───────────────────────────────────────────────────────────

interface PlantSettingRow {
  plant_index: number;
  name: string;
  is_automatic: number;
  watering_mode: string | null;
  threshold: number;
  is_on: number;
}

export interface PlantSetting {
  plantIndex: number;
  name: string;
  wateringMode: WateringMode;
  threshold: number;
  isOn: boolean;
}

const stmtInitSetting = db.prepare(`
  INSERT OR IGNORE INTO plant_settings (plant_index, name, is_automatic, watering_mode, threshold, is_on)
  VALUES (@plant_index, @name, @is_automatic, @watering_mode, @threshold, @is_on)
`);

const stmtGetSettings = db.prepare(`SELECT * FROM plant_settings ORDER BY plant_index`);

const stmtUpdateName          = db.prepare(`UPDATE plant_settings SET name = ? WHERE plant_index = ?`);
const stmtUpdateWateringMode  = db.prepare(`UPDATE plant_settings SET watering_mode = ?, is_automatic = ? WHERE plant_index = ?`);
const stmtUpdateThreshold     = db.prepare(`UPDATE plant_settings SET threshold = ? WHERE plant_index = ?`);
const stmtUpdateIsOn          = db.prepare(`UPDATE plant_settings SET is_on = ? WHERE plant_index = ?`);

const rowToWateringMode = (row: PlantSettingRow): WateringMode => {
  if (row.watering_mode === 'automatic' || row.watering_mode === 'manual' || row.watering_mode === 'scheduled') {
    return row.watering_mode;
  }
  return row.is_automatic ? 'automatic' : 'manual';
};

export const initPlantSetting = (data: PlantSetting): void => {
  stmtInitSetting.run({
    plant_index: data.plantIndex,
    name: data.name,
    is_automatic: data.wateringMode === 'automatic' ? 1 : 0,
    watering_mode: data.wateringMode,
    threshold: data.threshold,
    is_on: data.isOn ? 1 : 0,
  });
};

export const getPlantSettings = (): PlantSetting[] =>
  (stmtGetSettings.all() as PlantSettingRow[]).map(row => ({
    plantIndex: row.plant_index,
    name: row.name,
    wateringMode: rowToWateringMode(row),
    threshold: row.threshold,
    isOn: Boolean(row.is_on),
  }));

export const updatePlantName         = (plantIndex: number, name: string): void => { stmtUpdateName.run(name, plantIndex); };
export const updatePlantWateringMode = (plantIndex: number, mode: WateringMode): void => {
  stmtUpdateWateringMode.run(mode, mode === 'automatic' ? 1 : 0, plantIndex);
};
export const updatePlantThreshold    = (plantIndex: number, threshold: number): void => { stmtUpdateThreshold.run(threshold, plantIndex); };
export const updatePlantIsOn         = (plantIndex: number, isOn: boolean): void => { stmtUpdateIsOn.run(isOn ? 1 : 0, plantIndex); };

// ─── Environment readings ─────────────────────────────────────────────────────

const stmtInsertEnv = db.prepare(`
  INSERT INTO environment_readings (temperature, humidity, recorded_at)
  VALUES (?, ?, ?)
`);

const stmtQueryEnv = db.prepare(`
  SELECT * FROM environment_readings
  WHERE recorded_at BETWEEN ? AND ?
  ORDER BY recorded_at
`);

const stmtPruneEnv = db.prepare(
  `DELETE FROM environment_readings WHERE recorded_at < datetime('now', '-30 days')`
);

export const insertEnvironmentReading = (temperature: number, humidity: number): void => {
  stmtInsertEnv.run(temperature, humidity, new Date().toISOString());
};

export const queryEnvironmentReadings = (from: string, to: string) =>
  stmtQueryEnv.all(from, to) as { id: number; temperature: number; humidity: number; recorded_at: string }[];

export const pruneOldEnvironmentReadings = (): void => {
  stmtPruneEnv.run();
};

// ─── Schedules ────────────────────────────────────────────────────────────────

interface ScheduleRow {
  id: number;
  plant_index: number;
  time: string;
  duration: number;
  days: string;
}

const stmtDeleteSchedule  = db.prepare(`DELETE FROM plant_schedules WHERE plant_index = ?`);
const stmtInsertSchedule  = db.prepare(`INSERT INTO plant_schedules (plant_index, time, duration, days) VALUES (?, ?, ?, ?)`);
const stmtGetSchedule     = db.prepare(`SELECT * FROM plant_schedules WHERE plant_index = ? ORDER BY time`);

export const saveSchedule = (plantIndex: number, entries: ScheduleEntry[]): void => {
  const tx = db.transaction(() => {
    stmtDeleteSchedule.run(plantIndex);
    for (const e of entries) {
      stmtInsertSchedule.run(plantIndex, e.time, e.duration, JSON.stringify(e.days));
    }
  });
  tx();
};

export const getSchedule = (plantIndex: number): ScheduleEntry[] =>
  (stmtGetSchedule.all(plantIndex) as ScheduleRow[]).map(row => ({
    id: row.id,
    time: row.time,
    duration: row.duration,
    days: JSON.parse(row.days) as number[],
  }));