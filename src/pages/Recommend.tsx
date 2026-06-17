import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Sparkles, TrendingUp, Zap, Target, Check, ChevronDown } from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const Recommend = () => {
  const { materials, recommendations, fetchMaterials, fetchRecommendations, tasks } = useAppStore();
  const [selectedMaterial, setSelectedMaterial] = useState('m001');
  const [showMaterialDropdown, setShowMaterialDropdown] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  useEffect(() => {
    fetchRecommendations(selectedMaterial);
  }, [selectedMaterial, fetchRecommendations]);

  const selectedMaterialData = materials.find((m) => m.id === selectedMaterial);

  const historyData = tasks
    .filter((t) => t.materialId === selectedMaterial && t.status === 'completed')
    .map((t) => ({
      power: t.laserPower,
      speed: t.scanSpeed,
      porosity: t.porosity,
      name: t.name,
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-semibold text-xl text-white">智能工艺推荐</h2>
          <p className="text-sm text-steel-400 mt-1">基于历史模拟数据，AI 智能推荐最优工艺参数</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMaterialDropdown(!showMaterialDropdown)}
            className="flex items-center gap-3 px-4 py-2.5 bg-space-blue-600/50 border border-tech-cyan-900/30 rounded-lg text-white hover:border-tech-cyan-500/30 transition-colors"
          >
            <span className="text-steel-300">材料：</span>
            <span className="font-medium">{selectedMaterialData?.name || '选择材料'}</span>
            <ChevronDown className="w-4 h-4 text-steel-400" />
          </button>

          {showMaterialDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-space-blue-700 border border-tech-cyan-900/30 rounded-lg shadow-xl z-10">
              {materials.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMaterial(m.id);
                    setShowMaterialDropdown(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-space-blue-600 transition-colors ${
                    selectedMaterial === m.id ? 'text-tech-cyan-400 bg-tech-cyan-500/10' : 'text-steel-300'
                  }`}
                >
                  {m.name}
                  {m.isSuspended && <span className="ml-2 text-xs text-alert-red-400">(已暂停)</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`relative bg-space-blue-600/50 backdrop-blur-sm border rounded-xl p-6 card-hover ${
              index === 0
                ? 'border-tech-cyan-500/50 shadow-lg shadow-tech-cyan-500/10'
                : 'border-tech-cyan-900/30'
            }`}
          >
            {index === 0 && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 bg-gradient-to-r from-tech-cyan-500 to-tech-cyan-600 text-white text-xs font-bold rounded-full">
                  最优推荐
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className={`w-5 h-5 ${index === 0 ? 'text-tech-cyan-400' : 'text-steel-400'}`} />
                <span className={`font-medium ${index === 0 ? 'text-white' : 'text-steel-300'}`}>
                  方案 {index + 1}
                </span>
              </div>
              <span className="text-xs font-mono text-steel-400">
                置信度 {(rec.confidence * 100).toFixed(0)}%
              </span>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-steel-400">激光功率</span>
                <span className="font-mono font-semibold text-tech-cyan-400">{rec.laserPower} W</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-steel-400">扫描速度</span>
                <span className="font-mono font-semibold text-molten-orange-400">{rec.scanSpeed} mm/s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-steel-400">基板温度</span>
                <span className="font-mono font-semibold text-neon-green-400">{rec.substrateTemp} °C</span>
              </div>
            </div>

            <div className="pt-4 border-t border-tech-cyan-900/20">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="text-xs text-steel-400 mb-1">预测孔隙率</p>
                  <p className="font-mono font-bold text-neon-green-400">{rec.predictedPorosity}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-steel-400 mb-1">预测强度</p>
                  <p className="font-mono font-bold text-purple-400">{rec.predictedStrength} MPa</p>
                </div>
              </div>
            </div>

            <button
              className={`w-full mt-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                index === 0
                  ? 'bg-gradient-to-r from-tech-cyan-500 to-tech-cyan-600 text-white hover:from-tech-cyan-400 hover:to-tech-cyan-500'
                  : 'bg-space-blue-700/50 text-steel-300 border border-tech-cyan-900/30 hover:border-tech-cyan-500/30'
              }`}
            >
              使用此方案
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white">参数散点分布</h3>
              <p className="text-sm text-steel-400">历史模拟数据分布</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.1)" />
                <XAxis
                  type="number"
                  dataKey="power"
                  name="激光功率"
                  unit=" W"
                  stroke="#627d98"
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="speed"
                  name="扫描速度"
                  unit=" mm/s"
                  stroke="#627d98"
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#081220',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                  }}
                  cursor={{ strokeDasharray: '3 3' }}
                />
                <Scatter data={historyData} fill="#00D4FF" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-tech-cyan-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-tech-cyan-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white">参数敏感性分析</h3>
              <p className="text-sm text-steel-400">各参数对孔隙率的影响程度</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { name: '激光功率', impact: 85, color: 'bg-tech-cyan-500' },
              { name: '扫描速度', impact: 72, color: 'bg-molten-orange-500' },
              { name: '基板温度', impact: 45, color: 'bg-neon-green-500' },
              { name: '光斑直径', impact: 38, color: 'bg-purple-500' },
              { name: '粉层厚度', impact: 28, color: 'bg-yellow-500' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-steel-300">{item.name}</span>
                  <span className="text-sm font-mono text-steel-400">{item.impact}%</span>
                </div>
                <div className="h-2 bg-space-blue-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.impact}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-tech-cyan-500/5 border border-tech-cyan-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-tech-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-tech-cyan-400">优化建议</p>
                <p className="text-xs text-steel-400 mt-1">
                  激光功率对孔隙率影响最大，建议优先调整功率参数以获得最佳致密度。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-6">
        <h3 className="font-display font-semibold text-white mb-5">历史模拟案例</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-tech-cyan-900/30">
                <th className="text-left py-3 px-4 text-xs font-medium text-steel-400 uppercase">任务名称</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-steel-400 uppercase">激光功率</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-steel-400 uppercase">扫描速度</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-steel-400 uppercase">孔隙率</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-steel-400 uppercase">残余应力</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-steel-400 uppercase">状态</th>
              </tr>
            </thead>
            <tbody>
              {tasks
                .filter((t) => t.materialId === selectedMaterial)
                .slice(0, 8)
                .map((task) => (
                  <tr key={task.id} className="border-b border-tech-cyan-900/10">
                    <td className="py-3 px-4 text-sm text-white">{task.name}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm text-tech-cyan-400">{task.laserPower} W</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm text-molten-orange-400">{task.scanSpeed} mm/s</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm text-neon-green-400">
                        {task.porosity !== null ? `${task.porosity.toFixed(2)}%` : '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm text-purple-400">
                        {task.residualStress !== null ? `${task.residualStress.toFixed(0)} MPa` : '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {task.status === 'completed' && task.approvalLevel1 === 'approved' && (
                        <span className="inline-flex items-center gap-1 text-xs text-neon-green-400">
                          <Check className="w-3 h-3" />
                          已验证
                        </span>
                      )}
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

export default Recommend;
