
import React from 'react';

interface ScoreDisplayProps {
  runs: number;
  wickets: number;
  balls: number;
  battingTeam: string;
  isSecondInnings?: boolean;
  target?: number;
  totalOvers: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  runs, 
  wickets, 
  balls, 
  battingTeam, 
  isSecondInnings, 
  target, 
  totalOvers 
}) => {
  const overs = Math.floor(balls / 6);
  const ballsInOver = balls % 6;
  const totalBalls = totalOvers * 6;
  const remainingBalls = totalBalls - balls;
  const runsToWin = target ? target - runs : 0;
  
  // Highlight with darker palette if it's the last over of the second innings
  const isLastOver = isSecondInnings && remainingBalls <= 6 && remainingBalls > 0;

  return (
    <div className={`rounded-3xl shadow-xl p-5 mb-4 text-center border-b-[8px] relative overflow-hidden shrink-0 transition-all duration-500 ${
      isLastOver 
        ? 'bg-emerald-900 border-emerald-950 text-white' 
        : 'bg-white border-emerald-500 text-gray-900'
    }`}>
      {/* Decorative background element */}
      <div className={`absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full ${isLastOver ? 'bg-white/5' : 'bg-emerald-500/5'}`}></div>
      
      {isSecondInnings && target && (
        <div className={`mb-4 rounded-xl py-3 px-4 border animate-in slide-in-from-top-2 duration-500 flex flex-col items-center justify-center transition-colors duration-500 ${
          isLastOver 
            ? 'bg-emerald-800 border-emerald-700 shadow-inner' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isLastOver ? 'text-emerald-300' : 'text-slate-500'}`}>
            Winning Equation
          </div>
          <p className="text-sm font-black tracking-tight leading-none">
            <span className={`${isLastOver ? 'text-white' : 'text-slate-400 font-bold'}`}>Need</span> 
            <span className={`text-xl mx-1 ${isLastOver ? 'text-white' : 'text-emerald-600'}`}>{runsToWin}</span> 
            <span className={`${isLastOver ? 'text-white' : 'text-slate-400 font-bold'}`}>from</span> 
            <span className={`text-xl mx-1 ${isLastOver ? 'text-white' : 'text-emerald-600'}`}>{remainingBalls}</span> 
            <span className={`${isLastOver ? 'text-white' : 'text-slate-400 font-bold'}`}>balls</span>
          </p>
        </div>
      )}

      <div className={`text-[10px] font-black uppercase tracking-[0.3em] mb-1 ${isLastOver ? 'text-emerald-400' : 'text-emerald-600 opacity-80'}`}>
        {battingTeam || 'BATTING TEAM'}
      </div>
      
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className={`text-6xl font-black tracking-tighter drop-shadow-sm transition-colors duration-500 ${isLastOver ? 'text-white' : 'text-gray-900'}`}>
          {runs}
        </span>
        <span className="text-4xl font-light text-gray-300">/</span>
        <span className="text-6xl font-black text-red-600 tracking-tighter drop-shadow-sm">
          {wickets}
        </span>
      </div>
      
      <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-xl border transition-colors duration-500 ${
        isLastOver 
          ? 'bg-emerald-800 border-emerald-700' 
          : 'bg-emerald-50 border-emerald-100'
      }`}>
        <span className={`text-xl font-black ${isLastOver ? 'text-white' : 'text-emerald-600'}`}>
          {overs}.{ballsInOver}
        </span>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${isLastOver ? 'text-emerald-400' : 'text-gray-400'}`}>Overs</span>
      </div>
      
      {isLastOver && (
        <div className="mt-2 text-[8px] font-black uppercase tracking-[0.5em] text-emerald-400 animate-pulse">
          Final Over Intensity
        </div>
      )}
    </div>
  );
};

export default ScoreDisplay;
