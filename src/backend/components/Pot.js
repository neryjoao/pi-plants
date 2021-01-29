const Pump = require('./Pump');
const MoistureSensor = require('./MoistureSensor');
const {moistureLevelToPercentage} = require('../helper');

module.exports = class Pot {
    constructor({five, name, pumpPin, moisterPin, frequency, moisterLevel, waterThreshold, isAutomatic}) {
        this.pump = new Pump(five, pumpPin);
        this.moistureSensor = new MoistureSensor(five, moisterPin, frequency, moisterLevel);

        this.name = name;
        this.isAutomatic = isAutomatic;
        this.waterThreshold = waterThreshold;

        this.moistureRead();
    }

    moistureRead() {
        this.moistureSensor.on('data', () => {
            this.moistureSensor.moistureLevel = moistureLevelToPercentage(this.moistureSensor.value);
            console.log(`MoistureLevel: ${this.moistureSensor.moistureLevel}`)

            if (this.isAutomatic) {
               this.waterPlants();
            }
        });
    };

    waterPlants() {
        console.log(`waterThreshold: ${this.waterThreshold}`);
        if ((this.moistureSensor.moistureLevel > this.waterThreshold && this.pump.isOn) ||
            (this.moistureSensor.moistureLevel <= this.waterThreshold && !this.pump.isOn)) {
                this.pump.toggleWater();
        }
    }

    getWateringMode() {
        return this.isAutomatic ? 'Automatic' : 'Manual';
    }

    toggleWater() {
        this.pump.toggleWater();
    }

    toggleWateringMode() {
        this.isAutomatic = !this.isAutomatic;
    }

    getMoistureLevel() {
        return this.moistureSensor.getMoistureLevel();
    }

    setWaterThreshold(newLevel) {
        this.waterThreshold = newLevel;
    }
}
