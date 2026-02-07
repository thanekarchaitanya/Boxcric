
import React from 'react';
import { BallEvent } from '../types';

interface OverHistoryProps {
  events: BallEvent[];
}

const OverHistory: React.FC<OverHistoryProps> = ({ events }) => {
  const getBallColor = (event: BallEvent) => {
    if (event.includes('W')) return 'bg-red-600 text-white';
    switch (event) {
      case '4': return 'bg-emerald-600 text-white';
      case '6': return 'bg-emerald-900 text-white';
      case 'wd':
      case 'nb': return 'bg-amber-400 text-gray-900 ring-2 ring-amber-100';
      case '0': return 'bg-gray-100 text-gray-400 border border-gray-200';
      default: return 'bg-emerald-500 text-white';
    }
  };

  const getBallLabel = (event: BallEvent) => {
    if (event.includes('W')) {
      const runs = event.replace('W', '');
      return runs === '' || runs === '0' ? 'W' : `${runs}+W`;
    }
    return event;
  };

  return (
    <div className="mb-0">
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="h-px bg-gray-200 flex-1"></div>
        <h3 className="text-center text-[8px] font-black text-gray-400 uppercase tracking-[0.3em]">
          Current Over Track
        </h3>
        <div className="h-px bg-gray-200 flex-1"></div>
      </div>
      
      <div className="flex justify-center items-center gap-1.5 flex-wrap min-h-[36px]">
        {events.length === 0 ? (
          <p className="text-gray-300 italic text-[10px] font-semibold tracking-wide py-1">Waiting for delivery...</p>
        ) : (
          events.map((event, idx) => (
            <div
              key={idx}
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-[10px] shadow-md transition-all transform hover:scale-110 active:scale-90 cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-300 ${getBallColor(event)}`}
            >
              {getBallLabel(event)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OverHistory;
