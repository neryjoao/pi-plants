const Sensor = require('johnny-five').Sensor;

module.exports = class MoisterSensor extends Sensor{
    constructor(five, moisterPin, frequency) {
        super({
            pin: moisterPin,
            freq: frequency
        })
        this.moistureLevel = this.value;
        this.moisterRead();
    }

    moisterRead() {
        this.on('data', () => {
            this.moistureLevel = this.value;
            console.log(`Moisture level: ${this.value}`);
        })
    }

    getMoistureLevel () {
        return this.moistureLevel;
    }
}
