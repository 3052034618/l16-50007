import { Router, Request, Response } from 'express';
import { dataService } from '../data/mockData.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const materials = dataService.getMaterials();
  res.json(materials);
});

router.get('/:id', (req: Request, res: Response) => {
  const material = dataService.getMaterialById(req.params.id);
  if (!material) {
    return res.status(404).json({ error: '材料不存在' });
  }
  res.json(material);
});

router.post('/', (req: Request, res: Response) => {
  const materials = dataService.getMaterials();
  const newMaterial = {
    id: `m${String(materials.length + 1).padStart(3, '0')}`,
    ...req.body,
    porosityDeviationCount: 0,
    isSuspended: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  res.status(201).json(newMaterial);
});

router.put('/:id', (req: Request, res: Response) => {
  const material = dataService.getMaterialById(req.params.id);
  if (!material) {
    return res.status(404).json({ error: '材料不存在' });
  }
  Object.assign(material, req.body);
  material.updatedAt = new Date().toISOString();
  res.json(material);
});

router.post('/:id/suspend', (req: Request, res: Response) => {
  const material = dataService.suspendMaterial(req.params.id);
  if (!material) {
    return res.status(404).json({ error: '材料不存在' });
  }
  res.json(material);
});

router.post('/:id/resume', (req: Request, res: Response) => {
  const material = dataService.resumeMaterial(req.params.id);
  if (!material) {
    return res.status(404).json({ error: '材料不存在' });
  }
  res.json(material);
});

export default router;
