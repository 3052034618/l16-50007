import { Bell, Search, Maximize2, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const Header = () => {
  const activeNav = useAppStore((state) => state.activeNav);

  const titles: Record<string, string> = {
    dashboard: '控制台',
    tasks: '任务中心',
    'new-task': '新建模拟任务',
    recommend: '智能工艺推荐',
    approval: '审批中心',
    quality: '质量监控中心',
    materials: '材料库管理',
    settings: '系统设置',
  };

  return (
    <header className="h-16 bg-space-blue-600/80 backdrop-blur-sm border-b border-tech-cyan-900/30 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="font-display font-semibold text-xl text-white">
          {titles[activeNav] || '控制台'}
        </h2>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-space-blue-700/50 rounded-lg border border-tech-cyan-900/30">
          <span className="w-2 h-2 rounded-full bg-neon-green-500 animate-pulse"></span>
          <span className="text-xs text-steel-300">系统运行正常</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel-400" />
          <input
            type="text"
            placeholder="搜索任务、材料..."
            className="w-64 pl-10 pr-4 py-2 bg-space-blue-700/50 border border-tech-cyan-900/30 rounded-lg text-sm text-white placeholder-steel-500 focus:outline-none focus:border-tech-cyan-500/50 transition-colors"
          />
        </div>

        <button className="p-2 rounded-lg hover:bg-space-blue-700 text-steel-300 hover:text-white transition-colors">
          <RefreshCw className="w-5 h-5" />
        </button>

        <button className="p-2 rounded-lg hover:bg-space-blue-700 text-steel-300 hover:text-white transition-colors">
          <Maximize2 className="w-5 h-5" />
        </button>

        <button className="relative p-2 rounded-lg hover:bg-space-blue-700 text-steel-300 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-alert-red-500 rounded-full"></span>
        </button>

        <div className="text-right pl-4 border-l border-tech-cyan-900/30">
          <p className="text-xs text-steel-400">2026年6月17日</p>
          <p className="text-sm font-mono text-tech-cyan-400">14:32:18</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
