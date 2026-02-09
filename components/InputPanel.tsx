import React from 'react';

interface InputPanelProps {
  onRun: (runs: number) => void;
  onExtra: (type: 'wide' | 'noball') => void;
  onWicket: () => void;
  onUndo: () => void;
  onSummary: () => void;
  canUndo: boolean;
  isViewOnly?: boolean;
}

const ScoreButton: React.FC<{ 
  label: string; 
  onClick: () => void; 
  disabled?: boolean;
}> = ({ label, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        h-14 
        text-lg 
        font-black 
        uppercase 
        italic 
        tracking-tighter
        transition-all 
        flex items-center justify-center 
        rounded-2xl
        border
        shadow-inner
        ${disabled 
          ? 'bg-[#1A1A1A] text-slate-800 border-white/5 cursor-not-allowed opacity-40' 
          : 'bg-[#2A2A2A] text-slate-300 border-white/5 active-scale active:bg-[#00E676] active:text-black active:border-transparent'}
      `}
    >
      {label}
    </button>
  );
};

const InputPanel: React.FC<InputPanelProps> = ({ onRun, onExtra, onWicket, onUndo, onSummary, canUndo, isViewOnly }) => {
  return (
    <div className="flex flex-col gap-6">
      {isViewOnly && (
        <div className="bg-[#00E676]/5 border border-[#00E676]/20 rounded-xl p-3 flex items-center justify-center gap-2 mb-2">
           <svg className="w-4 h-4 text-[#00E676]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
           <span className="text-[10px] font-black text-[#00E676] uppercase tracking-widest">View Only Mode</span>
        </div>
      )}

      {/* Scoring Grid */}
      <div className="grid grid-cols-3 gap-3">
        <ScoreButton label="0" onClick={() => onRun(0)} disabled={isViewOnly} />
        <ScoreButton label="1" onClick={() => onRun(1)} disabled={isViewOnly} />
        <ScoreButton label="2" onClick={() => onRun(2)} disabled={isViewOnly} />
        
        <ScoreButton label="3" onClick={() => onRun(3)} disabled={isViewOnly} />
        <ScoreButton label="4" onClick={() => onRun(4)} disabled={isViewOnly} />
        <ScoreButton label="6" onClick={() => onRun(6)} disabled={isViewOnly} />
        
        <ScoreButton label="WD" onClick={() => onExtra('wide')} disabled={isViewOnly} />
        <ScoreButton label="NB" onClick={() => onExtra('noball')} disabled={isViewOnly} />
        <ScoreButton label="WICKET" onClick={onWicket} disabled={isViewOnly} />
      </div>

      {/* Utility Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <button 
          onClick={onUndo}
          disabled={!canUndo || isViewOnly}
          className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all active-scale ${canUndo && !isViewOnly ? 'text-slate-400 border-slate-700' : 'text-slate-800 border-slate-800 cursor-not-allowed'}`}
        >
          <svg className={`h-3.5 w-3.5 ${canUndo && !isViewOnly ? 'text-[#00E676]' : 'text-slate-800'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Undo
        </button>

        <button 
          onClick={onSummary}
          className="flex items-center gap-2 px-6 py-3.5 bg-[#00E676] text-black rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#00E676]/20 transition-all active-scale"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          Summary
        </button>
      </div>
    </div>
  );
};

export default InputPanel;