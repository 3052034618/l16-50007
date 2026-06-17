import { useState } from 'react';
import {
  Settings,
  Users,
  Shield,
  Bell,
  Database,
  Palette,
  ChevronRight,
  User,
  MoreHorizontal,
} from 'lucide-react';

const settingsSections = [
  {
    id: 'users',
    label: '用户管理',
    icon: Users,
    description: '管理系统用户和角色权限',
  },
  {
    id: 'roles',
    label: '角色权限',
    icon: Shield,
    description: '配置角色访问权限',
  },
  {
    id: 'notifications',
    label: '通知设置',
    icon: Bell,
    description: '预警和通知推送配置',
  },
  {
    id: 'database',
    label: '数据管理',
    icon: Database,
    description: '数据备份与清理策略',
  },
  {
    id: 'appearance',
    label: '界面外观',
    icon: Palette,
    description: '主题和显示设置',
  },
];

const users = [
  { id: 'u001', name: '张工', role: 'engineer', roleLabel: '工艺工程师', email: 'zhang.gong@example.com' },
  { id: 'u002', name: '李审核', role: 'reviewer', roleLabel: '质量审核员', email: 'li.shenhe@example.com' },
  { id: 'u003', name: '王首席', role: 'scientist', roleLabel: '首席科学家', email: 'wang.shouxi@example.com' },
  { id: 'u004', name: '系统管理员', role: 'admin', roleLabel: '系统管理员', email: 'admin@example.com' },
];

const roleColors: Record<string, string> = {
  engineer: 'bg-tech-cyan-500/10 text-tech-cyan-400',
  reviewer: 'bg-purple-500/10 text-purple-400',
  scientist: 'bg-molten-orange-500/10 text-molten-orange-400',
  admin: 'bg-alert-red-500/10 text-alert-red-400',
};

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('users');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-semibold text-xl text-white">系统设置</h2>
        <p className="text-sm text-steel-400 mt-1">配置系统参数和用户权限</p>
      </div>

      <div className="flex gap-6">
        <div className="w-64 flex-shrink-0">
          <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-2">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeSection === section.id
                      ? 'bg-tech-cyan-500/10 text-tech-cyan-400'
                      : 'text-steel-300 hover:bg-space-blue-700/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium">{section.label}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1">
          {activeSection === 'users' && (
            <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-semibold text-white text-lg">用户管理</h3>
                  <p className="text-sm text-steel-400 mt-1">共 {users.length} 位用户</p>
                </div>
                <button className="px-4 py-2 bg-tech-cyan-500/20 text-tech-cyan-400 text-sm font-medium rounded-lg hover:bg-tech-cyan-500/30 transition-colors">
                  添加用户
                </button>
              </div>

              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-space-blue-700/30 rounded-lg border border-tech-cyan-900/20 hover:border-tech-cyan-500/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-molten-orange-400 to-molten-orange-600 flex items-center justify-center font-bold text-white">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-sm text-steel-400">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                        {user.roleLabel}
                      </span>
                      <button className="p-2 text-steel-400 hover:text-white transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'roles' && (
            <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-6">
              <h3 className="font-display font-semibold text-white text-lg mb-6">角色权限</h3>
              <div className="space-y-4">
                {[
                  { role: '工艺工程师', desc: '创建和管理模拟任务', count: 12, color: 'tech-cyan' },
                  { role: '质量审核员', desc: '两级审批、质量监控', count: 3, color: 'purple' },
                  { role: '首席科学家', desc: '高级权限、材料管理', count: 2, color: 'molten-orange' },
                  { role: '系统管理员', desc: '全部系统管理权限', count: 1, color: 'alert-red' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-space-blue-700/30 rounded-lg border border-tech-cyan-900/20"
                  >
                    <div>
                      <p className="font-medium text-white">{item.role}</p>
                      <p className="text-sm text-steel-400 mt-1">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-steel-400">{item.count} 人</span>
                      <button className="text-tech-cyan-400 text-sm hover:text-tech-cyan-300">
                        编辑权限
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="bg-space-blue-600/50 backdrop-blur-sm border border-tech-cyan-900/30 rounded-xl p-6">
              <h3 className="font-display font-semibold text-white text-lg mb-6">通知设置</h3>
              <div className="space-y-4">
                {[
                  { name: '温度阈值预警', desc: '熔池温度超出安全范围时推送', enabled: true },
                  { name: '孔隙率偏差预警', desc: '材料孔隙率连续偏差时通知', enabled: true },
                  { name: '任务完成通知', desc: '模拟任务完成时推送', enabled: false },
                  { name: '审批提醒', desc: '有待审批任务时通知', enabled: true },
                  { name: '每日统计报告', desc: '每日自动发送模拟完成率统计', enabled: false },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-space-blue-700/30 rounded-lg border border-tech-cyan-900/20"
                  >
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-sm text-steel-400 mt-1">{item.desc}</p>
                    </div>
                    <button
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        item.enabled ? 'bg-tech-cyan-500' : 'bg-space-blue-800'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                          item.enabled ? 'right-1' : 'left-1'
                        }`}
                      ></span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeSection === 'database' || activeSection === 'appearance') && (
            <div className="bg-space-blue-600/30 border border-tech-cyan-900/20 rounded-xl p-12 text-center">
              <Settings className="w-12 h-12 mx-auto mb-4 text-steel-600" />
              <p className="text-steel-400">此功能正在开发中...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
