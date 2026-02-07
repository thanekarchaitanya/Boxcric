
import React, { useState } from 'react';

interface SetupScreenProps {
  onStart: (teamA: string, teamB: string, overs: number, code: string, skipToss: boolean) => void;
  onJoin: (code: string) => void;
  deviceId: string;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, onJoin, deviceId }) => {
  const [teamA, setTeamA] = useState('Team A');
  const [teamB, setTeamB] = useState('Team B');
  const [overs, setOvers] = useState(20);
  const [joinCode, setJoinCode] = useState('');
  const [mode, setMode] = useState<'create' | 'join'>('create');

  return (
    <div className="flex-1 flex flex-col min-h-0 relative z-10 animate-in fade-in duration-700 bg-black overflow-hidden">
      {/* Immersive Compact Header */}
      <div className="shrink-0 pt-8 pb-4 text-center px-6 bg-gradient-to-b from-emerald-900/20 to-black">
        <div className="inline-block p-3 bg-white/5 rounded-full mb-3 animate-in zoom-in-75 duration-500 shadow-xl">
          <div className="box-3d cricket-ball-3d w-10 h-10 rounded-full border-b-[3px] border-r-[3px] border-red-900/50"></div>
        </div>
        <h2 className="logo-3d text-3xl font-black text-white tracking-tighter italic leading-none mb-3">
          box<span className="text-emerald-500">cric</span>
        </h2>
        <div className="flex flex-col items-center">
           <p className="text-[8px] font-black text-emerald-500/60 uppercase tracking-[0.4em] mb-1">Device ID</p>
           <p className="text-[10px] font-black text-white tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full border border-white/10">
             {deviceId}
           </p>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 bg-white rounded-t-[40px] shadow-[0_-15px_40px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden">
        <div className="flex-1 px-6 py-6 flex flex-col">
          <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
            {/* Uniform Tabs with Highlight */}
            <div className="flex p-1 bg-gray-100 rounded-2xl mb-6 border border-gray-200">
              <button 
                onClick={() => setMode('create')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${mode === 'create' ? 'bg-white text-emerald-600 shadow-lg ring-1 ring-emerald-500/10' : 'text-gray-400'}`}
              >
                Create Match
              </button>
              <button 
                onClick={() => setMode('join')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${mode === 'join' ? 'bg-white text-emerald-600 shadow-lg ring-1 ring-emerald-500/10' : 'text-gray-400'}`}
              >
                Sync Device
              </button>
            </div>

            {mode === 'create' ? (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-500 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-900 uppercase tracking-widest ml-1 block">Batting Team</label>
                    <input 
                      type="text" 
                      value={teamA} 
                      onChange={(e) => setTeamA(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-black focus:border-emerald-500 focus:bg-white outline-none text-gray-900 shadow-sm transition-all"
                      placeholder="Name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-900 uppercase tracking-widest ml-1 block">Bowling Team</label>
                    <input 
                      type="text" 
                      value={teamB} 
                      onChange={(e) => setTeamB(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-black focus:border-emerald-500 focus:bg-white outline-none text-gray-900 shadow-sm transition-all"
                      placeholder="Name"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-900 uppercase tracking-widest ml-1 block">Match Overs</label>
                  <input 
                    type="number" 
                    value={overs} 
                    onChange={(e) => setOvers(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-2xl font-black focus:border-emerald-500 focus:bg-white outline-none text-emerald-600 shadow-sm transition-all"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-end pb-2">
                   <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <p className="text-[9px] font-bold text-emerald-800 uppercase tracking-widest leading-relaxed">
                        Teams are set. Choose your entry mode below.
                      </p>
                   </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-left-4 duration-500 flex-1 flex flex-col justify-center">
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                    Real-time Score Sync
                  </p>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-gray-900 uppercase tracking-widest block">Network Sync Code</label>
                    <input 
                      type="text" 
                      placeholder="CODE-XY"
                      value={joinCode} 
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-5 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl text-3xl text-center font-black tracking-[0.4em] focus:border-emerald-500 focus:bg-white outline-none text-emerald-600 shadow-inner transition-all"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Uniform High-Impact Action Bar */}
        <div className="shrink-0 p-6 bg-white border-t border-gray-100">
          <div className="max-w-md mx-auto w-full space-y-4">
            {mode === 'create' ? (
              <>
                <button 
                  onClick={() => onStart(teamA, teamB, overs, deviceId, false)}
                  className="w-full py-4 bg-black text-emerald-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl flex items-center justify-center border border-emerald-500/10"
                >
                  PROCEED WITH TOSS
                </button>
                <button 
                  onClick={() => onStart(teamA, teamB, overs, deviceId, true)}
                  className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[24px] font-black text-base uppercase tracking-[0.1em] transition-all active:scale-95 shadow-[0_15px_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span>START QUICK MATCH</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </>
            ) : (
              <button 
                onClick={() => onJoin(joinCode)}
                disabled={!joinCode}
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:grayscale text-white rounded-[24px] font-black text-base uppercase tracking-widest transition-all active:scale-95 shadow-[0_15px_30px_rgba(16,185,129,0.3)]"
              >
                CONNECT & SYNC
              </button>
            )}
            <div className="pt-2 text-center">
              <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.6em]">BoxCric Premium Engine</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;
