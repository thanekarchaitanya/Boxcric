
import React, { useState } from 'react';
import { TossResult } from '../types';

interface TossScreenProps {
  team1: string;
  team2: string;
  onComplete: (result?: TossResult) => void;
  onBack: () => void;
}

const ArtisticMandala: React.FC<{ type: 'sun' | 'moon' }> = ({ type }) => {
  return (
    <svg className="absolute inset-0 w-full h-full p-2 pointer-events-none drop-shadow-2xl" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="mandalaGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="0.5 1.5" className="opacity-30" />
      
      <g className="opacity-40">
        {[...Array(24)].map((_, i) => (
          <path 
            key={i} 
            d="M50 10 Q52 20 50 30 Q48 20 50 10" 
            fill="currentColor" 
            transform={`rotate(${i * 15} 50 50)`} 
          />
        ))}
      </g>

      <g className="opacity-25">
        {[...Array(12)].map((_, i) => (
          <path 
            key={i} 
            d="M50 15 C55 25 60 35 50 45 C40 35 45 25 50 15" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.3"
            transform={`rotate(${i * 30 + 15} 50 50)`} 
          />
        ))}
      </g>

      <g className="opacity-10">
        {[...Array(6)].map((_, i) => (
          <circle 
            key={i} 
            cx="50" 
            cy="35" 
            r="15" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5"
            transform={`rotate(${i * 60} 50 50)`} 
          />
        ))}
      </g>

      <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="0.2" className="opacity-50" />
      <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1 1" className="opacity-20" />

      {type === 'sun' ? (
        <g transform="translate(50, 50)" className="text-current">
          <circle r="7" fill="currentColor" className="opacity-90" />
          {[...Array(16)].map((_, d) => (
            <line 
              key={d} 
              y1="-13" 
              y2="-9" 
              stroke="currentColor" 
              strokeWidth="1.2" 
              strokeLinecap="round"
              transform={`rotate(${d * 22.5})`} 
              className="opacity-70"
            />
          ))}
          <circle r="4" fill="none" stroke="black" strokeWidth="0.5" className="opacity-20" />
        </g>
      ) : (
        <g transform="translate(50, 50)" className="text-current">
           <path 
            d="M-4 -6 A8 8 0 1 1 -4 10 A6.5 6.5 0 1 0 -4 -6" 
            fill="currentColor" 
            className="opacity-90"
            transform="rotate(-15)"
          />
          {[...Array(8)].map((_, i) => (
            <circle 
              key={i} 
              cx="0" 
              cy="-11" 
              r="0.8" 
              fill="currentColor" 
              transform={`rotate(${i * 45 + 22.5})`} 
              className="opacity-40"
            />
          ))}
        </g>
      )}

      <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="0.1 2" className="opacity-60" />
    </svg>
  );
};

const CoinFace: React.FC<{ isBack?: boolean; isResult?: boolean; side: 'sun' | 'moon' }> = ({ isBack, isResult, side }) => {
  return (
    <div className={`
      absolute inset-0 rounded-full border-[3px] flex flex-col items-center justify-center transition-all overflow-hidden
      ${isResult ? 'bg-gradient-to-br from-[#00E676] via-[#00C853] to-[#00A243] border-[#B2FFD9]/40 text-black/80' : 'bg-gradient-to-br from-[#2a2a2a] via-[#121212] to-[#2a2a2a] border-white/10 text-white/20'}
    `} style={{ backfaceVisibility: 'hidden', transform: isBack ? 'rotateY(180deg)' : 'none' }}>
      
      <div className="absolute inset-0 rounded-full border-[12px] border-black/40 pointer-events-none"></div>
      <div className="absolute inset-[8px] rounded-full border-[0.5px] border-white/10 opacity-20"></div>
      
      <ArtisticMandala type={side} />

      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-black/50 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1)_0%,transparent_70%)] pointer-events-none"></div>
    </div>
  );
};

