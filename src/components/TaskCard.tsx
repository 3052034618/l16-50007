import { Activity } from 'lucide-react';
import type { SimulationTask } from '../../shared/types';
import StatusBadge from './StatusBadge';
import { useNavigate } from 'react-router-dom';

interface TaskCardProps {
  task: SimulationTask;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      onClick={() => navigate(`/tasks/${task.id}`)}
      className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-5 cursor-pointer card-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-white text-base truncate">{task.name}</h3>
          <p className="text-sm text-steel-400 mt-1">{task.materialName}</p>
        </div>
        <StatusBadge status={task.status} size="sm" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-space-blue-700/50 rounded-lg p-2.5">
          <p className="text-xs text-steel-400 mb-1">激光功率</p>
          <p className="font-mono font-semibold text-tech-cyan-400 text-sm">{task.laserPower} W</p>
        </div>
        <div className="bg-space-blue-700/50 rounded-lg p-2.5">
          <p className="text-xs text-steel-400 mb-1">扫描速度</p>
          <p className="font-mono font-semibold text-tech-cyan-400 text-sm">{task.scanSpeed} mm/s</p>
        </div>
      </div>

      {task.status !== 'completed' && task.status !== 'failed' && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-steel-400">计算进度</span>
            <span className="font-mono text-tech-cyan-400">{task.progress}%</span>
          </div>
          <div className="h-1.5 bg-space-blue-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-tech-cyan-500 to-tech-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}

      {task.status === 'completed' && task.porosity !== null && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <p className="text-xs text-steel-400">孔隙率</p>
            <p className="font-mono text-neon-green-400 text-sm font-semibold">{task.porosity.toFixed(2)}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-steel-400">冷却速率</p>
            <p className="font-mono text-molten-orange-400 text-sm font-semibold">
              {(task.coolingRate! / 1000).toFixed(1)}k/s
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-steel-400">残余应力</p>
            <p className="font-mono text-tech-cyan-400 text-sm font-semibold">
              {task.residualStress!.toFixed(0)} MPa
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-tech-cyan-900/20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-molten-orange-400 to-molten-orange-600 flex items-center justify-center text-xs font-bold text-white">
            ZG
          </div>
          <span className="text-xs text-steel-400">{formatDate(task.createdAt)}</span>
        </div>
        {task.warningCount > 0 && (
          <span className="flex items-center gap-1 text-xs text-molten-orange-400">
            <span className="w-1.5 h-1.5 bg-molten-orange-400 rounded-full animate-pulse"></span>
            {task.warningCount} 次预警
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
