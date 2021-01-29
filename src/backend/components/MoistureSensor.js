const Sensor = require('johnny-five').Sensor;
const {moistureLevelToPercentage} = require('../helper');

module.exports = class MoisterSensor extends Sensor{
    constructor(five, moisterPin, frequency) {
        super({
            pin: moisterPin,
            freq: frequency
        })
        this.moistureLevel = moistureLevelToPercentage(this.value);
    }

    getMoistureLevel () {
        return moistureLevelToPercentage(this.moistureLevel);
    }
}
