const fs = require('fs');
const _set = require('lodash/set');

const PLANT_DETAILS_PATH = './src/backend/data/plantsDetails.json';
const DATA_READS_PATH = './src/backend/data/dataReads.json';

const updatePlantsDetails = (key, value, plantIndex) => {
    const updatedData = getData(PLANT_DETAILS_PATH);
    _set(updatedData, `[${plantIndex}].${key}`, value);
    fs.writeFileSync(PLANT_DETAILS_PATH, JSON.stringify(updatedData));
};

const getData = (path= PLANT_DETAILS_PATH) => {
    const storedData = fs.readFileSync(path);
    return JSON.parse(storedData);
};

const storeDataRead = (pot) => {
    const {name, isAutomatic, waterThreshold, plantIndex, moistureSensor} = pot || {};
    const {moistureLevel} = moistureSensor || {};
    const date = new Date();

    const storedData = getData(DATA_READS_PATH);
    storedData[plantIndex].push({
        name,
        isAutomatic,
        waterThreshold,
        moistureLevel,
        date
    });
    fs.writeFileSync(DATA_READS_PATH, JSON.stringify(storedData));
};


module.exports = {
    updatePlantsDetails,
    getData,
    storeDataRead
}
