const Pot = require('./src/backend/components/Pot');
const PlantSystem = require('./src/backend/components/PlantSystem');
const fs = require('fs');

const express = require('express');
const five = require('johnny-five');
const app = express();

const board = new five.Board();

const createPlantSystem = () => {
    const plantDetails = JSON.parse(fs.readFileSync('./src/backend/data/plantsDetails.json'));

    const pots = plantDetails.map(plant => {
        plant.five = five;
        return new Pot(plant);
    });

    const plantSystem = new PlantSystem(pots);

    require(`./src/backend/routes`).init(app, plantSystem);
}

board.on('ready', () => {
    createPlantSystem();

    app.listen(3001, () => {
        console.log(`Listening on port 3001`);
    });
})
