
import React from 'react';

interface WelcomeScreenProps {
  onCreate: () => void;
  onJoin: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onCreate, onJoin }) => {
  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-[#000] items-center justify-center p-8 relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(0,230,118,0.1)_0%,transparent_60%)] animate-[pulse_5s_infinite] pointer-events-none"></div>
        <div className="absolute -top-[20%] -left-[20%] w-[80%] h-[80%] bg-[#00E676]/10 rounded-full blur-[120px] pointer-events-none animate-[pulse_8s_infinite]"></div>
        <div className="absolute -bottom-[20%] -right-[20%] w-[80%] h-[80%] bg-[#00E676]/5 rounded-full blur-[120px] pointer-events-none animate-[pulse_10s_infinite]"></div>
      </div>

      <div className="w-full flex flex-col items-center z-10 animate-in fade-in zoom-in-95 duration-1000">
        <div className="relative group mb-6 flex justify-center w-full">
           <div className="absolute inset-0 bg-[#00E676]/15 blur-3xl rounded-full scale-125 animate-pulse"></div>
           <svg viewBox="0 0 240 60" className="h-20 w-auto drop-shadow-[0_0_20px_rgba(0,230,118,0.4)]">
             <defs>
               <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#fff" />
                 <stop offset="100%" stopColor="#00E676" />
               </linearGradient>
             </defs>
             <text 
              x="50%" 
              y="45" 
              textAnchor="middle" 
              fontFamily="'JetBrains Mono', monospace" 
              fontWeight="900" 
              fontSize="42" 
              fill="url(#logoGrad)" 
              fontStyle="italic" 
              letterSpacing="-2"
            >
              PLAYSCORE
            </text>
           </svg>
        </div>

        <p className="text-white/60 text-center text-[10px] font-black tracking-[0.6em] uppercase mb-24 italic">
          Scoreboard <span className="text-[#00E676] font-bold">Redefined</span>
        </p>

        <div className="flex flex-col w-full gap-5 max-w-[280px]">
          <button 
            onClick={onCreate}
            className="w-full py-6 bg-[#00E676] text-black rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(0,230,118,0.2)] active-scale transition-all"
          >
            Start New Match
          </button>
          
          <button 
            onClick={onJoin}
            className="w-full py-6 bg-[#2A2A2A] text-slate-300 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] active-scale transition-all border border-white/5 shadow-inner"
          >
            Join Match ID
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
