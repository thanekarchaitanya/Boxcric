
import React, { useEffect, useState } from 'react';

interface VictoryScreenProps {
  winner: string;
  margin: string;
  onNextMatch: () => void;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ winner, margin, onNextMatch }) => {
  const [particles, setParticles] = useState<{ id: number, x: number, y: number, color: string }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => [
        ...prev.slice(-30),
        {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          color: ['#10b981', '#ffffff', '#fbbf24', '#ffffff'][Math.floor(Math.random() * 4)]
        }
      ]);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 text-center overflow-hidden">
      {/* Animated Firecrackers / Confetti */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(p => (
          <div 
            key={p.id}
            className="absolute w-1.5 h-1.5 rounded-full animate-ping"
            style={{ 
              left: `${p.x}%`, 
              top: `${p.y}%`, 
              backgroundColor: p.color,
              boxShadow: `0 0 15px ${p.color}`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 animate-in zoom-in-50 duration-700 flex flex-col items-center">
        {/* Premium SVG Trophy Icon */}
        <div className="mb-10 relative group">
          <div className="absolute inset-0 bg-emerald-500/20 blur-[60px] rounded-full group-hover:bg-emerald-500/40 transition-all"></div>
          <div className="relative transform transition-transform hover:scale-110 duration-500">
            <svg 
              viewBox="0 0 24 24" 
              className="w-40 h-40 drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="trophy-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <path 
                d="M6 9V2H18V9C18 12.3137 15.3137 15 12 15C8.68629 15 6 12.3137 6 9Z" 
                fill="url(#trophy-grad)" 
              />
              <path 
                d="M6 5H2V8C2 9.65685 3.34315 11 5 11H6V5Z" 
                fill="#065f46" 
              />
              <path 
                d="M18 5H22V8C22 9.65685 20.6569 11 19 11H18V5Z" 
                fill="#065f46" 
              />
              <path 
                d="M8 22H16M12 15V22" 
                stroke="url(#trophy-grad)" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
              />
              <path 
                d="M10 22L12 15L14 22" 
                fill="url(#trophy-grad)" 
                opacity="0.3"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black/40 font-black text-xl select-none">#1</div>
          </div>
        </div>

        <div className="inline-block px-4 py-1.5 bg-emerald-950/50 border border-emerald-500/30 rounded-full mb-6">
          <span className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em]">Tournament Champions</span>
        </div>
        
        <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-[0.85] mb-4 max-w-sm drop-shadow-2xl">
          {winner}
        </h2>
        
        <div className="text-xl font-bold text-gray-500 italic mb-14 uppercase tracking-wider">
          {margin}
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button 
            onClick={onNextMatch}
            className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-black rounded-3xl font-black text-lg tracking-widest transition-all active:scale-95 shadow-[0_20px_40px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3 group"
          >
            <span>START NEXT MATCH</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryScreen;
