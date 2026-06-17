import { Router, Request, Response } from 'express';
import { dataService } from '../data/mockData.js';

const router = Router();

router.get('/porosity', (req: Request, res: Response) => {
  const materialId = req.query.materialId as string | undefined;
  const trends = dataService.getPorosityTrends(materialId);
  res.json(trends);
});

router.post('/suspend', (req: Request, res: Response) => {
  const { materialId } = req.body;
  const material = dataService.suspendMaterial(materialId);
  if (!material) {
    return res.status(404).json({ error: '材料不存在' });
  }
  res.json(material);
});

router.post('/resume', (req: Request, res: Response) => {
  const { materialId } = req.body;
  const material = dataService.resumeMaterial(materialId);
  if (!material) {
    return res.status(404).json({ error: '材料不存在' });
  }
  res.json(material);
});

export default router;
