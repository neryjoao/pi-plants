const Pot = require('./src/backend/components/Pot');
const PlantSystem = require('./src/backend/components/PlantSystem');

const express = require('express');
const five = require('johnny-five');
const app = express();

const board = new five.Board();

const createPlantSystem = () => {
    const pot1Details = {
        five,
        pumpPin: 5,
        moisterPin: 'A0',
        frequency: 2000,
        waterThreshold: 400,
        isAutomatic: false
    }
    const pot1 = new Pot(pot1Details)
    const plantSystem = new PlantSystem([pot1]);

    require(`./src/backend/routes`).init(app, plantSystem);
}

board.on('ready', () => {
    createPlantSystem();

    app.listen(3001, () => {
        console.log(`Listening on port 3001`);
    });
})




// const _get = require('lodash/get');
//     let isOn = false;
//     let relay;
//     let isAutomatic;
//     let moistureSensor;
//     let moistureLevel;
//     let waterThreshold = 400;
//
//     const getWateringMode = () => {
//     return isAutomatic ? 'Automatic' : 'Manual';
// }

// const moistureRead = () => {
//     moistureSensor.on('data', () => {
//         moistureLevel = moistureSensor.value;
//         console.log(`Moisture level: ${moistureSensor.value}`);
//         console.log(`Watering mode: ${getWateringMode()}`);
//
//         if (isAutomatic) {
//             waterPlants();
//         }
//     })
// };
//
// const waterPlants = () => {
//     console.log(`waterThreshold: ${waterThreshold}`);
//     if ((moistureLevel > waterThreshold && !isOn) || (moistureLevel <= waterThreshold && isOn)) {
//         toggleWater()
//     }
// }
