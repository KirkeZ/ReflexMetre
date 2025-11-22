import React, { useState, useMemo } from 'react';
import ReactionGame from './components/ReactionGame';
import StatsChart from './components/StatsChart';
import AIFeedback from './components/AIFeedback';
import { ReactionRecord, Language } from './types';
import { translations } from './translations';
import { Timer, Trophy, History, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [history, setHistory] = useState<ReactionRecord[]>([]);
  const [lang, setLang] = useState<Language>('tr');

  const t = translations[lang].app;
  const tai = translations[lang].ai;

  const handleNewRecord = (time: number) => {
    const newRecord: ReactionRecord = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      reactionTime: time,
    };
    setHistory(prev => [...prev, newRecord]);
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'tr' ? 'en' : 'tr');
  };

  const bestTime = useMemo(() => {
    if (history.length === 0) return 0;
    return Math.min(...history.map(r => r.reactionTime));
  }, [history]);

  const averageTime = useMemo(() => {
    if (history.length === 0) return 0;
    const sum = history.reduce((acc, curr) => acc + curr.reactionTime, 0);
    return Math.round(sum / history.length);
  }, [history]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 overflow-x-hidden font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-xl rotate-3 shadow-lg shadow-indigo-500/20">
              <Timer className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                {t.title}
              </h1>
              <p className="text-slate-400 text-sm">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-4 hidden sm:flex">
              <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-3">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">{t.best}</p>
                  <p className="text-xl font-mono font-bold">{bestTime > 0 ? `${bestTime}ms` : '-'}</p>
                </div>
              </div>
              <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-3">
                <History className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">{t.avg}</p>
                  <p className="text-xl font-mono font-bold">{averageTime > 0 ? `${averageTime}ms` : '-'}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={toggleLanguage}
              className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-colors border border-slate-600 flex items-center gap-2"
              title="Switch Language"
            >
              <Globe className="w-5 h-5" />
              <span className="font-bold text-sm">{lang.toUpperCase()}</span>
            </button>
          </div>
        </header>

        {/* Mobile Stats (Visible only on small screens) */}
        <div className="flex gap-4 sm:hidden">
            <div className="flex-1 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">{t.best}</p>
                <p className="text-xl font-mono font-bold">{bestTime > 0 ? `${bestTime}ms` : '-'}</p>
              </div>
            </div>
            <div className="flex-1 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-3">
              <History className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">{t.avg}</p>
                <p className="text-xl font-mono font-bold">{averageTime > 0 ? `${averageTime}ms` : '-'}</p>
              </div>
            </div>
        </div>

        {/* Main Game Area */}
        <main className="grid md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-8">
            <ReactionGame onNewRecord={handleNewRecord} lang={lang} />
            <StatsChart history={history} lang={lang} />
          </div>

          {/* Sidebar / AI Section */}
          <div className="space-y-6">
             <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-2">{t.howToPlay}</h3>
                <ul className="space-y-3 text-slate-300 text-sm">
                  <li className="flex gap-2">
                    <span className="bg-indigo-500/20 text-indigo-300 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0">1</span>
                    {t.step1}
                  </li>
                  <li className="flex gap-2">
                    <span className="bg-red-500/20 text-red-300 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0">2</span>
                    {t.step2}
                  </li>
                  <li className="flex gap-2">
                    <span className="bg-emerald-500/20 text-emerald-300 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0">3</span>
                    {t.step3}
                  </li>
                </ul>
             </div>

             <div className="flex flex-col gap-4">
               <AIFeedback history={history} lang={lang} />
               
               <div className="flex flex-col items-start px-4 pt-6 border-t border-slate-800/50 gap-3">
                  <span className="text-xs text-slate-500 font-medium italic tracking-wider opacity-60">By Kirke</span>
                  <a 
                    href="https://github.com/KirkeZ" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group"
                  >
                    <span className="text-lg font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                      {tai.myGithub}
                    </span>
                    <img 
                      src="https://github.com/KirkeZ.png" 
                      alt="KirkeZ" 
                      className="w-16 h-16 rounded-full border-4 border-indigo-500/30 group-hover:border-indigo-400 transition-all shadow-lg shadow-indigo-500/20"
                    />
                  </a>
               </div>
             </div>
             
             {history.length > 0 && (
               <div className="text-center">
                 <button 
                   onClick={() => setHistory([])}
                   className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                 >
                   {t.clearData}
                 </button>
               </div>
             )}
          </div>

        </main>
        
        <footer className="text-center text-slate-600 text-sm py-8">
          <p>© {new Date().getFullYear()} {t.title}. {t.footer}</p>
        </footer>

      </div>
    </div>
  );
};

export default App;