import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import {
  Upload,
  FileText,
  Zap,
  Thermometer,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import type { ValidationResult } from '../../shared/types';

const NewTask = () => {
  const navigate = useNavigate();
  const { materials, fetchMaterials, createTask } = useAppStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    materialId: '',
    materialName: '',
    laserPower: 200,
    scanSpeed: 1000,
    substrateTemp: 100,
    scanPathFile: '',
  });
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleMaterialSelect = (materialId: string) => {
    const material = materials.find((m) => m.id === materialId);
    setFormData({
      ...formData,
      materialId,
      materialName: material?.name || '',
    });
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      setFormData({ ...formData, scanPathFile: file.name });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFormData({ ...formData, scanPathFile: file.name });
    }
  };

  const validateStep1 = () => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!formData.name.trim()) errors.push('请输入任务名称');
    if (!formData.materialId) errors.push('请选择粉末材料');

    if (!formData.scanPathFile && !fileName) {
      errors.push('请上传扫描路径文件');
    }

    setValidation({ valid: errors.length === 0, errors, warnings });

    if (errors.length === 0) {
      setStep(2);
    }
  };

  const validateStep2 = () => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (formData.laserPower <= 0) {
      errors.push('激光功率必须大于0');
    } else if (formData.laserPower < 50) {
      warnings.push('激光功率偏低，可能导致熔合不良');
    } else if (formData.laserPower > 500) {
      warnings.push('激光功率偏高，可能导致过熔和球化');
    }

    if (formData.scanSpeed <= 0) {
      errors.push('扫描速度必须大于0');
    }

    if (formData.substrateTemp < 20) {
      warnings.push('基板温度较低，可能增加残余应力');
    }

    setValidation({ valid: errors.length === 0, errors, warnings });
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    const newTask = await createTask({
      ...formData,
      createdBy: 'u001',
    });

    if (newTask) {
      navigate(`/tasks/${newTask.id}`);
    }
  };

  const useRecommendedParams = () => {
    if (formData.materialId === 'm001') {
      setFormData({
        ...formData,
        laserPower: 220,
        scanSpeed: 1100,
        substrateTemp: 120,
      });
    } else if (formData.materialId === 'm002') {
      setFormData({
        ...formData,
        laserPower: 195,
        scanSpeed: 900,
        substrateTemp: 100,
      });
    } else {
      setFormData({
        ...formData,
        laserPower: 210,
        scanSpeed: 1050,
        substrateTemp: 110,
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s
                  ? 'bg-tech-cyan-500 text-white'
                  : 'bg-space-blue-700 text-steel-500 border border-tech-cyan-900/30'
              }`}
            >
              {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`w-20 h-0.5 mx-2 ${
                  step > s ? 'bg-tech-cyan-500' : 'bg-tech-cyan-900/30'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-8 space-y-6">
          <div>
            <h3 className="font-display font-semibold text-white text-xl mb-1">基本信息</h3>
            <p className="text-sm text-steel-400">填写任务基本信息和选择粉末材料</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-steel-300 mb-2">任务名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="输入模拟任务名称"
              className="w-full px-4 py-3 bg-space-blue-700/50 border border-tech-cyan-900/30 rounded-lg text-white placeholder-steel-500 focus:outline-none focus:border-tech-cyan-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-steel-300 mb-3">选择粉末材料</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {materials.map((material) => (
                <button
                  key={material.id}
                  onClick={() => handleMaterialSelect(material.id)}
                  disabled={material.isSuspended}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.materialId === material.id
                      ? 'bg-tech-cyan-500/10 border-tech-cyan-500/50'
                      : material.isSuspended
                      ? 'bg-space-blue-800/50 border-tech-cyan-900/20 opacity-50 cursor-not-allowed'
                      : 'bg-space-blue-700/30 border-tech-cyan-900/30 hover:border-tech-cyan-500/30'
                  }`}
                >
                  <p className="font-medium text-white text-sm">{material.name}</p>
                  <p className="text-xs text-steel-400 mt-1">{material.particleSize}</p>
                  {material.isSuspended && (
                    <span className="inline-block mt-2 text-xs text-alert-red-400">已暂停</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-steel-300 mb-2">
              激光扫描路径文件
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                isDragging
                  ? 'border-tech-cyan-500 bg-tech-cyan-500/10'
                  : 'border-tech-cyan-900/30 bg-space-blue-700/20 hover:border-tech-cyan-500/30'
              }`}
            >
              <Upload className="w-10 h-10 mx-auto mb-3 text-steel-400" />
              {fileName ? (
                <div>
                  <p className="text-tech-cyan-400 font-medium">{fileName}</p>
                  <p className="text-xs text-steel-500 mt-1">点击重新选择文件</p>
                </div>
              ) : (
                <div>
                  <p className="text-steel-300">拖拽文件到此处，或点击选择</p>
                  <p className="text-xs text-steel-500 mt-1">支持 .gcode, .cli, .stl 格式</p>
                </div>
              )}
              <input
                type="file"
                accept=".gcode,.cli,.stl"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {validation && (
            <div
              className={`p-4 rounded-lg ${
                validation.valid ? 'bg-neon-green-500/10 border border-neon-green-500/30' : 'bg-alert-red-500/10 border border-alert-red-500/30'
              }`}
            >
              {validation.errors.length > 0 && (
                <div className="space-y-1">
                  {validation.errors.map((err, i) => (
                    <div key={i} className="flex items-center gap-2 text-alert-red-400 text-sm">
                      <XCircle className="w-4 h-4" />
                      {err}
                    </div>
                  ))}
                </div>
              )}
              {validation.warnings.length > 0 && (
                <div className="space-y-1 mt-2">
                  {validation.warnings.map((warn, i) => (
                    <div key={i} className="flex items-center gap-2 text-molten-orange-400 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      {warn}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              onClick={validateStep1}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-tech-cyan-500 to-tech-cyan-600 text-white font-medium rounded-lg hover:from-tech-cyan-400 hover:to-tech-cyan-500 transition-all"
            >
              下一步
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-white text-xl mb-1">工艺参数</h3>
              <p className="text-sm text-steel-400">设置激光功率、扫描速度和基板温度</p>
            </div>
            <button
              onClick={useRecommendedParams}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm rounded-lg hover:bg-purple-500/20 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              智能推荐
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-steel-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-tech-cyan-400" />
                激光功率
              </label>
              <span className="font-mono font-bold text-tech-cyan-400 text-lg">
                {formData.laserPower} W
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              value={formData.laserPower}
              onChange={(e) => setFormData({ ...formData, laserPower: Number(e.target.value) })}
              className="w-full h-2 bg-space-blue-800 rounded-full appearance-none cursor-pointer accent-tech-cyan-500"
            />
            <div className="flex justify-between text-xs text-steel-500 mt-1">
              <span>50 W</span>
              <span>500 W</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-steel-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-molten-orange-400" />
                扫描速度
              </label>
              <span className="font-mono font-bold text-molten-orange-400 text-lg">
                {formData.scanSpeed} mm/s
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="3000"
              step="50"
              value={formData.scanSpeed}
              onChange={(e) => setFormData({ ...formData, scanSpeed: Number(e.target.value) })}
              className="w-full h-2 bg-space-blue-800 rounded-full appearance-none cursor-pointer accent-molten-orange-500"
            />
            <div className="flex justify-between text-xs text-steel-500 mt-1">
              <span>100 mm/s</span>
              <span>3000 mm/s</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-steel-300 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-neon-green-400" />
                基板温度
              </label>
              <span className="font-mono font-bold text-neon-green-400 text-lg">
                {formData.substrateTemp} °C
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="300"
              value={formData.substrateTemp}
              onChange={(e) => setFormData({ ...formData, substrateTemp: Number(e.target.value) })}
              className="w-full h-2 bg-space-blue-800 rounded-full appearance-none cursor-pointer accent-neon-green-500"
            />
            <div className="flex justify-between text-xs text-steel-500 mt-1">
              <span>20 °C</span>
              <span>300 °C</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-space-blue-700/30 rounded-lg">
            <div className="text-center">
              <p className="text-xs text-steel-400 mb-1">能量密度</p>
              <p className="font-mono font-bold text-purple-400">
                {(formData.laserPower / (formData.scanSpeed * 0.1)).toFixed(2)}
              </p>
              <p className="text-xs text-steel-500">J/mm²</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-steel-400 mb-1">线能量</p>
              <p className="font-mono font-bold text-tech-cyan-400">
                {(formData.laserPower / formData.scanSpeed).toFixed(3)}
              </p>
              <p className="text-xs text-steel-500">J/mm</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-steel-400 mb-1">预测精度</p>
              <p className="font-mono font-bold text-neon-green-400">95.2%</p>
              <p className="text-xs text-steel-500">置信度</p>
            </div>
          </div>

          {validation && validation.warnings.length > 0 && (
            <div className="p-4 rounded-lg bg-molten-orange-500/10 border border-molten-orange-500/30">
              {validation.warnings.map((warn, i) => (
                <div key={i} className="flex items-center gap-2 text-molten-orange-400 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  {warn}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-6 py-3 border border-tech-cyan-900/30 text-steel-300 rounded-lg hover:bg-space-blue-700/50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              上一步
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-tech-cyan-500 to-tech-cyan-600 text-white font-medium rounded-lg hover:from-tech-cyan-400 hover:to-tech-cyan-500 transition-all"
            >
              创建任务
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewTask;
