import { Router, Request, Response } from 'express';
import { dataService } from '../data/mockData.js';
import { taskStateMachine } from '../services/taskStateMachine.js';
import { generateId } from '../data/mockData.js';

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

  if (level === 2 && task.approvalLevel1 === 'approved') {
    setTimeout(() => {
      taskStateMachine.pushToSlicing(req.params.taskId);
    }, 500);

    const notification = {
      id: `n${generateId().slice(0, 8)}`,
      type: 'approval' as const,
      title: '审批完成',
      message: `任务「${task.name}」已通过两级审批，已进入切片推送流程`,
      recipientRole: 'engineer' as const,
      recipientUserId: null,
      relatedTaskId: req.params.taskId,
      relatedMaterialId: null,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    dataService.addNotificationRecord(notification);
  }

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

  task.slicingStatus = 'not_applicable';

  const notification = {
    id: `n${generateId().slice(0, 8)}`,
    type: 'approval' as const,
    title: '审批驳回',
    message: `任务「${task.name}」在${level === 1 ? '第一级' : '第二级'}审批中被驳回：${comment || '未填写原因'}`,
    recipientRole: 'engineer' as const,
    recipientUserId: task.createdBy,
    relatedTaskId: req.params.taskId,
    relatedMaterialId: null,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  dataService.addNotificationRecord(notification);

  res.json(record);
});

export default router;
