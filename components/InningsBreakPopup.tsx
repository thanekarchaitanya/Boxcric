
import React from 'react';

interface InningsBreakPopupProps {
  battingTeam: string;
  bowlingTeam: string;
  runs: number;
  wickets: number;
  totalOvers: number;
  onContinue: () => void;
  onShowSummary: () => void;
}

const InningsBreakPopup: React.FC<InningsBreakPopupProps> = ({ 
  battingTeam, bowlingTeam, runs, wickets, totalOvers, onContinue, onShowSummary 
}) => {
  const target = runs + 1;
  const rrr = (target / totalOvers).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] w-full max-w-sm p-8 text-center shadow-[0_0_50px_rgba(16,185,129,0.4)] border-b-[12px] border-emerald-500">
        <div className="bg-emerald-100 text-emerald-700 inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
          Innings 1 Complete
        </div>
        
        <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
          {battingTeam} Finished
        </h2>
        
        <div className="text-5xl font-black text-gray-900 mb-6 tracking-tighter">
          {runs}<span className="text-gray-300">/</span><span className="text-red-600">{wickets}</span>
        </div>

        <div className="bg-black text-emerald-500 p-6 rounded-[32px] mb-8 shadow-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.2em] block opacity-70 mb-2">Target for {bowlingTeam}</span>
          <span className="text-7xl font-black leading-none block">{target}</span>
          <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-white/10">
            <div className="text-center">
              <span className="block text-[10px] opacity-60 uppercase font-black tracking-widest">Required RR</span>
              <span className="text-xl font-black text-white">{rrr}</span>
            </div>
            <div className="w-px bg-white/10 h-8 mt-2"></div>
            <div className="text-center">
              <span className="block text-[10px] opacity-60 uppercase font-black tracking-widest">Overs</span>
              <span className="text-xl font-black text-white">{totalOvers}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={onShowSummary}
            className="w-full py-5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 border border-gray-200"
          >
            Quick Summary
          </button>
          <button 
            onClick={onContinue}
            className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-lg uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-emerald-500/40 animate-pulse ring-4 ring-emerald-500/20"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default InningsBreakPopup;
