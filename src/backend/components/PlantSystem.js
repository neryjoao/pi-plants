module.exports = class PlantSystem {
    constructor(pots) {
        this.pots = pots;
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
