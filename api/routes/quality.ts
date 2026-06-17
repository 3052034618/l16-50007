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

router.get('/notifications', (req: Request, res: Response) => {
  const role = req.query.role as string | undefined;
  const notifications = dataService.getNotificationRecords(role);
  res.json(notifications);
});

router.post('/notifications/:id/read', (req: Request, res: Response) => {
  const notification = dataService.markNotificationRead(req.params.id);
  if (!notification) {
    return res.status(404).json({ error: '通知不存在' });
  }
  res.json(notification);
});

router.get('/warnings', (req: Request, res: Response) => {
  const taskId = req.query.taskId as string | undefined;
  const warnings = dataService.getWarningRecords(taskId);
  res.json(warnings);
});

export default router;
