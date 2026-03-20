import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { ArduinoBoard } from './src/components/ArduinoBoard';
import { Pot } from './src/components/Pot';
import { PlantSystem } from './src/components/PlantSystem';
import { getData } from './src/data/dataHelper/dataHelper';
import { init } from './src/routes';

const ARDUINO_PORT = process.env.ARDUINO_PORT ?? '/dev/ttyACM0';
const PORT = Number(process.env.PORT ?? 3001);

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
const board = new ArduinoBoard(ARDUINO_PORT);

board.onReady(() => {
  const plantDetails = getData();

  const pots = plantDetails.map((config, plantIndex) =>
    new Pot(board, { ...config, plantIndex })
  );

  const plantSystem = new PlantSystem(pots);
  init(app, plantSystem);

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
