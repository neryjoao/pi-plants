import { Application, Request, Response, NextFunction } from 'express';
import { updatePlantsDetails } from './data/dataHelper/dataHelper';
import { PlantSystem } from './components/PlantSystem';

export const init = (app: Application, plantSystem: PlantSystem): void => {

  app.get('/ping', (_req: Request, res: Response) => {
    res.send('pong');
  });

  const sseMiddleware = (_req: Request, res: Response, next: NextFunction): void => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  };

  app.get('/plantsDetails', sseMiddleware, (_req: Request, res: Response) => {
    setInterval(() => {
      res.write(`data: ${JSON.stringify(plantSystem.getPlantsDetails())}\n\n`);
    }, 2000);
  });

  app.get('/name', (req: Request, res: Response) => {
    const index = Number(req.query.index);
    res.json({ name: plantSystem.getName(index) });
  });

  app.post('/name', (req: Request, res: Response) => {
    const { key, value, plantIndex } = req.body as { key: string; value: string; plantIndex: number };
    plantSystem.setName(plantIndex, value);
    updatePlantsDetails(key, value, plantIndex);
    res.json({ newName: value });
  });

  app.get('/moisture', (req: Request, res: Response) => {
    const index = Number(req.query.index);
    res.json({ moisture: plantSystem.getMoistureLevel(index) });
  });

  app.post('/toggleWateringMode', (req: Request, res: Response) => {
    const { key, value, plantIndex } = req.body as { key: string; value: boolean; plantIndex: number };
    plantSystem.toggleWateringMode(plantIndex);
    updatePlantsDetails(key, value, plantIndex);
    res.json({ isAutomatic: value });
  });

  app.post('/toggleWater', (req: Request, res: Response) => {
    const { key, value, plantIndex } = req.body as { key: string; value: boolean; plantIndex: number };
    plantSystem.toggleWater(plantIndex);
    updatePlantsDetails(key, value, plantIndex);
    res.json({ isOn: value });
  });

  app.post('/updateThreshold', (req: Request, res: Response) => {
    const { key, value, plantIndex } = req.body as { key: string; value: number; plantIndex: number };
    plantSystem.setWaterThreshold(plantIndex, value);
    updatePlantsDetails(key, value, plantIndex);
    res.json({ newThreshold: value });
  });
};
