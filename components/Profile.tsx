
import React, { useState } from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

const SPORT_IDOLS = [
  { name: 'Lionel Messi', image: 'https://images.unsplash.com/photo-1552318975-27db45722363?auto=format&fit=crop&q=80&w=400' },
  { name: 'Cristiano Ronaldo', image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?auto=format&fit=crop&q=80&w=400' },
  { name: 'Michael Jordan', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400' },
  { name: 'Kobe Bryant', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=400' }
];

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    lastName: user.lastName || '',
    desiredSurname: user.desiredSurname || '',
    profileImage: user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
    sportIdol: user.sportIdol || SPORT_IDOLS[0]
  });

  const handleSave = () => {
    onUpdateUser({
      ...user,
      ...formData
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden relative">
        {/* Profile Header Background */}
        <div className="h-48 bg-gradient-to-r from-indigo-600 to-purple-700 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          <div className="absolute -bottom-24 left-16 p-2 bg-white rounded-[3rem] shadow-2xl">
            <div className="w-44 h-44 rounded-[2.5rem] bg-slate-100 overflow-hidden border-4 border-white shadow-inner relative group">
              <img 
                src={formData.profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <button 
                  onClick={() => setFormData({...formData, profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`})}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="text-xs font-black uppercase tracking-widest">Change Avatar</span>
                </button>
              )}
            </div>
          </div>
          <div className="absolute bottom-6 right-16 flex gap-4">
             <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="px-8 py-3 bg-white/90 backdrop-blur rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-800 hover:bg-white transition-all shadow-xl"
              >
                {isEditing ? '💾 Save Changes' : '✏️ Edit Profile'}
              </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-32 px-16 pb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
            <div className="flex-1 w-full space-y-6">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">First Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Last Name</label>
                    <input 
                      type="text" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Desired Surname (Moniker)</label>
                    <input 
                      type="text" 
                      value={formData.desiredSurname}
                      onChange={(e) => setFormData({...formData, desiredSurname: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold"
                      placeholder="e.g. The Catalyst"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                    {user.name} {user.lastName}
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                      Verified Scholar
                    </span>
                  </h2>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Future Moniker:</span>
                    <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 italic">
                      "{user.desiredSurname}"
                    </p>
                  </div>
                </>
              )}
            </div>
            
            <button 
              onClick={onLogout}
              className="px-10 py-5 bg-rose-50 text-rose-600 rounded-[2rem] font-black text-sm hover:bg-rose-600 hover:text-white transition-all shadow-lg active:scale-95 flex items-center gap-3 shrink-0"
            >
              <span>🚪</span> Log out Account
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Sport Idol Section */}
            <div className={`bg-slate-50 rounded-[3rem] p-10 border transition-all duration-500 ${isEditing ? 'border-indigo-200 ring-4 ring-indigo-50' : 'border-slate-100'}`}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Elite Inspiration</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Select Your Sport Idol</p>
                </div>
                <span className="text-3xl">🏆</span>
              </div>
              
              {isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                  {SPORT_IDOLS.map((idol) => (
                    <button 
                      key={idol.name}
                      onClick={() => setFormData({...formData, sportIdol: idol})}
                      className={`relative aspect-square rounded-3xl overflow-hidden border-4 transition-all ${formData.sportIdol.name === idol.name ? 'border-indigo-600 scale-[1.02]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={idol.image} alt={idol.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-center">
                        <p className="text-[8px] font-black text-white uppercase tracking-widest">{idol.name}</p>
                      </div>
                      {formData.sportIdol.name === idol.name && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] text-white">✓</div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="group">
                  <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/3] shadow-2xl mb-8 group-hover:-translate-y-2 transition-transform duration-700">
                    <img 
                      src={user.sportIdol?.image} 
                      alt={user.sportIdol?.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-8 left-8">
                      <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] mb-1">Inspirational Lead</p>
                      <p className="text-2xl font-black text-white tracking-tight">{user.sportIdol?.name}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                    "Success isn't accidental. It's built on the discipline exemplified by {user.sportIdol?.name}."
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats / Achievements */}
            <div className="space-y-6">
              <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100 flex items-center justify-between group">
                <div>
                  <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Diagnostic Score</p>
                  <p className="text-4xl font-black">94.8%</p>
                </div>
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform">📈</div>
              </div>

              <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rank Among Peers</p>
                  <p className="text-4xl font-black text-slate-800">Top 5</p>
                </div>
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl">🥇</div>
              </div>

              <div className="p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                <h4 className="text-lg font-black mb-4 relative z-10">Professional Summary</h4>
                <p className="text-sm text-indigo-100/70 font-medium leading-relaxed relative z-10">
                  Driven by the resilience of {user.sportIdol?.name}, targeting high-tier tech institutions with a specialization in AI Ethics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
