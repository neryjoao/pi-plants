const fs = require('fs');
const _set = require('lodash/set');

const updateStoredData = (key, value, plantIndex) => {
    const storedData = fs.readFileSync('./src/backend/data/plantsDetails.json');
    const updatedData = JSON.parse(storedData);
    _set(updatedData, `[${plantIndex}].${key}`, value);
    fs.writeFileSync('./src/backend/data/plantsDetails.json', JSON.stringify(updatedData));
}

module.exports = {
    updateStoredData
}
