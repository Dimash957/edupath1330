
import React, { useState, useEffect } from 'react';
import { INITIAL_ROADMAP } from '../constants';
import { RoadmapStep } from '../types';
import { EduPathAPI } from '../services/api';

interface Props {
  userEmail: string;
}

const AdmissionRoadmap: React.FC<Props> = ({ userEmail }) => {
  const [steps, setSteps] = useState<RoadmapStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const loadRoadmap = async () => {
      setIsLoading(true);
      try {
        const saved = await EduPathAPI.roadmap.get(userEmail);
        setSteps(saved || INITIAL_ROADMAP);
      } finally {
        setIsLoading(false);
      }
    };
    loadRoadmap();
  }, [userEmail]);

  const syncWithServer = async (updatedSteps: RoadmapStep[]) => {
    setIsSyncing(true);
    try {
      await EduPathAPI.roadmap.update(userEmail, updatedSteps);
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleComplete = async (id: string) => {
    const updatedSteps = steps.map(step => 
      step.id === id ? { ...step, completed: !step.completed } : step
    );
    setSteps(updatedSteps);
    await syncWithServer(updatedSteps);
  };

  const addStep = async () => {
    const title = prompt("Enter specific milestone title:");
    if (!title) return;
    
    const newStep: RoadmapStep = {
      id: Date.now().toString(),
      title,
      date: new Date().toISOString().split('T')[0],
      completed: false,
      type: 'Program'
    };
    const updatedSteps = [...steps, newStep];
    setSteps(updatedSteps);
    await syncWithServer(updatedSteps);
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-40 bg-white rounded-[3rem] border border-slate-100"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="bg-white rounded-[4rem] p-10 md:p-16 border border-slate-100 shadow-xl shadow-slate-200/30 relative overflow-hidden">
        {/* Visual Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-[80px] -mr-32 -mt-32"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 relative z-10">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Mission Roadmap<span className="text-indigo-600">.</span></h2>
            <p className="text-slate-400 text-lg font-bold mt-2 italic">A precise chronological path to your elite admission.</p>
          </div>
          <button 
            onClick={addStep}
            className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-sm hover:bg-black hover:scale-105 transition-all shadow-2xl active:scale-95 flex items-center gap-3"
          >
            <span>+</span> New Strategic Milestone
          </button>
        </div>

        <div className="relative space-y-16 before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-[4px] before:bg-slate-100 before:rounded-full">
          {steps.map((step, idx) => (
            <div key={step.id} className="relative pl-20 group animate-in slide-in-from-left duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
              <button 
                onClick={() => toggleComplete(step.id)}
                className={`absolute left-0 top-1 w-14 h-14 rounded-3xl border-[6px] flex items-center justify-center text-xl transition-all duration-500 z-10 ${
                  step.completed 
                  ? 'bg-emerald-500 border-white text-white shadow-[0_15px_30px_rgba(16,185,129,0.3)]' 
                  : 'bg-white border-slate-50 text-slate-200 hover:border-indigo-400 hover:text-indigo-400 hover:scale-110 shadow-lg'
                }`}
              >
                {step.completed ? '✓' : '○'}
              </button>
              
              <div className={`p-10 rounded-[3.5rem] border-2 transition-all duration-700 ${
                step.completed 
                ? 'bg-slate-50/80 border-slate-100 opacity-60 grayscale' 
                : 'bg-white border-slate-50 hover:border-indigo-200 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:shadow-indigo-50/50 hover:-translate-y-2'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                  <div className="space-y-2">
                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                      step.completed ? 'text-slate-400' : 'text-indigo-500'
                    }`}>
                      {step.type} Milestone
                    </span>
                    <h4 className={`text-2xl font-black transition-all leading-tight ${step.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                      {step.title}
                    </h4>
                  </div>
                  
                  <div className={`px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 ${
                    step.completed ? 'bg-slate-200 text-slate-500' :
                    step.type === 'Exam' ? 'bg-orange-100 text-orange-700' :
                    step.type === 'Submission' ? 'bg-indigo-100 text-indigo-700' :
                    step.type === 'Document' ? 'bg-purple-100 text-purple-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-current"></span>
                    {step.completed ? 'Completed' : step.type}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-8">
                  <div className="flex items-center gap-3 text-sm text-slate-500 font-black">
                    <span className="text-2xl filter group-hover:drop-shadow-md transition-all">📅</span> 
                    {new Date(step.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  
                  {!step.completed && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                      Status: Pending Attention
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom Sync Indicator */}
        <div className="mt-20 pt-10 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
           <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-lg">☁️</div>
             <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Permanent Cloud Persistence Enabled</p>
           </div>
           {isSyncing && (
             <div className="flex items-center gap-3 px-6 py-3 bg-amber-50 rounded-full border border-amber-100 animate-pulse">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Encrypting Session Data</span>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdmissionRoadmap;
