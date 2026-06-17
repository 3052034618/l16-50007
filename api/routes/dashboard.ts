import { Router, Request, Response } from 'express';
import { dataService } from '../data/mockData.js';

const router = Router();

router.get('/stats', (_req: Request, res: Response) => {
  const stats = dataService.getDashboardStats();
  res.json(stats);
});

router.get('/recent-tasks', (_req: Request, res: Response) => {
  const tasks = dataService.getTasks().slice(0, 5);
  res.json(tasks);
});

export default router;
