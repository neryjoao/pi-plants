import { ArduinoBoard } from './ArduinoBoard';

export class Pump {
  isOn: boolean = false;
  private pin: number;
  private board: ArduinoBoard;

  constructor(board: ArduinoBoard, pin: number) {
    this.board = board;
    this.pin = pin;
    this.board.setupRelay(pin);
  }

  open(): void {
    this.board.setRelay(this.pin, true);
    this.isOn = true;
  }

  close(): void {
    this.board.setRelay(this.pin, false);
    this.isOn = false;
  }

  toggle(): boolean {
    if (this.isOn) {
      this.close();
    } else {
      this.open();
    }
    return this.isOn;
  }
}