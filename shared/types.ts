export type TaskStatus = 'pending_verify' | 'parsing' | 'computing' | 'analyzing' | 'completed' | 'failed' | 'rollback' | 'slicing' | 'sliced';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type UserRole = 'engineer' | 'reviewer' | 'scientist' | 'admin';

export type WarningStatus = 'pending_review' | 'review_approved' | 'review_rejected' | 'resolved';

export interface WarningRecord {
  id: string;
  taskId: string;
  type: 'temperature' | 'cooling_rate';
  message: string;
  value: number;
  threshold: number;
  status: WarningStatus;
  reviewedBy: string | null;
  reviewComment: string | null;
  reviewedAt: string | null;
  parameterAdjustment: {
    laserPowerAdjustment: number;
    scanSpeedAdjustment: number;
  } | null;
  createdAt: string;
}

export interface SlicingRecord {
  id: string;
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  gcodeFile: string | null;
  pushedAt: string | null;
  createdAt: string;
}

export interface NotificationRecord {
  id: string;
  type: 'warning' | 'approval' | 'quality' | 'system';
  title: string;
  message: string;
  recipientRole: UserRole;
  recipientUserId: string | null;
  relatedTaskId: string | null;
  relatedMaterialId: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface SimulationTask {
  id: string;
  name: string;
  materialId: string;
  materialName: string;
  laserPower: number;
  scanSpeed: number;
  substrateTemp: number;
  scanPathFile: string;
  status: TaskStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
  porosity: number | null;
  coolingRate: number | null;
  maxPoolTemp: number | null;
  residualStress: number | null;
  approvalLevel1: ApprovalStatus;
  approvalLevel2: ApprovalStatus;
  warningCount: number;
  createdBy: string;
  slicingStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'not_applicable';
  gcodeFile: string | null;
  originalLaserPower: number | null;
  originalScanSpeed: number | null;
  restartCount: number;
}

export interface PowderMaterial {
  id: string;
  name: string;
  chemicalComposition: string;
  particleSize: string;
  density: number;
  meltingPoint: number;
  thermalConductivity: number;
  specificHeat: number;
  viscosity: number;
  surfaceTension: number;
  porosityDeviationCount: number;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemperatureData {
  id: string;
  taskId: string;
  time: number;
  temperature: number;
  coolingRate: number;
}

export interface ApprovalRecord {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  level: 1 | 2;
  status: ApprovalStatus;
  comment: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
}

export interface RecommendedParams {
  laserPower: number;
  scanSpeed: number;
  substrateTemp: number;
  confidence: number;
  predictedPorosity: number;
  predictedStrength: number;
  similarCases: number;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  runningTasks: number;
  failedTasks: number;
  completionRate: number;
  todayTasks: number;
  pendingApprovals: number;
  activeWarnings: number;
}

export interface PorosityTrend {
  date: string;
  materialId: string;
  materialName: string;
  porosity: number;
  deviation: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
