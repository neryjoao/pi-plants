const express = require('express');
const five = require('johnny-five');
const app = express();
const _get = require('lodash/get');

const cors = require('cors');
const bodyParser = require('body-parser');

const board = new five.Board();
let isReady = false;
let isOn = false;
let relay;
let moistureSensor;
let moistureLevel;
let isAutomatic;
let waterThreshold = 400;

app.listen(3001, () => {
    console.log(`Listening on port 3001`)
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: true }));
app.use(cors());

app.get("/ping", (req, res) => {
    res.send('pong');
});

app.get("/toggleWater", (req, res) => {
    toggleWater();
    res.json({status: isOn})
});

app.get("/moisture", (req, res) => {
    res.json({moisture: moistureLevel})
});

app.get("/toggleWateringMode", (req, res) => {
    isAutomatic = !isAutomatic;
    console.log(isAutomatic)

    res.json({wateringMode: getWateringMode()})
});

app.post('/updateThreshold', (req, res) => {
    const newLevel = _get(req, `query.waterThreshold`);

    if (newLevel) {
        waterThreshold = newLevel;
        res.json({waterThreshold: newLevel});
    } else {
        res.json({error: `Threshold not updated`})
    }
})

const getWateringMode = () => {
    return isAutomatic ? 'Automatic' : 'Manual';
}

board.on('ready', () => {
    relay = new five.Relay(5);
    moistureSensor = new five.Sensor({
        pin: 'A0',
        freq: 2000
    });
    relay.close();
    isAutomatic = true;
    moistureRead();
    isReady = true;
});

const toggleWater = () => {
    if (isOn) {
        relay.close();
        isOn = false;
    } else {
        relay.open();
        isOn = true;
    }
};

const moistureRead = () => {
    moistureSensor.on('data', () => {
        moistureLevel = moistureSensor.value;
        console.log(`Moisture level: ${moistureSensor.value}`);
        console.log(`Watering mode: ${getWateringMode()}`);

        if (isAutomatic) {
            waterPlants();
        }
    })
};

const waterPlants = () => {
    console.log(`waterThreshold: ${waterThreshold}`);
    if ((moistureLevel > waterThreshold && !isOn) || (moistureLevel <= waterThreshold && isOn)) {
        toggleWater()
    }
}
