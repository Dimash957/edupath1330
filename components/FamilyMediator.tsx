
import React, { useState } from 'react';
import { resolveFamilyConflict } from '../services/geminiService';
import { MediationResult } from '../types';

const FamilyMediator: React.FC = () => {
  const [studentView, setStudentView] = useState('');
  const [parentView, setParentView] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MediationResult | null>(null);

  const handleMediate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentView || !parentView) return;

    setLoading(true);
    try {
      const data = await resolveFamilyConflict(studentView, parentView);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to mediate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
        <div className="p-8 bg-gradient-to-r from-rose-50 to-orange-50 border-b border-rose-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Family Conflict Resolver</h2>
          <p className="text-slate-600">Bridging the gap between your dreams and your parents' expectations with AI mediation.</p>
        </div>

        {!result ? (
          <form onSubmit={handleMediate} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🎓</span>
                  <label className="text-sm font-bold text-slate-700">Student's Desired Career</label>
                </div>
                <textarea 
                  value={studentView}
                  onChange={(e) => setStudentView(e.target.value)}
                  placeholder="I want to be a digital artist because I love creativity and modern tech..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-rose-500 min-h-[150px]"
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">👨‍👩‍👦</span>
                  <label className="text-sm font-bold text-slate-700">Parents' View/Expectation</label>
                </div>
                <textarea 
                  value={parentView}
                  onChange={(e) => setParentView(e.target.value)}
                  placeholder="We want him to be an Architect or Engineer because it's stable and professional..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-rose-500 min-h-[150px]"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-black transition-all ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? 'Finding Common Ground...' : '🕊️ Resolve Conflict'}
            </button>
          </form>
        ) : (
          <div className="p-8 animate-in zoom-in-95 duration-500">
            <div className="text-center mb-10">
              <span className="text-5xl mb-4 block">✨</span>
              <h3 className="text-3xl font-bold text-slate-800">Ideal Compromise</h3>
              <p className="text-indigo-600 font-bold text-xl mt-2">{result.idealCareer}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-2">Why it satisfies YOU</h4>
                <p className="text-indigo-800 text-sm leading-relaxed">{result.whyStudentLovesIt}</p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                <h4 className="font-bold text-emerald-900 mb-2">Why it satisfies PARENTS</h4>
                <p className="text-emerald-800 text-sm leading-relaxed">{result.whyParentApproves}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-8">
              <h4 className="font-bold text-slate-800 mb-3">AI Synthesis</h4>
              <p className="text-slate-600 text-sm leading-relaxed italic">"{result.compromiseExplanation}"</p>
            </div>

            <div className="mb-10">
              <h4 className="font-bold text-slate-800 mb-4">Top 3 Universities for this path</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {result.suggestedUniversities.map((uni, i) => (
                  <div key={i} className="p-4 bg-white border border-slate-200 rounded-2xl text-center text-sm font-semibold text-slate-700">
                    {uni}
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => { setResult(null); setStudentView(''); setParentView(''); }}
              className="w-full py-4 border border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all"
            >
              Back to Input
            </button>
          </div>
        )}
      </div>

      <div className="mt-12 text-center text-slate-400 text-sm max-w-xl mx-auto">
        AI mediation helps find modern intersections between creative passion and traditional stability, such as <strong>Computational Design</strong>, <strong>Legal Technology</strong>, or <strong>Biotech Management</strong>.
      </div>
    </div>
  );
};

export default FamilyMediator;
