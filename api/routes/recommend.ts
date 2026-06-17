import { Router, Request, Response } from 'express';
import { dataService } from '../data/mockData.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const materialId = (req.query.materialId as string) || 'm001';
  const recommendations = dataService.getRecommendations(materialId);
  res.json(recommendations);
});

router.get('/history', (req: Request, res: Response) => {
  const materialId = (req.query.materialId as string) || 'm001';
  const tasks = dataService.getTasks('completed').filter((t) => t.materialId === materialId);
  res.json(tasks);
});

export default router;
