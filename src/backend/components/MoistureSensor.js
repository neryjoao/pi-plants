const Sensor = require('johnny-five').Sensor;

module.exports = class MoisterSensor extends Sensor{
    constructor(five, moisterPin, frequency, waterThreshold) {
        super({
            pin: moisterPin,
            freq: frequency
        })
        this.waterThreshold = waterThreshold;
        this.moisterRead();
        this.moistureLevel = this.value;
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

    // get waterThreshold () {
    //     return this.waterThreshold;
    // }
    //
    // set waterThreshold (newWaterThreshold) {
    //     this.waterThreshold = newWaterThreshold;
    // }
}
