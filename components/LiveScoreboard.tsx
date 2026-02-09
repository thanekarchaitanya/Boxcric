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
}

const BallIndicator: React.FC<{ ball: BallHistory | null }> = ({ ball }) => {
  if (!ball) {
    return (
      <div className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/5 opacity-30 shrink-0">
        <div className="w-1 h-1 rounded-full bg-slate-700"></div>
      </div>
    );
  }

  let bgColor = 'bg-[#1E1E1E] text-slate-400 border-white/5';
  let label = ball.runs.toString();
  let textColor = 'text-slate-300';

  if (ball.isWicket) {
    bgColor = 'bg-[#FF3B30] border-[#FF3B30]/20 shadow-[0_4px_12px_rgba(255,59,48,0.3)]';
    label = 'W';
    textColor = 'text-white';
  } else if (ball.type === 'wide') {
    bgColor = 'bg-amber-500/10 border-amber-500/30';
    label = 'WD';
    textColor = 'text-amber-500 text-[6px]';
  } else if (ball.type === 'noball') {
    bgColor = 'bg-amber-500/10 border-amber-500/30';
    label = 'NB';
    textColor = 'text-amber-500 text-[6px]';
  } else if (ball.runs === 4) {
    bgColor = 'bg-[#00E676]/20 border-[#00E676]/30';
    label = '4';
    textColor = 'text-[#00E676]';
  } else if (ball.runs === 6) {
    bgColor = 'bg-[#00E676] border-[#00E676]/20 shadow-[0_4px_12px_rgba(0,230,118,0.25)]';
    label = '6';
    textColor = 'text-black';
  } else if (ball.runs === 0 && !ball.isWicket) {
    label = '•';
    bgColor = 'bg-white/5 border-white/5';
    textColor = 'text-slate-600';
  }

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[9px] border transition-all active-scale uppercase italic shrink-0 ${bgColor} ${textColor} shadow-md`}>
      {label}
    </div>
  );
};

const LiveScoreboard: React.FC<LiveScoreboardProps> = ({ 
  battingTeamName, runs, wickets, overs, runRate, overHistory, innings, target, totalOvers 
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

  return (
    <div className="mt-2 flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Main Score Card with High-Intensity Design */}
      <div className={`
        relative overflow-hidden rounded-[2rem] border transition-all duration-700 flex flex-1 flex-col
        ${isLastOver 
          ? 'bg-gradient-to-br from-[#0D0D0D] via-[#081A10] to-[#050505] border-[#00E676]/50 shadow-[0_0_50px_rgba(0,230,118,0.2)] ring-1 ring-[#00E676]/30' 
          : 'bg-gradient-to-br from-[#121212] via-[#0A0A0A] to-[#050505] border-white/10 shadow-2xl'}
      `}>
        
        {/* LCD Dot Matrix Texture Layer */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
        
        {/* Match Intensity Glow */}
        {isLastOver && (
          <div className="absolute inset-0 bg-[#00E676]/5 animate-pulse pointer-events-none"></div>
        )}

        <div className="flex flex-1 min-h-0 relative z-10">
          
          {/* LEFT: Hero Score Section */}
          <div className="flex-[1.6] flex flex-col items-center justify-center py-4 px-2 min-w-0 relative">
            {/* Team Identity - Increased Z-index and removed excessive bottom margin to save space */}
            <h2 className="relative z-20 text-[9px] font-black text-[#00E676] uppercase italic tracking-[0.4em] text-center truncate w-full mb-1 opacity-90 drop-shadow-[0_0_10px_rgba(0,230,118,0.4)]">
              {battingTeamName}
            </h2>

            {/* Centered Hero Score - Slightly reduced sizes for better fit */}
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-6xl xs:text-7xl font-black text-white italic tracking-tighter tabular-nums leading-none 
                               drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
                {runs}
              </span>
              <div className="flex items-center">
                <span className="text-3xl xs:text-4xl font-black text-white/30 italic transform -rotate-12 select-none">/</span>
                <span className="text-5xl xs:text-6xl font-black text-[#FF3B30] italic leading-none tracking-tighter tabular-nums 
                                 drop-shadow-[0_0_20px_rgba(255,59,48,0.3)] opacity-90 ml-1">
                  {wickets}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Over History (3-column layout) */}
          <div className="flex-1 bg-black/40 backdrop-blur-sm border-l border-white/5 flex flex-col min-w-0 relative overflow-hidden shadow-inner">
            <div className="flex-1 overflow-y-auto no-scrollbar p-3 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-x-2 gap-y-2.5 justify-items-center h-fit">
                {displayBalls.map((ball, i) => (
                  <BallIndicator key={i} ball={ball} />
                ))}
              </div>
            </div>

            {/* Subtle Gradient Fade at Top/Bottom of Ball List */}
            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#0A0A0A] to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* BOTTOM: Performance Bar */}
        <div className="h-14 bg-[#161616]/90 border-t border-white/10 flex items-center divide-x divide-white/5 shrink-0 backdrop-blur-xl relative">
          {/* Bottom Accent "Rail" */}
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

          <div className="flex-1 flex flex-col items-center justify-center py-1 px-3 group">
            <span className="text-[6px] font-black text-white/20 uppercase tracking-[0.2em] mb-0.5 leading-none group-hover:text-white/40 transition-colors">Overs</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-white italic tracking-tighter tabular-nums leading-none">
                {overs}
              </span>
              <span className="text-[8px] font-black text-white/20 italic">/ {totalOvers}</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-1 px-3 group">
            <span className="text-[6px] font-black text-[#00E676]/30 uppercase tracking-[0.2em] mb-0.5 leading-none group-hover:text-[#00E676]/60 transition-colors">C. RR</span>
            <div className="flex items-baseline">
              <span className="text-lg font-black text-[#00E676] italic tracking-tighter tabular-nums leading-none drop-shadow-[0_0_10px_rgba(0,230,118,0.2)]">
                {runRate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Equation Display - Second Innings Only - Refined to be smaller */}
      {innings === 2 && target && (
        <div className="mt-2 shrink-0 animate-in slide-in-from-top-4 duration-700 ease-out">
          <div className="bg-[#121212] border border-white/5 rounded-xl py-2 px-4 shadow-2xl relative overflow-hidden">
            {/* Background progress track */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5"></div>
            {/* Active progress bar */}
            <div 
              className="absolute bottom-0 left-0 h-[2px] bg-[#00E676] shadow-[0_0_10px_rgba(0,230,118,0.6)] transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>

            <div className="flex flex-col items-center justify-center gap-1">
              <div className="flex items-baseline gap-1">
                <span className="text-[#00E676] text-sm font-black italic tabular-nums leading-none drop-shadow-[0_0_8px_rgba(0,230,118,0.2)]">
                  {runsRequired}
                </span>
                <span className="text-white/40 text-[7px] font-black uppercase tracking-widest italic">runs needed in</span>
                <span className="text-white text-sm font-black italic tabular-nums leading-none">
                  {ballsRemaining}
                </span>
                <span className="text-white/40 text-[7px] font-black uppercase tracking-widest italic">balls</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveScoreboard;