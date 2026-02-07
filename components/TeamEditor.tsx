
import React, { useState } from 'react';

interface TeamEditorProps {
  battingTeam: string;
  bowlingTeam: string;
  totalOvers: number;
  onSave: (batting: string, bowling: string, overs: number) => void;
}

const TeamEditor: React.FC<TeamEditorProps> = ({ battingTeam, bowlingTeam, totalOvers, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [batting, setBatting] = useState(battingTeam);
  const [bowling, setBowling] = useState(bowlingTeam);
  const [overs, setOvers] = useState(totalOvers);

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between bg-white/10 backdrop-blur-xl px-4 py-3 rounded-2xl mb-4 border border-white/20 shadow-2xl relative overflow-hidden group">
        {/* Animated highlight line */}
        <div className="absolute left-0 top-0 w-1 h-full bg-emerald-500"></div>
        
        <div className="flex-1 text-center pr-2">
          <span className="text-[10px] uppercase font-black text-emerald-400 block tracking-[0.3em] mb-0.5">MATCH CONFIG</span>
          <span className="text-base font-black text-white tracking-tighter italic flex items-center justify-center gap-2">
            {battingTeam || 'Team A'} <span className="text-emerald-500 font-normal scale-75">VS</span> {bowlingTeam || 'Team B'} 
            <span className="bg-white/10 px-2 py-0.5 rounded-md text-emerald-400 font-bold text-[10px] ml-1 uppercase">{totalOvers} Ov</span>
          </span>
        </div>
        <button 
          onClick={() => {
            setBatting(battingTeam);
            setBowling(bowlingTeam);
            setOvers(totalOvers);
            setIsEditing(true);
          }}
          className="bg-emerald-500 p-2.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-90 transition-all hover:bg-emerald-400"
          aria-label="Edit Match Info"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] p-6 mb-4 shadow-2xl border-b-[10px] border-emerald-500 animate-in slide-in-from-top-4 duration-500 relative z-30">
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter italic">Live Match Editor</h3>
          <div className="w-10 h-1 bg-emerald-500 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1 block">Batting Team</label>
            <input 
              type="text" 
              value={batting} 
              onChange={(e) => setBatting(e.target.value)}
              placeholder="Team A"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-black focus:outline-none focus:border-emerald-500 text-gray-900 shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1 block">Bowling Team</label>
            <input 
              type="text" 
              value={bowling} 
              onChange={(e) => setBowling(e.target.value)}
              placeholder="Team B"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-black focus:outline-none focus:border-emerald-500 text-gray-900 shadow-inner"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1 block">Target Overs</label>
          <input 
            type="number" 
            value={overs} 
            onChange={(e) => setOvers(parseInt(e.target.value) || 1)}
            min="1"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-black focus:outline-none focus:border-emerald-500 text-gray-900 shadow-inner"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button 
            onClick={() => {
              onSave(batting, bowling, overs);
              setIsEditing(false);
            }}
            className="flex-[2] py-4 bg-emerald-600 text-black rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
          >
            Update Live
          </button>
          <button 
            onClick={() => setIsEditing(false)}
            className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamEditor;
