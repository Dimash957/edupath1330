
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'login' | 'verify'>('login');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call to send email accreditation code
    setTimeout(() => {
      setStep('verify');
      setLoading(false);
    }, 1500);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate code verification
    setTimeout(() => {
      onLogin({ email, isVerified: true, name: email.split('@')[0] });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">E</div>
          <h2 className="text-2xl font-bold text-slate-800">EduPath AI</h2>
          <p className="text-slate-500 mt-2">Personalized Admission & Mediation</p>
        </div>

        {step === 'login' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">School Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@school.edu"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <span className="animate-spin text-lg">⏳</span> : null}
              {loading ? 'Sending Accreditation...' : 'Continue with Email'}
            </button>
            <p className="text-center text-xs text-slate-400">
              By continuing, you agree to our Terms of Service.
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded-xl mb-4 text-center">
              <p className="text-xs text-indigo-700 font-medium">A verification code was sent to</p>
              <p className="text-sm font-bold text-indigo-900">{email}</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Accreditation Code</label>
              <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-center tracking-widest text-xl font-bold"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
            >
              Verify & Log In
            </button>
            <button 
              type="button"
              onClick={() => setStep('login')}
              className="w-full text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Change Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
