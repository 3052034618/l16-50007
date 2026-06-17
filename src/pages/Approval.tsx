import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  MessageSquare,
  FileText,
  Zap,
  Printer,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { useNavigate } from 'react-router-dom';

const Approval = () => {
  const { tasks, fetchTasks, approveTask, rejectTask, warningRecords, fetchWarningRecords } = useAppStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [approvalType, setApprovalType] = useState<'approve' | 'reject'>('approve');

  useEffect(() => {
    fetchTasks('completed');
  }, [fetchTasks]);

  useEffect(() => {
    if (selectedTask && activeTab === 'history') {
      fetchWarningRecords(selectedTask);
    }
  }, [selectedTask, activeTab, fetchWarningRecords]);

  const pendingTasks = tasks.filter(
    (t) => t.approvalLevel1 === 'pending' || t.approvalLevel2 === 'pending'
  );

  const handleApprove = (taskId: string, level: 1 | 2) => {
    setSelectedTask(taskId);
    setApprovalType('approve');
    setShowCommentModal(true);
  };

  const handleReject = (taskId: string, level: 1 | 2) => {
    setSelectedTask(taskId);
    setApprovalType('reject');
    setShowCommentModal(true);
  };

  const submitApproval = () => {
    if (selectedTask) {
      const level = tasks.find((t) => t.id === selectedTask)?.approvalLevel1 === 'pending' ? 1 : 2;
      if (approvalType === 'approve') {
        approveTask(selectedTask, level as 1 | 2, comment);
      } else {
        rejectTask(selectedTask, level as 1 | 2, comment);
      }
      setShowCommentModal(false);
      setComment('');
      setSelectedTask(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-semibold text-xl text-white">审批中心</h2>
          <p className="text-sm text-steel-400 mt-1">两级审批流程，确保模拟结果质量</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-tech-cyan-900/30">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'pending'
              ? 'border-tech-cyan-500 text-tech-cyan-400'
              : 'border-transparent text-steel-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          待审批
          <span className="px-2 py-0.5 text-xs bg-alert-red-500/20 text-alert-red-400 rounded-full">
            {pendingTasks.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-tech-cyan-500 text-tech-cyan-400'
              : 'border-transparent text-steel-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          审批历史
        </button>
      </div>

      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingTasks.length === 0 ? (
            <div className="text-center py-16 bg-space-blue-600/30 rounded-xl border border-tech-cyan-900/20">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-neon-green-500" />
              <p className="text-steel-300">暂无待审批任务</p>
              <p className="text-sm text-steel-500 mt-1">所有任务都已处理完毕</p>
            </div>
          ) : (
            pendingTasks.map((task) => {
              const level = task.approvalLevel1 === 'pending' ? 1 : 2;
              return (
                <div
                  key={task.id}
                  className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-display font-semibold text-white text-lg">{task.name}</h3>
                        <StatusBadge status={task.status} size="sm" />
                        <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full">
                          第{level}级审批
                        </span>
                      </div>
                      <p className="text-sm text-steel-400 mt-1">
                        材料：{task.materialName} · 创建时间：
                        {new Date(task.createdAt).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReject(task.id, level as 1 | 2)}
                        className="flex items-center gap-2 px-4 py-2 bg-alert-red-500/10 text-alert-red-400 border border-alert-red-500/30 rounded-lg hover:bg-alert-red-500/20 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        驳回
                      </button>
                      <button
                        onClick={() => handleApprove(task.id, level as 1 | 2)}
                        className="flex items-center gap-2 px-4 py-2 bg-neon-green-500/10 text-neon-green-400 border border-neon-green-500/30 rounded-lg hover:bg-neon-green-500/20 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        通过
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-space-blue-700/50 rounded-lg p-3">
                      <p className="text-xs text-steel-400 mb-1">激光功率</p>
                      <p className="font-mono font-semibold text-tech-cyan-400">{task.laserPower} W</p>
                    </div>
                    <div className="bg-space-blue-700/50 rounded-lg p-3">
                      <p className="text-xs text-steel-400 mb-1">扫描速度</p>
                      <p className="font-mono font-semibold text-molten-orange-400">
                        {task.scanSpeed} mm/s
                      </p>
                    </div>
                    <div className="bg-space-blue-700/50 rounded-lg p-3">
                      <p className="text-xs text-steel-400 mb-1">孔隙率</p>
                      <p className="font-mono font-semibold text-neon-green-400">
                        {task.porosity?.toFixed(2)}%
                      </p>
                    </div>
                    <div className="bg-space-blue-700/50 rounded-lg p-3">
                      <p className="text-xs text-steel-400 mb-1">残余应力</p>
                      <p className="font-mono font-semibold text-purple-400">
                        {task.residualStress?.toFixed(0)} MPa
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-tech-cyan-900/20 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-molten-orange-400 to-molten-orange-600 flex items-center justify-center text-xs font-bold text-white">
                        ZG
                      </div>
                      <span className="text-sm text-steel-400">张工 提交</span>
                    </div>
                    {task.warningCount > 0 && (
                      <span className="flex items-center gap-1 text-xs text-molten-orange-400">
                        <Zap className="w-3 h-3" />
                        {task.warningCount} 次预警
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-space-blue-700/50">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-medium text-steel-400 uppercase">任务名称</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-steel-400 uppercase">材料</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-steel-400 uppercase">一级审批</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-steel-400 uppercase">二级审批</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-steel-400 uppercase">切片状态</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-steel-400 uppercase">操作</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-steel-400 uppercase">时间</th>
              </tr>
            </thead>
            <tbody>
              {tasks
                .filter((t) => t.approvalLevel1 !== 'pending' || t.approvalLevel2 !== 'pending')
                .slice(0, 10)
                .map((task) => (
                  <tr key={task.id} className="border-t border-tech-cyan-900/10">
                    <td className="py-4 px-6">
                      <p className="text-white font-medium">{task.name}</p>
                    </td>
                    <td className="py-4 px-6 text-sm text-steel-300">{task.materialName}</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={task.approvalLevel1} size="sm" />
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={task.approvalLevel2} size="sm" />
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        task.slicingStatus === 'completed'
                          ? 'bg-neon-green-500/20 text-neon-green-400'
                          : task.slicingStatus === 'processing'
                          ? 'bg-tech-cyan-500/20 text-tech-cyan-400'
                          : task.slicingStatus === 'failed'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-steel-500/20 text-steel-400'
                      }`}>
                        {task.slicingStatus === 'completed' ? (
                          <><Printer className="w-3 h-3" /> 已生成指令</>
                        ) : task.slicingStatus === 'processing' ? (
                          <><Clock className="w-3 h-3" /> 处理中</>
                        ) : task.slicingStatus === 'failed' ? (
                          <><XCircle className="w-3 h-3" /> 失败</>
                        ) : task.slicingStatus === 'pending' ? (
                          <><Clock className="w-3 h-3" /> 待推送</>
                        ) : (
                          '不适用'
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/tasks/${task.id}`)}
                          className="p-1.5 rounded-lg bg-tech-cyan-500/10 text-tech-cyan-400 hover:bg-tech-cyan-500/20 transition-colors"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {task.warningCount > 0 && (
                          <button
                            onClick={() => {
                              setSelectedTask(task.id);
                              navigate(`/tasks/${task.id}`);
                            }}
                            className="p-1.5 rounded-lg bg-molten-orange-500/10 text-molten-orange-400 hover:bg-molten-orange-500/20 transition-colors"
                            title={`${task.warningCount}条预警记录`}
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-steel-400">
                      {new Date(task.updatedAt).toLocaleDateString('zh-CN')}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {showCommentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-space-blue-600 border border-tech-cyan-900/30 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="font-display font-semibold text-white text-lg mb-4">
              {approvalType === 'approve' ? '审批通过' : '审批驳回'}
            </h3>
            <div className="mb-4">
              <label className="block text-sm text-steel-300 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                审批意见
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="请输入审批意见..."
                rows={4}
                className="w-full px-4 py-3 bg-space-blue-700/50 border border-tech-cyan-900/30 rounded-lg text-white placeholder-steel-500 focus:outline-none focus:border-tech-cyan-500/50 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCommentModal(false)}
                className="px-4 py-2 text-steel-300 hover:text-white transition-colors"
              >
                取消
              </button>
              <button
                onClick={submitApproval}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  approvalType === 'approve'
                    ? 'bg-neon-green-500/20 text-neon-green-400 border border-neon-green-500/30 hover:bg-neon-green-500/30'
                    : 'bg-alert-red-500/20 text-alert-red-400 border border-alert-red-500/30 hover:bg-alert-red-500/30'
                }`}
              >
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approval;
