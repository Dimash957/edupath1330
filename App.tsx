
import React, { useState, useEffect } from 'react';
import { AppTab, User, AssessmentResult } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AssessmentWizard from './components/AssessmentWizard';
import UniversityExplorer from './components/UniversityExplorer';
import AdmissionRoadmap from './components/AdmissionRoadmap';
import AiMentor from './components/AiMentor';
import Profile from './components/Profile';
import Auth from './components/Auth';
import { EduPathAPI } from './services/api';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load user session on boot
  useEffect(() => {
    const initSession = async () => {
      try {
        const session = await EduPathAPI.auth.checkSession();
        if (session) {
          // Add default mock data for new profile fields if missing
          const enrichedUser: User = {
            ...session,
            lastName: session.lastName || 'Anderson',
            desiredSurname: session.desiredSurname || 'The Catalyst',
            profileImage: session.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.email}`,
            sportIdol: session.sportIdol || {
              name: 'Michael Jordan',
              image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400'
            }
          };
          setUser(enrichedUser);
          const savedAssessment = await EduPathAPI.assessment.get(session.email);
          setAssessmentResult(savedAssessment);
        }
      } catch (err) {
        console.error("Server connection failed", err);
      } finally {
        setIsInitializing(false);
      }
    };
    initSession();
  }, []);

  const handleLogin = async (newUser: User) => {
    setIsInitializing(true);
    await EduPathAPI.auth.login(newUser.email);
    // Enrich user with mock profile data for demo purposes
    const enrichedUser: User = {
      ...newUser,
      lastName: 'Anderson',
      desiredSurname: 'The Catalyst',
      profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.email}`,
      sportIdol: {
        name: 'Cristiano Ronaldo',
        image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?auto=format&fit=crop&q=80&w=400'
      }
    };
    setUser(enrichedUser);
    const savedAssessment = await EduPathAPI.assessment.get(newUser.email);
    setAssessmentResult(savedAssessment);
    setIsInitializing(false);
  };

  const handleLogout = async () => {
    setIsInitializing(true);
    await EduPathAPI.auth.logout();
    setUser(null);
    setAssessmentResult(null);
    setActiveTab(AppTab.DASHBOARD);
    setIsInitializing(false);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    // Persist in mock database
    localStorage.setItem(`cloud_db_current_session`, JSON.stringify(updatedUser));
  };

  const handleAssessmentReady = async (result: AssessmentResult) => {
    if (user) {
      setIsSyncing(true);
      await EduPathAPI.assessment.save(user.email, result);
      setIsSyncing(false);
    }
    setAssessmentResult(result);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 blur-[80px] opacity-20 animate-pulse"></div>
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center text-white text-5xl font-black shadow-[0_0_50px_rgba(79,70,229,0.4)] animate-bounce relative z-10">
            E
          </div>
        </div>
        <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h2 className="text-white text-2xl font-black tracking-tighter">EduPath AI</h2>
          <div className="mt-4 flex items-center gap-3 justify-center">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce"></span>
            </div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em]">Establishing Secure Tunnel</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    return (
      <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out fill-mode-both">
        {(() => {
          switch (activeTab) {
            case AppTab.DASHBOARD:
              return <Dashboard onNavigate={setActiveTab} />;
            case AppTab.ASSESSMENT:
              return <AssessmentWizard onResultReady={handleAssessmentReady} initialResult={assessmentResult} />;
            case AppTab.UNIVERSITIES:
              return <UniversityExplorer assessmentResult={assessmentResult} userEmail={user.email} />;
            case AppTab.ROADMAP:
              return <AdmissionRoadmap userEmail={user.email} />;
            case AppTab.MENTOR:
              return <AiMentor />;
            case AppTab.PROFILE:
              return <Profile user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />;
            default:
              return <Dashboard onNavigate={setActiveTab} />;
          }
        })()}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFF] selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
      <main className="flex-1 lg:ml-72 p-4 md:p-10 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 group">
              <div className="transition-transform duration-500 group-hover:rotate-[360deg]">
                <h1 className="text-4xl font-black text-slate-900 capitalize tracking-tight flex items-center gap-3">
                   {activeTab.replace('_', ' ')}
                   <span className="text-indigo-600">.</span>
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className={`hidden md:flex items-center gap-3 px-5 py-2.5 rounded-full border transition-all duration-500 ${isSyncing ? 'bg-amber-50 border-amber-100 shadow-amber-100/20' : 'bg-emerald-50 border-emerald-100 shadow-emerald-100/20'} shadow-lg`}>
                <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-bounce'}`}></span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isSyncing ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {isSyncing ? 'Syncing Profile' : 'Cloud Sync Active'}
                </span>
              </div>
              
              <div 
                onClick={() => setActiveTab(AppTab.PROFILE)}
                className={`flex items-center gap-4 p-2.5 pr-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border transition-all group cursor-pointer ${activeTab === AppTab.PROFILE ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-50 hover:border-indigo-100'}`}
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 overflow-hidden flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-200 transform group-hover:scale-110 transition-transform">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user.name.substring(0, 1).toUpperCase()
                  )}
                </div>
                <div>
                  <p className={`text-sm font-black leading-none ${activeTab === AppTab.PROFILE ? 'text-white' : 'text-slate-800'}`}>{user.name}</p>
                  <p className={`text-[9px] font-black uppercase tracking-widest mt-1 opacity-70 group-hover:opacity-100 transition-opacity ${activeTab === AppTab.PROFILE ? 'text-indigo-200' : 'text-indigo-400'}`}>Student Elite</p>
                </div>
              </div>
            </div>
          </header>
          
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
