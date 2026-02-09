import React from 'react';

interface MatchDetailsProps {
  team1: string;
  team2: string;
  totalOvers: number;
  currentOvers: string;
  onEdit?: () => void;
  matchId: string;
}

const MatchDetails: React.FC<MatchDetailsProps> = ({ team1, team2, totalOvers, currentOvers, onEdit, matchId }) => {
  return (
    <div className="bg-[#161616] rounded-[1.25rem] px-5 py-2.5 mt-2 border border-white/5 flex items-center shadow-2xl shrink-0 transition-all relative overflow-hidden group">
      {/* Teams Section - Now fully left-aligned */}
      <div className="flex-1 min-w-0 pr-4 border-r border-white/5 flex flex-col justify-center">
        <div className="flex items-center gap-1.5 mb-1">
           <span className="text-[7px] font-black text-[#00E676] uppercase tracking-[0.2em] bg-[#00E676]/10 px-1.5 py-0.5 rounded leading-none">ID: {matchId}</span>
           <div className="w-1 h-1 rounded-full bg-[#00E676]/30"></div>
           <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none">Live Session</span>
        </div>
        
        {/* Team names starting from the left */}
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          <span className="text-base font-black text-white truncate uppercase italic tracking-tight leading-none max-w-[40%]">
            {team1}
          </span>
          
          <span className="text-[7px] font-black text-white/20 italic uppercase leading-none tracking-widest shrink-0">VS</span>
          
          <span className="text-base font-black text-white/60 truncate uppercase italic tracking-tight leading-none flex-1">
            {team2}
          </span>
        </div>
      </div>
      
      {/* Overs Format Display - Compact */}
      <div className="px-3 flex flex-col items-center justify-center border-r border-white/5 min-w-[45px] flex-shrink-0">
        <span className="text-base font-black text-white italic leading-none tracking-tighter">
          {totalOvers}
        </span>
        <span className="text-[6px] text-slate-500 font-black uppercase tracking-[0.1em] mt-0.5 leading-none">
          Overs
        </span>
      </div>

      {/* Action Area */}
      {onEdit && (
        <div className="pl-3 flex-shrink-0">
          <button 
            onClick={onEdit}
            className="w-8 h-8 flex items-center justify-center bg-[#1A1A1A] border border-white/10 rounded-lg text-slate-500 hover:text-[#00E676] hover:border-[#00E676]/40 active-scale transition-all shadow-inner"
            title="Edit Match Details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default MatchDetails;