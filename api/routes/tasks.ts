import { Router, Request, Response } from 'express';
import { dataService } from '../data/mockData.js';
import { taskStateMachine } from '../services/taskStateMachine.js';
import { generateReportPDF } from '../services/pdfGenerator.js';
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

router.post('/:id/verify', async (req: Request, res: Response) => {
  const task = await taskStateMachine.startVerification(req.params.id);
  if (!task) {
    return res.status(404).json({ error: '任务不存在' });
  }
  res.json(task);
});

router.post('/:id/restart', async (req: Request, res: Response) => {
  const task = await taskStateMachine.restartTask(req.params.id);
  if (!task) {
    return res.status(404).json({ error: '任务不存在' });
  }
  res.json(task);
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

router.get('/:id/warnings', (req: Request, res: Response) => {
  const task = dataService.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: '任务不存在' });
  }
  const warnings = dataService.getWarningRecords(req.params.id);
  res.json(warnings);
});

router.post('/:id/warnings/:warningId/review', (req: Request, res: Response) => {
  const { approved, comment, adjustPower, adjustSpeed } = req.body;
  const warning = taskStateMachine.reviewWarning(
    req.params.warningId,
    approved,
    comment || '',
    adjustPower || 0,
    adjustSpeed || 0
  );
  if (!warning) {
    return res.status(404).json({ error: '预警记录不存在' });
  }
  res.json(warning);
});

router.get('/:id/report', (req: Request, res: Response) => {
  const task = dataService.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: '任务不存在' });
  }
  const temperatureData = dataService.getTemperatureData(req.params.id);
  const warnings = dataService.getWarningRecords(req.params.id);
  res.json({
    task,
    temperatureData,
    warnings,
    analysis: {
      poolWidth: 120 + Math.random() * 30,
      poolDepth: 50 + Math.random() * 20,
      aspectRatio: 2.4 + Math.random() * 0.5,
      coolingRateAvg: task.coolingRate,
      maxGradient: 5000 + Math.random() * 2000,
    },
  });
});

router.get('/:id/report/download', async (req: Request, res: Response) => {
  const task = dataService.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: '任务不存在' });
  }
  if (task.status !== 'completed') {
    return res.status(400).json({ error: '任务尚未完成，无法下载报告' });
  }
  try {
    const pdfBuffer = await generateReportPDF(req.params.id);
    const fileName = `${task.name.replace(/[^\w\u4e00-\u9fa5]/g, '_')}_报告.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: '报告生成失败' });
  }
});

router.post('/:id/push-to-slicing', (req: Request, res: Response) => {
  const success = taskStateMachine.pushToSlicing(req.params.id);
  if (!success) {
    return res.status(400).json({ error: '推送切片失败，请检查审批状态' });
  }
  const task = dataService.getTaskById(req.params.id);
  res.json({ success: true, task });
});

router.get('/:id/slicing', (req: Request, res: Response) => {
  const task = dataService.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: '任务不存在' });
  }
  const slicingRecord = dataService.getSlicingRecordByTaskId(req.params.id);
  res.json({
    slicingStatus: task.slicingStatus,
    gcodeFile: task.gcodeFile,
    slicingRecord,
  });
});

export default router;
