import { Router, Request, Response } from 'express';
import { dataService } from '../data/mockData.js';

const router = Router();

router.get('/pending', (_req: Request, res: Response) => {
  const tasks = dataService.getTasks('completed').filter(
    (t) => t.approvalLevel1 === 'pending' || t.approvalLevel2 === 'pending'
  );
  res.json(tasks);
});

router.post('/:taskId/approve', (req: Request, res: Response) => {
  const { level, comment, userId, userName } = req.body;
  const task = dataService.getTaskById(req.params.taskId);
  if (!task) {
    return res.status(404).json({ error: '任务不存在' });
  }
  const record = dataService.addApprovalRecord({
    taskId: req.params.taskId,
    userId: userId || 'u002',
    userName: userName || '李审核',
    level: level || 1,
    status: 'approved',
    comment: comment || '',
  });
  res.json(record);
});

router.post('/:taskId/reject', (req: Request, res: Response) => {
  const { level, comment, userId, userName } = req.body;
  const task = dataService.getTaskById(req.params.taskId);
  if (!task) {
    return res.status(404).json({ error: '任务不存在' });
  }
  const record = dataService.addApprovalRecord({
    taskId: req.params.taskId,
    userId: userId || 'u002',
    userName: userName || '李审核',
    level: level || 1,
    status: 'rejected',
    comment: comment || '',
  });
  res.json(record);
});

export default router;
