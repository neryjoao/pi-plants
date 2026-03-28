import { ArduinoBoard } from './ArduinoBoard';

export class TemperatureHumiditySensor {
  temperature: number = 0;
  humidity: number = 0;

  constructor(
    board: ArduinoBoard,
    pin: number,
    type: 0 | 1 | 2,
    onData: () => void,
  ) {
    board.setupDHTSensor(pin, type, (humidity, temperature) => {
      this.humidity = humidity;
      this.temperature = temperature;
      onData();
    });
  }
}