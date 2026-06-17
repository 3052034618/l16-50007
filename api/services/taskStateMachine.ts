import { dataService, generateId } from '../data/mockData.js';
import type { SimulationTask, TaskStatus, WarningRecord, NotificationRecord, SlicingRecord } from '../../shared/types.js';

const STATUS_FLOW: TaskStatus[] = ['pending_verify', 'parsing', 'computing', 'analyzing', 'completed'];

const STATUS_DURATIONS: Record<TaskStatus, number> = {
  pending_verify: 0,
  parsing: 2000,
  computing: 3000,
  analyzing: 2000,
  completed: 0,
  failed: 0,
  rollback: 0,
  slicing: 0,
  sliced: 0,
};

const THRESHOLDS = {
  maxTemperature: 3200,
  maxCoolingRate: 50000,
  minCoolingRate: 5000,
};

interface ActiveSimulation {
  interval: any;
  dataInterval: any;
  warnings: WarningRecord[];
}

const activeSimulations = new Map<string, ActiveSimulation>();

const generateTemperatureData = (hasWarning: boolean = false): { temp: number; coolingRate: number }[] => {
  const data: { temp: number; coolingRate: number }[] = [];
  const peakTemp = hasWarning
    ? THRESHOLDS.maxTemperature + 200 + Math.random() * 300
    : 2500 + Math.random() * 500;

  for (let i = 0; i < 100; i++) {
    let temp: number;
    let coolingRate: number;

    if (i < 20) {
      temp = 300 + (peakTemp - 300) * (i / 20) + (Math.random() - 0.5) * 50;
      coolingRate = -((peakTemp - 300) / 20) * 10;
    } else if (i < 60) {
      temp = peakTemp + (Math.random() - 0.5) * 100;
      if (hasWarning && i > 30 && i < 45) {
        temp = THRESHOLDS.maxTemperature + 100 + Math.random() * 200;
      }
      coolingRate = (Math.random() - 0.5) * 500;
    } else {
      const progress = (i - 60) / 40;
      temp = peakTemp * Math.exp(-progress * 3) + 300;
      coolingRate = (peakTemp * 3 * Math.exp(-progress * 3) / 40) * 10;
    }

    data.push({
      temp: Math.round(temp * 10) / 10,
      coolingRate: Math.round(coolingRate * 10) / 10,
    });
  }

  return data;
};

