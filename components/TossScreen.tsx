import React, { useState } from 'react';
import { TossResult } from '../types';
import Coin from './Coin';

interface TossScreenProps {
  team1: string;
  team2: string;
  onComplete: (result?: TossResult) => void;
  onBack: () => void;
}

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
    }, 2800); 
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-[#000] p-6 animate-in fade-in duration-500 overflow-hidden relative">
      <header className="flex items-center justify-between mb-4 gap-5 shrink-0 z-20">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-2xl active-scale border border-white/10">
          <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] text-center flex-1 italic">Match Toss</h2>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <div className="w-[400px] h-[400px] rounded-full border border-white/[0.1] absolute animate-[spin_20s_linear_infinite]"></div>
        </div>

        {phase === 'result' && (
          <div className="text-center mb-8 animate-in slide-in-from-top-12 duration-700 shrink-0 z-20">
            <span className="text-[#00E676] font-black text-[11px] uppercase tracking-[1em] block mb-3 drop-shadow-[0_0_15px_rgba(0,230,118,0.5)]">{flipResult}</span>
            <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
              {winner} <span className="text-[#00E676]">Wins!</span>
            </h3>
          </div>
        )}

        <div className="flex flex-col items-center">
          <Coin 
            side={flipResult || 'HEADS'} 
            isFlipping={phase === 'flipping'} 
            isResult={phase === 'result'} 
            className={phase === 'flipping' ? "" : "animate-[float_6s_easeInOutSine_infinite]"}
          />
          
          <div className="h-6 mt-10 overflow-hidden flex items-center justify-center">
            {phase === 'flipping' && (
              <p className="text-[#00E676] text-[10px] font-black uppercase tracking-[0.8em] animate-pulse italic">
                Coin is flipping
              </p>
            )}
          </div>
        </div>

        <div className="w-full max-w-[320px] flex flex-col items-center mt-12 pb-4 z-20">
          {phase === 'caller-selection' && (
            <div className="space-y-4 animate-in fade-in duration-500 w-full">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] text-center italic">Caller Team Selection</p>
              <div className="flex flex-col gap-3">
                {[team1, team2].map(t => (
                  <button key={t} onClick={() => { setCallingTeam(t); setPhase('call-heads-tails'); }} className="h-16 w-full bg-[#1A1A1A] border border-white/5 rounded-[2rem] text-white font-black text-[13px] uppercase tracking-widest active-scale hover:border-[#00E676]/20 transition-all">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {phase === 'call-heads-tails' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500 w-full">
              <div className="text-center">
                <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] mb-2">{callingTeam}'s call</p>
                <p className="text-white font-black text-2xl italic uppercase tracking-tighter">Heads or Tails?</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['HEADS', 'TAILS'].map(c => (
                  <button key={c} onClick={() => setCallChoice(c as any)} className={`h-16 rounded-[2rem] font-black text-[11px] uppercase tracking-widest border transition-all active-scale ${callChoice === c ? 'bg-[#00E676]/10 border-[#00E676] text-[#00E676] shadow-[0_0_25px_rgba(0,230,118,0.15)]' : 'bg-[#1A1A1A] border-white/5 text-white/30'}`}>
                    {c}
                  </button>
                ))}
              </div>
              <button onClick={startFlip} disabled={!callChoice} className={`w-full h-16 rounded-[2rem] font-black text-[13px] uppercase tracking-[0.4em] transition-all active-scale ${callChoice ? 'bg-[#00E676] text-black shadow-xl shadow-[#00E676]/30' : 'bg-[#1A1A1A] text-white/5'}`}>Flip coin</button>
            </div>
          )}

          {phase === 'result' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 w-full">
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setDecision('bat')} className={`h-16 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] border transition-all active-scale ${decision === 'bat' ? 'bg-[#00E676]/10 border-[#00E676] text-[#00E676]' : 'bg-[#1A1A1A] border-white/5 text-white/30'}`}>Batting</button>
                <button onClick={() => setDecision('bowl')} className={`h-16 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] border transition-all active-scale ${decision === 'bowl' ? 'bg-[#00E676]/10 border-[#00E676] text-[#00E676]' : 'bg-[#1A1A1A] border-white/5 text-white/30'}`}>Bowling</button>
              </div>
              <button onClick={() => onComplete({ winner: winner!, decision: decision! })} disabled={!decision} className={`w-full h-16 rounded-[2rem] font-black text-[13px] uppercase tracking-[0.4em] transition-all active-scale ${decision ? 'bg-[#00E676] text-black shadow-2xl shadow-[#00E676]/30' : 'bg-[#1A1A1A] text-white/5'}`}>Start Match</button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotateX(10deg); }
          50% { transform: translateY(-12px) rotateX(15deg); }
        }
      `}</style>
    </div>
  );
};

export default TossScreen;