const TossScreen: React.FC<TossScreenProps> = ({ team1, team2, onComplete, onBack }) => {
  const [phase, setPhase] = useState<'caller-selection' | 'call-heads-tails' | 'flipping' | 'result'>('caller-selection');
  const [callingTeam, setCallingTeam] = useState<string | null>(null);
  const [callChoice, setCallChoice] = useState<'HEADS' | 'TAILS' | null>(null);
  const [flipResult, setFlipResult] = useState<'HEADS' | 'TAILS' | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [decision, setDecision] = useState<'bat' | 'bowl' | null>(null);

  const startFlip = () => {
    setPhase('flipping');
    const outcome = Math.random() < 0.5 ? 'HEADS' : 'TAILS';
    
    setTimeout(() => {
      setFlipResult(outcome);
      const isWinner = outcome === callChoice;
      const tossWinner = isWinner ? callingTeam! : (callingTeam === team1 ? team2 : team1);
      setWinner(tossWinner);
      setPhase('result');
    }, 3000); 
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#000] p-6 animate-in fade-in duration-500 overflow-hidden relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${phase === 'result' ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] bg-[radial-gradient(circle_at_center,rgba(0,230,118,0.06)_0%,transparent_65%)] animate-[pulse_4s_infinite]"></div>
        </div>
      </div>

      <header className="flex items-center justify-between mb-2 gap-5 shrink-0 z-20">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-2xl active-scale border border-white/10">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] text-center flex-1">
          Toss Update
        </h2>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full overflow-hidden">
        
        {phase === 'result' && (
          <div className="text-center mb-6 mt-2 animate-in slide-in-from-top-8 duration-700 shrink-0">
            <span className="text-[#00E676] font-black text-[9px] uppercase tracking-[0.8em] block mb-2 opacity-80">Outcome: {flipResult}</span>
            <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-tight px-4 drop-shadow-2xl">
              {winner} Wins
            </h3>
          </div>
        )}

        <div className="relative w-64 h-64 flex items-center justify-center shrink-0" style={{ perspective: '1200px' }}>
          <div 
            className={`
              w-44 h-44 relative transition-all duration-1000
              ${phase === 'flipping' ? 'animate-[toss3D_0.6s_linear_infinite]' : ''}
              ${phase === 'result' ? 'scale-110' : ''}
            `}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <CoinFace side="sun" isResult={phase === 'result'} />
            <CoinFace side="moon" isBack isResult={phase === 'result'} />

            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className={`absolute inset-0 rounded-full border-[1px] ${phase === 'result' ? 'border-[#00C853]/50' : 'border-white/5'}`} 
                style={{ transform: `translateZ(-${(i + 1) * 0.8}px)`, opacity: 0.3 - i * 0.03 }}
              ></div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-[340px] flex flex-col items-center mt-6 pb-4 h-auto">
          {phase === 'caller-selection' && (
            <div className="space-y-6 animate-in fade-in duration-500 w-full">
              <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em] text-center">Assign caller team</p>
              <div className="flex flex-col gap-3">
                {[team1, team2].map(t => (
                  <button 
                    key={t} 
                    onClick={() => { setCallingTeam(t); setPhase('call-heads-tails'); }} 
                    className="py-5 bg-[#111] border border-white/5 rounded-2xl text-white font-black text-xs uppercase tracking-[0.15em] active-scale transition-all"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {phase === 'call-heads-tails' && (
            <div className="space-y-6 animate-in slide-in-from-bottom duration-500 w-full">
              <div className="text-center">
                <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em] mb-1">{callingTeam}'s call</p>
                <p className="text-white font-black text-lg italic uppercase tracking-tight">Heads or Tails?</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {['HEADS', 'TAILS'].map(c => (
                  <button 
                    key={c} 
                    onClick={() => setCallChoice(c as any)} 
                    className={`
                      py-5 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all active-scale 
                      ${callChoice === c 
                        ? 'bg-[#1A1A1A] border-[#00E676] text-[#00E676] shadow-[0_0_15px_rgba(0,230,118,0.1)]' 
                        : 'bg-[#0A0A0A] border-white/5 text-white/30'}
                    `}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <button 
                onClick={startFlip} 
                disabled={!callChoice} 
                className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all active-scale ${callChoice ? 'bg-[#00E676] text-black shadow-lg shadow-[#00E676]/20' : 'bg-white/5 text-white/10 cursor-not-allowed'}`}
              >
                Toss Coin
              </button>
            </div>
          )}

          {phase === 'flipping' && (
            <div className="text-center animate-in fade-in duration-300 py-10">
               <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse italic">Coin is flipping</p>
            </div>
          )}

          {phase === 'result' && (
            <div className="space-y-6 animate-in slide-in-from-bottom duration-1000 w-full overflow-y-auto max-h-[45vh] no-scrollbar px-1">
              <div className="text-center">
                <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.5em] mb-4">{winner}'s Decision</p>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <button 
                    onClick={() => setDecision('bat')} 
                    className={`
                      py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border transition-all active-scale flex items-center justify-center gap-2
                      ${decision === 'bat' 
                        ? 'bg-[#1A1A1A] border-[#00E676] text-[#00E676] shadow-[0_0_15px_rgba(0,230,118,0.1)] scale-[1.02]' 
                        : 'bg-[#0A0A0A] border-white/5 text-white/30'}
                    `}
                  >
                    <span>Batting</span>
                  </button>
                  <button 
                    onClick={() => setDecision('bowl')} 
                    className={`
                      py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border transition-all active-scale flex items-center justify-center gap-2
                      ${decision === 'bowl' 
                        ? 'bg-[#1A1A1A] border-[#00E676] text-[#00E676] shadow-[0_0_15px_rgba(0,230,118,0.1)] scale-[1.02]' 
                        : 'bg-[#0A0A0A] border-white/5 text-white/30'}
                    `}
                  >
                    <span>Bowling</span>
                  </button>
                </div>
              </div>

              <button 
                onClick={() => onComplete({ winner: winner!, decision: decision! })} 
                disabled={!decision} 
                className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.6em] transition-all active-scale mb-4 ${decision ? 'bg-[#00E676] text-black shadow-4xl shadow-[#00E676]/20' : 'bg-white/5 text-white/10 cursor-not-allowed'}`}
              >
                Start Match
              </button>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes toss3D {
          0% { transform: rotateY(0deg) rotateX(0deg) scale(1); }
          25% { transform: rotateY(180deg) rotateX(12deg) scale(1.1); }
          50% { transform: rotateY(360deg) rotateX(0deg) scale(1.2); }
          75% { transform: rotateY(540deg) rotateX(-12deg) scale(1.1); }
          100% { transform: rotateY(720deg) rotateX(0deg) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default TossScreen;
