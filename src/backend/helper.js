module.exports = (pot, plantIndex) => {
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