export const taskStateMachine = {
  async startVerification(taskId: string): Promise<SimulationTask | null> {
    const task = dataService.getTaskById(taskId);
    if (!task) return null;

    const validation = dataService.validateTaskData(task);

    if (!validation.valid) {
      dataService.updateTaskStatus(taskId, 'rollback');
      return dataService.getTaskById(taskId);
    }

    dataService.updateTaskStatus(taskId, 'parsing');
    this.processNextState(taskId);
    return dataService.getTaskById(taskId);
  },

  processNextState(taskId: string): void {
    const task = dataService.getTaskById(taskId);
    if (!task) return;

    const currentIndex = STATUS_FLOW.indexOf(task.status);

    if (currentIndex === -1 || currentIndex >= STATUS_FLOW.length - 1) {
      return;
    }

    const nextStatus = STATUS_FLOW[currentIndex + 1];
    const duration = STATUS_DURATIONS[task.status];

    if (duration > 0) {
      const interval = setTimeout(() => {
        dataService.updateTaskStatus(taskId, nextStatus);

        if (nextStatus === 'computing') {
          this.startComputation(taskId);
        } else if (nextStatus === 'analyzing') {
          this.startAnalysis(taskId);
        } else if (nextStatus === 'completed') {
          this.completeTask(taskId);
        } else {
          this.processNextState(taskId);
        }
      }, duration);

      this.updateProgress(taskId, task.status);

      if (activeSimulations.has(taskId)) {
        const existing = activeSimulations.get(taskId)!;
        clearTimeout(existing.interval);
        clearInterval(existing.dataInterval);
      }

      activeSimulations.set(taskId, {
        interval,
        dataInterval: null as any,
        warnings: activeSimulations.get(taskId)?.warnings || [],
      });
    } else {
      dataService.updateTaskStatus(taskId, nextStatus);
      this.processNextState(taskId);
    }
  },

  updateProgress(taskId: string, status: TaskStatus): void {
    const progressMap: Record<TaskStatus, { start: number; end: number }> = {
      pending_verify: { start: 0, end: 10 },
      parsing: { start: 10, end: 30 },
      computing: { start: 30, end: 70 },
      analyzing: { start: 70, end: 95 },
      completed: { start: 95, end: 100 },
      failed: { start: 0, end: 0 },
      rollback: { start: 0, end: 0 },
      slicing: { start: 0, end: 0 },
      sliced: { start: 0, end: 0 },
    };

    const range = progressMap[status];
    const task = dataService.getTaskById(taskId);
    if (!task) return;

    let progress = range.start;
    const step = (range.end - range.start) / 20;

    const dataInterval = setInterval(() => {
      progress += step;
      if (progress >= range.end) {
        clearInterval(dataInterval);
        progress = range.end;
      }

      const currentTask = dataService.getTaskById(taskId);
      if (currentTask) {
        currentTask.progress = Math.round(progress);
      }
    }, STATUS_DURATIONS[status] / 20);

    const existing = activeSimulations.get(taskId);
    if (existing) {
      existing.dataInterval = dataInterval;
    }
  },

  startComputation(taskId: string): void {
    const task = dataService.getTaskById(taskId);
    if (!task) return;

    const hasWarning = Math.random() > 0.4;
    const tempData = generateTemperatureData(hasWarning);

    let dataIndex = 0;
    let temperatureWarningTriggered = false;
    let coolingRateWarningTriggered = false;

    const dataInterval = setInterval(() => {
      if (dataIndex >= tempData.length) {
        clearInterval(dataInterval);
        this.processNextState(taskId);
        return;
      }

      const data = tempData[dataIndex];

      dataService.addTemperatureDataPoint(taskId, {
        id: `${taskId}-temp-${dataIndex}`,
        taskId,
        time: dataIndex * 5,
        temperature: data.temp,
        coolingRate: data.coolingRate,
      });

      dataIndex++;

      if (!temperatureWarningTriggered && data.temp > THRESHOLDS.maxTemperature) {
        temperatureWarningTriggered = true;
        this.triggerWarning(taskId, 'temperature', data.temp, THRESHOLDS.maxTemperature);
      }

      const absCoolingRate = Math.abs(data.coolingRate);
      if (!coolingRateWarningTriggered && absCoolingRate > THRESHOLDS.maxCoolingRate) {
        coolingRateWarningTriggered = true;
        this.triggerWarning(taskId, 'cooling_rate', absCoolingRate, THRESHOLDS.maxCoolingRate);
      }
      if (!coolingRateWarningTriggered && absCoolingRate < THRESHOLDS.minCoolingRate && dataIndex > 30) {
        coolingRateWarningTriggered = true;
        this.triggerWarning(taskId, 'cooling_rate', absCoolingRate, THRESHOLDS.minCoolingRate);
      }

      const currentTask = dataService.getTaskById(taskId);
      if (currentTask && (currentTask.maxPoolTemp === null || data.temp > currentTask.maxPoolTemp)) {
        currentTask.maxPoolTemp = data.temp;
      }
    }, 50);

    const existing = activeSimulations.get(taskId);
    if (existing) {
      existing.dataInterval = dataInterval;
    }
  },

  triggerWarning(taskId: string, type: 'temperature' | 'cooling_rate', value: number, threshold: number): WarningRecord {
    const task = dataService.getTaskById(taskId);
    if (!task) return null as any;

    let message: string;
    if (type === 'temperature') {
      message = `熔池温度 ${value.toFixed(0)}K 超过安全阈值 ${threshold}K`;
    } else {
      const absValue = Math.abs(value);
      if (absValue > threshold) {
        message = `冷却速率 ${absValue.toFixed(0)}K/s 超过最大安全阈值 ${threshold}K/s`;
      } else {
        message = `冷却速率 ${absValue.toFixed(0)}K/s 低于最小安全阈值 ${threshold}K/s`;
      }
    }

    const warning: WarningRecord = {
      id: `w${generateId().slice(0, 8)}`,
      taskId,
      type,
      message,
      value,
      threshold,
      status: 'pending_review',
      reviewedBy: null,
      reviewComment: null,
      reviewedAt: null,
      parameterAdjustment: null,
      createdAt: new Date().toISOString(),
    };

    dataService.addWarningRecord(warning);

    task.warningCount += 1;

    const notification: NotificationRecord = {
      id: `n${generateId().slice(0, 8)}`,
      type: 'warning',
      title: '安全阈值预警',
      message: `任务「${task.name}」${warning.message}，请工程师复核`,
      recipientRole: 'engineer',
      recipientUserId: null,
      relatedTaskId: taskId,
      relatedMaterialId: null,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    dataService.addNotificationRecord(notification);

    const existing = activeSimulations.get(taskId);
    if (existing) {
      existing.warnings.push(warning);
    }

    return warning;
  },

  startAnalysis(taskId: string): void {
    setTimeout(() => {
      this.processNextState(taskId);
    }, STATUS_DURATIONS.analyzing);
  },

  completeTask(taskId: string): void {
    const task = dataService.getTaskById(taskId);
    if (!task) return;

    const tempData = dataService.getTemperatureData(taskId);

    if (tempData.length > 0) {
      const temps = tempData.map(d => d.temperature);
      const coolingRates = tempData.map(d => Math.abs(d.coolingRate));

      task.maxPoolTemp = Math.max(...temps);
      task.coolingRate = coolingRates[Math.floor(coolingRates.length / 2)];

      const material = dataService.getMaterialById(task.materialId);
      const basePorosity = material ? 0.5 : 1.0;
      task.porosity = Math.round((basePorosity + Math.random() * 1.5) * 100) / 100;
      task.residualStress = Math.round((150 + Math.random() * 300) * 10) / 10;

      const historyPorosities = dataService.getTasks('completed')
        .filter(t => t.materialId === task.materialId && t.porosity !== null)
        .map(t => t.porosity!);

      if (historyPorosities.length >= 3) {
        const avgPorosity = historyPorosities.reduce((a, b) => a + b, 0) / historyPorosities.length;
        const deviation = Math.abs(((task.porosity - avgPorosity) / avgPorosity) * 100);

        if (deviation > 20) {
          const material = dataService.getMaterialById(task.materialId);
          if (material) {
            material.porosityDeviationCount += 1;

            if (material.porosityDeviationCount >= 3) {
              dataService.suspendMaterial(material.id);

              const notification: NotificationRecord = {
                id: `n${generateId().slice(0, 8)}`,
                type: 'quality',
                title: '材料质量告警',
                message: `材料「${material.name}」连续${material.porosityDeviationCount}次孔隙率偏差超过20%，已自动暂停新任务`,
                recipientRole: 'scientist',
                recipientUserId: null,
                relatedTaskId: taskId,
                relatedMaterialId: material.id,
                isRead: false,
                createdAt: new Date().toISOString(),
              };
              dataService.addNotificationRecord(notification);
            }
          }
        } else {
          const material = dataService.getMaterialById(task.materialId);
          if (material) {
            material.porosityDeviationCount = 0;
          }
        }
      }
    }

    task.slicingStatus = 'pending';

    dataService.updateTaskStatus(taskId, 'completed');
  },

  async restartTask(taskId: string): Promise<SimulationTask | null> {
    const task = dataService.getTaskById(taskId);
    if (!task) return null;

    const existing = activeSimulations.get(taskId);
    if (existing) {
      clearTimeout(existing.interval);
      clearInterval(existing.dataInterval);
      activeSimulations.delete(taskId);
    }

    dataService.clearTemperatureData(taskId);
    dataService.clearWarningRecords(taskId);

    task.status = 'pending_verify';
    task.progress = 0;
    task.porosity = null;
    task.coolingRate = null;
    task.maxPoolTemp = null;
    task.residualStress = null;
    task.warningCount = 0;
    task.approvalLevel1 = 'pending';
    task.approvalLevel2 = 'pending';
    task.slicingStatus = 'not_applicable';
    task.gcodeFile = null;
    task.restartCount = (task.restartCount || 0) + 1;
    task.updatedAt = new Date().toISOString();

    return this.startVerification(taskId);
  },

  reviewWarning(warningId: string, approved: boolean, comment: string, adjustPower: number, adjustSpeed: number): WarningRecord | null {
    const warning = dataService.getWarningById(warningId);
    if (!warning) return null;

    warning.status = approved ? 'review_approved' : 'review_rejected';
    warning.reviewedBy = 'u001';
    warning.reviewComment = comment;
    warning.reviewedAt = new Date().toISOString();

    if (approved) {
      warning.parameterAdjustment = {
        laserPowerAdjustment: adjustPower,
        scanSpeedAdjustment: adjustSpeed,
      };

      const task = dataService.getTaskById(warning.taskId);
      if (task) {
        if (task.originalLaserPower === null) {
          task.originalLaserPower = task.laserPower;
        }
        if (task.originalScanSpeed === null) {
          task.originalScanSpeed = task.scanSpeed;
        }
        task.laserPower += adjustPower;
        task.scanSpeed += adjustSpeed;

        const existing = activeSimulations.get(warning.taskId);
        if (existing) {
          clearTimeout(existing.interval);
          clearInterval(existing.dataInterval);
        }

        dataService.clearTemperatureData(warning.taskId);
        task.status = 'parsing';
        task.progress = 0;

        this.processNextState(warning.taskId);
      }
    }

    return warning;
  },

  pushToSlicing(taskId: string): boolean {
    const task = dataService.getTaskById(taskId);
    if (!task) return false;

    if (task.approvalLevel1 !== 'approved' || task.approvalLevel2 !== 'approved') {
      return false;
    }

    task.slicingStatus = 'processing';
    task.status = 'slicing';

    setTimeout(() => {
      task.slicingStatus = 'completed';
      task.status = 'sliced';
      task.gcodeFile = `${task.id}_print.gcode`;
      task.updatedAt = new Date().toISOString();

      const slicingRecord: SlicingRecord = {
        id: `s${generateId().slice(0, 8)}`,
        taskId,
        status: 'completed' as const,
        gcodeFile: task.gcodeFile,
        pushedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      dataService.addSlicingRecord(slicingRecord);
    }, 2000);

    return true;
  },

  getWarningsByTask(taskId: string): WarningRecord[] {
    return dataService.getWarningRecords(taskId);
  },

  getNotifications(role?: string): NotificationRecord[] {
    return dataService.getNotificationRecords(role);
  },
};
