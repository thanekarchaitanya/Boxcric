
import React, { useState } from 'react';
import { BallEvent } from '../types';

interface ControlsProps {
  onAction: (event: BallEvent) => void;
  onUndo: () => void;
  onReset: () => void;
  onNextOver: () => void;
  onShowSummary: () => void;
  legalBallsInOver: number;
}

const Controls: React.FC<ControlsProps> = ({ onAction, onUndo, onReset, onNextOver, onShowSummary, legalBallsInOver }) => {
  const isOverComplete = legalBallsInOver >= 6;
  const [showWicketMenu, setShowWicketMenu] = useState(false);

  // Normal state buttons now share the same "same color" base
  // Active/Touch states are handled via Tailwind's `active:` prefix
  const mainActions: { label: string; value: BallEvent; activeColor: string }[] = [
    { label: 'Dot', value: '0', activeColor: 'active:bg-gray-400 active:text-white' },
    { label: '1 Run', value: '1', activeColor: 'active:bg-emerald-500 active:text-white' },
    { label: '2 Runs', value: '2', activeColor: 'active:bg-emerald-500 active:text-white' },
    { label: '3 Runs', value: '3', activeColor: 'active:bg-emerald-500 active:text-white' },
    { label: '4 Run', value: '4', activeColor: 'active:bg-emerald-600 active:text-white shadow-emerald-200' },
    { label: '6 Runs', value: '6', activeColor: 'active:bg-emerald-900 active:text-white shadow-emerald-400' },
    { label: 'Wide', value: 'wd', activeColor: 'active:bg-amber-400 active:text-white' },
    { label: 'No Ball', value: 'nb', activeColor: 'active:bg-amber-400 active:text-white' },
  ];

  const wicketOptions: { label: string; value: BallEvent; color: string }[] = [
    { label: 'Wicket', value: 'W', color: 'bg-red-600 text-white' },
    { label: '1 + W', value: '1W', color: 'bg-red-500 text-white' },
    { label: '2 + W', value: '2W', color: 'bg-red-500 text-white' },
    { label: '3 + W', value: '3W', color: 'bg-red-500 text-white' },
    { label: '4 + W', value: '4W', color: 'bg-red-500 text-white' },
    { label: '6 + W', value: '6W', color: 'bg-red-500 text-white' },
  ];

  const normalBtnClass = "bg-gray-100 text-gray-700 border border-gray-200";

  return (
    <div className="bg-white rounded-t-[32px] shadow-[0_-15px_30px_-10px_rgba(0,0,0,0.2)] p-6 pt-6 border-t border-gray-100 relative">
      
      {/* Wicket Selection Overlay */}
      {showWicketMenu && (
        <div className="absolute inset-x-0 bottom-full mb-2 px-6 z-20 animate-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white rounded-3xl p-4 shadow-2xl border border-red-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Select Wicket Type</span>
              <button onClick={() => setShowWicketMenu(false)} className="text-gray-300 hover:text-gray-500 p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {wicketOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onAction(opt.value);
                    setShowWicketMenu(false);
                  }}
                  className={`py-3 rounded-xl font-black text-xs transition-all active:scale-90 ${opt.color}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Over Complete Notification */}
      {isOverComplete && (
        <div className="mb-4 animate-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={onNextOver}
            className="w-full py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-3 animate-pulse active:scale-95 transition-transform"
          >
            <span>NEXT OVER</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      )}

      {/* Control Buttons Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {mainActions.map((action) => (
          <button
            key={action.value}
            onClick={() => onAction(action.value)}
            disabled={isOverComplete}
            className={`py-3.5 rounded-xl font-black text-xs transition-all active:scale-95 shadow-sm ${normalBtnClass} ${action.activeColor} ${isOverComplete ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
          >
            {action.label}
          </button>
        ))}
        {/* Wicket Button triggers menu */}
        <button
          onClick={() => setShowWicketMenu(!showWicketMenu)}
          className={`py-3.5 rounded-xl font-black text-xs transition-all active:scale-95 shadow-sm ${normalBtnClass} active:bg-red-600 active:text-white active:border-red-600`}
        >
          WICKET
        </button>
      </div>

      <div className="flex gap-3 items-stretch">
        <button
          onClick={onUndo}
          className="w-[30%] py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 active:bg-gray-200 transition-all flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          UNDO
        </button>
        <button
          onClick={onShowSummary}
          className="w-[70%] py-4 bg-black text-emerald-500 rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 active:bg-emerald-900 transition-all shadow-xl shadow-black/20"
        >
          MATCH SUMMARY
        </button>
      </div>
    </div>
  );
};

export default Controls;
