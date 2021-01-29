const dryLevel = 650,
    wetLevel = 340;

const extractPotDetails = (pot, plantIndex) => {
    const {name, isAutomatic, waterThreshold} = pot;
    const {moistureLevel} = pot.moistureSensor;
    const {isOn} = pot.pump;

    return {
        name,
        isAutomatic,
        waterThreshold,
        moistureLevel,
        isOn,
        plantIndex
    }
};

const moistureLevelToPercentage = (value) => {
    return Math.round(100 - (value-wetLevel)/(dryLevel-wetLevel)*100);
}

const percentageToMoistureLevel = (percentage) => {
    return Math.round((100-percentage) / 100 * (dryLevel - wetLevel) + wetLevel);
}

module.exports = {
    extractPotDetails,
    moistureLevelToPercentage,
    percentageToMoistureLevel
}
