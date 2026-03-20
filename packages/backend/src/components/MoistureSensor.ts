import { ArduinoBoard } from './ArduinoBoard';
import { moistureLevelToPercentage } from '../helper';

export class MoistureSensor {
  moistureLevel: number = 0;

  constructor(board: ArduinoBoard, pin: string, frequency: number, onData: () => void) {
    const pinIndex = parseInt(pin.slice(1)); // "A0" -> 0
    board.setSamplingInterval(frequency);
    board.analogRead(pinIndex, (value: number) => {
      this.moistureLevel = moistureLevelToPercentage(value);
      onData();
    });
  }

  getMoistureLevel(): number {
    return this.moistureLevel;
  }
}
