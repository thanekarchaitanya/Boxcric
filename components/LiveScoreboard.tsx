import React from 'react';
import { BallHistory } from '../types';

interface LiveScoreboardProps {
  battingTeamName: string;
  runs: number;
  wickets: number;
  overs: string;
  runRate: string;
  overHistory: BallHistory[];
  innings?: 1 | 2;
  target?: number | null;
  totalOvers?: number;
  fullHistory?: BallHistory[];
}

const BallIndicator: React.FC<{ ball: BallHistory | null }> = ({ ball }) => {
  if (!ball) {
    return (
      <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/5 opacity-30 shrink-0">
        <div className="w-1 h-1 rounded-full bg-white/20"></div>
      </div>
    );
  }

  let bgColor = 'bg-[#1A1A1A] text-slate-400 border-white/5';
  let label = ball.runs.toString();
  let textColor = 'text-slate-400';

  if (ball.isWicket) {
    bgColor = 'bg-[#FF3B30] border-[#FF3B30]/20 shadow-lg';
    label = 'W';
    textColor = 'text-white';
  } else if (ball.type === 'wide' || ball.type === 'noball') {
    bgColor = 'bg-amber-400 border-amber-500/50 shadow-sm';
    label = ball.type === 'wide' ? 'WD' : 'NB';
    textColor = 'text-black text-[6px]';
  } else if (ball.runs === 4) {
    bgColor = 'bg-[#00C853] border-white/10 shadow-lg';
    label = '4';
    textColor = 'text-black';
  } else if (ball.runs === 6) {
    bgColor = 'bg-[#00E676] border-white/30 shadow-[0_0_15px_rgba(0,230,118,0.4)]';
    label = '6';
    textColor = 'text-black';
  } else if (ball.runs === 0) {
    label = '•';
    bgColor = 'bg-white/5 border-white/5';
    textColor = 'text-white/30';
  } else {
    bgColor = 'bg-white/10 border-white/5';
    textColor = 'text-white/90';
  }

  return (
    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-[8px] border transition-all active-scale uppercase italic shrink-0 ${bgColor} ${textColor} shadow-md`}>
      {label}
    </div>
  );
};

const LiveScoreboard: React.FC<LiveScoreboardProps> = ({ 
  battingTeamName, runs, wickets, overs, runRate, overHistory, innings, target, totalOvers, fullHistory 
}) => {
  const displayBalls = [...overHistory];
  const placeholderCount = Math.max(0, 6 - overHistory.length);
  for (let i = 0; i < placeholderCount; i++) {
    displayBalls.push(null as any);
  }

  const [ovInt, ballInt] = overs.split('.').map(Number);
  const totalBallsBowled = (ovInt * 6) + ballInt;
  const totalMatchBalls = (totalOvers || 0) * 6;
  const ballsRemaining = Math.max(0, totalMatchBalls - totalBallsBowled);
  const runsRequired = target !== null && target !== undefined ? Math.max(0, target - runs) : null;
  
  const isLastOver = totalOvers ? ovInt === (totalOvers - 1) : false;
  const progressPercent = target ? Math.min(100, (runs / target) * 100) : 0;

  // For spectator mode, group fullHistory into overs
  const groupedOvers: BallHistory[][] = [];
  if (fullHistory) {
    let current: BallHistory[] = [];
    let legal = 0;
    fullHistory.forEach(b => {
      current.push(b);
      if (b.type === 'legal') legal++;
      if (legal === 6) {
        groupedOvers.push(current);
        current = [];
        legal = 0;
      }
    });
    if (current.length > 0) groupedOvers.push(current);
  }

  return (
    <div className="mt-2 flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className={`
        relative overflow-hidden rounded-2xl border transition-all duration-700 flex flex-[3] flex-col
        ${isLastOver 
          ? 'bg-[#080808] border-[#00E676] shadow-[0_0_50px_rgba(0,230,118,0.2)]' 
          : 'bg-[#0A0A0A] border-white/10 shadow-2xl'}
      `}>
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '10px 10px' }}
        ></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,230,118,0.04)_0%,transparent_50%)] pointer-events-none"></div>
        
        <div className="flex flex-1 min-h-0 relative z-10">
          <div className="flex-[2.2] flex flex-col items-center justify-center py-2 px-3 min-w-0 relative">
            <div className="bg-white/5 px-3 py-1 rounded-full border border-white/5 mb-1 backdrop-blur-md">
              <h2 className="text-[6.5pt] font-black text-[#00E676] uppercase italic tracking-[0.3em] text-center truncate w-full leading-none">
                {battingTeamName}
              </h2>
            </div>

            <div className="flex items-center justify-center">
              <span className="text-5xl font-black text-white italic tracking-tighter tabular-nums leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.08)]">
                {runs}
              </span>
              <div className="flex items-center px-4">
                <span className="text-4xl font-black text-white/40 italic transform -rotate-12 select-none">/</span>
              </div>
              <span className="text-5xl font-black text-[#FF3B30] italic leading-none tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(255,59,48,0.15)]">
                {wickets}
              </span>
            </div>
          </div>

          <div className="flex-1 bg-black/30 border-l border-white/5 flex flex-col min-w-0 relative overflow-hidden backdrop-blur-xl">
            <div className="flex-1 overflow-y-auto no-scrollbar p-2 flex items-center justify-center relative z-10">
              <div className="grid grid-cols-3 gap-x-1.5 gap-y-2 justify-items-center h-fit">
                {displayBalls.map((ball, i) => (
                  <BallIndicator key={i} ball={ball} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="h-14 bg-black/40 border-t border-white/10 flex items-center divide-x divide-white/5 shrink-0 relative backdrop-blur-2xl">
          <div className="flex-1 flex flex-col items-center justify-center py-0.5">
            <span className="text-[6pt] font-black text-white/20 uppercase tracking-[0.15em] mb-0.5 leading-none">Overs</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-white italic tracking-tighter tabular-nums leading-none">{overs}</span>
              <span className="text-[8pt] font-black text-white/10 italic">/ {totalOvers}</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-0.5">
            <span className="text-[6pt] font-black text-[#00E676]/30 uppercase tracking-[0.15em] mb-0.5 leading-none">Current RR</span>
            <span className="text-lg font-black text-[#00E676] italic tracking-tighter tabular-nums leading-none">{runRate}</span>
          </div>
        </div>
      </div>

      {innings === 2 && target && (
        <div className="mt-2 shrink-0 px-1">
          <div className="bg-[#0F0F0F] border border-white/5 rounded-xl py-2.5 px-4 shadow-xl relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5"></div>
            <div className="absolute bottom-0 left-0 h-[2px] bg-[#00E676] transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,230,118,0.4)]" style={{ width: `${progressPercent}%` }}></div>
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[#00E676] text-base font-black italic tabular-nums leading-none">{runsRequired}</span>
                <span className="text-white/20 text-[7pt] font-black uppercase tracking-[0.1em] italic">needed from</span>
                <span className="text-white text-base font-black italic tabular-nums leading-none">{ballsRemaining}</span>
                <span className="text-white/20 text-[7pt] font-black uppercase tracking-[0.1em] italic">balls</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL BALL-BY-BALL HISTORY FOR SPECTATORS */}
      {fullHistory && (
        <div className="mt-4 flex-1 flex flex-col min-h-0 bg-white/[0.02] border border-white/5 rounded-2xl p-4 overflow-hidden">
           <div className="flex items-center justify-between mb-4 shrink-0">
              <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em] italic leading-none">Over Summary</span>
              <div className="px-2 py-0.5 bg-[#00E676]/10 rounded-full border border-[#00E676]/20">
                 <span className="text-[7px] font-black text-[#00E676] uppercase">Real-time</span>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
              {groupedOvers.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
                   <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                   <span className="text-[9px] font-bold uppercase tracking-widest">Waiting for first ball</span>
                </div>
              ) : (
                groupedOvers.map((over, idx) => (
                  <div key={idx} className="flex items-center gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                    <div className="shrink-0 w-10 text-center">
                       <span className="text-[10px] font-black text-white italic tracking-tighter uppercase leading-none">Ov {idx + 1}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 flex-1">
                       {over.map((b, bIdx) => <BallIndicator key={bIdx} ball={b} />)}
                    </div>
                  </div>
                )).reverse()
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default LiveScoreboard;