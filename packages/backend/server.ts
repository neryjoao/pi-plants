import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { ArduinoBoard } from './src/components/ArduinoBoard';
import { Pot } from './src/components/Pot';
import { PlantSystem } from './src/components/PlantSystem';
import { TemperatureHumiditySensor } from './src/components/TemperatureHumiditySensor';
import { getData } from './src/data/dataHelper/dataHelper';
import { pruneOldReadings, pruneOldEnvironmentReadings, insertEnvironmentReading } from './src/database';
import { init } from './src/routes';

const ARDUINO_PORT = process.env.ARDUINO_PORT;
if (!ARDUINO_PORT) throw new Error('ARDUINO_PORT environment variable is required');
const PORT = Number(process.env.PORT ?? 3001);

// DHT sensor config — A8 on Arduino Mega = digital pin 62
// Set DHT_PIN in .env to override. Set DHT_TYPE to 0 (DHT11), 1 (DHT21), or 2 (DHT22).
const DHT_PIN  = Number(process.env.DHT_PIN ?? 62);
const DHT_TYPE = Number(process.env.DHT_TYPE ?? 0) as 0 | 1 | 2;

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

pruneOldReadings();
pruneOldEnvironmentReadings();
setInterval(() => { pruneOldReadings(); pruneOldEnvironmentReadings(); }, 24 * 60 * 60 * 1000);

const board = new ArduinoBoard(ARDUINO_PORT);

board.onReady(() => {
  const plantDetails = getData();

  const pots = plantDetails.map((config, plantIndex) =>
    new Pot(board, { ...config, plantIndex })
  );

  const plantSystem = new PlantSystem(pots);

  // Requires ConfigurableFirmata with DHT sub-module on the Arduino.
  // See: https://github.com/firmata/ConfigurableFirmata
  const envSensor = new TemperatureHumiditySensor(board, DHT_PIN, DHT_TYPE, () => {
    console.log(`Environment: ${envSensor.temperature.toFixed(1)}°C, ${envSensor.humidity.toFixed(1)}% RH`);
    // Store every 5 minutes (same cadence as plant readings)
    if (new Date().getMinutes() % 5 === 0) {
      insertEnvironmentReading(envSensor.temperature, envSensor.humidity);
    }
  });

  init(app, plantSystem, envSensor);

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});