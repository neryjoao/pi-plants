import { EventEmitter } from 'events';
import { ArduinoBoard } from './ArduinoBoard';
import { moistureLevelToPercentage } from '../helper';

export class MoistureSensor extends EventEmitter {
  moistureLevel: number = 0;

  constructor(board: ArduinoBoard, pin: string, frequency: number) {
    super();
    const pinIndex = parseInt(pin.slice(1)); // "A0" -> 0
    board.setSamplingInterval(frequency);
    board.analogRead(pinIndex, (value: number) => {
      this.moistureLevel = moistureLevelToPercentage(value);
      this.emit('data');
    });
  }

  getMoistureLevel(): number {
    return this.moistureLevel;
  }
}
