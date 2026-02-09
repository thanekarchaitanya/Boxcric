
import React, { useState } from 'react';

interface JoinScreenProps {
  onBack: () => void;
  onJoin: (id: string) => boolean;
}

const JoinScreen: React.FC<JoinScreenProps> = ({ onBack, onJoin }) => {
  const [matchId, setMatchId] = useState('');
  const [error, setError] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = () => {
    setIsJoining(true);
    setTimeout(() => {
      const success = onJoin(matchId.toUpperCase());
      if (!success) {
        setError(true);
        setIsJoining(false);
        setTimeout(() => setError(false), 2000);
      }
    }, 800);
  };

  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto bg-[#000] p-8 animate-in slide-in-from-left duration-500 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E676]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="flex items-center mb-16 gap-6 z-10">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl active-scale border border-white/10">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Enter <span className="text-[#00E676]">Access Code</span></h2>
          <div className="h-1 w-10 bg-[#00E676] mt-1 rounded-full"></div>
        </div>
      </header>

      <div className="flex-1 flex flex-col z-10">
        <div className="mb-12">
          <p className="text-white/40 text-sm font-medium leading-relaxed">
            Enter the unique 6-digit match identifier shared by the creator to view the live scorecard.
          </p>
        </div>

        <div className="space-y-10">
          <div className="relative">
            <input 
              value={matchId}
              onChange={e => setMatchId(e.target.value.toUpperCase())}
              maxLength={6}
              disabled={isJoining}
              className={`w-full bg-[#111] border rounded-3xl px-8 py-8 text-center text-2xl font-black tracking-[0.4em] text-white outline-none transition-all uppercase placeholder:text-white/5 placeholder:text-base placeholder:tracking-normal ${error ? 'border-[#FF3B30] bg-[#FF3B30]/5' : 'border-white/10 focus:border-[#00E676]/40 focus:bg-[#050505]'}`}
              placeholder="Enter access code"
              autoFocus
            />
            {error && <span className="absolute -bottom-8 left-0 w-full text-center text-[10px] font-black text-[#FF3B30] uppercase tracking-widest animate-in fade-in slide-in-from-top-2">Invalid Session Identifier</span>}
          </div>
          
          <button 
            onClick={handleJoin}
            disabled={matchId.length < 4 || isJoining}
            className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active-scale relative overflow-hidden ${matchId.length >= 4 ? 'bg-[#00E676] text-black shadow-[0_15px_30px_rgba(0,230,118,0.2)]' : 'bg-white/5 text-white/20'}`}
          >
            {isJoining ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                Connecting...
              </div>
            ) : 'Sync Scorecard'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinScreen;
