import type {
  SimulationTask,
  PowderMaterial,
  User,
  TemperatureData,
  ApprovalRecord,
  DashboardStats,
  PorosityTrend,
  RecommendedParams,
  TaskStatus,
  WarningRecord,
  SlicingRecord,
  NotificationRecord,
} from '../../shared/types';

const generateId = (): string => Math.random().toString(36).substring(2, 11);

const users: User[] = [
  { id: 'u001', name: '张工', role: 'engineer', email: 'zhang.gong@example.com', avatar: 'ZG' },
  { id: 'u002', name: '李审核', role: 'reviewer', email: 'li.shenhe@example.com', avatar: 'LS' },
  { id: 'u003', name: '王首席', role: 'scientist', email: 'wang.shouxi@example.com', avatar: 'WS' },
  { id: 'u004', name: '系统管理员', role: 'admin', email: 'admin@example.com', avatar: 'AD' },
];

const materials: PowderMaterial[] = [
  {
    id: 'm001',
    name: 'Ti-6Al-4V',
    chemicalComposition: 'Ti-6Al-4V',
    particleSize: '15-45 μm',
    density: 4.43,
    meltingPoint: 1923,
    thermalConductivity: 7.5,
    specificHeat: 560,
    viscosity: 0.0045,
    surfaceTension: 1.55,
    porosityDeviationCount: 0,
    isSuspended: false,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'm002',
    name: '316L不锈钢',
    chemicalComposition: 'Fe-17Cr-12Ni-2.5Mo',
    particleSize: '15-53 μm',
    density: 7.98,
    meltingPoint: 1700,
    thermalConductivity: 16.2,
    specificHeat: 500,
    viscosity: 0.0062,
    surfaceTension: 1.82,
    porosityDeviationCount: 2,
    isSuspended: false,
    createdAt: '2026-01-16T09:00:00Z',
    updatedAt: '2026-06-10T14:30:00Z',
  },
  {
    id: 'm003',
    name: 'AlSi10Mg',
    chemicalComposition: 'Al-10Si-0.5Mg',
    particleSize: '20-63 μm',
    density: 2.68,
    meltingPoint: 868,
    thermalConductivity: 155,
    specificHeat: 960,
    viscosity: 0.0028,
    surfaceTension: 0.87,
    porosityDeviationCount: 0,
    isSuspended: false,
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'm004',
    name: 'Inconel 718',
    chemicalComposition: 'Ni-19Cr-18Fe-5Nb-3Mo',
    particleSize: '15-45 μm',
    density: 8.19,
    meltingPoint: 1609,
    thermalConductivity: 11.2,
    specificHeat: 460,
    viscosity: 0.0058,
    surfaceTension: 1.95,
    porosityDeviationCount: 0,
    isSuspended: false,
    createdAt: '2026-02-01T11:00:00Z',
    updatedAt: '2026-02-01T11:00:00Z',
  },
  {
    id: 'm005',
    name: 'CoCrMo',
    chemicalComposition: 'Co-28Cr-6Mo',
    particleSize: '15-45 μm',
    density: 8.35,
    meltingPoint: 1653,
    thermalConductivity: 12.8,
    specificHeat: 420,
    viscosity: 0.0065,
    surfaceTension: 1.88,
    porosityDeviationCount: 3,
    isSuspended: true,
    createdAt: '2026-02-15T08:30:00Z',
    updatedAt: '2026-06-15T16:45:00Z',
  },
];

const statuses: TaskStatus[] = ['pending_verify', 'parsing', 'computing', 'analyzing', 'completed', 'completed', 'completed', 'failed'];

