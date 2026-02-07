
import React from 'react';
import { BallEvent, InningsData } from '../types';

interface MatchSummaryProps {
  innings: InningsData;
  onContinue: () => void;
  isMatchLive?: boolean;
}

const MatchSummary: React.FC<MatchSummaryProps> = ({ innings, onContinue, isMatchLive }) => {
  // Group history into overs
  const overs: BallEvent[][] = [];
  for (let i = 0; i < innings.history.length; i++) {
    const ball = innings.history[i];
    const lastOver = overs[overs.length - 1];
    
    const isLegalBall = ball !== 'wd' && ball !== 'nb';
    const legalBallsInLastOver = lastOver ? lastOver.filter(b => b !== 'wd' && b !== 'nb').length : 0;

    if (!lastOver || legalBallsInLastOver >= 6) {
      overs.push([ball]);
    } else {
      lastOver.push(ball);
    }
  }

  const getOverStats = (over: BallEvent[]) => {
    let runs = 0;
    let wickets = 0;
    let boundaries = 0;
    let sixes = 0;
    over.forEach(b => {
      if (b === 'W') wickets++;
      else if (b === '4') { runs += 4; boundaries++; }
      else if (b === '6') { runs += 6; sixes++; }
      else if (b === 'wd' || b === 'nb') runs += 1;
      else runs += parseInt(b);
    });
    return { runs, wickets, boundaries, sixes };
  };

  const currentRunRate = innings.balls > 0 
    ? (innings.runs / (innings.balls / 6)).toFixed(2) 
    : "0.00";

  return (
    <div className="flex-1 flex flex-col p-6 animate-in fade-in duration-500 h-full overflow-hidden relative z-10">
      <div className="bg-white rounded-[40px] p-6 shadow-2xl border-b-[8px] border-emerald-500 flex flex-col h-full">
        <header className="text-center mb-6">
          <div className="inline-block px-3 py-1 bg-emerald-50 rounded-full text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-3 border border-emerald-100">
            {isMatchLive ? 'Live Scorecard' : 'Innings Scorecard'}
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-none italic uppercase mb-2">
            {innings.battingTeam}
          </h2>
          
          <div className="flex flex-col items-center justify-center">
            <div className="text-5xl font-black text-gray-900 tracking-tighter leading-none">
              {innings.runs}<span className="text-gray-300">/</span><span className="text-red-600">{innings.wickets}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
               <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Run Rate</span>
               <span className="text-sm font-black text-emerald-600">{currentRunRate}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {overs.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-300 text-xs font-bold uppercase tracking-widest">
              No deliveries yet
            </div>
          ) : (
            overs.map((over, idx) => {
              const stats = getOverStats(over);
              return (
                <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 transition-all hover:bg-emerald-50/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Over {idx + 1}</span>
                    <div className="flex gap-2 text-[10px] font-bold text-gray-400">
                      <span>{stats.runs} Runs</span>
                      <span>{stats.wickets} Wkt</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {over.map((b, bIdx) => (
                      <div key={bIdx} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black shadow-sm ${
                        b === 'W' ? 'bg-red-500 text-white' : 
                        (b === '4' || b === '6') ? 'bg-emerald-600 text-white' : 
                        (b === 'wd' || b === 'nb') ? 'bg-amber-400 text-gray-900' : 'bg-white border border-gray-200 text-gray-400'
                      }`}>
                        {b}
                      </div>
                    ))}
                  </div>
                  {(stats.boundaries > 0 || stats.sixes > 0) && (
                    <div className="text-[8px] font-black text-emerald-500 uppercase tracking-widest flex gap-2">
                      {stats.boundaries > 0 && <span>{stats.boundaries}x 4s</span>}
                      {stats.sixes > 0 && <span>{stats.sixes}x 6s</span>}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <button 
          onClick={onContinue}
          className="w-full py-4 mt-6 bg-black text-emerald-500 rounded-3xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-black/20 flex items-center justify-center gap-2"
        >
          {isMatchLive ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              BACK TO LIVE MATCH
            </>
          ) : (
            'CONTINUE'
          )}
        </button>
      </div>
    </div>
  );
};

export default MatchSummary;
