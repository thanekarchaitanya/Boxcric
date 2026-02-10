import React from 'react';
import Coin from './Coin';

interface WelcomeScreenProps {
  onCreate: () => void;
  onJoin: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onCreate, onJoin }) => {
  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-[#050505] items-center justify-center p-8 relative overflow-hidden">
      
      {/* 1. LAYERED BACKGROUND ARCHITECTURE */}
      <div className="absolute inset-0 z-0">
        {/* A. Base Mesh Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#004D40_0%,#050505_70%)] opacity-60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,#002B1F_0%,transparent_50%)] opacity-40"></div>
        
        {/* B. Technical Pitch Grid (Perspective) */}
        <div 
          className="absolute inset-0 opacity-[0.07]" 
          style={{ 
            backgroundImage: `linear-gradient(#00E676 1px, transparent 1px), linear-gradient(90deg, #00E676 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at 50% 50%, black, transparent)',
            transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) scale(2)'
          }}
        ></div>

        {/* C. Stadium Corner Blooms */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#00E676]/10 blur-[100px] rounded-full"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#00E676]/10 blur-[100px] rounded-full"></div>

        {/* D. Brand Coin Watermark - Reusing centralized Coin design */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.12]">
          <Coin 
            size="w-[550px] h-[550px]" 
            className="animate-[spin_60s_linear_infinite]" 
            rotationX={0}
          />
        </div>

        {/* E. Scanning Line Effect */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00E676]/40 to-transparent animate-[scan_8s_linear_infinite]"></div>
      </div>

      {/* 2. FOREGROUND CONTENT */}
      <div className="w-full flex flex-col items-center z-10 animate-in fade-in zoom-in-95 duration-1000">
        <div className="relative group mb-8 flex justify-center w-full">
           {/* Logo Glow Backlight */}
           <div className="absolute inset-0 bg-[#00E676]/20 blur-3xl rounded-full scale-110 animate-pulse"></div>
           
           <svg viewBox="0 0 240 60" className="h-20 w-auto drop-shadow-[0_0_25px_rgba(0,230,118,0.5)]">
             <defs>
               <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#FFFFFF" />
                 <stop offset="100%" stopColor="#00E676" />
               </linearGradient>
             </defs>
             <text 
              x="50%" 
              y="45" 
              textAnchor="middle" 
              fontFamily="'JetBrains Mono', monospace" 
              fontWeight="900" 
              fontSize="44" 
              fill="url(#logoGrad)" 
              fontStyle="italic" 
              letterSpacing="-3"
            >
              BoxCricLive
            </text>
           </svg>
        </div>

        <div className="flex flex-col items-center mb-24">
          <p className="text-white font-black text-[11px] tracking-[0.7em] uppercase italic bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            The <span className="text-[#00E676]">Pro</span> Standard
          </p>
          <div className="w-1 h-8 bg-gradient-to-b from-[#00E676] to-transparent mt-4 rounded-full opacity-40"></div>
        </div>

        <div className="flex flex-col w-full gap-5 max-w-[280px]">
          <button 
            onClick={onCreate}
            className="group relative w-full py-6 bg-[#00E676] text-black rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(0,230,118,0.3)] active-scale transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
            <span className="relative z-10">Start New Match</span>
          </button>
          
          <button 
            onClick={onJoin}
            className="w-full py-6 bg-white/5 text-slate-300 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] active-scale transition-all border border-white/10 backdrop-blur-md hover:bg-white/10"
          >
            Join Match ID
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;