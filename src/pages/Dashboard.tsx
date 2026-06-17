import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  TrendingUp,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import StatusBadge from '@/components/StatusBadge';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    dashboardStats,
    tasks,
    fetchDashboardStats,
    fetchTasks,
    fetchTemperatureData,
    temperatureData,
    currentTask,
  } = useAppStore();

  useEffect(() => {
    fetchDashboardStats();
    fetchTasks();
    fetchTemperatureData('t003');
  }, [fetchDashboardStats, fetchTasks, fetchTemperatureData]);

  const recentTasks = tasks.slice(0, 5);
  const runningTask = tasks.find((t) => t.status === 'computing');

  const statsCards = [
    {
      label: '总任务数',
      value: dashboardStats?.totalTasks || 0,
      icon: FileText,
      color: 'text-tech-cyan-400',
      bgColor: 'bg-tech-cyan-500/10',
    },
    {
      label: '运行中',
      value: dashboardStats?.runningTasks || 0,
      icon: Activity,
      color: 'text-molten-orange-400',
      bgColor: 'bg-molten-orange-500/10',
    },
    {
      label: '已完成',
      value: dashboardStats?.completedTasks || 0,
      icon: CheckCircle2,
      color: 'text-neon-green-400',
      bgColor: 'bg-neon-green-500/10',
    },
    {
      label: '完成率',
      value: `${dashboardStats?.completionRate || 0}%`,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-5 card-hover"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-steel-300">{stat.label}</span>
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className={`font-display font-bold text-3xl ${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-semibold text-white text-lg">实时熔池温度监控</h3>
              <p className="text-sm text-steel-400 mt-1">
                {runningTask ? runningTask.name : '当前无运行任务'}
              </p>
            </div>
            {runningTask && <StatusBadge status={runningTask.status} size="sm" />}
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={temperatureData.slice(-50)}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#627d98', fontSize: 11 }}
                  label={{ value: '时间 (ms)', position: 'insideBottom', offset: -5, fill: '#627d98', fontSize: 11 }}
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
                  labelStyle={{ color: '#00D4FF' }}
                />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#00D4FF"
                  strokeWidth={2}
                  fill="url(#tempGradient)"
                  name="温度 (K)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-tech-cyan-900/20">
            <div className="text-center">
              <p className="text-xs text-steel-400 mb-1">最高温度</p>
              <p className="font-mono font-bold text-molten-orange-400 text-xl">
                {temperatureData.length > 0 ? Math.max(...temperatureData.map((d) => d.temperature)).toFixed(0) : 0} K
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-steel-400 mb-1">当前温度</p>
              <p className="font-mono font-bold text-tech-cyan-400 text-xl data-pulse">
                {temperatureData.length > 0 ? temperatureData[temperatureData.length - 1].temperature.toFixed(0) : 0} K
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-steel-400 mb-1">冷却速率</p>
              <p className="font-mono font-bold text-neon-green-400 text-xl">
                {temperatureData.length > 0
                  ? (Math.abs(temperatureData[temperatureData.length - 1].coolingRate) / 1000).toFixed(1)
                  : 0}
                k/s
              </p>
            </div>
          </div>
        </div>

        <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold text-white text-lg">快速操作</h3>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/tasks/new')}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-tech-cyan-500/20 to-tech-cyan-600/10 border border-tech-cyan-500/30 rounded-lg hover:from-tech-cyan-500/30 hover:to-tech-cyan-600/20 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-tech-cyan-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-tech-cyan-400" />
              </div>
              <div className="text-left flex-1">
                <p className="font-medium text-white">新建模拟任务</p>
                <p className="text-xs text-steel-400">上传参数开始模拟</p>
              </div>
              <ChevronRight className="w-5 h-5 text-steel-400 group-hover:text-tech-cyan-400 transition-colors" />
            </button>

            <button
              onClick={() => navigate('/approval')}
              className="w-full flex items-center gap-3 p-4 bg-space-blue-700/50 border border-tech-cyan-900/30 rounded-lg hover:bg-space-blue-700 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-alert-red-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-alert-red-400" />
              </div>
              <div className="text-left flex-1">
                <p className="font-medium text-white">待审批任务</p>
                <p className="text-xs text-steel-400">{dashboardStats?.pendingApprovals || 0} 项待处理</p>
              </div>
              <span className="px-2 py-0.5 text-xs font-bold bg-alert-red-500/20 text-alert-red-400 rounded-full">
                {dashboardStats?.pendingApprovals || 0}
              </span>
            </button>

            <button
              onClick={() => navigate('/recommend')}
              className="w-full flex items-center gap-3 p-4 bg-space-blue-700/50 border border-tech-cyan-900/30 rounded-lg hover:bg-space-blue-700 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left flex-1">
                <p className="font-medium text-white">智能参数推荐</p>
                <p className="text-xs text-steel-400">基于历史数据优化</p>
              </div>
              <ChevronRight className="w-5 h-5 text-steel-400 group-hover:text-tech-cyan-400 transition-colors" />
            </button>

            <button
              onClick={() => navigate('/quality')}
              className="w-full flex items-center gap-3 p-4 bg-space-blue-700/50 border border-tech-cyan-900/30 rounded-lg hover:bg-space-blue-700 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-molten-orange-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-molten-orange-400" />
              </div>
              <div className="text-left flex-1">
                <p className="font-medium text-white">质量监控</p>
                <p className="text-xs text-steel-400">孔隙率偏差分析</p>
              </div>
              <ChevronRight className="w-5 h-5 text-steel-400 group-hover:text-tech-cyan-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold text-white text-lg">最近任务</h3>
          <button
            onClick={() => navigate('/tasks')}
            className="text-sm text-tech-cyan-400 hover:text-tech-cyan-300 flex items-center gap-1"
          >
            查看全部
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-tech-cyan-900/30">
                <th className="text-left py-3 px-4 text-xs font-medium text-steel-400 uppercase tracking-wider">
                  任务名称
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-steel-400 uppercase tracking-wider">
                  材料
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-steel-400 uppercase tracking-wider">
                  激光功率
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-steel-400 uppercase tracking-wider">
                  状态
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-steel-400 uppercase tracking-wider">
                  进度
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-steel-400 uppercase tracking-wider">
                  创建时间
                </th>
              </tr>
            </thead>
            <tbody>
              {recentTasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="border-b border-tech-cyan-900/10 hover:bg-space-blue-700/30 cursor-pointer transition-colors"
                >
                  <td className="py-4 px-4">
                    <p className="font-medium text-white">{task.name}</p>
                  </td>
                  <td className="py-4 px-4 text-sm text-steel-300">{task.materialName}</td>
                  <td className="py-4 px-4">
                    <span className="font-mono text-tech-cyan-400">{task.laserPower} W</span>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={task.status} size="sm" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-space-blue-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-tech-cyan-500 rounded-full"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-steel-400">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-steel-400">
                    {new Date(task.createdAt).toLocaleDateString('zh-CN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
