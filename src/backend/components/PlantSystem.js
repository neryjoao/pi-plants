module.exports = class PlantSystem {
    constructor(pots) {
        this.pots = pots;
    }

    getPlantsDetails() {
        return this.pots.map(pot => {
            const {name, isAutomatic, waterThreshold} = pot;
            const {moistureLevel} = pot.moistureSensor;
            const {isOn} = pot.pump;

            return {
                name,
                isAutomatic,
                waterThreshold,
                moistureLevel,
                isOn
            }
        })
    }

    getName(potIndex) {
        return this.pots[potIndex].name;
    }

    setName(potIndex, newName) {
        this.pots[potIndex].name = newName;
    }

    toggleWater(potIndex) {
        return this.pots[potIndex].toggleWater();
    }

    toggleWateringMode(potIndex) {
        return this.pots[potIndex].toggleWateringMode();
    }

    getWateringMode(potIndex) {
        return this.pots[potIndex].getWateringMode();
    }

    getMoistureLevel(potIndex) {
        return this.pots[potIndex].getMoistureLevel();
    }

    setWaterThreshold(potIndex, newLevel) {
        this.pots[potIndex].setWaterThreshold(newLevel);
    }
}
