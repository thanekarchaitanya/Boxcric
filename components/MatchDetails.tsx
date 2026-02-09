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
    <div className="bg-gradient-to-r from-[var(--card-bg)] to-[#1A1A1A] rounded-xl px-3 py-1.5 mt-1 border border-[var(--border-color)] flex items-center justify-between shadow-lg shrink-0 transition-all relative overflow-hidden group">
      
      {/* Left Section: Metadata & Team Matchup */}
      <div className="flex flex-col min-w-0 flex-1 pr-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[7px] font-black text-[var(--accent-green)] uppercase tracking-[0.2em] leading-none bg-[var(--accent-green)]/10 px-1.5 py-0.5 rounded shrink-0">
            {matchId}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <div className="w-1 h-1 rounded-full bg-[var(--accent-green)] animate-pulse"></div>
            <span className="text-[7px] font-black text-white/40 uppercase tracking-[0.1em] italic">Live Score</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[13px] font-black text-white truncate uppercase italic tracking-tighter leading-none pr-1 max-w-[90px]">
            {team1}
          </span>
          <span className="text-[8px] font-black text-white/10 italic uppercase leading-none shrink-0">v</span>
          <span className="text-[13px] font-black text-white/40 truncate uppercase italic tracking-tighter leading-none pr-1 max-w-[90px]">
            {team2}
          </span>
        </div>
      </div>
      
      {/* Right Section: Match Format & Edit */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Glass Separator */}
        <div className="h-8 w-[1px] bg-white/10 mx-1"></div>

        <div className="flex flex-col items-center justify-center min-w-[36px]">
          <span className="text-2xl font-black text-[var(--accent-green)] italic leading-none tracking-tighter tabular-nums drop-shadow-[0_0_10px_rgba(0,230,118,0.2)]">
            {totalOvers}
          </span>
          <span className="text-[6px] text-[var(--text-secondary)] font-black uppercase tracking-[0.1em] mt-0.5 leading-none opacity-30">
            Format
          </span>
        </div>

        {onEdit && (
          <button 
            onClick={onEdit}
            className="w-11 h-11 flex items-center justify-center bg-white/[0.05] border border-white/5 rounded-xl text-white/30 hover:text-white hover:border-white/20 active-scale transition-all shrink-0 ml-1.5 shadow-inner"
            title="Edit Match"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        )}
      </div>

      {/* Very Subtle Decorative Glow */}
      <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-[var(--accent-green)]/5 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default MatchDetails;