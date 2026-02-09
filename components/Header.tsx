
import React from 'react';

interface HeaderProps {
  timerSeconds: number;
}

const Header: React.FC<HeaderProps> = ({ timerSeconds }) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="flex justify-between items-center px-5 py-2.5 bg-[#121212] border-b border-white/5 shrink-0">
      <div className="flex flex-col">
        <h1 className="text-xl font-black tracking-tighter text-white italic uppercase leading-none">
          BoxCric<span className="text-[#00E676]">Live</span>
        </h1>
        <div className="h-[2px] w-6 bg-[#00E676] mt-1 rounded-full green-glow"></div>
      </div>
      
      <div className="flex flex-col items-end gap-0.5">
        <div className="bg-[#1A1A1A] px-3 py-1 rounded-lg flex items-center justify-center border border-white/5 shadow-inner">
          <span className="digital-timer font-bold text-[#00E676] text-lg tracking-wider min-w-[50px] text-center">
            {formatTime(timerSeconds)}
          </span>
        </div>
        <span className="text-[8px] font-black text-[#00E676]/60 uppercase tracking-[0.2em] mr-0.5">Match Timing</span>
      </div>
    </header>
  );
};

export default Header;
