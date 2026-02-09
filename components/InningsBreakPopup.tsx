
import React from 'react';
import { InningsData } from '../types';

interface InningsBreakPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onViewSummary?: () => void;
  target: number;
  data: InningsData;
  teamName: string;
  totalOvers: number;
}

const InningsBreakPopup: React.FC<InningsBreakPopupProps> = ({ isOpen, onClose, onViewSummary, target, data, teamName, totalOvers }) => {
  if (!isOpen) return null;

  const fours = data.history.filter(b => b.runs === 4).length;
  const sixes = data.history.filter(b => b.runs === 6).length;
  const totalBalls = totalOvers * 6;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-[#121212] border border-white/10 rounded-[2rem] p-8 text-center shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00E676] to-transparent opacity-30"></div>
        
        <div className="mb-6">
          <span className="text-[8px] font-black text-[#00E676] uppercase tracking-[0.4em] block mb-2 opacity-50">First Innings Complete</span>
          <h2 className="text-sm font-black text-white/40 uppercase tracking-widest mb-1 italic">{teamName}</h2>
          <h3 className="text-base font-black text-white italic uppercase tracking-tighter leading-none mb-2">Target to win</h3>
          <div className="text-5xl font-black text-[#00E676] tracking-tighter italic leading-none my-2 drop-shadow-[0_0_15px_rgba(0,230,118,0.25)]">
            {target}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5 mt-1">
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest italic">
              {target} runs from {totalBalls} balls
            </span>
          </div>
        </div>

        {/* Simplified Performance Summary - Centered & Clean */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 mb-8 flex flex-col items-center">
           <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 block">1st Innings Performance</span>
           
           <div className="flex items-baseline justify-center gap-1 mb-4">
             <span className="text-2xl font-black text-white italic tracking-tighter leading-none">{data.runs}</span>
             <span className="text-xl font-black text-[#FF3B30] italic tracking-tighter opacity-70 leading-none">/{data.wickets}</span>
             <span className="text-[8px] font-black text-white/30 uppercase tracking-widest italic ml-2">({data.overs} Ov)</span>
           </div>

           <div className="grid grid-cols-2 gap-2 w-full">
             <div className="bg-white/5 rounded-lg py-2 px-3 flex flex-col items-center border border-white/5">
                <span className="text-[7px] font-black text-white/20 uppercase mb-0.5">4s</span>
                <span className="text-sm font-black text-white italic leading-none">{fours}</span>
             </div>
             <div className="bg-white/5 rounded-lg py-2 px-3 flex flex-col items-center border border-white/5">
                <span className="text-[7px] font-black text-white/20 uppercase mb-0.5">6s</span>
                <span className="text-sm font-black text-[#00E676] italic leading-none">{sixes}</span>
             </div>
           </div>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-[#00E676] text-black rounded-xl font-black text-[10px] uppercase tracking-[0.3em] active-scale shadow-lg shadow-[#00E676]/10 transition-all"
          >
            Start Chasing
          </button>
          
          <button 
            onClick={onViewSummary}
            className="w-full py-3 bg-white/5 text-white/40 border border-white/5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] active-scale transition-all"
          >
            Check 1st Innings Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default InningsBreakPopup;
