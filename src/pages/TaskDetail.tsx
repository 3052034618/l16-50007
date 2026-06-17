import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import {
  ArrowLeft,
  Play,
  RotateCcw,
  Download,
  AlertTriangle,
  Thermometer,
  Zap,
  Layers,
  Clock,
  CheckCircle2,
  FileText,
  Gauge,
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { TaskStatus } from '../../shared/types';

const statusSteps: { status: TaskStatus; label: string; icon: typeof Thermometer }[] = [
  { status: 'pending_verify', label: '待校验', icon: FileText },
  { status: 'parsing', label: '参数解析', icon: Layers },
  { status: 'computing', label: '耦合计算', icon: Zap },
  { status: 'analyzing', label: '熔池分析', icon: Thermometer },
  { status: 'completed', label: '已完成', icon: CheckCircle2 },
];

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentTask, fetchTaskDetail, temperatureData, fetchTemperatureData, loading } = useAppStore();
  const [activeTab, setActiveTab] = useState<'monitor' | 'params' | 'report'>('monitor');

  useEffect(() => {
    if (id) {
      fetchTaskDetail(id);
      fetchTemperatureData(id);
    }
  }, [id, fetchTaskDetail, fetchTemperatureData]);

  useEffect(() => {
    if (currentTask?.status === 'computing') {
      const interval = setInterval(() => {
        if (id) {
          fetchTaskDetail(id);
          fetchTemperatureData(id);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [currentTask?.status, id, fetchTaskDetail, fetchTemperatureData]);

  const getCurrentStepIndex = () => {
    if (!currentTask) return -1;
    const idx = statusSteps.findIndex((s) => s.status === currentTask.status);
    return idx >= 0 ? idx : currentTask.status === 'failed' || currentTask.status === 'rollback' ? -1 : 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  if (!currentTask && !loading) {
    return (
      <div className="text-center py-20">
        <p className="text-steel-400">任务不存在</p>
        <button onClick={() => navigate('/tasks')} className="mt-4 text-tech-cyan-400 hover:text-tech-cyan-300">
          返回任务列表
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/tasks')}
            className="p-2 rounded-lg bg-space-blue-600/50 border border-tech-cyan-900/30 text-steel-300 hover:text-white hover:border-tech-cyan-500/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display font-semibold text-xl text-white">{currentTask?.name}</h2>
              {currentTask && <StatusBadge status={currentTask.status} size="sm" />}
            </div>
            <p className="text-sm text-steel-400 mt-1">
              任务ID: {id} · 材料: {currentTask?.materialName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentTask?.status === 'pending_verify' && (
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-tech-cyan-500 to-tech-cyan-600 text-white font-medium rounded-lg hover:from-tech-cyan-400 hover:to-tech-cyan-500 transition-all">
              <Play className="w-4 h-4" />
              开始校验
            </button>
          )}
          {(currentTask?.status === 'failed' || currentTask?.status === 'rollback') && (
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-molten-orange-500 to-molten-orange-600 text-white font-medium rounded-lg hover:from-molten-orange-400 hover:to-molten-orange-500 transition-all">
              <RotateCcw className="w-4 h-4" />
              重新计算
            </button>
          )}
          {currentTask?.status === 'completed' && (
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-green-500 to-neon-green-600 text-white font-medium rounded-lg hover:from-neon-green-400 hover:to-neon-green-500 transition-all">
              <Download className="w-4 h-4" />
              下载报告
            </button>
          )}
        </div>
      </div>

      <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-6">
        <h3 className="font-display font-semibold text-white mb-6">任务状态流转</h3>
        <div className="relative">
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-tech-cyan-900/30 mx-12"></div>
          <div className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-tech-cyan-500 to-tech-cyan-400 mx-12 transition-all duration-500"
            style={{ width: `calc((100% - 96px) * ${currentStepIndex >= 0 ? currentStepIndex / (statusSteps.length - 1) : 0})` }}
          ></div>

          <div className="flex justify-between relative">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.status} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isActive
                        ? 'bg-tech-cyan-500/20 border-tech-cyan-500 text-tech-cyan-400'
                        : 'bg-space-blue-700 border-tech-cyan-900/50 text-steel-500'
                    } ${isCurrent ? 'ring-4 ring-tech-cyan-500/20 animate-pulse' : ''}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <p
                    className={`mt-3 text-sm font-medium ${
                      isActive ? 'text-white' : 'text-steel-500'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {currentTask?.warningCount && currentTask.warningCount > 0 && (
        <div className="bg-molten-orange-500/10 border border-molten-orange-500/30 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-molten-orange-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-molten-orange-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-molten-orange-400">安全预警</p>
            <p className="text-sm text-steel-300 mt-1">
              本次模拟共触发 {currentTask.warningCount} 次温度阈值预警，已推送工程师复核
            </p>
          </div>
          <button className="px-4 py-2 text-sm text-molten-orange-400 border border-molten-orange-500/30 rounded-lg hover:bg-molten-orange-500/10 transition-colors">
            查看详情
          </button>
        </div>
      )}

      <div className="flex gap-2 border-b border-tech-cyan-900/30">
        {[
          { id: 'monitor', label: '实时监控', icon: Gauge },
          { id: 'params', label: '参数配置', icon: Layers },
          { id: 'report', label: '分析报告', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-tech-cyan-500 text-tech-cyan-400'
                  : 'border-transparent text-steel-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'monitor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-white">熔池温度曲线</h3>
              <span className="text-xs text-steel-400">实时更新</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={temperatureData}>
                  <defs>
                    <linearGradient id="tempGradient2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.4} />
                      <stop offset="50%" stopColor="#00D4FF" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.1)" />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#627d98', fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#627d98', fontSize: 11 }}
                    domain={['dataMin - 200', 'dataMax + 200']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#081220',
                      border: '1px solid rgba(0, 212, 255, 0.3)',
                      borderRadius: '8px',
                      color: '#e2e8f0',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="#00D4FF"
                    strokeWidth={2}
                    fill="url(#tempGradient2)"
                    name="温度 (K)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-molten-orange-500/10 flex items-center justify-center">
                  <Thermometer className="w-5 h-5 text-molten-orange-400" />
                </div>
                <span className="text-sm text-steel-300">最高熔池温度</span>
              </div>
              <p className="font-mono font-bold text-3xl text-molten-orange-400">
                {currentTask?.maxPoolTemp
                  ? currentTask.maxPoolTemp.toFixed(0)
                  : temperatureData.length > 0
                  ? Math.max(...temperatureData.map((d) => d.temperature)).toFixed(0)
                  : '0'}
              </p>
              <p className="text-xs text-steel-500 mt-1">开尔文 (K)</p>
            </div>

            <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-tech-cyan-500/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-tech-cyan-400" />
                </div>
                <span className="text-sm text-steel-300">冷却速率</span>
              </div>
              <p className="font-mono font-bold text-3xl text-tech-cyan-400">
                {currentTask?.coolingRate
                  ? (currentTask.coolingRate / 1000).toFixed(1)
                  : temperatureData.length > 0
                  ? (Math.abs(temperatureData[temperatureData.length - 1].coolingRate) / 1000).toFixed(1)
                  : '0'}
              </p>
              <p className="text-xs text-steel-500 mt-1">× 10³ K/s</p>
            </div>

            <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-sm text-steel-300">计算进度</span>
              </div>
              <p className="font-mono font-bold text-3xl text-purple-400">{currentTask?.progress || 0}%</p>
              <div className="h-2 bg-space-blue-800 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-500"
                  style={{ width: `${currentTask?.progress || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'params' && currentTask && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-5">
            <h4 className="font-medium text-white mb-4">材料参数</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-steel-400">材料名称</span>
                <span className="text-sm text-white">{currentTask.materialName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-steel-400">材料ID</span>
                <span className="text-sm font-mono text-tech-cyan-400">{currentTask.materialId}</span>
              </div>
            </div>
          </div>

          <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-5">
            <h4 className="font-medium text-white mb-4">激光参数</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-steel-400">激光功率</span>
                <span className="text-sm font-mono text-tech-cyan-400">{currentTask.laserPower} W</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-steel-400">扫描速度</span>
                <span className="text-sm font-mono text-tech-cyan-400">{currentTask.scanSpeed} mm/s</span>
              </div>
            </div>
          </div>

          <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-5">
            <h4 className="font-medium text-white mb-4">基板参数</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-steel-400">基板温度</span>
                <span className="text-sm font-mono text-molten-orange-400">{currentTask.substrateTemp} °C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-steel-400">扫描路径</span>
                <span className="text-sm text-white truncate max-w-32">{currentTask.scanPathFile}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-6">
          {currentTask?.status === 'completed' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-space-blue-700/50 rounded-lg">
                  <p className="text-sm text-steel-400 mb-2">孔隙率</p>
                  <p className="font-mono text-2xl font-bold text-neon-green-400">
                    {currentTask.porosity?.toFixed(2)}%
                  </p>
                </div>
                <div className="text-center p-4 bg-space-blue-700/50 rounded-lg">
                  <p className="text-sm text-steel-400 mb-2">最高温度</p>
                  <p className="font-mono text-2xl font-bold text-molten-orange-400">
                    {currentTask.maxPoolTemp?.toFixed(0)} K
                  </p>
                </div>
                <div className="text-center p-4 bg-space-blue-700/50 rounded-lg">
                  <p className="text-sm text-steel-400 mb-2">冷却速率</p>
                  <p className="font-mono text-2xl font-bold text-tech-cyan-400">
                    {(currentTask.coolingRate! / 1000).toFixed(1)} k/s
                  </p>
                </div>
                <div className="text-center p-4 bg-space-blue-700/50 rounded-lg">
                  <p className="text-sm text-steel-400 mb-2">残余应力</p>
                  <p className="font-mono text-2xl font-bold text-purple-400">
                    {currentTask.residualStress?.toFixed(0)} MPa
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <Link
                  to={`/tasks/${id}/report`}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-tech-cyan-500 to-tech-cyan-600 text-white font-medium rounded-lg hover:from-tech-cyan-400 hover:to-tech-cyan-500 transition-all"
                >
                  <FileText className="w-5 h-5" />
                  查看完整报告
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-space-blue-700/50 flex items-center justify-center">
                <Clock className="w-8 h-8 text-steel-500" />
              </div>
              <p className="text-steel-400">模拟尚未完成，报告生成中...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