const generateTasks = (): SimulationTask[] => {
  const taskNames = [
    '航空发动机叶片-批次A',
    '骨科植入物-股骨柄',
    '汽车模具-镶块',
    '航天结构件-支架',
    '齿科修复体-冠桥',
    '涡轮盘-原型件',
    '换热器-微通道',
    '生物支架-骨整合',
  ];

  return taskNames.map((name, index) => {
    const material = materials[index % materials.length];
    const status = statuses[index % statuses.length];
    const now = new Date();
    const created = new Date(now.getTime() - (index * 3600000 * 2));

    return {
      id: `t${String(index + 1).padStart(3, '0')}`,
      name,
      materialId: material.id,
      materialName: material.name,
      laserPower: 150 + Math.floor(Math.random() * 200),
      scanSpeed: 500 + Math.floor(Math.random() * 1500),
      substrateTemp: 80 + Math.floor(Math.random() * 120),
      scanPathFile: `scan_path_${index + 1}.gcode`,
      status,
      progress: status === 'completed' ? 100 : status === 'failed' ? 65 : Math.floor(Math.random() * 80),
      createdAt: created.toISOString(),
      updatedAt: new Date(created.getTime() + 1800000).toISOString(),
      porosity: status === 'completed' ? 0.1 + Math.random() * 2.5 : null,
      coolingRate: status === 'completed' ? 10000 + Math.random() * 20000 : null,
      maxPoolTemp: status === 'completed' ? 1800 + Math.random() * 800 : null,
      residualStress: status === 'completed' ? 100 + Math.random() * 400 : null,
      approvalLevel1: status === 'completed' ? (index % 3 === 0 ? 'approved' : index % 3 === 1 ? 'pending' : 'rejected') : 'pending',
      approvalLevel2: status === 'completed' && index % 3 === 0 ? (index % 2 === 0 ? 'approved' : 'pending') : 'pending',
      warningCount: Math.floor(Math.random() * 3),
      createdBy: users[0].id,
      slicingStatus: status === 'completed' && index % 2 === 0 ? 'completed' : status === 'completed' ? 'pending' : 'not_applicable',
      gcodeFile: status === 'completed' && index % 2 === 0 ? `t${String(index + 1).padStart(3, '0')}_print.gcode` : null,
      originalLaserPower: null,
      originalScanSpeed: null,
      restartCount: 0,
    };
  });
};

const tasks = generateTasks();

const generateTemperatureData = (taskId: string, count: number = 100): TemperatureData[] => {
  const data: TemperatureData[] = [];
  let temp = 300;
  const peakTemp = 2500 + Math.random() * 500;
  const riseTime = 20;
  const steadyTime = 40;
  const coolTime = count - riseTime - steadyTime;

  for (let i = 0; i < count; i++) {
    let temperature: number;
    let coolingRate: number;

    if (i < riseTime) {
      temperature = 300 + (peakTemp - 300) * (i / riseTime) + (Math.random() - 0.5) * 50;
      coolingRate = -((peakTemp - 300) / riseTime) * 10;
    } else if (i < riseTime + steadyTime) {
      temperature = peakTemp + (Math.random() - 0.5) * 100;
      coolingRate = (Math.random() - 0.5) * 500;
    } else {
      const coolProgress = (i - riseTime - steadyTime) / coolTime;
      temperature = peakTemp * Math.exp(-coolProgress * 3) + 300 + (Math.random() - 0.5) * 20;
      coolingRate = (peakTemp * 3 * Math.exp(-coolProgress * 3) / coolTime) * 10;
    }

    data.push({
      id: `${taskId}-temp-${i}`,
      taskId,
      time: i * 5,
      temperature: Math.round(temperature * 10) / 10,
      coolingRate: Math.round(coolingRate * 10) / 10,
    });
  }

  return data;
};

const temperatureDataCache = new Map<string, TemperatureData[]>();

const approvalRecords: ApprovalRecord[] = [
  {
    id: 'a001',
    taskId: 't001',
    userId: 'u002',
    userName: '李审核',
    level: 1,
    status: 'approved',
    comment: '熔池温度稳定，孔隙率符合要求，同意通过。',
    createdAt: '2026-06-17T08:30:00Z',
  },
  {
    id: 'a002',
    taskId: 't001',
    userId: 'u003',
    userName: '王首席',
    level: 2,
    status: 'approved',
    comment: '工艺参数合理，残余应力在可接受范围内。',
    createdAt: '2026-06-17T09:15:00Z',
  },
  {
    id: 'a003',
    taskId: 't004',
    userId: 'u002',
    userName: '李审核',
    level: 1,
    status: 'rejected',
    comment: '冷却速率偏高，建议降低扫描速度后重新模拟。',
    createdAt: '2026-06-16T16:00:00Z',
  },
];

const generatePorosityTrends = (): PorosityTrend[] => {
  const trends: PorosityTrend[] = [];
  const today = new Date();

  materials.forEach((material) => {
    if (material.id === 'm001') {
      for (let i = 14; i >= 0; i--) {
        const date = new Date(today.getTime() - i * 86400000);
        const basePorosity = 0.8;
        const variation = (Math.random() - 0.5) * 0.4;
        trends.push({
          date: date.toISOString().split('T')[0],
          materialId: material.id,
          materialName: material.name,
          porosity: Math.round((basePorosity + variation) * 100) / 100,
          deviation: Math.round(variation / basePorosity * 100 * 10) / 10,
        });
      }
    }
  });

  return trends;
};

