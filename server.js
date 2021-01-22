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
        isAutomatic: false,
        name: `My first Plant`
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
