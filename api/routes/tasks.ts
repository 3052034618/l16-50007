import { Router, Request, Response } from 'express';
import { dataService } from '../data/mockData.js';
import type { TaskStatus } from '../../shared/types.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const status = req.query.status as TaskStatus | undefined;
  const tasks = dataService.getTasks(status);
  res.json(tasks);
});

router.get('/:id', (req: Request, res: Response) => {
  const task = dataService.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: '任务不存在' });
  }
  res.json(task);
});

router.post('/', (req: Request, res: Response) => {
  const task = dataService.createTask(req.body);
  res.status(201).json(task);
});

router.put('/:id', (req: Request, res: Response) => {
  const task = dataService.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: '任务不存在' });
  }
  Object.assign(task, req.body);
  task.updatedAt = new Date().toISOString();
  res.json(task);
});

router.post('/:id/verify', (req: Request, res: Response) => {
  const task = dataService.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: '任务不存在' });
  }
  const validation = dataService.validateTaskData(task);
  if (validation.valid) {
    dataService.updateTaskStatus(req.params.id, 'parsing');
  }
  res.json(validation);
});

router.get('/:id/temperature', (req: Request, res: Response) => {
  const task = dataService.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: '任务不存在' });
  }
  const data = dataService.getTemperatureData(req.params.id);
  res.json(data);
});

router.get('/:id/approvals', (req: Request, res: Response) => {
  const task = dataService.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: '任务不存在' });
  }
  const records = dataService.getApprovalRecords(req.params.id);
  res.json(records);
});

router.post('/:id/restart', (req: Request, res: Response) => {
  const task = dataService.updateTaskStatus(req.params.id, 'parsing');
  if (!task) {
    return res.status(404).json({ error: '任务不存在' });
  }
  task.progress = 0;
  task.warningCount = 0;
  res.json(task);
});

router.get('/:id/report', (req: Request, res: Response) => {
  const task = dataService.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: '任务不存在' });
  }
  const temperatureData = dataService.getTemperatureData(req.params.id);
  res.json({
    task,
    temperatureData,
    analysis: {
      poolWidth: 120 + Math.random() * 30,
      poolDepth: 50 + Math.random() * 20,
      aspectRatio: 2.4 + Math.random() * 0.5,
      coolingRateAvg: task.coolingRate,
      maxGradient: 5000 + Math.random() * 2000,
    },
  });
});

export default router;
