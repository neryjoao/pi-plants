const Pump = require('./Pump');
const MoistureSensor = require('./MoistureSensor');

module.exports = class Pot {
    constructor({five, pumpPin, moisterPin, frequency, moisterLevel, waterThreshold, isAutomatic}) {
        this.pump = new Pump(five, pumpPin);
        this.moistureSensor = new MoistureSensor(five, moisterPin, frequency, moisterLevel, waterThreshold);

        this.isAutomatic = isAutomatic;
        this.waterThreshold = waterThreshold;
        this.moistureRead();
    }

    moistureRead() {
        this.moistureSensor.on('data', () => {
            this.moistureSensor.moistureLevel = this.moistureSensor.value;
            console.log(`Moisture level: ${this.moistureSensor.moistureLevel}`);
            console.log(`Watering mode: ${this.getWateringMode()}`);

            if (this.isAutomatic) {
               this.waterPlants();
            }
        });
    };

    waterPlants() {
        console.log(`waterThreshold: ${this.waterThreshold}`);
        if ((this.moistureSensor.moistureLevel > this.waterThreshold && !this.pump.isOn) ||
            (this.moistureSensor.moistureLevel <= this.waterThreshold && this.pump.isOn)) {
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
