
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_UNIVERSITIES } from '../constants';
import { University, AssessmentResult, ProgramLevel } from '../types';
import { EduPathAPI } from '../services/api';

interface Props {
  assessmentResult: AssessmentResult | null;
  userEmail: string;
}

interface SelectedProgram {
  uniId: string;
  programName: string;
}

const UniversityExplorer: React.FC<Props> = ({ assessmentResult, userEmail }) => {
  const [uniSearch, setUniSearch] = useState('');
  const [programSearch, setProgramSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [matchFilter, setMatchFilter] = useState<string>('All');
  const [durationFilter, setDurationFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [selectedPrograms, setSelectedPrograms] = useState<SelectedProgram[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const list = await EduPathAPI.shortlist.get(userEmail);
        setShortlist(list);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [userEmail]);

  const toggleShortlist = async (uniId: string) => {
    const updated = await EduPathAPI.shortlist.toggle(userEmail, uniId);
    setShortlist(updated);
  };

  const processedUniversities = useMemo(() => {
    return MOCK_UNIVERSITIES.map(uni => {
      let status: 'Reach' | 'Match' | 'Safety' | 'Unknown' = 'Unknown';
      let programMatch = false;
      let score = 0;
      
      if (assessmentResult) {
        const userSat = assessmentResult.academicTargets.sat;
        const userIelts = assessmentResult.academicTargets.ielts;
        const diff = userSat - uni.minSat;
        
        if (diff < -50 || userIelts < uni.minIelts) status = 'Reach';
        else if (diff >= -50 && diff < 100) status = 'Match';
        else status = 'Safety';

        const recommendedMajor = assessmentResult.recommendedMajor.toLowerCase();
        programMatch = uni.programs.some(p => {
          const pLower = p.toLowerCase();
          return pLower.includes(recommendedMajor) || recommendedMajor.includes(pLower);
        });

        if (programMatch) score += 40;
        if (assessmentResult.locationPreference !== 'Global' && uni.region === assessmentResult.locationPreference) score += 20;
      }

      return { ...uni, status, programMatch, matchScore: score };
    });
  }, [assessmentResult]);

  const filteredUniversities = processedUniversities.filter(uni => {
    const matchesUni = uni.name.toLowerCase().includes(uniSearch.toLowerCase()) || 
                      uni.location.toLowerCase().includes(uniSearch.toLowerCase());
    
    const matchesProgram = programSearch === '' || 
                          uni.programs.some(p => p.toLowerCase().includes(programSearch.toLowerCase()));

    const matchesRegion = regionFilter === 'All' || uni.region === regionFilter;
    const matchesStatus = matchFilter === 'All' || uni.status === matchFilter;
    const matchesDuration = durationFilter === 'All' || uni.duration.toLowerCase().includes(durationFilter.toLowerCase());
    const matchesType = typeFilter === 'All' || uni.programType === typeFilter;
    
    return matchesUni && matchesProgram && matchesRegion && matchesStatus && matchesDuration && matchesType;
  }).sort((a, b) => {
    // Priority sorting: Match score first, then alphabetically
    if (b.matchScore !== a.matchScore) return (b.matchScore || 0) - (a.matchScore || 0);
    return a.name.localeCompare(b.name);
  });

  const toggleProgramSelection = (uniId: string, programName: string) => {
    const isSelected = selectedPrograms.some(p => p.uniId === uniId && p.programName === programName);
    if (isSelected) {
      setSelectedPrograms(prev => prev.filter(p => !(p.uniId === uniId && p.programName === programName)));
    } else {
      if (selectedPrograms.length >= 3) return;
      setSelectedPrograms(prev => [...prev, { uniId, programName }]);
    }
  };

  const comparisonData = useMemo(() => {
    return selectedPrograms.map(selection => {
      const uni = MOCK_UNIVERSITIES.find(u => u.id === selection.uniId);
      return { selection, uni };
    });
  }, [selectedPrograms]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-96 bg-white rounded-[3rem] border border-slate-100"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/* Side-by-Side Comparison Modal */}
      {showComparison && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="bg-white rounded-[4rem] w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-500">
            {/* Modal Header */}
            <div className="p-10 md:p-12 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-3">Program Decision Matrix</h2>
                <p className="text-slate-500 font-medium text-lg">Cross-referencing your top {selectedPrograms.length} selections for final admission choice.</p>
              </div>
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setSelectedPrograms([])}
                  className="px-6 py-3 text-xs font-black text-rose-500 uppercase tracking-[0.2em] hover:bg-rose-50 rounded-2xl transition-all"
                >
                  Clear All Selection
                </button>
                <button 
                  onClick={() => setShowComparison(false)}
                  className="w-16 h-16 rounded-3xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-all font-bold border border-slate-100 shadow-sm"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>
            </div>
            
            {/* Modal Content - Comparison Grid */}
            <div className="flex-1 overflow-auto p-12 bg-white">
              <div className="grid grid-cols-4 gap-12 min-w-[1050px]">
                {/* Comparison Labels Column */}
                <div className="space-y-10 pt-[240px]">
                  <div className="h-16 flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] border-b border-slate-50">University</div>
                  <div className="h-16 flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] border-b border-slate-50">Degree Level</div>
                  <div className="h-16 flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] border-b border-slate-50">Location</div>
                  <div className="h-16 flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] border-b border-slate-50">Duration</div>
                  <div className="h-24 flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] border-b border-slate-50">Tuition Fees</div>
                  <div className="h-24 flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] border-b border-slate-50">Job Placement</div>
                  <div className="h-16 flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] border-b border-slate-50">Min. Requirements</div>
                </div>

                {/* Data Columns */}
                {comparisonData.map(({ selection, uni }, idx) => (
                  <div key={`${selection.uniId}-${selection.programName}`} className={`space-y-10 animate-in slide-in-from-right-${(idx + 1) * 4} duration-500`}>
                    <div className="h-[240px] flex flex-col items-center text-center">
                      <div className="w-36 h-36 rounded-[3rem] overflow-hidden mb-6 shadow-2xl ring-[12px] ring-slate-50 relative group">
                        <img src={uni?.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={uni?.name} />
                        <div className="absolute inset-0 bg-indigo-600/10 mix-blend-multiply"></div>
                      </div>
                      <h3 className="text-2xl font-black text-slate-800 leading-tight h-14 overflow-hidden">{selection.programName}</h3>
                      <div className="mt-2 flex items-center gap-2 justify-center">
                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                        <p className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em]">{uni?.name}</p>
                      </div>
                    </div>

                    <div className="h-16 flex items-center justify-center font-bold text-slate-800 text-sm text-center leading-tight border-b border-slate-50">
                      {uni?.name}
                    </div>
                    <div className="h-16 flex items-center justify-center border-b border-slate-50">
                      <span className="px-5 py-2.5 bg-purple-50 text-purple-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">{uni?.programType}</span>
                    </div>
                    <div className="h-16 flex items-center justify-center font-bold text-slate-400 text-xs border-b border-slate-50">
                      {uni?.location}
                    </div>
                    <div className="h-16 flex items-center justify-center font-black text-slate-700 text-base border-b border-slate-50">
                      {uni?.duration}
                    </div>
                    <div className="h-24 flex flex-col items-center justify-center border-b border-slate-50">
                      <span className="text-lg font-black text-slate-900">{uni?.feeRange}</span>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Estimated Per Year</span>
                    </div>
                    <div className="h-24 flex flex-col items-center justify-center space-y-3 border-b border-slate-50">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-emerald-600 leading-none">{uni?.placementRate}</span>
                        {parseInt(uni?.placementRate || '0') > 95 && <span className="text-lg" title="Top Outcome">🎖️</span>}
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden max-w-[140px] shadow-inner">
                        <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: uni?.placementRate || '0%' }}></div>
                      </div>
                    </div>
                    <div className="h-16 flex items-center justify-center gap-3 border-b border-slate-50">
                      <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-[11px] font-black text-indigo-600">SAT {uni?.minSat}+</div>
                      <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-black text-slate-600">IELTS {uni?.minIelts}</div>
                    </div>
                  </div>
                ))}

                {Array.from({ length: 3 - comparisonData.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="pt-[240px] border-l border-dashed border-slate-200 flex flex-col items-center justify-center group">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center text-3xl grayscale opacity-20 group-hover:scale-110 transition-transform">
                      ➕
                    </div>
                    <p className="mt-6 text-slate-300 font-black text-xs uppercase tracking-widest italic">Slot {comparisonData.length + i + 1} Available</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-12 bg-slate-50 flex items-center justify-center border-t border-slate-100">
              <button 
                onClick={() => setShowComparison(false)} 
                className="px-20 py-7 bg-slate-900 text-white rounded-[2rem] font-black text-base shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center gap-4"
              >
                <span>Back to Explorer</span>
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">←</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Compare Floating Bar */}
      {selectedPrograms.length > 0 && !showComparison && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-12 duration-700">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowComparison(true)}
              className="px-12 py-6 bg-slate-900 text-white rounded-[3rem] font-black flex items-center gap-8 shadow-2xl shadow-indigo-300/40 group hover:scale-105 transition-all border-2 border-slate-800"
            >
              <div className="flex -space-x-4">
                {selectedPrograms.map((_, i) => (
                  <div key={i} className="w-12 h-12 rounded-full bg-indigo-600 border-4 border-slate-900 flex items-center justify-center text-sm font-black shadow-xl ring-2 ring-indigo-400/20">
                    {i + 1}
                  </div>
                ))}
                {selectedPrograms.length < 3 && (
                   <div className="w-12 h-12 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-xs font-black opacity-40">
                    +
                   </div>
                )}
              </div>
              <div className="text-left">
                <span className="block text-[10px] text-indigo-400 uppercase tracking-[0.3em] leading-none mb-1.5 font-black">Multi-Select Active</span>
                <span className="text-xl">Compare {selectedPrograms.length} {selectedPrograms.length === 1 ? 'Choice' : 'Choices'}</span>
              </div>
              <span className="w-14 h-14 bg-indigo-700 rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-lg">
                <span className="text-xl">📊</span>
              </span>
            </button>
            <button 
              onClick={() => setSelectedPrograms([])} 
              className="w-20 h-20 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center shadow-2xl hover:bg-rose-50 hover:text-rose-500 transition-all hover:rotate-90"
              title="Clear All"
            >
              <span className="text-2xl font-bold">✕</span>
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters UI */}
      <div className="bg-white p-8 md:p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10">
        <div className="flex flex-col space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-3">Institutional Explorer</h2>
              <p className="text-slate-500 font-medium text-lg italic">Discover campuses and specific majors with precision filters.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative group">
              <div className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 text-2xl shadow-inner">🏫</div>
              <input 
                type="text"
                value={uniSearch}
                onChange={(e) => setUniSearch(e.target.value)}
                placeholder="Search University Name or City..."
                className="w-full pl-24 pr-10 py-8 rounded-[2.5rem] border-2 border-slate-100 bg-slate-50/20 focus:bg-white focus:border-indigo-500 outline-none text-xl font-medium transition-all shadow-sm"
              />
              <label className="absolute -top-3 left-8 px-3 bg-white text-[9px] font-black text-indigo-500 uppercase tracking-widest border border-indigo-50 rounded-full">Institution Filter</label>
            </div>

            <div className="relative group">
              <div className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 text-2xl shadow-inner">🎓</div>
              <input 
                type="text"
                value={programSearch}
                onChange={(e) => setProgramSearch(e.target.value)}
                placeholder="Search Major or Specific Course..."
                className="w-full pl-24 pr-10 py-8 rounded-[2.5rem] border-2 border-slate-100 bg-slate-50/20 focus:bg-white focus:border-purple-500 outline-none text-xl font-medium transition-all shadow-sm"
              />
              <label className="absolute -top-3 left-8 px-3 bg-white text-[9px] font-black text-purple-500 uppercase tracking-widest border border-purple-50 rounded-full">Program/Major Filter</label>
            </div>
          </div>

          {/* Expanded Filter Bar */}
          <div className="flex flex-wrap items-center gap-4 border-t border-slate-50 pt-10">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mr-4">Institutional Refinement:</span>
            <select 
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[11px] font-black text-slate-600 outline-none focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
            >
              <option value="All">Global Regions</option>
              <option value="Americas">Americas</option>
              <option value="Europe">Europe</option>
              <option value="Asia">Asia</option>
              <option value="Oceania">Oceania</option>
            </select>

            <select 
              value={matchFilter}
              onChange={(e) => setMatchFilter(e.target.value)}
              className="px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[11px] font-black text-slate-600 outline-none focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
            >
              <option value="All">Admission Match</option>
              <option value="Safety">Safety Choice</option>
              <option value="Match">Direct Match</option>
              <option value="Reach">Reach Goal</option>
            </select>

            <select 
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="px-6 py-4 bg-indigo-50/50 border-2 border-indigo-100 rounded-2xl text-[11px] font-black text-indigo-600 outline-none focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
            >
              <option value="All">Any Duration</option>
              <option value="2 Years">2 Year Programs</option>
              <option value="3 Years">3 Year Programs</option>
              <option value="4 Years">4 Year Programs</option>
            </select>

            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-6 py-4 bg-purple-50/50 border-2 border-purple-100 rounded-2xl text-[11px] font-black text-purple-600 outline-none focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
            >
              <option value="All">Any Degree Level</option>
              <option value="Bachelor">Bachelor's</option>
              <option value="Master">Master's</option>
            </select>
          </div>
        </div>
      </div>

      {/* University Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-48">
        {filteredUniversities.length > 0 ? filteredUniversities.map((uni) => {
          const isShortlisted = shortlist.includes(uni.id);
          return (
            <div key={uni.id} className="group bg-white rounded-[4rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-4 transition-all duration-700 ease-out">
              <div className="relative h-80 overflow-hidden">
                <img src={uni.image} alt={uni.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                <div className="absolute top-8 left-8 flex flex-col gap-4">
                  <div className="px-6 py-2.5 bg-white/95 backdrop-blur rounded-[1.5rem] text-[10px] font-black text-slate-800 shadow-xl uppercase tracking-widest border border-white/50">{uni.region}</div>
                  {assessmentResult && uni.status !== 'Unknown' && (
                    <div className={`px-6 py-2.5 rounded-[1.5rem] text-[10px] font-black text-white shadow-2xl uppercase tracking-widest ${uni.status === 'Reach' ? 'bg-rose-500' : uni.status === 'Match' ? 'bg-indigo-600' : 'bg-emerald-500'}`}>
                      {uni.status} Chance
                    </div>
                  )}
                  <div className="px-6 py-2.5 bg-purple-600 text-white rounded-[1.5rem] text-[10px] font-black shadow-xl uppercase tracking-widest">
                    {uni.programType}
                  </div>
                </div>
                <button 
                  onClick={() => toggleShortlist(uni.id)}
                  className={`absolute top-8 right-8 w-16 h-16 rounded-[1.75rem] flex items-center justify-center shadow-2xl transition-all border border-white/20 backdrop-blur-xl ${isShortlisted ? 'bg-indigo-600 text-white' : 'bg-white/90 text-slate-400 hover:bg-white hover:text-indigo-600'}`}
                >
                  <span className="text-3xl leading-none">{isShortlisted ? '⭐' : '☆'}</span>
                </button>
              </div>

              <div className="p-12">
                <h3 className="text-3xl font-black text-slate-800 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">{uni.name}</h3>
                <p className="text-slate-400 text-base font-bold mb-10 flex items-center gap-2">
                  <span className="text-xl">📍</span> {uni.location}
                </p>
                
                <div className="space-y-12">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Available Programs</p>
                      {selectedPrograms.length >= 3 && <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest animate-pulse">Comparison Slot Full</span>}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {uni.programs.map(prog => {
                        const isSelected = selectedPrograms.some(p => p.uniId === uni.id && p.programName === prog);
                        const isSearchingThisProgram = programSearch !== '' && prog.toLowerCase().includes(programSearch.toLowerCase());
                        return (
                          <button 
                            key={prog} 
                            onClick={() => toggleProgramSelection(uni.id, prog)}
                            className={`px-6 py-3.5 rounded-2xl text-[12px] font-black border-2 transition-all flex items-center gap-2 ${
                              isSelected 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl scale-105' 
                                : isSearchingThisProgram
                                  ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-md ring-2 ring-purple-100'
                                  : 'bg-slate-50 border-slate-50 text-slate-500 hover:bg-white hover:border-slate-300'
                            }`}
                          >
                            {isSelected && <span>✓</span>}
                            {prog}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary Metric Strip */}
                  <div className="grid grid-cols-3 gap-3 p-8 bg-slate-50/50 rounded-[3rem] border border-slate-50 text-center shadow-inner">
                    <div className="flex flex-col items-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest">Entry SAT</p>
                      <p className="text-lg font-black text-slate-900">{uni.minSat > 0 ? uni.minSat + '+' : 'N/A'}</p>
                    </div>
                    <div className="border-x border-slate-200 flex flex-col items-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest">Job Rate</p>
                      <p className="text-lg font-black text-emerald-600">{uni.placementRate}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest">Length</p>
                      <p className="text-lg font-black text-slate-900">{uni.duration}</p>
                    </div>
                  </div>

                  <div className="pt-8 flex items-center justify-between border-t border-slate-100">
                    <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Accredited Fees</p>
                      <p className="text-xl font-black text-slate-800 tracking-tight">{uni.feeRange}</p>
                    </div>
                    <button className="px-12 py-5 bg-slate-900 text-white rounded-[1.75rem] text-sm font-black hover:bg-indigo-600 shadow-2xl transition-all hover:-translate-y-2 flex items-center gap-3 group">
                      Review Full Profile
                      <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border border-dashed border-slate-200">
            <span className="text-8xl block mb-10 grayscale opacity-40 animate-bounce">🔭</span>
            <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">No Precise Matches Found</h3>
            <p className="text-slate-500 font-medium text-lg max-w-lg mx-auto leading-relaxed">No institutions match both your campus name and major requirements simultaneously.</p>
            <button 
              onClick={() => {
                setUniSearch('');
                setProgramSearch('');
                setRegionFilter('All');
                setMatchFilter('All');
                setDurationFilter('All');
                setTypeFilter('All');
              }}
              className="mt-12 px-10 py-5 bg-indigo-50 text-indigo-600 rounded-3xl font-black text-sm hover:bg-indigo-600 hover:text-white transition-all shadow-md"
            >
              Reset Combined Search Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityExplorer;
