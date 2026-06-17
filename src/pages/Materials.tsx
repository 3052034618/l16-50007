import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  FlaskConical,
  Plus,
  Search,
  Thermometer,
  Zap,
  Layers,
  Droplets,
  Ruler,
  Gauge,
  Pause,
  Play,
  ChevronRight,
} from 'lucide-react';

const Materials = () => {
  const { materials, fetchMaterials } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const filteredMaterials = materials.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.chemicalComposition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selected = materials.find((m) => m.id === selectedMaterial);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-semibold text-xl text-white">材料库管理</h2>
          <p className="text-sm text-steel-400 mt-1">粉末材料参数配置与热物理属性</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-tech-cyan-500 to-tech-cyan-600 text-white font-medium rounded-lg hover:from-tech-cyan-400 hover:to-tech-cyan-500 transition-all">
          <Plus className="w-5 h-5" />
          新增材料
        </button>
      </div>

      <div className="flex gap-6">
        <div className="w-80 flex-shrink-0">
          <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel-400" />
              <input
                type="text"
                placeholder="搜索材料..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-space-blue-700/50 border border-tech-cyan-900/30 rounded-lg text-sm text-white placeholder-steel-500 focus:outline-none focus:border-tech-cyan-500/50 transition-colors"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredMaterials.map((material) => (
                <button
                  key={material.id}
                  onClick={() => setSelectedMaterial(material.id)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedMaterial === material.id
                      ? 'bg-tech-cyan-500/10 border border-tech-cyan-500/30'
                      : 'bg-space-blue-700/30 border border-transparent hover:border-tech-cyan-900/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          material.isSuspended
                            ? 'bg-alert-red-500/10'
                            : material.porosityDeviationCount > 0
                            ? 'bg-molten-orange-500/10'
                            : 'bg-tech-cyan-500/10'
                        }`}
                      >
                        <FlaskConical
                          className={`w-4 h-4 ${
                            material.isSuspended
                              ? 'text-alert-red-400'
                              : material.porosityDeviationCount > 0
                              ? 'text-molten-orange-400'
                              : 'text-tech-cyan-400'
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{material.name}</p>
                        <p className="text-xs text-steel-500">{material.chemicalComposition}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-steel-500" />
                  </div>
                  {material.isSuspended && (
                    <div className="mt-2 pt-2 border-t border-tech-cyan-900/20">
                      <span className="text-xs text-alert-red-400 font-medium">已暂停使用</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          {selected ? (
            <div className="space-y-6">
              <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-tech-cyan-500/20 to-tech-cyan-700/20 border border-tech-cyan-500/30 flex items-center justify-center">
                      <FlaskConical className="w-7 h-7 text-tech-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-white text-xl">{selected.name}</h3>
                      <p className="text-sm text-steel-400 mt-1">{selected.chemicalComposition}</p>
                      <p className="text-xs text-steel-500 mt-1">材料ID: {selected.id}</p>
                    </div>
                  </div>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selected.isSuspended
                        ? 'bg-neon-green-500/10 text-neon-green-400 border border-neon-green-500/30 hover:bg-neon-green-500/20'
                        : 'bg-alert-red-500/10 text-alert-red-400 border border-alert-red-500/30 hover:bg-alert-red-500/20'
                    }`}
                  >
                    {selected.isSuspended ? (
                      <>
                        <Play className="w-4 h-4" />
                        恢复使用
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4" />
                        暂停使用
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Ruler className="w-4 h-4 text-tech-cyan-400" />
                    <span className="text-sm text-steel-300">粒径范围</span>
                  </div>
                  <p className="font-mono font-bold text-white text-lg">{selected.particleSize}</p>
                </div>

                <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Droplets className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-steel-300">密度</span>
                  </div>
                  <p className="font-mono font-bold text-white text-lg">{selected.density} g/cm³</p>
                </div>

                <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Thermometer className="w-4 h-4 text-molten-orange-400" />
                    <span className="text-sm text-steel-300">熔点</span>
                  </div>
                  <p className="font-mono font-bold text-white text-lg">{selected.meltingPoint} K</p>
                </div>

                <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-neon-green-400" />
                    <span className="text-sm text-steel-300">热导率</span>
                  </div>
                  <p className="font-mono font-bold text-white text-lg">{selected.thermalConductivity} W/(m·K)</p>
                </div>

                <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-steel-300">比热容</span>
                  </div>
                  <p className="font-mono font-bold text-white text-lg">{selected.specificHeat} J/(kg·K)</p>
                </div>

                <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Gauge className="w-4 h-4 text-pink-400" />
                    <span className="text-sm text-steel-300">粘度</span>
                  </div>
                  <p className="font-mono font-bold text-white text-lg">{selected.viscosity} Pa·s</p>
                </div>
              </div>

              <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-6">
                <h4 className="font-medium text-white mb-4">质量状态</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-steel-400 mb-2">连续偏差次数</p>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-2xl text-molten-orange-400">
                        {selected.porosityDeviationCount}
                      </span>
                      <span className="text-sm text-steel-500">/ 3 次</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-steel-400 mb-2">使用状态</p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                        selected.isSuspended
                          ? 'bg-alert-red-500/10 text-alert-red-400'
                          : 'bg-neon-green-500/10 text-neon-green-400'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          selected.isSuspended ? 'bg-alert-red-400' : 'bg-neon-green-400'
                        }`}
                      ></span>
                      {selected.isSuspended ? '已暂停' : '正常使用'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-space-blue-600/30 border border-tech-cyan-900/20 rounded-xl p-12 text-center">
              <FlaskConical className="w-12 h-12 mx-auto mb-4 text-steel-600" />
              <p className="text-steel-400">请从左侧选择一种材料查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Materials;
