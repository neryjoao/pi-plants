const _get = require(`lodash/get`);

module.exports.init = (app, plantSystem) => {
    const cors = require('cors');
    const bodyParser = require('body-parser');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extend: true }));
    app.use(cors());

    app.get('/ping', (req, res) => {
        res.send('pong');
    });

    app.get('/toggleWater', (req, res) => {
        const index = _get(req, `query.index`);
        plantSystem.toggleWater(index);
        const isOn = plantSystem.pots[0].pump.isOn
        res.json({status: isOn})
    });

    app.get('/moisture', (req, res) => {
        const index = _get(req, `query.index`);
        const moistureLevel = plantSystem.getMoistureLevel(index);

        res.json({moisture: moistureLevel})
    });

    app.get('/toggleWateringMode', (req, res) => {
        const index = _get(req, `query.index`);
        plantSystem.toggleWateringMode(index);
        const wateringMode = plantSystem.getWateringMode(index);
        res.json({wateringMode})
    });

    app.post('/updateThreshold', (req, res) => {
        const index = _get(req, `query.index`),
            newLevel = _get(req, `query.waterThreshold`);
        if (newLevel) {
            plantSystem.setWaterThreshold(index, newLevel);
            res.json({waterThreshold: plantSystem.pots[index].moistureSensor.waterThreshold})
        } else {
            res.json({error: `Threshold not updated`})
        }
    })
}
