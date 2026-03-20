import Database from 'better-sqlite3';
import path from 'path';
import type { PlantReading } from '@pi-plants/shared';

const DB_PATH = path.join(__dirname, '../data/readings.db');

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
