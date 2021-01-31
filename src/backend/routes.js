const _get = require(`lodash/get`);
const {updateStoredData} = require('./data/dataHelper/updateStoredData')

module.exports.init = (app, plantSystem) => {
    const cors = require('cors');
    const bodyParser = require('body-parser');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extend: true }));
    app.use(cors());

    app.get('/ping', (req, res) => {
        res.send('pong');
    });

    app.get('/plantsDetails', (req, res) => {
        const plantDetails = plantSystem.getPlantsDetails();
        res.json(plantDetails);
        console.log(`Returned ${plantDetails}`)
    })

    app.get('/name', (req, res) => {
        const index = _get(req, `query.index`);
        const name = plantSystem.getName(index);
        res.json({name});
    })

    app.post('/name', (req, res) => {
        const { key, value, plantIndex } = _get(req, `body`);
        plantSystem.setName(plantIndex, value);
        updateStoredData(key, value, plantIndex);
        res.json({newName: value});
    })

    app.get('/moisture', (req, res) => {
        const index = _get(req, `query.index`);
        const moistureLevel = plantSystem.getMoistureLevel(index);

        res.json({moisture: moistureLevel})
    });

    app.post('/toggleWateringMode', (req, res) => {
        const { key, value, plantIndex } = _get(req, `body`);
        plantSystem.toggleWateringMode(plantIndex);
        updateStoredData(key, value, plantIndex);
        res.json({isAutomatic: value})
    });

    app.post('/toggleWater', (req, res) => {
        const { key, value, plantIndex } = _get(req, `body`);
        plantSystem.toggleWater(plantIndex);
        updateStoredData(key, value, plantIndex);
        res.json({isOn: value})
    });

    app.post('/updateThreshold', (req, res) => {
        const { key, value, plantIndex } = _get(req, `body`)
        plantSystem.setWaterThreshold(plantIndex, value);
        updateStoredData(key, value, plantIndex);
        res.json({newThreshold: value});
    })
}
