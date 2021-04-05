const _get = require(`lodash/get`);
const {updatePlantsDetails} = require('./data/dataHelper/dataHelper')

module.exports.init = (app, plantSystem) => {
    const cors = require('cors');
    const bodyParser = require('body-parser');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extend: true }));
    app.use(cors());

    app.get('/ping', (req, res) => {
        res.send('pong');
    });

    const useServerSentEventsMiddleware = (req, res, next) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        next();
    }

    app.get('/plantsDetails', useServerSentEventsMiddleware, (req, res) => {
        setInterval(() => {
            const data = plantSystem.getPlantsDetails();
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        }, 2000)
    })

    app.get('/name', (req, res) => {
        const index = _get(req, `query.index`);
        const name = plantSystem.getName(index);
        res.json({name});
    })

    app.post('/name', (req, res) => {
        const { key, value, plantIndex } = _get(req, `body`);
        plantSystem.setName(plantIndex, value);
        updatePlantsDetails(key, value, plantIndex);
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
        updatePlantsDetails(key, value, plantIndex);
        res.json({isAutomatic: value})
    });

    app.post('/toggleWater', (req, res) => {
        const { key, value, plantIndex } = _get(req, `body`);
        plantSystem.toggleWater(plantIndex);
        updatePlantsDetails(key, value, plantIndex);
        res.json({isOn: value})
    });

    app.post('/updateThreshold', (req, res) => {
        const { key, value, plantIndex } = _get(req, `body`)
        plantSystem.setWaterThreshold(plantIndex, value);
        updatePlantsDetails(key, value, plantIndex);
        res.json({newThreshold: value});
    })
}
