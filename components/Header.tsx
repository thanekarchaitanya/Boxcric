import React from 'react';

interface HeaderProps {
  timerSeconds: number;
  syncStatus?: 'synced' | 'syncing' | 'offline';
}

const Header: React.FC<HeaderProps> = ({ timerSeconds, syncStatus = 'synced' }) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getSyncColor = () => {
    switch (syncStatus) {
      case 'syncing': return 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]';
      case 'offline': return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
      default: return 'bg-[var(--accent-green)] shadow-[0_0_10px_rgba(0,230,118,0.5)]';
    }
  };

  return (
    <header className="flex justify-between items-center px-5 py-4 bg-[var(--primary-bg)] border-b border-[var(--border-color)] shrink-0 z-20">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black tracking-tighter text-[var(--text-primary)] italic uppercase leading-none">
            Play<span className="text-[var(--accent-green)]">Score</span>
          </h1>
          <div className={`w-1.5 h-1.5 rounded-full mt-0.5 animate-pulse ${getSyncColor()}`}></div>
        </div>
        <div className="h-[2px] w-6 bg-[var(--accent-green)] mt-1.5 rounded-full green-glow"></div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Match Timer Display - Top Right */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--glass-effect)] rounded-lg border border-[var(--border-color)] shadow-inner">
            <div className="w-1.5 h-1.5 bg-[var(--accent-green)] rounded-full animate-pulse"></div>
            <span className="digital-timer font-bold text-[var(--accent-green)] text-base tracking-wider leading-none tabular-nums">
              {formatTime(timerSeconds)}
            </span>
          </div>
          <span className="text-[6px] font-black text-white/30 uppercase tracking-[0.3em] mt-1 leading-none pr-0.5">
            {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'offline' ? 'Offline' : 'Match Timer'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;