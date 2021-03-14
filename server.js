const Pot = require('./src/backend/components/Pot');
const PlantSystem = require('./src/backend/components/PlantSystem');
const {getData} = require('./src/backend/data/dataHelper/dataHelper')

const express = require('express');
const five = require('johnny-five');
const app = express();

const board = new five.Board();

const createPlantSystem = () => {
    const plantDetails = getData();

    const pots = plantDetails.map((plant, plantIndex) => {
        plant.five = five;
        plant.plantIndex = plantIndex;
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
