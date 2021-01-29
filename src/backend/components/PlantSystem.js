const {extractPotDetails} = require('../helper');

module.exports = class PlantSystem {
    constructor(pots) {
        this.pots = pots;
    }

    getPlantsDetails() {
        return this.pots.map((pot, plantIndex) => {
            return extractPotDetails(pot, plantIndex);
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

    getPot(potIndex) {
        const selectedPot = this.pots[potIndex];
        return extractPotDetails(selectedPot, potIndex);
    }
}
