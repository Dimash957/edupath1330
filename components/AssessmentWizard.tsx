
import React, { useState } from 'react';
import { analyzeFullAssessment } from '../services/geminiService';
import { AssessmentResult } from '../types';

const STUDENT_QUESTIONS = [
  "I find satisfaction in solving puzzles and logical problems.",
  "I enjoy working with groups and coordinating people.",
  "Public speaking and presenting ideas feels natural to me.",
  "I feel most alive when creating something new (art, code, writing).",
  "I like being responsible for the outcome of a project.",
  "I am fascinated by how modern software and AI are built.",
  "I prefer physical, tangible results over abstract concepts.",
  "Helping others solve their personal problems is rewarding for me.",
  "I enjoy critical thinking and questioning the status quo.",
  "I am willing to take calculated risks for potential success.",
  "Structure and clear rules help me perform at my best.",
  "The complexity of biological systems or nature excites me.",
  "I am curious about different cultures and international relations.",
  "I thrive in competitive environments where I can be the best.",
  "I enjoy finding patterns in large amounts of information."
];

const PARENT_QUESTIONS = [
  "Long-term financial security is our primary concern.",
  "We want our child to have a role with high social respect.",
  "We hope our child will have the opportunity to work globally.",
  "We prefer a stable, recognized career path (Medicine, Law, Engineering).",
  "A balanced lifestyle is more important than a massive salary.",
  "We worry about how AI might replace traditional jobs.",
  "Staying close to home for education is a priority.",
  "We see strong natural leadership abilities in our child.",
  "We value artistic and creative pursuits as much as technical ones.",
  "A career that leaves a positive impact on the world is best.",
  "Cutting-edge tech industries are where the future lies.",
  "We would support our child starting their own business.",
  "A steady corporate environment provides the best growth.",
  "Scientific research and higher academic degrees are valuable."
];

interface Props {
  onResultReady: (result: AssessmentResult) => void;
  initialResult: AssessmentResult | null;
}

