
import React from 'react';
import { AppTab } from '../types';

interface DashboardProps {
  onNavigate: (tab: AppTab) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
      {/* Hero Module: Module 1 Proforientation */}
      <div className="col-span-1 md:col-span-2 bg-white rounded-[3.5rem] p-12 md:p-16 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group transition-all duration-700 hover:shadow-2xl hover:border-indigo-100">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-50/50 rounded-full blur-[100px] group-hover:bg-indigo-100/70 transition-colors duration-1000"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-50/50 rounded-full blur-[100px] group-hover:bg-purple-100/70 transition-colors duration-1000"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
            </div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">AI-Driven Proforientation 2025</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.05] max-w-xl">
            Design Your Professional <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-[gradient_4s_linear_infinite]">Future with Clarity.</span>
          </h2>
          
          <p className="text-slate-500 mb-14 text-xl leading-relaxed max-w-xl font-medium">
            Our neural engine bridges the gap between your passion, parent expectations, and global market trends in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-6">
            <button 
              onClick={() => onNavigate(AppTab.ASSESSMENT)}
              className="px-12 py-7 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-slate-400 hover:bg-black transition-all hover:-translate-y-1.5 active:translate-y-0 active:scale-95 flex items-center gap-4 group/btn"
            >
              Start Diagnostic
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:translate-x-2 transition-transform">→</span>
            </button>
            <button 
              onClick={() => onNavigate(AppTab.MENTOR)}
              className="px-10 py-7 bg-white border-2 border-slate-100 text-slate-800 rounded-[2rem] font-black text-lg hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm flex items-center gap-4"
            >
              Talk to AI Mentor
              <span className="text-2xl group-hover:animate-bounce">🤖</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side Module: AI Mentor Tips */}
      <div className="bg-slate-900 rounded-[3.5rem] p-12 border border-slate-800 shadow-2xl shadow-slate-400/10 flex flex-col justify-between group transition-all duration-500 hover:-translate-y-2">
        <div>
          <h3 className="text-2xl font-black text-white mb-10 tracking-tight">Mediation Layer</h3>
          <div className="space-y-6">
            <div className="p-7 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 group-hover:bg-white/10 transition-all duration-500">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Conflict Insight</p>
              <p className="text-sm font-bold text-indigo-50 leading-relaxed italic">"Intersections are key. A child wanting Art vs parents wanting Tech finds harmony in Computational Design."</p>
            </div>
            <div className="p-7 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 group-hover:bg-white/10 transition-all duration-500 delay-75">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">Market Data</p>
              <p className="text-sm font-bold text-emerald-50 leading-relaxed">AI analyzes 200+ industries to prove the stability of your chosen path to your family.</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => onNavigate(AppTab.MENTOR)}
          className="mt-12 w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-[0_20px_40px_rgba(79,70,229,0.3)] active:scale-95"
        >
          Consult Specialist
        </button>
      </div>

      {/* Roadmap Stages: Systematic Progress */}
      <div className="col-span-1 md:col-span-3 bg-white rounded-[3.5rem] p-12 md:p-14 border border-slate-100 shadow-xl shadow-slate-200/30 group">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Your Systematic Roadmap</h3>
            <p className="text-slate-400 font-bold text-sm mt-1">Real-time progress tracking via EduPath Cloud</p>
          </div>
          <div className="bg-indigo-50 px-6 py-2.5 rounded-full">
            <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">Stage 2 :Selection Phase</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { stage: '01', title: 'Interest\nDiagnosis', status: 'verified', icon: '🔍', color: 'bg-emerald-50 text-emerald-600' },
            { stage: '02', title: 'Profession\nSelection', status: 'active', icon: '🎯', color: 'bg-indigo-50 text-indigo-600' },
            { stage: '03', title: 'University\nShortlisting', status: 'pending', icon: '🏫', color: 'bg-slate-50 text-slate-400' },
            { stage: '04', title: 'Admissions\nPlanning', status: 'pending', icon: '📝', color: 'bg-slate-50 text-slate-400' },
          ].map((item, idx) => (
            <div 
              key={idx}
              className={`p-10 rounded-[3rem] border transition-all duration-500 group/card relative ${
                item.status === 'active' 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-200 -translate-y-2' 
                : item.status === 'verified'
                  ? 'bg-white border-emerald-100 text-slate-800'
                  : 'bg-slate-50 border-slate-50 text-slate-400 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-10">
                <span className={`text-[11px] font-black uppercase tracking-widest ${item.status === 'active' ? 'text-indigo-200' : 'text-slate-300'}`}>
                  Stage {item.stage}
                </span>
                <span className="text-3xl filter group-hover/card:scale-125 transition-transform duration-500">
                  {item.icon}
                </span>
              </div>
              <p className={`font-black text-2xl leading-tight whitespace-pre-line ${item.status === 'active' ? 'text-white' : 'text-slate-800'}`}>
                {item.title}
              </p>
              
              {item.status === 'active' && (
                <div className="mt-8 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">Current Mission</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
