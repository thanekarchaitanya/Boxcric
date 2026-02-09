
import React from 'react';

interface MatchIDPopupProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
}

const MatchIDPopup: React.FC<MatchIDPopupProps> = ({ isOpen, onClose, matchId }) => {
  if (!isOpen) return null;

  const copyId = () => {
    navigator.clipboard.writeText(matchId);
    alert('Match ID copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-[#121212] border border-white/10 rounded-3xl p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-[#00E676]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#00E676]/20">
          <svg className="w-10 h-10 text-[#00E676]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
        </div>

        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">Match <span className="text-[#00E676]">Created!</span></h3>
        <p className="text-slate-500 text-xs font-medium mb-8">Share this unique ID with others to join the live scorecard.</p>

        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 mb-8">
           <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] mb-4 block">Match ID</span>
           <div className="text-4xl font-black text-white tracking-[0.3em] italic mb-6">{matchId}</div>
           
           <button 
            onClick={copyId}
            className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-white/5 text-[#00E676] rounded-xl font-black text-[10px] uppercase tracking-widest active-scale border border-white/5"
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
             Copy ID
           </button>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-5 bg-[#00E676] text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] active-scale shadow-lg shadow-[#00E676]/10"
        >
          Got it, Let's Play
        </button>
      </div>
    </div>
  );
};

export default MatchIDPopup;
