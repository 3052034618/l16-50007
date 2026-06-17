import { create } from 'zustand';
import type {
  SimulationTask,
  PowderMaterial,
  DashboardStats,
  TemperatureData,
  ApprovalRecord,
  RecommendedParams,
  PorosityTrend,
  TaskStatus,
  User,
  WarningRecord,
  NotificationRecord,
} from '../../shared/types';

interface AppState {
  tasks: SimulationTask[];
  materials: PowderMaterial[];
  currentTask: SimulationTask | null;
  dashboardStats: DashboardStats | null;
  temperatureData: TemperatureData[];
  approvalRecords: ApprovalRecord[];
  recommendations: RecommendedParams[];
  porosityTrends: PorosityTrend[];
  currentUser: User | null;
  warningRecords: WarningRecord[];
  notificationRecords: NotificationRecord[];
  loading: boolean;
  error: string | null;
  activeNav: string;

  setActiveNav: (nav: string) => void;
  setTasks: (tasks: SimulationTask[]) => void;
  setMaterials: (materials: PowderMaterial[]) => void;
  setCurrentTask: (task: SimulationTask | null) => void;
  setDashboardStats: (stats: DashboardStats) => void;
  setTemperatureData: (data: TemperatureData[]) => void;
  setApprovalRecords: (records: ApprovalRecord[]) => void;
  setRecommendations: (recs: RecommendedParams[]) => void;
  setPorosityTrends: (trends: PorosityTrend[]) => void;
  setWarningRecords: (records: WarningRecord[]) => void;
  setNotificationRecords: (records: NotificationRecord[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  fetchTasks: (status?: TaskStatus) => Promise<void>;
  fetchTaskDetail: (id: string) => Promise<void>;
  fetchMaterials: () => Promise<void>;
  fetchDashboardStats: () => Promise<void>;
  fetchTemperatureData: (taskId: string) => Promise<void>;
  fetchApprovalRecords: (taskId: string) => Promise<void>;
  fetchRecommendations: (materialId: string) => Promise<void>;
  fetchPorosityTrends: (materialId?: string) => Promise<void>;
  fetchWarningRecords: (taskId: string) => Promise<void>;
  fetchNotifications: (role?: string) => Promise<void>;
  createTask: (task: Partial<SimulationTask>) => Promise<SimulationTask | null>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  approveTask: (taskId: string, level: 1 | 2, comment: string) => Promise<void>;
  rejectTask: (taskId: string, level: 1 | 2, comment: string) => Promise<void>;
  startVerification: (taskId: string) => Promise<boolean>;
  restartTask: (taskId: string) => Promise<boolean>;
  reviewWarning: (taskId: string, warningId: string, approved: boolean, comment: string, adjustPower: number, adjustSpeed: number) => Promise<boolean>;
  downloadReport: (taskId: string) => Promise<void>;
  pushToSlicing: (taskId: string) => Promise<boolean>;
  addTemperatureData: (data: TemperatureData) => void;
}

const API_BASE = '/api';

export const useAppStore = create<AppState>((set, get) => ({
  tasks: [],
  materials: [],
  currentTask: null,
  dashboardStats: null,
  temperatureData: [],
  approvalRecords: [],
  recommendations: [],
  porosityTrends: [],
  currentUser: null,
  warningRecords: [],
  notificationRecords: [],
  loading: false,
  error: null,
  activeNav: 'dashboard',

  setActiveNav: (nav) => set({ activeNav: nav }),
  setTasks: (tasks) => set({ tasks }),
  setMaterials: (materials) => set({ materials }),
  setCurrentTask: (task) => set({ currentTask: task }),
  setDashboardStats: (stats) => set({ dashboardStats: stats }),
  setTemperatureData: (data) => set({ temperatureData: data }),
  setApprovalRecords: (records) => set({ approvalRecords: records }),
  setRecommendations: (recs) => set({ recommendations: recs }),
  setPorosityTrends: (trends) => set({ porosityTrends: trends }),
  setWarningRecords: (records) => set({ warningRecords: records }),
  setNotificationRecords: (records) => set({ notificationRecords: records }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchTasks: async (status) => {
    set({ loading: true, error: null });
    try {
      const url = status ? `${API_BASE}/tasks?status=${status}` : `${API_BASE}/tasks`;
      const res = await fetch(url);
      const data = await res.json();
      set({ tasks: data, loading: false });
    } catch (err) {
      set({ error: '获取任务列表失败', loading: false });
    }
  },

  fetchTaskDetail: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`);
      const data = await res.json();
      set({ currentTask: data, loading: false });
    } catch (err) {
      set({ error: '获取任务详情失败', loading: false });
    }
  },

  fetchMaterials: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/materials`);
      const data = await res.json();
      set({ materials: data, loading: false });
    } catch (err) {
      set({ error: '获取材料列表失败', loading: false });
    }
  },

  fetchDashboardStats: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/dashboard/stats`);
      const data = await res.json();
      set({ dashboardStats: data, loading: false });
    } catch (err) {
      set({ error: '获取统计数据失败', loading: false });
    }
  },

  fetchTemperatureData: async (taskId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/temperature`);
      const data = await res.json();
      set({ temperatureData: data, loading: false });
    } catch (err) {
      set({ error: '获取温度数据失败', loading: false });
    }
  },

  fetchApprovalRecords: async (taskId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/approvals`);
      const data = await res.json();
      set({ approvalRecords: data, loading: false });
    } catch (err) {
      set({ error: '获取审批记录失败', loading: false });
    }
  },

  fetchRecommendations: async (materialId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/recommend?materialId=${materialId}`);
      const data = await res.json();
      set({ recommendations: data, loading: false });
    } catch (err) {
      set({ error: '获取推荐参数失败', loading: false });
    }
  },

  fetchPorosityTrends: async (materialId) => {
    set({ loading: true, error: null });
    try {
      const url = materialId
        ? `${API_BASE}/quality/porosity?materialId=${materialId}`
        : `${API_BASE}/quality/porosity`;
      const res = await fetch(url);
      const data = await res.json();
      set({ porosityTrends: data, loading: false });
    } catch (err) {
      set({ error: '获取孔隙率数据失败', loading: false });
    }
  },

  createTask: async (task) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      const data = await res.json();
      const tasks = get().tasks;
      set({ tasks: [data, ...tasks], loading: false });
      return data;
    } catch (err) {
      set({ error: '创建任务失败', loading: false });
      return null;
    }
  },

  updateTaskStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      const tasks = get().tasks.map((t) => (t.id === id ? data : t));
      set({ tasks, currentTask: data, loading: false });
    } catch (err) {
      set({ error: '更新任务状态失败', loading: false });
    }
  },

  approveTask: async (taskId, level, comment) => {
    set({ loading: true, error: null });
    try {
      await fetch(`${API_BASE}/approval/${taskId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, comment }),
      });
      await get().fetchTaskDetail(taskId);
      await get().fetchApprovalRecords(taskId);
      set({ loading: false });
    } catch (err) {
      set({ error: '审批操作失败', loading: false });
    }
  },

  rejectTask: async (taskId, level, comment) => {
    set({ loading: true, error: null });
    try {
      await fetch(`${API_BASE}/approval/${taskId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, comment }),
      });
      await get().fetchTaskDetail(taskId);
      await get().fetchApprovalRecords(taskId);
      set({ loading: false });
    } catch (err) {
      set({ error: '审批操作失败', loading: false });
    }
  },

  addTemperatureData: (data) => {
    set((state) => ({
      temperatureData: [...state.temperatureData, data],
    }));
  },

  fetchWarningRecords: async (taskId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/warnings`);
      const data = await res.json();
      set({ warningRecords: data, loading: false });
    } catch (err) {
      set({ error: '获取预警记录失败', loading: false });
    }
  },

  fetchNotifications: async (role) => {
    set({ loading: true, error: null });
    try {
      const url = role ? `${API_BASE}/quality/notifications?role=${role}` : `${API_BASE}/quality/notifications`;
      const res = await fetch(url);
      const data = await res.json();
      set({ notificationRecords: data, loading: false });
    } catch (err) {
      set({ error: '获取通知记录失败', loading: false });
    }
  },

  startVerification: async (taskId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('开始校验失败');
      const data = await res.json();
      const tasks = get().tasks.map((t) => (t.id === taskId ? data : t));
      set({ tasks, currentTask: data, loading: false });
      return true;
    } catch (err) {
      set({ error: '开始校验失败', loading: false });
      return false;
    }
  },

  restartTask: async (taskId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/restart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('重新计算失败');
      const data = await res.json();
      const tasks = get().tasks.map((t) => (t.id === taskId ? data : t));
      set({ tasks, currentTask: data, temperatureData: [], warningRecords: [], loading: false });
      return true;
    } catch (err) {
      set({ error: '重新计算失败', loading: false });
      return false;
    }
  },

  reviewWarning: async (taskId, warningId, approved, comment, adjustPower, adjustSpeed) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/warnings/${warningId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved, comment, adjustPower, adjustSpeed }),
      });
      if (!res.ok) throw new Error('复核操作失败');
      await get().fetchWarningRecords(taskId);
      await get().fetchTaskDetail(taskId);
      await get().fetchTemperatureData(taskId);
      set({ loading: false });
      return true;
    } catch (err) {
      set({ error: '复核操作失败', loading: false });
      return false;
    }
  },

  downloadReport: async (taskId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/report/download`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || '报告下载失败');
      }
      const blob = await res.blob();
      const contentDisposition = res.headers.get('Content-Disposition');
      let fileName = 'simulation_report.pdf';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename\*=UTF-8''(.+)/);
        if (match) {
          fileName = decodeURIComponent(match[1]);
        }
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      set({ loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '报告下载失败', loading: false });
    }
  },

  pushToSlicing: async (taskId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/push-to-slicing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || '推送切片失败');
      }
      const data = await res.json();
      const tasks = get().tasks.map((t) => (t.id === taskId ? data.task : t));
      set({ tasks, currentTask: data.task, loading: false });
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : '推送切片失败', loading: false });
      return false;
    }
  },
}));
