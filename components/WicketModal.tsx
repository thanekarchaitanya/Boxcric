import React from 'react';
import { BallHistory } from '../types';

interface WicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (ball: BallHistory) => void;
}

const WicketModal: React.FC<WicketModalProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const scenarios: { label: string; ball: BallHistory }[] = [
    { label: 'Wicket', ball: { type: 'legal', runs: 0, isWicket: true } },
    { label: 'Wicket + 1 Run', ball: { type: 'legal', runs: 1, isWicket: true } },
    { label: 'Wicket + 2 Run', ball: { type: 'legal', runs: 2, isWicket: true } },
    { label: 'Wicket + 3 Run', ball: { type: 'legal', runs: 3, isWicket: true } },
    { label: 'Wicket + 4 Run', ball: { type: 'legal', runs: 4, isWicket: true } },
    { label: 'Wicket + Wide', ball: { type: 'wide', runs: 1, isWicket: true } },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[var(--secondary-bg)] border-t border-[var(--border-color)] rounded-t-2xl p-6 pb-12 shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 px-2">
          <div>
            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Record <span className="text-[var(--warning-red)]">Wicket</span></h2>
            <div className="h-1 w-12 bg-[var(--warning-red)] mt-1 rounded-full"></div>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 flex items-center justify-center bg-[var(--card-bg)] rounded-xl text-slate-500 active-scale transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {scenarios.map((scenario, index) => (
            <button
              key={index}
              onClick={() => onSelect(scenario.ball)}
              className={`
                w-full px-6 py-5 rounded-xl text-left border transition-all active-scale flex items-center justify-between group
                ${index === 0 ? 'bg-[var(--warning-red)] border-[var(--warning-red)]/20 text-white shadow-lg' : 'bg-[var(--card-bg)] border-[var(--border-color)] text-slate-100'}
              `}
            >
              <span className="font-black text-sm uppercase tracking-widest italic">{scenario.label}</span>
              <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-[var(--warning-red)]'} opacity-40 transition-opacity`}></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WicketModal;