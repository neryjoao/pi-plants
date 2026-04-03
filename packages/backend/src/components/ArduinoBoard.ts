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
    // ConfigurableFirmata DhtFirmata type codes: 0x01 = DHT11, 0x02 = DHT22
    const typeCode = type === 2 ? 0x02 : 0x01;

    (this.board as any).sysexResponse(DHT_DATA, (data: number[]) => {
      if (data[0] !== 0 || data[1] !== pin) return;
      // Temperature and humidity are signed/unsigned 14-bit integers (2 × 7-bit bytes) × 10
      const tempRaw = data[2] | (data[3] << 7);
      const temperature = (tempRaw > 8191 ? tempRaw - 16384 : tempRaw) / 10;
      const humidity = (data[4] | (data[5] << 7)) / 10;
      if (isFinite(humidity) && isFinite(temperature)) {
        callback(humidity, temperature);
      }
    });

    // DhtFirmata.report() is a no-op — must poll by re-sending the command
    const sendCommand = () => (this.board as any).sysexCommand([DHT_DATA, typeCode, pin]);
    sendCommand();
    setInterval(sendCommand, 2000);
  }
}