const AssessmentWizard: React.FC<Props> = ({ onResultReady, initialResult }) => {
  const [step, setStep] = useState<'intro' | 'student' | 'parent' | 'result'>(initialResult ? 'result' : 'intro');
  const [studentIdx, setStudentIdx] = useState(0);
  const [parentIdx, setParentIdx] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<number[]>([]);
  const [parentAnswers, setParentAnswers] = useState<number[]>([]);
  const [parentJobDesire, setParentJobDesire] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(initialResult);

  const totalSteps = STUDENT_QUESTIONS.length + PARENT_QUESTIONS.length + 1;

  const handleStudentAnswer = (val: number) => {
    const newAnswers = [...studentAnswers, val];
    setStudentAnswers(newAnswers);
    if (studentIdx < STUDENT_QUESTIONS.length - 1) {
      setStudentIdx(studentIdx + 1);
    } else {
      setStep('parent');
    }
  };

  const handleParentAnswer = (val: number) => {
    const newAnswers = [...parentAnswers, val];
    setParentAnswers(newAnswers);
    if (parentIdx < PARENT_QUESTIONS.length - 1) {
      setParentIdx(parentIdx + 1);
    }
  };

  const goBackStudent = () => {
    if (studentIdx > 0) {
      setStudentIdx(studentIdx - 1);
      setStudentAnswers(prev => prev.slice(0, -1));
    }
  };

  const goBackParent = () => {
    if (parentIdx > 0) {
      setParentIdx(parentIdx - 1);
      setParentAnswers(prev => prev.slice(0, -1));
    } else {
      setStep('student');
      setStudentIdx(STUDENT_QUESTIONS.length - 1);
      setStudentAnswers(prev => prev.slice(0, -1));
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentJobDesire.trim()) return;
    
    setLoading(true);
    try {
      const data = await analyzeFullAssessment(
        { qualities: studentAnswers, questions: STUDENT_QUESTIONS },
        { 
          expectations: parentAnswers, 
          questions: PARENT_QUESTIONS,
          desiredJobs: parentJobDesire 
        }
      );
      setResult(data);
      onResultReady(data);
      setStep('result');
    } catch (err) {
      console.error(err);
      alert("Error generating your personalized path. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderProgress = () => {
    const isParentConsultation = parentAnswers.length === PARENT_QUESTIONS.length;
    const currentCount = step === 'student' 
      ? studentIdx + 1 
      : step === 'parent' 
        ? STUDENT_QUESTIONS.length + (isParentConsultation ? parentIdx + 1 : parentIdx + 1)
        : totalSteps;
    
    const percent = (currentCount / totalSteps) * 100;
    return (
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-8">
        <div 
          className={`h-full transition-all duration-700 ease-in-out ${step === 'parent' ? 'bg-amber-500' : 'bg-indigo-600'}`} 
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    );
  };

  if (step === 'intro') {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/40 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-inner">🎯</div>
        <h2 className="text-3xl font-black text-slate-800 mb-4">AI Proforientation Specialist</h2>
        <p className="text-slate-500 mb-10 text-lg leading-relaxed max-w-md mx-auto">
          We bridge the gap between student interests, natural abilities, and market demands, while mediating with parental expectations.
        </p>
        <div className="grid grid-cols-1 gap-4 mb-10 text-left">
          <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xl">👩‍🎓</span>
            <div>
              <p className="font-bold text-slate-800 text-sm">Phase 1: Student Insights</p>
              <p className="text-xs text-slate-500">Identifying your true interests and cognitive strengths.</p>
            </div>
          </div>
          <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xl">👨‍👩‍👧</span>
            <div>
              <p className="font-bold text-slate-800 text-sm">Phase 2: Parental Vision</p>
              <p className="text-xs text-slate-500">Integrating family expectations and long-term security goals.</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setStep('student')}
          className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all"
        >
          Start Consultation
        </button>
      </div>
    );
  }

  if (step === 'student') {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 animate-in slide-in-from-right-8 duration-300">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs">👩‍🎓</span>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Student Profile</span>
          </div>
          <span className="text-xs font-bold text-slate-400">Question {studentIdx + 1} of {STUDENT_QUESTIONS.length}</span>
        </div>
        {renderProgress()}
        <h3 className="text-2xl font-bold text-slate-800 mb-10 min-h-[80px] leading-tight">{STUDENT_QUESTIONS[studentIdx]}</h3>
        <div className="grid grid-cols-1 gap-3">
          {[
            { label: "Strongly Agree", val: 5, color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
            { label: "Agree", val: 4, color: "bg-emerald-50/50 text-emerald-600 hover:bg-emerald-100/50" },
            { label: "Neutral", val: 3, color: "bg-slate-50 text-slate-500 hover:bg-slate-100" },
            { label: "Disagree", val: 2, color: "bg-rose-50/50 text-rose-600 hover:bg-rose-100/50" },
            { label: "Strongly Disagree", val: 1, color: "bg-rose-50 text-rose-700 hover:bg-rose-100" },
          ].map(opt => (
            <button 
              key={opt.val}
              onClick={() => handleStudentAnswer(opt.val)}
              className={`py-5 rounded-2xl font-bold text-sm transition-all text-left px-8 border-2 border-transparent hover:border-slate-200 ${opt.color}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {studentIdx > 0 && (
          <button onClick={goBackStudent} className="mt-8 text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors uppercase tracking-widest flex items-center gap-2">
            ← Previous Question
          </button>
        )}
      </div>
    );
  }

  if (step === 'parent') {
    const isSurveyComplete = parentAnswers.length === PARENT_QUESTIONS.length;
    
    return (
      <div className="max-w-xl mx-auto bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 animate-in slide-in-from-right-8 duration-300">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs">👨‍👩‍👧</span>
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Family Mediation</span>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {isSurveyComplete ? 'Final Consultation' : `Question ${parentIdx + 1} of ${PARENT_QUESTIONS.length}`}
          </span>
        </div>
        {renderProgress()}
        
        {!isSurveyComplete ? (
          <>
            <h3 className="text-2xl font-bold text-slate-800 mb-10 min-h-[80px] leading-tight">{PARENT_QUESTIONS[parentIdx]}</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: "Strongly Agree", val: 5, color: "bg-amber-50 text-amber-800 hover:bg-amber-100" },
                { label: "Agree", val: 4, color: "bg-amber-50/50 text-amber-700 hover:bg-amber-100/50" },
                { label: "Neutral", val: 3, color: "bg-slate-50 text-slate-500 hover:bg-slate-100" },
                { label: "Disagree", val: 2, color: "bg-rose-50/50 text-rose-600 hover:bg-rose-100/50" },
                { label: "Strongly Disagree", val: 1, color: "bg-rose-50 text-rose-700 hover:bg-rose-100" },
              ].map(opt => (
                <button 
                  key={opt.val}
                  onClick={() => handleParentAnswer(opt.val)}
                  className={`py-5 rounded-2xl font-bold text-sm transition-all text-left px-8 border-2 border-transparent hover:border-slate-200 ${opt.color}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button onClick={goBackParent} className="mt-8 text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors uppercase tracking-widest flex items-center gap-2">
              ← Previous Question
            </button>
          </>
        ) : (
          <form onSubmit={handleFinalSubmit} className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-amber-50/50 p-8 rounded-[2rem] border border-amber-100">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm mb-4">📝</div>
              <h3 className="text-xl font-black text-slate-800 mb-3">Final Job Vision</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Parents: Which specific professions or industries have you envisioned for your child? AI will use this to identify paths that satisfy family security and individual passion.
              </p>
            </div>
            
            <div className="relative group">
              <label className="absolute -top-3 left-6 px-3 bg-white text-[10px] font-black text-amber-600 uppercase tracking-widest border border-slate-100 rounded-full z-10">Parental Expectations</label>
              <textarea 
                value={parentJobDesire}
                onChange={(e) => setParentJobDesire(e.target.value)}
                placeholder="e.g. 'We hope for a career in Medical Bio or perhaps Architecture for long-term stability...'"
                className="w-full px-6 py-6 rounded-3xl border-2 border-slate-100 bg-slate-50/20 focus:bg-white focus:ring-4 focus:ring-amber-50 focus:border-amber-400 transition-all outline-none min-h-[160px] text-slate-700 font-medium text-lg leading-relaxed shadow-sm"
                required
              />
            </div>
            
            <div className="flex flex-col gap-4">
              <button 
                type="submit"
                disabled={loading || !parentJobDesire.trim()}
                className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-lg hover:bg-black transition-all flex items-center justify-center gap-4 shadow-2xl disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <span className="animate-spin text-2xl">⏳</span>
                    <span>Synthesizing Conflict Resolution...</span>
                  </>
                ) : (
                  <>
                    <span>🚀 Finalize AI Analysis</span>
                  </>
                )}
              </button>
              <button 
                type="button"
                onClick={() => setParentAnswers(prev => prev.slice(0, -1))}
                className="w-full py-4 text-slate-400 text-xs font-black uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                ← Back to Questions
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  if (step === 'result' && result) {
    return (
      <div className="max-w-6xl mx-auto space-y-12 animate-in zoom-in-95 duration-700 pb-20">
        {/* Core Career Identification */}
        <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-100 shadow-2xl shadow-slate-200/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/40 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-12">
            <div className="w-40 h-40 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] flex items-center justify-center text-7xl shadow-2xl shadow-indigo-100 shrink-0">🎓</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Primary Recommendation</span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">Family Approved</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight mb-4">{result.unifiedCareer}</h2>
              <div className="flex flex-wrap gap-4">
                <div className="px-6 py-3 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-3">
                  <span className="text-xs font-black text-indigo-400">IDEAL MAJOR:</span>
                  <span className="text-base font-bold text-slate-700">{result.recommendedMajor}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 relative">
            <div className="absolute -top-3 left-10 px-4 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Expert Consultation Summary</div>
            <p className="text-slate-600 text-xl leading-relaxed font-medium italic text-center">
              "{result.rationale}"
            </p>
          </div>
        </div>

        {/* 5-10 Career Scenarios with Market Demand */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Diverse Professional Scenarios</h3>
              <p className="text-slate-500 text-sm font-medium">Mapped to your unique profile and current market trends</p>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-emerald-500">●</span>
              <span className="text-xs font-bold text-slate-600">Dynamic Market Insights Active</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {result.scenarios.map((scenario, i) => (
              <div key={i} className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    scenario.marketDemand === 'Very High' ? 'bg-emerald-100 text-emerald-700' :
                    scenario.marketDemand === 'High' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {scenario.marketDemand} MARKET Demand
                  </div>
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-500">💼</span>
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">{scenario.title}</h4>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium line-clamp-4">{scenario.description}</p>
                
                <div className="mt-auto space-y-4 pt-8 border-t border-slate-50">
                  <div className="flex items-start gap-3">
                    <span className="text-indigo-500 mt-0.5">✔</span>
                    <p className="text-xs text-slate-600 font-bold leading-relaxed">{scenario.whyMatch}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Educational Preparation & Strategic Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/30">
            <h3 className="text-2xl font-black text-slate-800 mb-10 flex items-center gap-4">
              <span className="text-3xl">🗺️</span> Strategic Admissions Targets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all">
                <span className="text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-widest">SAT Goal</span>
                <span className="text-5xl font-black text-indigo-600">{result.academicTargets.sat}</span>
                <p className="text-[10px] font-bold text-indigo-300 mt-4 uppercase">Target Tier 1</p>
              </div>
              <div className="p-8 bg-emerald-50/50 rounded-[2.5rem] border border-emerald-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all">
                <span className="text-[10px] font-black text-emerald-400 uppercase mb-4 tracking-widest">IELTS Goal</span>
                <span className="text-5xl font-black text-emerald-600">{result.academicTargets.ielts}</span>
                <p className="text-[10px] font-bold text-emerald-300 mt-4 uppercase">Fluent Range</p>
              </div>
              <div className="p-8 bg-purple-50/50 rounded-[2.5rem] border border-purple-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all">
                <span className="text-[10px] font-black text-purple-400 uppercase mb-4 tracking-widest">GPA Target</span>
                <span className="text-5xl font-black text-purple-600">{result.academicTargets.gpa}</span>
                <p className="text-[10px] font-bold text-purple-300 mt-4 uppercase">Scale Max</p>
              </div>
            </div>
            
            <div className="mt-12 pt-10 border-t border-slate-100">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Skill Gap Closing Plan</h4>
              <div className="flex flex-wrap gap-4">
                {result.skillsToImprove.map((s, i) => (
                  <div key={i} className="px-6 py-4 bg-slate-900 text-white rounded-3xl text-sm font-bold flex items-center gap-3 shadow-lg shadow-slate-200">
                    <span className="text-indigo-400 font-black">#</span> {s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-[3rem] p-12 text-white shadow-2xl shadow-indigo-100">
            <h3 className="text-2xl font-black mb-8 leading-tight">Strategic Summer <br/>Programs</h3>
            <p className="text-indigo-200 text-sm mb-10 leading-relaxed font-medium">Building a competitive CV requires specialized extracurriculars. AI suggests:</p>
            <div className="space-y-8">
              {result.summerPrograms.map((p, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <h5 className="font-black text-lg mb-3 group-hover:text-amber-400 transition-colors leading-tight">{p.name}</h5>
                  <p className="text-xs text-indigo-100 font-medium leading-relaxed opacity-80">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 pb-20">
          <button 
            onClick={() => { setStep('intro'); setResult(null); }}
            className="flex-1 py-6 bg-white border-2 border-slate-100 text-slate-500 rounded-[2rem] font-black text-sm hover:bg-slate-50 transition-all shadow-sm"
          >
            Retake AI Diagnostic
          </button>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex-[2] py-6 bg-indigo-600 text-white rounded-[2rem] font-black shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            Explore Matched Campuses & Scholarships →
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AssessmentWizard;
