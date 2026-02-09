import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTeam1: string;
  initialTeam2: string;
  initialOvers: number;
  onSave: (team1: string, team2: string, overs: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, initialTeam1, initialTeam2, initialOvers, onSave }) => {
  const [team1, setTeam1] = useState(initialTeam1);
  const [team2, setTeam2] = useState(initialTeam2);
  const [overs, setOvers] = useState(initialOvers || 5);

  useEffect(() => {
    if (isOpen) {
      setTeam1(initialTeam1);
      setTeam2(initialTeam2);
      setOvers(initialOvers);
    }
  }, [isOpen, initialTeam1, initialTeam2, initialOvers]);

  if (!isOpen) return null;

  const adjustOvers = (amount: number) => {
    setOvers(prev => {
      const newVal = prev + amount;
      return newVal < 1 ? 1 : (newVal > 100 ? 100 : newVal);
    });
  };

  const handleSave = () => {
    onSave(team1, team2, overs);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-5 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-[320px] bg-[#141414] border border-white/10 rounded-[2rem] overflow-hidden shadow-3xl animate-in zoom-in-95 duration-200">
        <div className="p-7 text-left">
          <h2 className="text-lg font-black text-white italic mb-8 uppercase tracking-tighter leading-none text-left">Match <span className="text-[#00E676]">Settings</span></h2>
          
          <div className="space-y-5">
            <div className="space-y-2 text-left">
              <label className="text-[8px] text-white/30 font-black ml-1 uppercase tracking-[0.3em] block">Home Team</label>
              <input 
                type="text" 
                value={team1} 
                onChange={e => setTeam1(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white font-bold outline-none shadow-inner text-left focus:border-[#00E676]/30 transition-colors"
                placeholder="Team Alpha"
              />
            </div>

            {/* Stylized VS Separator */}
            <div className="flex items-center gap-4 py-1">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
              <div className="relative group">
                <div className="absolute inset-0 bg-[#00E676]/20 rounded-full blur-[8px] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#00E676]/30 flex items-center justify-center shadow-lg">
                  <span className="text-[9px] font-black text-[#00E676] italic tracking-tighter uppercase leading-none">VS</span>
                </div>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[8px] text-white/30 font-black ml-1 uppercase tracking-[0.3em] block">Away Team</label>
              <input 
                type="text" 
                value={team2} 
                onChange={e => setTeam2(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white font-bold outline-none shadow-inner text-left focus:border-[#00E676]/30 transition-colors"
                placeholder="Team Bravo"
              />
            </div>

            <div className="space-y-3 text-left pt-2">
              <label className="text-[8px] text-white/30 font-black ml-1 uppercase tracking-[0.3em] block">Match Format (Overs)</label>
              <div className="flex items-center justify-between bg-[#1A1A1A] border border-white/5 rounded-xl p-2 shadow-inner">
                <button 
                  onClick={() => adjustOvers(-1)}
                  className="w-12 h-12 flex items-center justify-center bg-[#202020] rounded-lg text-white font-black text-xl active-scale border border-white/5"
                >
                  -
                </button>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-black text-white italic leading-none tabular-nums">{overs}</span>
                </div>
                <button 
                  onClick={() => adjustOvers(1)}
                  className="w-12 h-12 flex items-center justify-center bg-[#00E676]/10 rounded-lg text-[#00E676] font-black text-xl active-scale border border-[#00E676]/10"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-4 bg-[#1A1A1A] text-white/30 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] transition-all active-scale border border-white/5"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex-[1.6] py-4 bg-[#00E676] text-black rounded-xl font-black text-[9px] uppercase tracking-[0.3em] shadow-xl shadow-[#00E676]/10 transition-all active-scale"
            >
              Update Match
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;