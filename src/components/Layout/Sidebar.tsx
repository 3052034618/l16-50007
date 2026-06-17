import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListTodo,
  PlusCircle,
  Sparkles,
  CheckSquare,
  Activity,
  FlaskConical,
  Settings,
  Zap,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const navItems = [
  { id: 'dashboard', label: '控制台', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'tasks', label: '任务中心', icon: ListTodo, path: '/tasks' },
  { id: 'new-task', label: '新建任务', icon: PlusCircle, path: '/tasks/new' },
  { id: 'recommend', label: '智能推荐', icon: Sparkles, path: '/recommend' },
  { id: 'approval', label: '审批中心', icon: CheckSquare, path: '/approval' },
  { id: 'quality', label: '质量监控', icon: Activity, path: '/quality' },
  { id: 'materials', label: '材料库', icon: FlaskConical, path: '/materials' },
  { id: 'settings', label: '系统设置', icon: Settings, path: '/settings' },
];

const Sidebar = () => {
  const activeNav = useAppStore((state) => state.activeNav);
  const setActiveNav = useAppStore((state) => state.setActiveNav);

  return (
    <aside className="w-64 h-screen bg-space-blue-700 border-r border-tech-cyan-900/50 flex flex-col">
      <div className="p-6 border-b border-tech-cyan-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-tech-cyan-500 to-tech-cyan-700 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-white">MeltSim Pro</h1>
            <p className="text-xs text-steel-400">熔池动力学模拟平台</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => setActiveNav(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-tech-cyan-500/10 text-tech-cyan-400 border border-tech-cyan-500/30 shadow-lg shadow-tech-cyan-500/10'
                  : 'text-steel-300 hover:bg-space-blue-600 hover:text-white border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-tech-cyan-400' : ''}`} />
              <span className="font-medium text-sm">{item.label}</span>
              {item.id === 'approval' && (
                <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-alert-red-500/20 text-alert-red-400 rounded-full">
                  3
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-tech-cyan-900/30">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-molten-orange-400 to-molten-orange-600 flex items-center justify-center font-bold text-white text-sm">
              ZG
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">张工</p>
              <p className="text-xs text-steel-400">工艺工程师</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
