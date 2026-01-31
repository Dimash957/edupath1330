
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { mentorChat } from '../services/geminiService';

const AiMentor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome to EduPath AI Mentorship. I'm here to refine your professional vision, strategize your university path, and help resolve any parental concerns. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await mentorChat(messages, input);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to my neural core. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden group transition-all duration-500">
      <div className="p-8 border-b border-slate-50 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg relative z-10">🤖</div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-slate-900 z-20 animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">AI Admissions Mentor</h2>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Active Intelligence Session</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([{ role: 'model', text: "Session reset. How else can I guide you?" }])}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
        >
          Reset Session
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/30">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`} style={{ animationDelay: `${i * 100}ms` }}>
            <div className={`max-w-[75%] p-7 rounded-[2.5rem] text-base leading-relaxed shadow-sm transition-all hover:shadow-md ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
            }`}>
              {msg.text}
              {msg.role === 'model' && (
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-3">
                   <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-[10px]">✨</div>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Generated Response</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-7 rounded-[2.5rem] rounded-tl-none text-base text-slate-400 flex items-center gap-4 shadow-sm animate-pulse">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></span>
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Analyzing Query...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-8 border-t border-slate-50 bg-white">
        <form onSubmit={handleSend} className="flex gap-4 max-w-5xl mx-auto">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="E.g., 'How do I explain my interest in Fine Art to my Engineer parents?'"
            className="flex-1 px-8 py-6 rounded-[2rem] border-2 border-slate-50 bg-slate-50/50 focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium text-lg shadow-inner"
          />
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="w-20 h-20 bg-slate-900 text-white rounded-full flex items-center justify-center text-2xl hover:bg-black transition-all disabled:opacity-50 shadow-2xl active:scale-90"
          >
            🚀
          </button>
        </form>
        <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mt-6">Powered by EduPath GenAI Core v3.1</p>
      </div>
    </div>
  );
};

export default AiMentor;
