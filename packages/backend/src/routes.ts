import { Application, Request, Response, NextFunction } from 'express';
import {
  queryReadings,
  updatePlantName,
  updatePlantWateringMode,
  updatePlantThreshold,
  updatePlantIsOn,
  saveSchedule,
  getSchedule,
} from './database';
import { PlantSystem } from './components/PlantSystem';
import type { ScheduleEntry, WateringMode } from '@pi-plants/shared';

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

  app.get('/moisture', (req: Request, res: Response) => {
    const index = Number(req.query.index);
    res.json({ moisture: plantSystem.getMoistureLevel(index) });
  });

  app.get('/history/:plantIndex', (req: Request, res: Response) => {
    const plantIndex = Number(req.params.plantIndex);
    const to = (req.query.to as string) ?? new Date().toISOString();
    const from = (req.query.from as string) ?? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    res.json(queryReadings(plantIndex, from, to));
  });

  app.get('/schedule/:plantIndex', (req: Request, res: Response) => {
    const plantIndex = Number(req.params.plantIndex);
    res.json(getSchedule(plantIndex));
  });

  app.post('/name', (req: Request, res: Response) => {
    const { value, plantIndex } = req.body as { value: string; plantIndex: number };
    plantSystem.setName(plantIndex, value);
    updatePlantName(plantIndex, value);
    res.json(plantSystem.getPot(plantIndex));
  });

  app.post('/setWateringMode', (req: Request, res: Response) => {
    const { plantIndex, mode } = req.body as { plantIndex: number; mode: WateringMode };
    plantSystem.setWateringMode(plantIndex, mode);
    updatePlantWateringMode(plantIndex, mode);
    res.json(plantSystem.getPot(plantIndex));
  });

  app.post('/toggleWater', (req: Request, res: Response) => {
    const { plantIndex } = req.body as { plantIndex: number };
    plantSystem.toggleWater(plantIndex);
    updatePlantIsOn(plantIndex, plantSystem.getPot(plantIndex).isOn);
    res.json(plantSystem.getPot(plantIndex));
  });

  app.post('/updateThreshold', (req: Request, res: Response) => {
    const { value, plantIndex } = req.body as { value: number; plantIndex: number };
    plantSystem.setWaterThreshold(plantIndex, value);
    updatePlantThreshold(plantIndex, value);
    res.json(plantSystem.getPot(plantIndex));
  });

  app.post('/schedule', (req: Request, res: Response) => {
    const { plantIndex, entries } = req.body as { plantIndex: number; entries: ScheduleEntry[] };
    saveSchedule(plantIndex, entries);
    plantSystem.setSchedule(plantIndex, entries);
    res.json(plantSystem.getPot(plantIndex));
  });
};