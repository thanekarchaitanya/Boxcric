import React, { useState } from 'react';

interface PlayerSetupScreenProps {
  onBack: () => void;
  team1: string;
  team2: string;
  onComplete: (name: string, team: string) => void;
}

const PlayerSetupScreen: React.FC<PlayerSetupScreenProps> = ({ onBack, team1, team2, onComplete }) => {
  const [name, setName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(team1);

  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto bg-[#000] p-8 animate-in slide-in-from-right duration-500">
      <header className="flex items-center mb-12 gap-6">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl active-scale border border-white/10">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Player <span className="text-[#00E676]">Profile</span></h2>
          <div className="h-1 w-10 bg-[#00E676] mt-1 rounded-full"></div>
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-10">
        <div className="space-y-4">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-2 block italic">Your Player Name</label>
          <input 
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-[#111] border border-white/10 rounded-3xl px-6 py-6 text-white font-black text-xl italic outline-none focus:border-[#00E676]/40 transition-all placeholder:text-white/5"
            placeholder="E.g. Virat"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-2 block italic">Select Your Team</label>
          <div className="grid grid-cols-1 gap-3">
            {[team1, team2].map(team => (
              <button
                key={team}
                onClick={() => setSelectedTeam(team)}
                className={`w-full py-6 px-6 rounded-3xl border transition-all text-left flex items-center justify-between active-scale ${selectedTeam === team ? 'bg-[#00E676]/10 border-[#00E676] text-white' : 'bg-[#111] border-white/5 text-white/30'}`}
              >
                <span className="font-black text-base uppercase italic tracking-tighter">{team}</span>
                {selectedTeam === team && (
                  <div className="w-6 h-6 bg-[#00E676] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => onComplete(name || 'Unknown Player', selectedTeam)}
          className={`mt-auto py-6 rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.4em] transition-all active-scale ${name.length > 0 ? 'bg-[#00E676] text-black shadow-2xl shadow-[#00E676]/30' : 'bg-white/5 text-white/10'}`}
          disabled={name.length === 0}
        >
          Enter Match
        </button>
      </div>
    </div>
  );
};

export default PlayerSetupScreen;