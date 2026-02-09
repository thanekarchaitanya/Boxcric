import React from 'react';

interface RoleSelectScreenProps {
  onSelectRole: (role: 'viewer' | 'player') => void;
  onBack: () => void;
}

const RoleSelectScreen: React.FC<RoleSelectScreenProps> = ({ onSelectRole, onBack }) => {
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#000] p-8 animate-in slide-in-from-left duration-500 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E676]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00E676]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="flex items-center mb-16 gap-6 z-10">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl active-scale border border-white/10 hover:bg-white/10 transition-all">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Choose Your <span className="text-[#00E676]">Role</span></h2>
          <div className="h-1 w-10 bg-[#00E676] mt-1 rounded-full"></div>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-center items-center z-10 gap-8">
        <p className="text-white/40 text-sm font-medium text-center max-w-xs mb-4">
          Select how you want to participate in this match
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-4">
          {/* Viewer Option */}
          <button
            onClick={() => onSelectRole('viewer')}
            className="p-8 bg-gradient-to-br from-[#00E676]/10 to-[#00E676]/5 border border-[#00E676]/30 rounded-3xl transition-all active:scale-95 hover:border-[#00E676]/60 hover:from-[#00E676]/20 hover:to-[#00E676]/10 group"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-[#00E676]/20 rounded-2xl flex items-center justify-center group-hover:bg-[#00E676]/30 transition-colors">
                <svg className="w-8 h-8 text-[#00E676]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-white font-black text-lg uppercase tracking-tight">Viewer</h3>
                <p className="text-white/40 text-xs font-medium mt-2">Watch the live scorecard</p>
              </div>
            </div>
          </button>

          {/* Player Option */}
          <button
            onClick={() => onSelectRole('player')}
            className="p-8 bg-gradient-to-br from-[#FFD700]/10 to-[#FFD700]/5 border border-[#FFD700]/30 rounded-3xl transition-all active:scale-95 hover:border-[#FFD700]/60 hover:from-[#FFD700]/20 hover:to-[#FFD700]/10 group"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-[#FFD700]/20 rounded-2xl flex items-center justify-center group-hover:bg-[#FFD700]/30 transition-colors">
                <svg className="w-8 h-8 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-white font-black text-lg uppercase tracking-tight">Player</h3>
                <p className="text-white/40 text-xs font-medium mt-2">Participate in the match</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectScreen;
