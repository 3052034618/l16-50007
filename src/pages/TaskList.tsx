import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import TaskCard from '@/components/TaskCard';
import { Plus, Search, Filter, Grid3X3, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { TaskStatus } from '../../shared/types';

const statusFilters: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'pending_verify', label: '待校验' },
  { value: 'parsing', label: '解析中' },
  { value: 'computing', label: '计算中' },
  { value: 'analyzing', label: '分析中' },
  { value: 'completed', label: '已完成' },
  { value: 'failed', label: '失败' },
];

const TaskList = () => {
  const navigate = useNavigate();
  const { tasks, fetchTasks, loading } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<TaskStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (activeFilter === 'all') {
      fetchTasks();
    } else {
      fetchTasks(activeFilter);
    }
  }, [activeFilter, fetchTasks]);

  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.materialName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel-400" />
            <input
              type="text"
              placeholder="搜索任务名称或材料..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-space-blue-600/50 border border-tech-cyan-900/30 rounded-lg text-sm text-white placeholder-steel-500 focus:outline-none focus:border-tech-cyan-500/50 transition-colors"
            />
          </div>

          <button className="p-2.5 bg-space-blue-600/50 border border-tech-cyan-900/30 rounded-lg text-steel-300 hover:text-white hover:border-tech-cyan-500/30 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-space-blue-600/50 border border-tech-cyan-900/30 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-tech-cyan-500/20 text-tech-cyan-400' : 'text-steel-400 hover:text-white'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-tech-cyan-500/20 text-tech-cyan-400' : 'text-steel-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => navigate('/tasks/new')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-tech-cyan-500 to-tech-cyan-600 text-white font-medium rounded-lg hover:from-tech-cyan-400 hover:to-tech-cyan-500 transition-all shadow-lg shadow-tech-cyan-500/20"
          >
            <Plus className="w-5 h-5" />
            新建任务
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === filter.value
                ? 'bg-tech-cyan-500/20 text-tech-cyan-400 border border-tech-cyan-500/30'
                : 'bg-space-blue-600/50 text-steel-300 border border-transparent hover:border-tech-cyan-900/30'
            }`}
          >
            {filter.label}
            <span className="ml-2 opacity-60">
              {filter.value === 'all'
                ? tasks.length
                : tasks.filter((t) => t.status === filter.value).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-tech-cyan-500/30 border-t-tech-cyan-500 rounded-full animate-spin"></div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-space-blue-700/50">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-medium text-steel-400 uppercase tracking-wider">
                  任务名称
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-steel-400 uppercase tracking-wider">
                  材料
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-steel-400 uppercase tracking-wider">
                  激光功率
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-steel-400 uppercase tracking-wider">
                  扫描速度
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-steel-400 uppercase tracking-wider">
                  状态
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-steel-400 uppercase tracking-wider">
                  进度
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-steel-400 uppercase tracking-wider">
                  创建时间
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="border-t border-tech-cyan-900/10 hover:bg-space-blue-700/30 cursor-pointer transition-colors"
                >
                  <td className="py-4 px-6">
                    <p className="font-medium text-white">{task.name}</p>
                  </td>
                  <td className="py-4 px-6 text-sm text-steel-300">{task.materialName}</td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-tech-cyan-400">{task.laserPower} W</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-tech-cyan-400">{task.scanSpeed} mm/s</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-20 h-1.5 bg-space-blue-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-tech-cyan-500 rounded-full"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-steel-400">
                    {new Date(task.createdAt).toLocaleDateString('zh-CN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredTasks.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-space-blue-700/50 flex items-center justify-center">
            <Search className="w-8 h-8 text-steel-500" />
          </div>
          <p className="text-steel-400">未找到匹配的任务</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
