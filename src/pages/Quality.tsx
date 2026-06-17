import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  Activity,
  AlertTriangle,
  AlertOctagon,
  TrendingDown,
  TrendingUp,
  ChevronDown,
  Pause,
  Play,
  Bell,
  User,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

const Quality = () => {
  const {
    materials,
    porosityTrends,
    fetchMaterials,
    fetchPorosityTrends,
    notificationRecords,
    fetchNotifications,
  } = useAppStore();
  const [selectedMaterial, setSelectedMaterial] = useState('m001');
  const [showMaterialDropdown, setShowMaterialDropdown] = useState(false);

  useEffect(() => {
    fetchMaterials();
    fetchNotifications('scientist');
  }, [fetchMaterials, fetchNotifications]);

  useEffect(() => {
    fetchPorosityTrends(selectedMaterial);
  }, [selectedMaterial, fetchPorosityTrends]);

  const selectedMaterialData = materials.find((m) => m.id === selectedMaterial);

  const suspendedMaterials = materials.filter((m) => m.isSuspended);
  const warningMaterials = materials.filter((m) => m.porosityDeviationCount > 0 && !m.isSuspended);

  const handleSuspendMaterial = async (materialId: string) => {
    try {
      await fetch('/api/quality/suspend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialId }),
      });
      fetchMaterials();
    } catch (err) {
      console.error('暂停材料失败', err);
    }
  };

  const handleResumeMaterial = async (materialId: string) => {
    try {
      await fetch('/api/quality/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialId }),
      });
      fetchMaterials();
      fetchNotifications('scientist');
    } catch (err) {
      console.error('恢复材料失败', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-semibold text-xl text-white">质量监控中心</h2>
          <p className="text-sm text-steel-400 mt-1">孔隙率偏差分析与质量预警</p>
        </div>
      </div>

      {suspendedMaterials.length > 0 && (
        <div className="bg-alert-red-500/10 border border-alert-red-500/30 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-alert-red-500/20 flex items-center justify-center flex-shrink-0">
              <AlertOctagon className="w-6 h-6 text-alert-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-alert-red-400">材料质量告警</h3>
              <p className="text-sm text-steel-300 mt-1">
                {suspendedMaterials.length} 种材料因连续孔隙率偏差超阈值已暂停新任务
              </p>
            </div>
            <button className="px-4 py-2 text-sm text-alert-red-400 border border-alert-red-500/30 rounded-lg hover:bg-alert-red-500/10 transition-colors">
              立即处理
            </button>
          </div>
        </div>
      )}

      {warningMaterials.length > 0 && (
        <div className="bg-molten-orange-500/10 border border-molten-orange-500/30 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-molten-orange-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-molten-orange-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-molten-orange-400">质量预警提醒</h3>
              <p className="text-sm text-steel-300 mt-1">
                {warningMaterials.length} 种材料孔隙率偏差持续增加，需密切关注
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-tech-cyan-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-tech-cyan-400" />
            </div>
            <span className="text-sm text-steel-300">监控材料</span>
          </div>
          <p className="font-display font-bold text-3xl text-tech-cyan-400">{materials.length}</p>
        </div>

        <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-neon-green-500/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-neon-green-400" />
            </div>
            <span className="text-sm text-steel-300">质量稳定</span>
          </div>
          <p className="font-display font-bold text-3xl text-neon-green-400">
            {materials.filter((m) => m.porosityDeviationCount === 0 && !m.isSuspended).length}
          </p>
        </div>

        <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-molten-orange-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-molten-orange-400" />
            </div>
            <span className="text-sm text-steel-300">预警中</span>
          </div>
          <p className="font-display font-bold text-3xl text-molten-orange-400">
            {warningMaterials.length}
          </p>
        </div>

        <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-alert-red-500/10 flex items-center justify-center">
              <Pause className="w-5 h-5 text-alert-red-400" />
            </div>
            <span className="text-sm text-steel-300">已暂停</span>
          </div>
          <p className="font-display font-bold text-3xl text-alert-red-400">
            {suspendedMaterials.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-white">孔隙率趋势</h3>
                <p className="text-sm text-steel-400">近14天数据</p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowMaterialDropdown(!showMaterialDropdown)}
                className="flex items-center gap-2 px-3 py-2 bg-space-blue-700/50 border border-tech-cyan-900/30 rounded-lg text-sm text-white hover:border-tech-cyan-500/30 transition-colors"
              >
                {selectedMaterialData?.name}
                <ChevronDown className="w-4 h-4 text-steel-400" />
              </button>

              {showMaterialDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-space-blue-700 border border-tech-cyan-900/30 rounded-lg shadow-xl z-10">
                  {materials.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedMaterial(m.id);
                        setShowMaterialDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-space-blue-600 transition-colors ${
                        selectedMaterial === m.id ? 'text-tech-cyan-400 bg-tech-cyan-500/10' : 'text-steel-300'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={porosityTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.1)" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#627d98', fontSize: 11 }}
                  tickFormatter={(value) => value.slice(5)}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#627d98', fontSize: 11 }}
                  domain={[0, 'auto']}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#081220',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                  }}
                  formatter={(value: number) => [`${value}%`, '孔隙率']}
                />
                <ReferenceLine y={1.0} stroke="#FF6B35" strokeDasharray="5 5" label={{ value: '预警线', fill: '#FF6B35', fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="porosity"
                  stroke="#00D4FF"
                  strokeWidth={2}
                  dot={{ fill: '#00D4FF', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-6">
          <h3 className="font-display font-semibold text-white mb-5">材料状态列表</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {materials.map((material) => (
              <div
                key={material.id}
                className="p-4 bg-space-blue-700/30 rounded-lg border border-tech-cyan-900/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white text-sm">{material.name}</span>
                  <span
                    className={`text-xs font-medium ${
                      material.isSuspended
                        ? 'text-alert-red-400'
                        : material.porosityDeviationCount > 0
                        ? 'text-molten-orange-400'
                        : 'text-neon-green-400'
                    }`}
                  >
                    {material.isSuspended
                      ? '已暂停'
                      : material.porosityDeviationCount > 0
                      ? `${material.porosityDeviationCount}/3 次`
                      : '正常'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-space-blue-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        material.isSuspended
                          ? 'bg-alert-red-500'
                          : material.porosityDeviationCount >= 2
                          ? 'bg-molten-orange-500'
                          : material.porosityDeviationCount >= 1
                          ? 'bg-yellow-500'
                          : 'bg-neon-green-500'
                      }`}
                      style={{ width: `${(material.porosityDeviationCount / 3) * 100}%` }}
                    />
                  </div>
                  {material.isSuspended ? (
                    <button
                      onClick={() => handleResumeMaterial(material.id)}
                      className="p-1.5 bg-neon-green-500/10 text-neon-green-400 rounded hover:bg-neon-green-500/20 transition-colors"
                      title="恢复材料"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSuspendMaterial(material.id)}
                      className="p-1.5 bg-alert-red-500/10 text-alert-red-400 rounded hover:bg-alert-red-500/20 transition-colors"
                      title="暂停材料"
                    >
                      <Pause className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-molten-orange-500/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-molten-orange-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white">通知记录</h3>
            <p className="text-sm text-steel-400">质量告警通知历史</p>
          </div>
        </div>

        <div className="space-y-3">
          {notificationRecords.length === 0 ? (
            <div className="text-center py-8 text-steel-500">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>暂无通知记录</p>
            </div>
          ) : (
            notificationRecords.slice().reverse().map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-4 p-4 rounded-lg border ${
                  item.type === 'quality'
                    ? 'bg-alert-red-500/5 border-alert-red-500/20'
                    : item.type === 'warning'
                    ? 'bg-molten-orange-500/5 border-molten-orange-500/20'
                    : 'bg-tech-cyan-500/5 border-tech-cyan-500/20'
                } ${!item.isRead ? 'ring-1 ring-tech-cyan-500/30' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.type === 'quality'
                      ? 'bg-alert-red-500/20'
                      : item.type === 'warning'
                      ? 'bg-molten-orange-500/20'
                      : 'bg-tech-cyan-500/20'
                  }`}
                >
                  {item.type === 'quality' ? (
                    <AlertOctagon className="w-4 h-4 text-alert-red-400" />
                  ) : item.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-molten-orange-400" />
                  ) : (
                    <Activity className="w-4 h-4 text-tech-cyan-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white text-sm">{item.title}</p>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-tech-cyan-400" />
                    )}
                  </div>
                  <p className="text-xs text-steel-400 mt-1">{item.message}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-steel-500">
                    {new Date(item.createdAt).toLocaleString('zh-CN', {
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-xs text-steel-400 mt-1 flex items-center gap-1 justify-end">
                    <User className="w-3 h-3" />
                    {item.recipientRole === 'scientist' ? '首席科学家' : item.recipientRole}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Quality;
