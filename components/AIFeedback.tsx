import React, { useState } from 'react';
import { BrainCircuit, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { ReactionRecord, GeminiAnalysisResult, Language } from '../types';
import { analyzePerformance } from '../services/geminiService';
import { translations } from '../translations';

interface AIFeedbackProps {
  history: ReactionRecord[];
  lang: Language;
}

const AIFeedback: React.FC<AIFeedbackProps> = ({ history, lang }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeminiAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = translations[lang].ai;

  const handleAnalyze = async () => {
    if (history.length < 3) {
      setError(t.errorMinTests);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await analyzePerformance(history, lang);
      setResult(data);
    } catch (err: any) {
      console.error("AI Error in UI:", err);
      setError(err.message || "Error.");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-2xl border border-indigo-500/30 shadow-xl animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">{t.coachTitle}</h3>
          </div>
          <button 
            onClick={() => setResult(null)} 
            className="text-indigo-200 hover:text-white text-sm underline"
          >
            {t.reset}
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-black/20 p-4 rounded-lg">
            <p className="text-indigo-200 text-xs uppercase font-bold tracking-wide mb-1">{t.labels.rank}</p>
            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              {result.rank}
            </p>
          </div>

          <div>
            <p className="text-indigo-200 text-xs uppercase font-bold tracking-wide mb-1">{t.labels.summary}</p>
            <p className="text-white leading-relaxed">{result.summary}</p>
          </div>

          <div className="bg-emerald-900/30 border border-emerald-500/30 p-3 rounded-lg flex gap-3 items-start">
             <BrainCircuit className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
             <p className="text-emerald-100 text-sm italic">"{result.advice}"</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <BrainCircuit className="w-8 h-8 text-indigo-400" />
        <div>
          <h3 className="text-lg font-bold text-white">{t.title}</h3>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={loading || history.length === 0}
        className={`w-full py-3 px-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all
          ${loading 
            ? 'bg-slate-700 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 shadow-lg shadow-indigo-900/50'
          }
        `}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t.analyzing}
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            {t.analyzeButton}
          </>
        )}
      </button>
      
      {history.length < 3 && !loading && (
        <p className="text-center text-slate-500 text-xs mt-3">
          {t.remainingTests(3 - history.length)}
        </p>
      )}
    </div>
  );
};

export default AIFeedback;
