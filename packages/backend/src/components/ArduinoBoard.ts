import Firmata from 'firmata';

export class ArduinoBoard {
  private board: Firmata;

  constructor(port: string) {
    this.board = new Firmata(port, { serialport: { baudRate: 115200 } });
  }

  onReady(callback: () => void): void {
    const timeout = setTimeout(() => {
      console.error(`[ArduinoBoard] No response from board on port after 10s. Check that the correct port is set in .env and the Arduino is running ConfigurableFirmata.`);
      process.exit(1);
    }, 10_000);

    this.board.on('ready', () => {
      clearTimeout(timeout);
      callback();
    });

    this.board.on('error', (err: Error) => {
      clearTimeout(timeout);
      console.error('[ArduinoBoard] Connection error:', err.message);
      process.exit(1);
    });
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

  /**
   * Set up a DHT temperature/humidity sensor using the ConfigurableFirmata DHT sub-module.
   * Requires ConfigurableFirmata (with DHT feature enabled) to be loaded on the Arduino.
   *
   * @param pin  - Digital pin number (A8 on Mega = 62)
   * @param type - 0 = DHT11, 1 = DHT21, 2 = DHT22
   */
  setupDHTSensor(pin: number, type: 0 | 1 | 2, callback: (humidity: number, temperature: number) => void): void {
    const DHT_DATA = 0x74;

    (this.board as any).sysexResponse(DHT_DATA, (data: number[]) => {
      console.log('[DHT] raw sysex data:', data, '| expecting pin:', pin);
      if (data[0] !== pin) return;
      const humidity    = this.decodeFirmataFloat(data.slice(2, 7));
      const temperature = this.decodeFirmataFloat(data.slice(7, 12));
      console.log('[DHT] decoded — humidity:', humidity, 'temperature:', temperature);
      if (isFinite(humidity) && isFinite(temperature)) {
        callback(humidity, temperature);
      }
    });

    // Attach the sensor — ConfigurableFirmata will begin sending readings
    (this.board as any).sysexCommand([DHT_DATA, pin, type]);
  }

  private decodeFirmataFloat(bytes: number[]): number {
    // Firmata encodes a 32-bit IEEE 754 float across 5 × 7-bit bytes
    const uint32 =
      bytes[0] |
      (bytes[1] << 7) |
      (bytes[2] << 14) |
      (bytes[3] << 21) |
      ((bytes[4] & 0x0f) << 28);
    const buf = Buffer.allocUnsafe(4);
    buf.writeUInt32LE(uint32 >>> 0, 0);
    return buf.readFloatLE(0);
  }
}