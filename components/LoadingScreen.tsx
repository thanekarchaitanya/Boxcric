
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-1000">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-block p-4 bg-white/5 rounded-[40px] mb-8 animate-in zoom-in-50 duration-700">
            <div className="box-3d cricket-ball-3d w-24 h-24 rounded-full border-b-[8px] border-r-[8px] border-red-900/50"></div>
          </div>
          
          <h1 className="logo-3d text-6xl font-black text-white tracking-tighter italic animate-in slide-in-from-bottom-8 duration-1000">
            box<span className="text-emerald-500">cric</span>
          </h1>
          
          <div className="mt-8 flex gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
          </div>
          
          <p className="mt-12 text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] animate-pulse">
            Premium Tracker Engine
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
