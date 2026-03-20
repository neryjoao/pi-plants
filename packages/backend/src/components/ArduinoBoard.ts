import Firmata from 'firmata';

export class ArduinoBoard {
  private board: Firmata;

  constructor(port: string) {
    this.board = new Firmata(port);
  }

  onReady(callback: () => void): void {
    this.board.on('ready', callback);
  }

  setupRelay(pin: number): void {
    this.board.pinMode(pin, this.board.MODES.OUTPUT);
    this.board.digitalWrite(pin, 0);
  }

  setRelay(pin: number, on: boolean): void {
    this.board.digitalWrite(pin, on ? 1 : 0);
  }

  setSamplingInterval(ms: number): void {
    this.board.setSamplingInterval(ms);
  }

  analogRead(pinIndex: number, callback: (value: number) => void): void {
    this.board.pinMode(pinIndex, this.board.MODES.ANALOG);
    this.board.analogRead(pinIndex, callback);
  }
}