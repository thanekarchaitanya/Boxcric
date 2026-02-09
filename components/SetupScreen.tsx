
import React, { useState } from 'react';
import { MatchPermission } from '../types';

interface SetupScreenProps {
  onBack: () => void;
  onCreate: (team1: string, team2: string, overs: number, permission: MatchPermission, skipToss?: boolean) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onBack, onCreate }) => {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [overs, setOvers] = useState(5);
  const [permission, setPermission] = useState<MatchPermission>('editable');

  const adjustOvers = (amt: number) => {
    setOvers(prev => Math.max(1, Math.min(50, prev + amt)));
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#000] p-5 animate-in slide-in-from-right duration-500 overflow-hidden">
      <header className="flex items-center mb-4 gap-4 shrink-0">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl active-scale border border-white/10">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <h2 className="text-lg font-black text-white italic uppercase tracking-tighter">Match <span className="text-[#00E676]">Setup</span></h2>
          <div className="h-0.5 w-5 bg-[#00E676] mt-0.5 rounded-full"></div>
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-3 overflow-hidden justify-between py-1">
        {/* Teams Card */}
        <div className="bg-[#0A0A0A] rounded-[1.2rem] p-4 border border-white/5 space-y-3 shadow-xl shrink-0">
          <div className="space-y-2">
            <div className="relative">
              <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-1 mb-1 block">Home Team</label>
              <input 
                value={team1} onChange={e => setTeam1(e.target.value)}
                className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-white font-bold text-sm outline-none focus:border-[#00E676]/40 transition-all placeholder:text-white/30"
                placeholder="Type your team name"
              />
            </div>
            
            <div className="flex items-center gap-2 py-0">
              <div className="h-px flex-1 bg-white/5"></div>
              <div className="bg-[#00E676]/5 px-2 py-0.5 rounded-full border border-[#00E676]/10">
                <span className="text-[7px] font-black text-[#00E676] italic tracking-widest uppercase">VS</span>
              </div>
              <div className="h-px flex-1 bg-white/5"></div>
            </div>

            <div className="relative">
              <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] ml-1 mb-1 block">Away Team</label>
              <input 
                value={team2} onChange={e => setTeam2(e.target.value)}
                className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-white font-bold text-sm outline-none focus:border-[#00E676]/40 transition-all placeholder:text-white/30"
                placeholder="Type your team name"
              />
            </div>
          </div>
        </div>

        {/* Configuration Card */}
        <div className="bg-[#0A0A0A] rounded-[1.2rem] p-4 border border-white/5 space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] block">Match Format</span>
              <span className="text-base font-black text-white italic uppercase">Total Overs</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => adjustOvers(-1)} className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-xl text-white font-black text-lg active-scale border border-white/10">-</button>
              <span className="text-2xl font-black text-[#00E676] italic min-w-[36px] text-center">{overs}</span>
              <button onClick={() => adjustOvers(1)} className="w-9 h-9 flex items-center justify-center bg-[#00E676]/10 rounded-xl text-[#00E676] font-black text-lg active-scale border border-[#00E676]/20">+</button>
            </div>
          </div>

          <div className="h-px bg-white/5"></div>

          <div className="space-y-2">
            <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] block">Scoring Permissions</span>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setPermission('editable')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest border transition-all active-scale ${permission === 'editable' ? 'bg-[#00E676]/10 text-[#00E676] border-[#00E676]/40' : 'bg-white/5 text-white/40 border-white/5'}`}
              >
                <svg className={`w-3.5 h-3.5 ${permission === 'editable' ? 'text-[#00E676]' : 'text-white/20'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editable
              </button>
              <button 
                onClick={() => setPermission('view-only')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest border transition-all active-scale ${permission === 'view-only' ? 'bg-[#00E676]/10 text-[#00E676] border-[#00E676]/40' : 'bg-white/5 text-white/40 border-white/5'}`}
              >
                <svg className={`w-3.5 h-3.5 ${permission === 'view-only' ? 'text-[#00E676]' : 'text-white/20'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Only
              </button>
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="shrink-0 flex flex-col gap-3 pt-2">
          <button 
            onClick={() => onCreate(team1 || 'Team 1', team2 || 'Team 2', overs, permission)}
            className="w-full py-6 bg-[#2A2A2A] text-slate-300 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-inner active-scale flex items-center justify-center border border-white/5"
          >
            Continue to Toss
          </button>
          
          <button 
            onClick={() => onCreate(team1 || 'Team 1', team2 || 'Team 2', overs, permission, true)}
            className="w-full py-6 bg-[#2A2A2A] text-slate-300 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-inner active-scale flex items-center justify-center border border-white/5"
          >
            Start Match Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;