const porosityTrends = generatePorosityTrends();

const warningRecords: WarningRecord[] = [];
const notificationRecords: NotificationRecord[] = [];
const slicingRecords: SlicingRecord[] = [];

const generateRecommendations = (materialId: string): RecommendedParams[] => {
  const recommendations: RecommendedParams[] = [];
  const basePower = materialId === 'm001' ? 200 : materialId === 'm002' ? 180 : 220;
  const baseSpeed = materialId === 'm001' ? 1000 : materialId === 'm002' ? 800 : 1200;

  for (let i = 0; i < 3; i++) {
    recommendations.push({
      laserPower: basePower + i * 25,
      scanSpeed: baseSpeed + i * 150,
      substrateTemp: 100 + i * 20,
      confidence: 0.85 - i * 0.1,
      predictedPorosity: 0.5 + i * 0.2,
      predictedStrength: 900 - i * 30,
      similarCases: 15 - i * 3,
    });
  }

  return recommendations;
};

export const dataService = {
  getUsers: (): User[] => users,
  getUserById: (id: string): User | undefined => users.find((u) => u.id === id),

  getMaterials: (): PowderMaterial[] => materials,
  getMaterialById: (id: string): PowderMaterial | undefined => materials.find((m) => m.id === id),

  getTasks: (status?: TaskStatus): SimulationTask[] => {
    if (status) {
      return tasks.filter((t) => t.status === status);
    }
    return tasks;
  },

  getTaskById: (id: string): SimulationTask | undefined => tasks.find((t) => t.id === id),

  createTask: (data: Partial<SimulationTask>): SimulationTask => {
    const material = dataService.getMaterialById(data.materialId || 'm001');
    if (material?.isSuspended) {
      throw new Error(`材料「${material.name}」已暂停，无法创建新任务`);
    }

    const newTask: SimulationTask = {
      id: `t${String(tasks.length + 1).padStart(3, '0')}`,
      name: data.name || '新模拟任务',
      materialId: data.materialId || 'm001',
      materialName: data.materialName || 'Ti-6Al-4V',
      laserPower: data.laserPower || 200,
      scanSpeed: data.scanSpeed || 1000,
      substrateTemp: data.substrateTemp || 100,
      scanPathFile: data.scanPathFile || 'scan_path.gcode',
      status: 'pending_verify',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      porosity: null,
      coolingRate: null,
      maxPoolTemp: null,
      residualStress: null,
      approvalLevel1: 'pending',
      approvalLevel2: 'pending',
      warningCount: 0,
      createdBy: data.createdBy || 'u001',
      slicingStatus: 'not_applicable',
      gcodeFile: null,
      originalLaserPower: null,
      originalScanSpeed: null,
      restartCount: 0,
    };
    tasks.unshift(newTask);
    return newTask;
  },

  updateTaskStatus: (id: string, status: TaskStatus): SimulationTask | undefined => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.status = status;
      task.updatedAt = new Date().toISOString();
    }
    return task;
  },

  getTemperatureData: (taskId: string): TemperatureData[] => {
    if (!temperatureDataCache.has(taskId)) {
      temperatureDataCache.set(taskId, generateTemperatureData(taskId));
    }
    return temperatureDataCache.get(taskId) || [];
  },

  getApprovalRecords: (taskId: string): ApprovalRecord[] => {
    return approvalRecords.filter((r) => r.taskId === taskId);
  },

  addApprovalRecord: (record: Omit<ApprovalRecord, 'id' | 'createdAt'>): ApprovalRecord => {
    const newRecord: ApprovalRecord = {
      ...record,
      id: `a${String(approvalRecords.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
    };
    approvalRecords.push(newRecord);

    const task = tasks.find((t) => t.id === record.taskId);
    if (task) {
      if (record.level === 1) {
        task.approvalLevel1 = record.status;
      } else if (record.level === 2) {
        task.approvalLevel2 = record.status;
      }
    }

    return newRecord;
  },

  getDashboardStats: (): DashboardStats => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const runningTasks = tasks.filter((t) => ['parsing', 'computing', 'analyzing'].includes(t.status)).length;
    const failedTasks = tasks.filter((t) => t.status === 'failed').length;
    const pendingApprovals = tasks.filter(
      (t) => t.status === 'completed' && (t.approvalLevel1 === 'pending' || t.approvalLevel2 === 'pending')
    ).length;
    const activeWarnings = tasks.reduce((sum, t) => sum + t.warningCount, 0);

    return {
      totalTasks,
      completedTasks,
      runningTasks,
      failedTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      todayTasks: 4,
      pendingApprovals,
      activeWarnings,
    };
  },

  getPorosityTrends: (materialId?: string): PorosityTrend[] => {
    if (materialId) {
      return porosityTrends.filter((t) => t.materialId === materialId);
    }
    return porosityTrends;
  },

  getRecommendations: (materialId: string): RecommendedParams[] => {
    return generateRecommendations(materialId);
  },

  validateTaskData: (data: Partial<SimulationTask>): { valid: boolean; errors: string[]; warnings: string[] } => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('任务名称不能为空');
    }

    if (!data.materialId) {
      errors.push('请选择粉末材料');
    }

    if (!data.laserPower || data.laserPower <= 0) {
      errors.push('激光功率必须大于0');
    } else if (data.laserPower < 50) {
      warnings.push('激光功率偏低，可能导致熔合不良');
    } else if (data.laserPower > 500) {
      warnings.push('激光功率偏高，可能导致过熔和球化');
    }

    if (!data.scanSpeed || data.scanSpeed <= 0) {
      errors.push('扫描速度必须大于0');
    }

    if (data.substrateTemp === undefined || data.substrateTemp === null) {
      errors.push('基板温度不能为空');
    } else if (data.substrateTemp < 20) {
      warnings.push('基板温度较低，可能增加残余应力');
    }

    if (!data.scanPathFile) {
      errors.push('请上传激光扫描路径文件');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  },

  suspendMaterial: (materialId: string): PowderMaterial | undefined => {
    const material = materials.find((m) => m.id === materialId);
    if (material) {
      material.isSuspended = true;
      material.updatedAt = new Date().toISOString();
    }
    return material;
  },

  resumeMaterial: (materialId: string): PowderMaterial | undefined => {
    const material = materials.find((m) => m.id === materialId);
    if (material) {
      material.isSuspended = false;
      material.porosityDeviationCount = 0;
      material.updatedAt = new Date().toISOString();
    }
    return material;
  },

  addWarningRecord: (warning: WarningRecord): void => {
    warningRecords.push(warning);
  },

  getWarningRecords: (taskId?: string): WarningRecord[] => {
    if (taskId) {
      return warningRecords.filter((w) => w.taskId === taskId);
    }
    return warningRecords;
  },

  getWarningById: (id: string): WarningRecord | undefined => {
    return warningRecords.find((w) => w.id === id);
  },

  clearWarningRecords: (taskId: string): void => {
    for (let i = warningRecords.length - 1; i >= 0; i--) {
      if (warningRecords[i].taskId === taskId) {
        warningRecords.splice(i, 1);
      }
    }
  },

  addTemperatureDataPoint: (taskId: string, data: TemperatureData): void => {
    const existing = temperatureDataCache.get(taskId) || [];
    existing.push(data);
    temperatureDataCache.set(taskId, existing);
  },

  clearTemperatureData: (taskId: string): void => {
    temperatureDataCache.delete(taskId);
  },

  addNotificationRecord: (notification: NotificationRecord): void => {
    notificationRecords.push(notification);
  },

  getNotificationRecords: (role?: string): NotificationRecord[] => {
    if (role) {
      return notificationRecords.filter((n) => n.recipientRole === role);
    }
    return notificationRecords;
  },

  addSlicingRecord: (record: SlicingRecord): void => {
    slicingRecords.push(record);
  },

  getSlicingRecords: (taskId?: string): SlicingRecord[] => {
    if (taskId) {
      return slicingRecords.filter((s) => s.taskId === taskId);
    }
    return slicingRecords;
  },

  getSlicingRecordByTaskId: (taskId: string): SlicingRecord | undefined => {
    return slicingRecords.find((s) => s.taskId === taskId);
  },

  updateTask: (id: string, updates: Partial<SimulationTask>): SimulationTask | undefined => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      Object.assign(task, updates);
      task.updatedAt = new Date().toISOString();
    }
    return task;
  },

  markNotificationRead: (id: string): NotificationRecord | undefined => {
    const notification = notificationRecords.find((n) => n.id === id);
    if (notification) {
      notification.isRead = true;
    }
    return notification;
  },
};

export { generateId };
