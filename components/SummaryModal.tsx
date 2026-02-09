import React, { useState, useEffect } from 'react';
import { MatchState, BallHistory } from '../types';
import Coin from './Coin';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: MatchState;
  onReset: () => void;
  onUpdateBall: (ball: BallHistory, index: number) => void;
  onNextMatch: (battingTeam?: 1 | 2) => void;
}

const StatTile: React.FC<{ label: string; value: string | number; color?: string }> = ({ label, value, color = 'text-white' }) => (
  <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl py-3 px-2 flex flex-col items-center justify-center text-center shadow-lg">
    <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.15em] mb-1 leading-none">{label}</span>
    <span className={`text-base font-black italic tracking-tighter tabular-nums leading-none ${color}`}>{value}</span>
  </div>
);

const OverDetail: React.FC<{ 
  index: number; 
  balls: BallHistory[]; 
  total: number; 
  isInningsBreak?: boolean; 
  inningsLabel?: string;
}> = ({ index, balls, total, isInningsBreak, inningsLabel }) => {
  if (isInningsBreak) {
    return (
      <div className="py-4 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
        <span className="text-[9px] font-black text-[#00E676] uppercase tracking-[0.4em] italic drop-shadow-sm">{inningsLabel || 'Innings Switch'}</span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
      </div>
    );
  }

  const legalBalls = balls.filter(b => b.type === 'legal').length;
  const overRR = legalBalls > 0 ? ((total / legalBalls) * 6).toFixed(2) : '0.00';

  return (
    <div className="flex flex-col py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Over {index}</span>
          <div className="h-1 w-1 bg-white/20 rounded-full"></div>
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">R.R {overRR}</span>
        </div>
        <div className="flex items-center gap-1 bg-[#00E676]/5 px-2 py-0.5 rounded-full border border-[#00E676]/10">
          <span className="text-[8px] font-black text-[#00E676] uppercase tracking-widest leading-none">Total:</span>
          <span className="text-[10px] font-black text-[#00E676] italic leading-none">{total}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1.5">
        {balls.map((ball, i) => {
          let style = "bg-white/5 text-slate-400 border-white/5";
          let label = ball.runs.toString();
          
          if (ball.isWicket) {
            style = "bg-[#FF3B30] text-white border-transparent shadow-sm";
            label = "W";
          } else if (ball.type !== 'legal') {
            style = "bg-amber-400 text-black border-transparent shadow-sm";
            label = ball.type === 'wide' ? "WD" : "NB";
          } else if (ball.runs === 4) {
            style = "bg-[#00C853] text-black border-transparent shadow-sm";
          } else if (ball.runs === 6) {
            style = "bg-[#00E676] text-black border-transparent shadow-lg ring-1 ring-[#00E676]/50";
          } else if (ball.runs === 0) {
            label = "•";
            style = "bg-white/5 text-white/20 border-white/5";
          } else {
            style = "bg-white/10 text-white border-white/5";
          }
          
          return (
            <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black italic shrink-0 border transition-all ${style}`}>
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose, match, onReset, onUpdateBall, onNextMatch }) => {
  const [setupPhase, setSetupPhase] = useState<'view' | 'next-match-options'>('view');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showInnings1, setShowInnings1] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSetupPhase('view');
      setShowCancelConfirm(false);
      setShowInnings1(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentBattingTeam = match.battingTeam === 1 ? match.team1 : match.team2;
  const firstInningsBattingTeam = match.battingTeam === 1 ? match.team2 : match.team1;

  const ballsBowled = match.completedOvers * 6 + match.ballsInCurrentOver;
  const currentRR = ballsBowled > 0 ? ((match.runs / ballsBowled) * 6).toFixed(2) : '0.00';
  
  const isTargetReached = match.target !== null && match.runs >= match.target && match.innings === 2;
  const winningTeam = match.isGameOver ? (isTargetReached ? currentBattingTeam : (match.battingTeam === 1 ? match.team2 : match.team1)) : null;
  const winningTeamIdx = isTargetReached ? match.battingTeam : (match.battingTeam === 1 ? 2 : 1);

  const processHistory = (history: BallHistory[]) => {
    const overs: { balls: BallHistory[]; total: number }[] = [];
    let currentBalls: BallHistory[] = [];
    let currentTotal = 0;
    let legalCount = 0;
    history.forEach((ball) => {
      currentBalls.push(ball);
      currentTotal += ball.runs;
      if (ball.type === 'legal') legalCount++;
      if (legalCount === 6) {
        overs.push({ balls: [...currentBalls], total: currentTotal });
        currentBalls = []; currentTotal = 0; legalCount = 0;
      }
    });
    if (currentBalls.length > 0) overs.push({ balls: [...currentBalls], total: currentTotal });
    return overs;
  };

  const innings1Overs = match.firstInningsData ? processHistory(match.firstInningsData.history) : [];
  const innings2Overs = processHistory(match.history);

  const isNextMatchPhase = setupPhase === 'next-match-options';

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#080808] animate-in fade-in duration-300 overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-[35%] bg-gradient-to-b ${isNextMatchPhase ? 'from-[#00E676]/20' : 'from-[#00E676]/10'} to-transparent pointer-events-none transition-all duration-700`}></div>

      {!isNextMatchPhase && (
        <header className="shrink-0 px-6 pt-10 pb-2 z-20 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">
              Innings <span className="text-[#00E676]">Summary</span>
            </h2>
            <div className="h-0.5 w-6 bg-[#00E676] mt-1.5 rounded-full"></div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-full border border-white/10 active-scale">
             <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </header>
      )}

      <div className={`flex-1 overflow-y-auto no-scrollbar px-6 z-10 flex flex-col ${isNextMatchPhase ? 'justify-center py-4' : 'pb-60'}`}>
        {setupPhase === 'view' ? (
          <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 gap-2.5 mb-6 mt-3">
              <StatTile label="Overs Completed" value={`${match.completedOvers}.${match.ballsInCurrentOver}`} />
              <StatTile label="Run Rate" value={currentRR} color="text-[#00E676]" />
              <StatTile label="Session Target" value={match.target || 'N/A'} />
              <StatTile label="Innings No." value={match.innings} />
            </div>

            {match.isGameOver && (
              <div className="relative mb-4 pt-6 pb-2 flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[#00E676]/5 rounded-full blur-[40px] scale-90 animate-pulse opacity-40"></div>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <span className="text-[#00E676] text-[10px] font-black uppercase tracking-[0.8em] mb-3 italic opacity-60">Victory Decided</span>
                  <h3 className="text-3xl font-black italic tracking-tighter leading-none uppercase text-white drop-shadow-[0_0_20px_rgba(0,230,118,0.4)] relative">
                    <span className="bg-gradient-to-r from-white via-[#00E676] to-white bg-clip-text text-transparent animate-[shimmer_3s_infinite_linear] bg-[length:200%_auto]">
                      {winningTeam} Wins!
                    </span>
                  </h3>
                  <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#00E676]/60 to-transparent mt-4"></div>
                </div>
              </div>
            )}

            {(match.seriesScore.team1 > 0 || match.seriesScore.team2 > 0) && (
              <div className="mb-6 p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-around">
                <div className="flex flex-col items-center">
                   <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-0.5 truncate max-w-[80px]">{match.team1}</span>
                   <span className={`text-xl font-black italic ${match.seriesScore.team1 > match.seriesScore.team2 ? 'text-[#00E676]' : 'text-white/40'}`}>{match.seriesScore.team1}</span>
                </div>
                <div className="h-8 w-px bg-white/5"></div>
                <div className="flex flex-col items-center">
                   <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-0.5 truncate max-w-[80px]">{match.team2}</span>
                   <span className={`text-xl font-black italic ${match.seriesScore.team2 > match.seriesScore.team1 ? 'text-[#00E676]' : 'text-white/40'}`}>{match.seriesScore.team2}</span>
                </div>
              </div>
            )}

            <div className="bg-[#121212]/50 border border-white/5 rounded-[1.5rem] p-4 shadow-xl mb-8">
              <div className="flex flex-col">
                {innings1Overs.length === 0 && innings2Overs.length === 0 ? (
                  <div className="text-center py-8 opacity-20">
                    <span className="text-xs font-black uppercase tracking-widest italic">No Deliveries Recorded</span>
                  </div>
                ) : (
                  <>
                    {innings2Overs.length > 0 && match.innings === 2 && (
                      <div className="mb-4">
                         <div className="flex items-center justify-between mb-3">
                           <span className="text-[9px] font-black text-[#00E676] uppercase tracking-[0.2em] block italic">{currentBattingTeam} Innings</span>
                           <div className="px-2 py-0.5 bg-[#00E676]/10 rounded-full">
                             <span className="text-[8px] font-black text-[#00E676] uppercase">Innings 2</span>
                           </div>
                         </div>
                         {innings2Overs.map((over, idx) => (
                           <OverDetail key={`i2-${idx}`} index={idx + 1} balls={over.balls} total={over.total} />
                         ))}
                      </div>
                    )}

                    {innings1Overs.length > 0 && (
                      <div className="mt-1">
                        {match.innings === 2 ? (
                          <>
                            <button 
                              onClick={() => setShowInnings1(!showInnings1)}
                              className="w-full flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/5 active-scale mb-3"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.1em] italic">Previous: {firstInningsBattingTeam} Innings</span>
                              </div>
                              <svg className={`w-3.5 h-3.5 text-[#00E676] transition-transform duration-300 ${showInnings1 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {showInnings1 && (
                              <div className="animate-in slide-in-from-top-2 duration-300">
                                {innings1Overs.map((over, idx) => (
                                  <OverDetail key={`i1-${idx}`} index={idx + 1} balls={over.balls} total={over.total} />
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="text-[9px] font-black text-[#00E676]/60 uppercase tracking-[0.2em] mb-3 block italic">{firstInningsBattingTeam} Innings</span>
                            {innings1Overs.map((over, idx) => (
                              <OverDetail key={`i1-${idx}`} index={idx + 1} balls={over.balls} total={over.total} />
                            ))}
                          </>
                        )}
                      </div>
                    )}

                    {innings2Overs.length > 0 && match.innings === 1 && (
                      <div className="mt-5 border-t border-white/5 pt-3">
                         <span className="text-[9px] font-black text-[#00E676]/60 uppercase tracking-[0.2em] mb-3 block italic">{currentBattingTeam} Innings</span>
                         {innings2Overs.map((over, idx) => (
                           <OverDetail key={`i2-${idx}`} index={idx + 1} balls={over.balls} total={over.total} />
                         ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in zoom-in-95 fade-in duration-500 max-w-sm mx-auto w-full px-2">
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-[#00E676]/20 rounded-full blur-2xl animate-pulse"></div>
              <Coin 
                side={isTargetReached ? (match.battingTeam === 1 ? 'HEADS' : 'TAILS') : (match.battingTeam === 1 ? 'TAILS' : 'HEADS')} 
                isResult 
                size="w-32 h-32" 
                className="animate-bounce"
              />
            </div>
            <div className="text-center mb-10">
              <span className="text-[10px] font-black text-[#00E676] uppercase tracking-[0.8em] mb-2 block italic">Winner</span>
              <h4 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
                {winningTeam}
              </h4>
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mt-8">Prepare for the next match</p>
            </div>
            
            <div className="w-full space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => onNextMatch(winningTeamIdx as 1 | 2)} 
                  className="py-7 bg-[#1A1A1A] border border-white/10 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest italic active-scale flex flex-col items-center justify-center gap-1.5 transition-all hover:bg-white hover:text-black"
                >
                  <span className="opacity-40 text-[7px] tracking-widest">Winner will</span>
                  Bat First
                </button>
                
                <button 
                  onClick={() => onNextMatch(winningTeamIdx === 1 ? 2 : 1)} 
                  className="py-7 bg-[#1A1A1A] border border-white/10 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest italic active-scale flex flex-col items-center justify-center gap-1.5 transition-all hover:bg-white hover:text-black"
                >
                  <span className="opacity-30 text-[7px] tracking-widest">Winner will</span>
                  Bowl First
                </button>
              </div>

              <div className="flex items-center gap-6 py-4">
                <div className="h-px flex-1 bg-white/5"></div>
                <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.6em] italic">Or</span>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>

              <button 
                onClick={() => onNextMatch()} 
                className="w-full py-5 bg-transparent border border-white/10 rounded-3xl text-white/40 font-black text-[10px] uppercase tracking-[0.4em] italic active-scale transition-all"
              >
                Perform Fresh Toss
              </button>

              <div className="pt-6">
                 <button 
                  onClick={() => setShowCancelConfirm(true)}
                  className="w-full py-3 bg-transparent text-white/20 font-black text-[9px] uppercase tracking-[0.4em] italic active-scale transition-all"
                 >
                   Abort Series & Exit
                 </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {setupPhase === 'view' && (
        <div className="shrink-0 p-6 pb-12 bg-black/90 backdrop-blur-3xl border-t border-white/10 space-y-4 z-30 animate-in slide-in-from-bottom duration-500 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
          {match.isGameOver ? (
            <>
              <button 
                onClick={() => setSetupPhase('next-match-options')} 
                className="w-full py-6 bg-[#00E676] text-black rounded-[2rem] font-black text-[10px] uppercase tracking-widest active-scale shadow-2xl shadow-[#00E676]/20 transition-transform"
              >
                Initiate Next Match
              </button>
              <button 
                onClick={() => setShowCancelConfirm(true)} 
                className="w-full py-2 text-white/30 font-black text-[10px] uppercase tracking-widest active-scale"
              >
                Exit Session
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={onClose} 
                className="w-full py-6 bg-white text-black rounded-[2rem] font-black text-[10px] uppercase tracking-widest active-scale transition-transform"
              >
                {match.innings === 2 && match.history.length === 0 ? 'Kickoff 2nd Innings' : 'Track score'}
              </button>
              {match.role === 'admin' && (
                <button 
                  onClick={() => setShowCancelConfirm(true)} 
                  className="w-full py-2 text-[#FF3B30]/60 font-black text-[10px] uppercase tracking-widest active-scale"
                >
                  Discard Match
                </button>
              )}
            </>
          )}
        </div>
      )}

      {showCancelConfirm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-in fade-in">
          <div className="w-full max-sm bg-[#121212] border border-white/10 rounded-[2.5rem] p-8 text-center shadow-4xl animate-in zoom-in-95">
            <div className="w-14 h-14 bg-[#FF3B30]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#FF3B30]/20">
               <svg className="w-7 h-7 text-[#FF3B30]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-3">Terminate Match?</h3>
            <p className="text-slate-500 text-xs font-medium mb-8 leading-relaxed px-4">This session and all data will be cleared permanently.</p>
            <div className="flex flex-col gap-3">
              <button onClick={onReset} className="w-full py-5 bg-[#FF3B30] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active-scale transition-transform">Yes, Discard All</button>
              <button onClick={() => setShowCancelConfirm(false)} className="w-full py-5 bg-white/5 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest active-scale transition-transform border border-white/5">Go Back</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
};

export default SummaryModal;