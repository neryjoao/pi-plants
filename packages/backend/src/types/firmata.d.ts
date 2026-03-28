import { EventEmitter } from 'events';

declare class Firmata extends EventEmitter {
  MODES: {
    INPUT: number;
    OUTPUT: number;
    ANALOG: number;
    PWM: number;
    SERVO: number;
  };

  constructor(port: string, callback?: () => void);
  constructor(port: string, options: { serialport?: { baudRate?: number; highWaterMark?: number } }, callback?: () => void);
  pinMode(pin: number, mode: number): void;
  digitalWrite(pin: number, value: number): void;
  analogRead(pin: number, callback: (value: number) => void): void;
  setSamplingInterval(interval: number): void;
}

export = Firmata;