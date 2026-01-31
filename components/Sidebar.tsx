
import React from 'react';
import { AppTab } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onLogout }) => {
  const navItems = [
    { id: AppTab.DASHBOARD, label: 'Dashboard', icon: '📊' },
    { id: AppTab.ASSESSMENT, label: 'Choose Profession', icon: '🎯' },
    { id: AppTab.UNIVERSITIES, label: 'Universities', icon: '🏫' },
    { id: AppTab.ROADMAP, label: 'Admission Map', icon: '🗺️' },
    { id: AppTab.MENTOR, label: 'AI Mentor', icon: '🤖' },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-100 z-50 hidden lg:flex flex-col shadow-[1px_0_0_rgba(0,0,0,0.03)]">
      <div className="p-10">
        <div className="flex items-center gap-4 mb-14 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-indigo-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            E
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">EduPath<span className="text-indigo-600">.</span></span>
        </div>

        <nav className="space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4.5 rounded-[1.5rem] text-sm font-bold transition-all duration-300 relative group ${
                activeTab === item.id
                  ? 'bg-slate-900 text-white shadow-2xl shadow-slate-300'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className={`text-xl transition-transform duration-500 group-hover:scale-125 ${activeTab === item.id ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              <span className="relative z-10">{item.label}</span>
              {activeTab === item.id && (
                <span className="absolute right-6 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(129,140,248,0.8)]"></span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-10 space-y-6">
        <div className="bg-slate-900 rounded-[2.5rem] p-7 text-white shadow-2xl shadow-slate-400/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
          <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2 relative z-10">Premium Mentor</p>
          <p className="text-sm font-bold opacity-90 mb-6 leading-relaxed relative z-10">Facing complex choices? Talk to your AI expert now.</p>
          <button 
            onClick={() => onTabChange(AppTab.MENTOR)}
            className="w-full py-3.5 bg-white text-slate-900 rounded-2xl text-[11px] font-black hover:bg-indigo-50 transition-all shadow-xl active:scale-95 relative z-10"
          >
            START SESSION
          </button>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full py-4 px-6 flex items-center gap-4 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all duration-300 text-sm font-black group"
        >
          <span className="text-xl group-hover:rotate-12 transition-transform">🚪</span> 
          <span>Logout System</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
