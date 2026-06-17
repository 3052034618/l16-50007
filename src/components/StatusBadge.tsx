import type { TaskStatus, ApprovalStatus } from '../../shared/types';

interface StatusBadgeProps {
  status: TaskStatus | ApprovalStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; dotColor: string }> = {
  pending_verify: {
    label: '待校验',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10 border-yellow-500/30',
    dotColor: 'bg-yellow-400',
  },
  parsing: {
    label: '参数解析',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/30',
    dotColor: 'bg-blue-400',
  },
  computing: {
    label: '耦合计算中',
    color: 'text-tech-cyan-400',
    bgColor: 'bg-tech-cyan-500/10 border-tech-cyan-500/30',
    dotColor: 'bg-tech-cyan-400',
  },
  analyzing: {
    label: '熔池分析',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/30',
    dotColor: 'bg-purple-400',
  },
  completed: {
    label: '已完成',
    color: 'text-neon-green-400',
    bgColor: 'bg-neon-green-500/10 border-neon-green-500/30',
    dotColor: 'bg-neon-green-400',
  },
  failed: {
    label: '失败',
    color: 'text-alert-red-400',
    bgColor: 'bg-alert-red-500/10 border-alert-red-500/30',
    dotColor: 'bg-alert-red-400',
  },
  rollback: {
    label: '异常回退',
    color: 'text-molten-orange-400',
    bgColor: 'bg-molten-orange-500/10 border-molten-orange-500/30',
    dotColor: 'bg-molten-orange-400',
  },
  pending: {
    label: '待审批',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10 border-yellow-500/30',
    dotColor: 'bg-yellow-400',
  },
  approved: {
    label: '已通过',
    color: 'text-neon-green-400',
    bgColor: 'bg-neon-green-500/10 border-neon-green-500/30',
    dotColor: 'bg-neon-green-400',
  },
  rejected: {
    label: '已驳回',
    color: 'text-alert-red-400',
    bgColor: 'bg-alert-red-500/10 border-alert-red-500/30',
    dotColor: 'bg-alert-red-400',
  },
};

const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.pending;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bgColor} ${config.color} ${sizeClasses} font-medium`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} ${status === 'computing' ? 'animate-pulse' : ''}`}></span>
      {config.label}
    </span>
  );
};

export default StatusBadge;
