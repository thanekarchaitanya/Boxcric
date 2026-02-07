
import React from 'react';
import { BallEvent, MatchState } from '../types';

interface MatchHighlightsProps {
  state: MatchState;
  duration: string;
  onNewMatch: () => void;
  onBack: () => void;
}

const MatchHighlights: React.FC<MatchHighlightsProps> = ({ state, duration, onNewMatch, onBack }) => {
  const counts = state.history.reduce((acc, event) => {
    acc[event] = (acc[event] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    { label: 'Fours', value: counts['4'] || 0, color: 'text-emerald-500' },
    { label: 'Sixes', value: counts['6'] || 0, color: 'text-emerald-400' },
    { label: 'Wickets', value: state.wickets, color: 'text-red-500' },
    { label: 'Extras', value: (counts['wd'] || 0) + (counts['nb'] || 0), color: 'text-amber-500' },
  ];

  return (
    <div className="h-full flex flex-col p-4 animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
      <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-2xl overflow-hidden relative flex flex-col">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-red-500 to-emerald-500"></div>
        
        <header className="text-center mb-4">
          <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-1">Match Highlights</h2>
          <div className="text-2xl font-black text-white italic tracking-tighter leading-tight">
            {state.battingTeam} <span className="text-gray-500 font-normal">vs</span> {state.bowlingTeam}
          </div>
          <div className="text-[10px] font-bold text-gray-400 mt-1">{duration} Match Duration</div>
        </header>

        <div className="flex items-center justify-center gap-4 mb-4 bg-white/5 p-4 rounded-3xl">
          <div className="text-center">
             <div className="text-4xl font-black text-white tracking-tighter leading-none">{state.runs}</div>
             <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-1">Runs</div>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="text-center">
             <div className="text-4xl font-black text-red-600 tracking-tighter leading-none">{state.wickets}</div>
             <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-1">Wickets</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/5 p-3 rounded-2xl text-center">
              <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-auto space-y-2">
          <button 
            onClick={onNewMatch}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-base transition-all active:scale-95 shadow-xl shadow-emerald-500/20"
          >
            NEW MATCH
          </button>
          <button 
            onClick={onBack}
            className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all"
          >
            BACK
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchHighlights;
