
import React, { useState } from 'react';
import { generateCareerRecommendations } from '../services/geminiService';

const CareerQuiz: React.FC = () => {
  const [interests, setInterests] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interests || !skills) return;
    
    setLoading(true);
    try {
      const result = await generateCareerRecommendations(interests, skills);
      setRecommendations(result || "Unable to generate recommendations.");
    } catch (error) {
      console.error(error);
      setRecommendations("Error communicating with AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">AI Proforientation</h2>
        
        {!recommendations ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">What are your main interests? (e.g., Drawing, Coding, Helping people)</label>
              <textarea 
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-h-[100px]"
                placeholder="List your hobbies and things you enjoy doing..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">What skills do you feel you're good at?</label>
              <textarea 
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-h-[100px]"
                placeholder="E.g., Math, Public speaking, Organization..."
                required
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Analyzing your profile...' : 'Generate AI Recommendations'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="prose prose-indigo max-w-none">
              <div className="bg-indigo-50 p-6 rounded-2xl text-slate-800 whitespace-pre-wrap leading-relaxed">
                {recommendations}
              </div>
            </div>
            <button 
              onClick={() => { setRecommendations(null); setInterests(''); setSkills(''); }}
              className="text-indigo-600 font-bold hover:underline"
            >
              ← Start Over
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
          <p className="font-bold text-purple-900 mb-1">Personalized Path</p>
          <p className="text-sm text-purple-700">AI considers local market trends and your unique psychological profile.</p>
        </div>
        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="font-bold text-blue-900 mb-1">Market Insights</p>
          <p className="text-sm text-blue-700">See high-demand jobs that match your skillset and interests.</p>
        </div>
      </div>
    </div>
  );
};

export default CareerQuiz;
