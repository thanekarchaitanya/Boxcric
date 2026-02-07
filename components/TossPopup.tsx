
import React, { useState } from 'react';

interface TossPopupProps {
  teamA: string;
  teamB: string;
  onComplete: (battingTeam: string, bowlingTeam: string) => void;
  onCancel: () => void;
}

const TossPopup: React.FC<TossPopupProps> = ({ teamA, teamB, onComplete, onCancel }) => {
  const [step, setStep] = useState<'caller' | 'call' | 'flip' | 'decision'>('caller');
  const [caller, setCaller] = useState<string | null>(null);
  const [callChoice, setCallChoice] = useState<'heads' | 'tails' | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [coinRotation, setCoinRotation] = useState(0);

  const startFlip = (choice: 'heads' | 'tails') => {
    setCallChoice(choice);
    setStep('flip');
    setIsAnimating(true);
    
    // Truly anonymous and fair logic: 
    // We generate a cryptographic-quality random bit for the result
    const resultIsHeads = window.crypto.getRandomValues(new Uint8Array(1))[0] % 2 === 0;
    
    // Calculate rotation to land on the correct side
    // One rotation is 180 degrees. Even multiples are Heads, Odd are Tails.
    const baseRotations = 10 + Math.floor(Math.random() * 10); // 10-20 full flips
    const finalRotation = (baseRotations * 180) + (resultIsHeads ? 0 : 180);
    
    setCoinRotation(finalRotation);

    setTimeout(() => {
      setIsAnimating(false);
      const tossWinner = resultIsHeads === (choice === 'heads') ? caller : (caller === teamA ? teamB : teamA);
      setWinner(tossWinner!);
      setStep('decision');
    }, 2000);
  };

  const handleDecision = (decision: 'bat' | 'bowl') => {
    if (!winner) return;
    const batting = decision === 'bat' ? winner : (winner === teamA ? teamB : teamA);
    const bowling = batting === teamA ? teamB : teamA;
    onComplete(batting, bowling);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 relative z-[60] animate-in fade-in duration-500 bg-black overflow-hidden">
      {/* Immersive Header */}
      <div className="shrink-0 pt-12 pb-6 text-center px-6 bg-gradient-to-b from-emerald-900/20 to-black">
        <div className="inline-block p-3 bg-white/5 rounded-full mb-3 shadow-xl">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
        </div>
        <h2 className="logo-3d text-3xl font-black text-white tracking-tighter italic leading-none">
          toss<span className="text-emerald-500">master</span>
        </h2>
      </div>

      {/* Main Screen Area */}
      <div className="flex-1 bg-white rounded-t-[40px] shadow-[0_-15px_40px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden">
        {/* Close/Back Button */}
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 transition-colors z-20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <div className="flex-1 px-8 py-8 flex flex-col justify-center items-center">
          <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center items-center">
            
            {step === 'caller' && (
              <div className="w-full space-y-8 animate-in slide-in-from-bottom-6 duration-500">
                <div className="text-center">
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">WHO'S CALLING?</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Select the team to call the flip</p>
                </div>
                <div className="grid gap-4">
                  {[teamA, teamB].map((team) => (
                    <button 
                      key={team}
                      onClick={() => { setCaller(team); setStep('call'); }}
                      className="w-full py-6 bg-gray-50 active:bg-emerald-600 active:text-white text-gray-900 rounded-[24px] font-black text-lg transition-all border border-gray-100 shadow-sm active:scale-95"
                    >
                      {team}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'call' && (
              <div className="w-full space-y-10 animate-in zoom-in-95 duration-300">
                <div className="text-center">
                  <div className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                    {caller} Calling
                  </div>
                  <h3 className="text-4xl font-black text-gray-900 tracking-tight mb-2 italic">HEADS OR TAILS?</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <button 
                    onClick={() => startFlip('heads')}
                    className="h-40 bg-gray-50 active:bg-emerald-600 text-gray-900 active:text-white rounded-[32px] font-black transition-all active:scale-95 shadow-lg border border-gray-100 flex flex-col items-center justify-center gap-2 group"
                  >
                    <span className="text-5xl">H</span>
                    <span className="text-xs uppercase tracking-widest">Heads</span>
                  </button>
                  <button 
                    onClick={() => startFlip('tails')}
                    className="h-40 bg-gray-50 active:bg-black text-gray-900 active:text-white rounded-[32px] font-black transition-all active:scale-95 shadow-lg border border-gray-100 flex flex-col items-center justify-center gap-2 group"
                  >
                    <span className="text-5xl">T</span>
                    <span className="text-xs uppercase tracking-widest">Tails</span>
                  </button>
                </div>
              </div>
            )}

            {step === 'flip' && (
              <div className="flex flex-col items-center animate-in fade-in duration-300">
                <div 
                  className="w-48 h-48 relative preserve-3d transition-transform duration-[2000ms] ease-out"
                  style={{ 
                    transform: `rotateY(${coinRotation}deg)`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Heads Side */}
                  <div className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-br from-amber-300 to-amber-500 border-8 border-amber-600 shadow-2xl backface-hidden flex items-center justify-center">
                     <div className="text-amber-900 font-black text-6xl italic">H</div>
                  </div>
                  {/* Tails Side */}
                  <div 
                    className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-8 border-amber-700 shadow-2xl flex items-center justify-center"
                    style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                  >
                     <div className="text-amber-950 font-black text-6xl italic">T</div>
                  </div>
                </div>
                <h3 className="mt-12 text-2xl font-black text-emerald-600 animate-pulse uppercase tracking-[0.4em]">FLIPPING...</h3>
              </div>
            )}

            {step === 'decision' && (
              <div className="w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center">
                  <div className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                    Toss Result
                  </div>
                  <h3 className="text-5xl font-black text-gray-900 tracking-tighter mb-4 italic uppercase leading-none">
                    {winner} WON
                  </h3>
                  <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Select your innings preference</p>
                </div>

                <div className="grid gap-4">
                  <button 
                    onClick={() => handleDecision('bat')}
                    className="w-full py-6 bg-emerald-600 active:bg-emerald-700 text-white rounded-[24px] font-black text-xl transition-all active:scale-95 shadow-xl shadow-emerald-500/30"
                  >
                    BAT FIRST
                  </button>
                  <button 
                    onClick={() => handleDecision('bowl')}
                    className="w-full py-6 bg-black active:bg-gray-800 text-white rounded-[24px] font-black text-xl transition-all active:scale-95 shadow-xl"
                  >
                    BOWL FIRST
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="shrink-0 pb-8 pt-4 text-center">
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em]">BoxCric Random Engine v3.0</p>
        </div>
      </div>
      
      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export default TossPopup;
