import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Zap, RotateCcw, AlertTriangle } from 'lucide-react';
import { GameState, Language } from '../types';
import { translations } from '../translations';

interface ReactionGameProps {
  onNewRecord: (time: number) => void;
  lang: Language;
}

const ReactionGame: React.FC<ReactionGameProps> = ({ onNewRecord, lang }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  
  const t = translations[lang].game;
  const tf = translations[lang].feedback;
  
  // Refs for timing logic to avoid re-render loops
  const timeoutRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const handleStart = useCallback(() => {
    setGameState(GameState.WAITING);
    const randomDelay = Math.floor(Math.random() * 3000) + 2000; // 2000ms to 5000ms

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setGameState(GameState.READY);
      // Use performance.now() for high-precision timing (microseconds) instead of Date.now()
      startTimeRef.current = performance.now();
    }, randomDelay);
  }, []);

  // Changed from onClick to onPointerDown to eliminate "click" delay (waiting for mouse up)
  const handlePointerDown = (e: React.PointerEvent) => {
    // Prevent default behaviors that might interfere
    e.preventDefault();

    if (gameState === GameState.IDLE || gameState === GameState.FINISHED) {
      handleStart();
    } else if (gameState === GameState.WAITING) {
      // Too early
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setGameState(GameState.TOO_EARLY);
    } else if (gameState === GameState.READY) {
      // Success - Calculate immediately using performance.now()
      const endTime = performance.now();
      const duration = endTime - startTimeRef.current;
      // Round to standard millisecond format for display/storage
      const finalTime = Math.round(duration);
      
      setReactionTime(finalTime);
      setGameState(GameState.FINISHED);
      onNewRecord(finalTime);
    } else if (gameState === GameState.TOO_EARLY) {
      // Retry from fail screen
      handleStart();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getFeedback = (time: number) => {
    if (time < 150) return tf.godlike;
    if (time < 180) return tf.esports;
    if (time < 220) return tf.veryGood;
    if (time < 270) return tf.average;
    if (time < 350) return tf.slow;
    return tf.verySlow;
  };

  // Dynamic classes based on state
  const getContainerClasses = () => {
    const base = "w-full h-96 md:h-[28rem] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-100 shadow-2xl no-select transform active:scale-[0.99] p-6 text-center";
    switch (gameState) {
      case GameState.IDLE:
        return `${base} bg-slate-800 hover:bg-slate-700 text-white border-4 border-slate-600`;
      case GameState.WAITING:
        return `${base} bg-red-600 text-white border-4 border-red-400`;
      case GameState.READY:
        return `${base} bg-emerald-500 text-white border-4 border-emerald-300`;
      case GameState.TOO_EARLY:
        return `${base} bg-amber-500 text-white border-4 border-amber-300`;
      case GameState.FINISHED:
        return `${base} bg-indigo-600 text-white border-4 border-indigo-400`;
      default:
        return base;
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.IDLE:
        return (
          <>
            <Zap className="w-20 h-20 mb-6 animate-pulse text-yellow-400" />
            <h2 className="text-4xl font-bold mb-3">{t.idleTitle}</h2>
            <p className="text-slate-300 text-xl">{t.idleDesc}</p>
          </>
        );
      case GameState.WAITING:
        return (
          <>
            <h2 className="text-5xl font-bold tracking-widest mb-4">{t.waitingTitle}</h2>
            <p className="text-xl opacity-90">{t.waitingDesc}</p>
          </>
        );
      case GameState.READY:
        return (
          <>
            <h2 className="text-6xl font-black animate-bounce">{t.ready}</h2>
          </>
        );
      case GameState.TOO_EARLY:
        return (
          <>
            <AlertTriangle className="w-20 h-20 mb-6" />
            <h2 className="text-4xl font-bold mb-2">{t.earlyTitle}</h2>
            <p className="text-xl mb-6">{t.earlyDesc}</p>
            <div className="text-lg opacity-75 bg-black/10 px-4 py-2 rounded-full">{t.retry}</div>
          </>
        );
      case GameState.FINISHED:
        const feedback = reactionTime !== null ? getFeedback(reactionTime) : { title: '', desc: '' };
        return (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="text-7xl font-black mb-2 tracking-tight">{reactionTime} ms</div>
            
            <div className="mb-8 max-w-lg">
              <p className="text-3xl font-bold mb-3 text-yellow-300 drop-shadow-md">{feedback.title}</p>
              <p className="text-lg text-indigo-100 leading-relaxed font-medium">{feedback.desc}</p>
            </div>

            <div className="flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full hover:bg-white/30 transition-colors shadow-lg">
              <RotateCcw className="w-6 h-6" />
              <span className="font-bold text-lg">{t.playAgain}</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      onPointerDown={handlePointerDown} 
      className={getContainerClasses()}
      style={{ touchAction: 'manipulation' }}
    >
      {renderContent()}
    </div>
  );
};

export default ReactionGame;