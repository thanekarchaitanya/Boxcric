
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ScoreDisplay from './components/ScoreDisplay';
import OverHistory from './components/OverHistory';
import Controls from './components/Controls';
import TeamEditor from './components/TeamEditor';
import SetupScreen from './components/SetupScreen';
import TossPopup from './components/TossPopup';
import InningsBreakPopup from './components/InningsBreakPopup';
import MatchSummary from './components/MatchSummary';
import VictoryScreen from './components/VictoryScreen';
import LoadingScreen from './components/LoadingScreen';
import { BallEvent, MatchState, InningsData } from './types';

const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

const App: React.FC = () => {
  const [deviceId] = useState(() => {
    const saved = localStorage.getItem('boxcric_deviceId');
    if (saved) return saved;
    const newId = `BC-${generateCode()}`;
    localStorage.setItem('boxcric_deviceId', newId);
    return newId;
  });

  const [state, setState] = useState<MatchState>({
    runs: 0,
    wickets: 0,
    balls: 0,
    history: [],
    overHistory: [],
    battingTeam: 'Team A',
    bowlingTeam: 'Team B',
    totalOvers: 20,
    matchStartTime: null,
    matchEndTime: null,
    matchCode: deviceId,
    innings: 1,
    firstInnings: null,
    status: 'loading'
  });

  const [historyStack, setHistoryStack] = useState<MatchState[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncCodeInput, setSyncCodeInput] = useState('');

  // Initial loading timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setState(prev => ({ ...prev, status: 'setup' }));
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (state.matchCode && state.status !== 'loading') {
      localStorage.setItem(`match_${state.matchCode}`, JSON.stringify(state));
    }
  }, [state]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (state.matchCode && e.key === `match_${state.matchCode}` && e.newValue) {
        try {
          const newState = JSON.parse(e.newValue);
          if (JSON.stringify(newState) !== JSON.stringify(state)) {
            setState(newState);
          }
        } catch (err) {
          console.error("Failed to parse synced state", err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [state.matchCode, state]);

  useEffect(() => {
    let interval: number;
    if (state.matchStartTime && !state.matchEndTime) {
      interval = window.setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.matchStartTime, state.matchEndTime]);

  const elapsedSeconds = useMemo(() => {
    if (!state.matchStartTime) return 0;
    const endTime = state.matchEndTime || currentTime;
    return Math.floor((endTime - state.matchStartTime) / 1000);
  }, [state.matchStartTime, state.matchEndTime, currentTime]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const legalBallsInCurrentOver = useMemo(() => {
    return state.overHistory.filter(e => e !== 'wd' && e !== 'nb').length;
  }, [state.overHistory]);

  const isInningsComplete = useMemo(() => {
    const oversComplete = state.balls >= state.totalOvers * 6;
    const allOut = state.wickets >= 10;
    if (state.innings === 2 && state.firstInnings) {
      const targetMet = state.runs > state.firstInnings.runs;
      return oversComplete || allOut || targetMet;
    }
    return oversComplete || allOut;
  }, [state.balls, state.totalOvers, state.wickets, state.innings, state.firstInnings, state.runs]);

  useEffect(() => {
    if (isInningsComplete && state.history.length > 0 && state.status === 'live') {
      if (state.innings === 1) {
        setState(prev => ({ ...prev, status: 'break' }));
      } else {
        setState(prev => ({ ...prev, status: 'finished', matchEndTime: Date.now() }));
      }
    }
  }, [isInningsComplete, state.history.length, state.innings, state.status]);

  const handleInitiateMatch = useCallback((teamA: string, teamB: string, overs: number, code: string, skipToss: boolean) => {
    const initialMatchState: MatchState = {
      runs: 0,
      wickets: 0,
      balls: 0,
      history: [],
      overHistory: [],
      battingTeam: teamA,
      bowlingTeam: teamB,
      totalOvers: overs,
      matchStartTime: Date.now(),
      matchEndTime: null,
      matchCode: code,
      innings: 1,
      firstInnings: null,
      status: skipToss ? 'live' : 'toss'
    };
    setState(initialMatchState);
    setHistoryStack([]);
  }, []);

  const handleTossComplete = useCallback((battingTeam: string, bowlingTeam: string) => {
    setState(prev => ({
      ...prev,
      runs: 0,
      wickets: 0,
      balls: 0,
      history: [],
      overHistory: [],
      battingTeam: battingTeam,
      bowlingTeam: bowlingTeam,
      status: 'live'
    }));
    setHistoryStack([]);
  }, []);

  const handleStartSecondInnings = useCallback(() => {
    setState(prev => ({
      ...prev,
      firstInnings: {
        runs: prev.runs,
        wickets: prev.wickets,
        balls: prev.balls,
        history: [...prev.history],
        battingTeam: prev.battingTeam,
        bowlingTeam: prev.bowlingTeam
      },
      innings: 2,
      runs: 0,
      wickets: 0,
      balls: 0,
      history: [],
      overHistory: [],
      battingTeam: prev.bowlingTeam,
      bowlingTeam: prev.battingTeam,
      status: 'live'
    }));
    setHistoryStack([]);
  }, []);

  const handleAction = useCallback((event: BallEvent) => {
    if (state.status !== 'live') return;
    setState((prevState) => {
      setHistoryStack((prevStack) => [...prevStack, prevState]);
      const newState = { ...prevState };
      newState.history = [...prevState.history, event];
      newState.overHistory = [...prevState.overHistory, event];
      
      if (event.includes('W')) {
        newState.wickets += 1;
        newState.balls += 1;
        const runsPart = event.replace('W', '');
        const runs = runsPart === '' ? 0 : parseInt(runsPart);
        newState.runs += runs;
      } else if (event === 'wd' || event === 'nb') {
        newState.runs += 1;
      } else if (event === '0') {
        newState.balls += 1;
      } else {
        newState.runs += parseInt(event);
        newState.balls += 1;
      }
      return newState;
    });
  }, [state.status]);

  const handleNextOver = useCallback(() => {
    setState((prevState) => {
      setHistoryStack((prevStack) => [...prevStack, prevState]);
      return { ...prevState, overHistory: [] };
    });
  }, []);

  const handleUndo = useCallback(() => {
    if (historyStack.length === 0) return;
    const lastState = historyStack[historyStack.length - 1];
    setState(lastState);
    setHistoryStack((prevStack) => prevStack.slice(0, -1));
  }, [historyStack]);

  const handleReset = useCallback(() => {
    setState({
      runs: 0, wickets: 0, balls: 0, history: [], overHistory: [],
      battingTeam: 'Team A', bowlingTeam: 'Team B', totalOvers: 20,
      matchStartTime: null, matchEndTime: null, matchCode: deviceId,
      innings: 1, firstInnings: null, status: 'setup'
    });
    setHistoryStack([]);
  }, [deviceId]);

  const handleJoinSync = (code: string) => {
    const saved = localStorage.getItem(`match_${code}`);
    if (saved) {
      setState(JSON.parse(saved));
    } else {
      setState(prev => ({ ...prev, matchCode: code }));
    }
    setIsSyncModalOpen(false);
  };

  const handleCancelSync = () => {
    setState(prev => ({ ...prev, matchCode: deviceId }));
    setIsSyncModalOpen(false);
  };

  const winnerInfo = useMemo(() => {
    if (state.status !== 'finished' || !state.firstInnings) return null;
    const team1 = state.firstInnings.battingTeam;
    const team2 = state.battingTeam;
    const score1 = state.firstInnings.runs;
    const score2 = state.runs;
    if (score2 > score1) return { winner: team2, margin: `Won by ${10 - state.wickets} wickets` };
    if (score1 > score2) return { winner: team1, margin: `Won by ${score1 - score2} runs` };
    return { winner: 'Match Tied', margin: 'Scores are level' };
  }, [state.status, state.firstInnings, state.runs, state.wickets, state.battingTeam]);

  const isSynced = state.matchCode !== deviceId;

  if (state.status === 'loading') return <LoadingScreen />;

  return (
    <div className="h-[100dvh] flex flex-col max-w-lg mx-auto bg-black relative selection:bg-emerald-500/30 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-black to-black h-[50%] z-0 pointer-events-none"></div>

      {isSyncModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-xs p-6 shadow-2xl border-b-8 border-emerald-500">
            <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight italic">Network Sync</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 leading-relaxed">
              Connect multiple screens to this live scorecard. Any updates will sync instantly across the network.
            </p>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Current Match Code</label>
                <input 
                  type="text" 
                  value={syncCodeInput}
                  placeholder={state.matchCode || ''}
                  onChange={(e) => setSyncCodeInput(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-black tracking-widest text-emerald-600 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleJoinSync(syncCodeInput)}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  Join / Update Network
                </button>
                {isSynced && (
                  <button 
                    onClick={handleCancelSync}
                    className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
                  >
                    Cancel Sync (Go Private)
                  </button>
                )}
                <button 
                  onClick={() => setIsSyncModalOpen(false)}
                  className="w-full py-3 bg-gray-100 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {state.status === 'setup' && (
        <SetupScreen 
          deviceId={deviceId}
          onStart={(bat, bowl, ov, code, skip) => handleInitiateMatch(bat, bowl, ov, code, skip)} 
          onJoin={handleJoinSync} 
        />
      )}

      {state.status === 'toss' && (
        <TossPopup 
          teamA={state.battingTeam} 
          teamB={state.bowlingTeam} 
          onComplete={handleTossComplete} 
          onCancel={() => setState(s => ({...s, status: 'setup'}))} 
        />
      )}

      {state.status === 'break' && (
        <InningsBreakPopup 
          battingTeam={state.battingTeam} bowlingTeam={state.bowlingTeam}
          runs={state.runs} wickets={state.wickets} totalOvers={state.totalOvers}
          onContinue={handleStartSecondInnings}
          onShowSummary={() => setState(prev => ({ ...prev, status: 'summary' }))}
        />
      )}

      {state.status === 'summary' && (
        <MatchSummary 
          innings={{ runs: state.runs, wickets: state.wickets, balls: state.balls, history: state.history, battingTeam: state.battingTeam, bowlingTeam: state.bowlingTeam }}
          isMatchLive={state.matchEndTime === null}
          onContinue={() => {
            if (state.innings === 1 && !state.firstInnings) {
              setState(prev => ({ ...prev, status: 'live' }));
            } else if (state.innings === 2) {
              setState(prev => ({ ...prev, status: 'live' }));
            } else {
              handleStartSecondInnings();
            }
          }}
        />
      )}

      {state.status === 'finished' && winnerInfo && (
        <VictoryScreen winner={winnerInfo.winner} margin={winnerInfo.margin} onNextMatch={handleReset} />
      )}

      {(state.status === 'live' || state.status === 'highlights') && (
        <div className="flex flex-col h-full overflow-hidden">
          <header className="px-6 pt-4 pb-2 relative z-20 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="box-3d cricket-ball-3d w-8 h-8 rounded-full flex items-center justify-center border-b-2 border-r-2 border-red-900/50">
                  <div className="w-full h-[1px] bg-red-400/30 rotate-45"></div>
                  <div className="absolute w-full h-[1px] bg-red-400/30 rotate-[135deg]"></div>
                </div>
                <h1 className="logo-3d text-2xl font-black text-white tracking-tighter italic">box<span className="text-emerald-500">cric</span></h1>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <div className={`h-2 w-2 rounded-full ${isSynced ? 'bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]'}`}></div>
                    <span className="text-[10px] font-mono font-bold text-white tracking-wider">{formatTime(elapsedSeconds)}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setSyncCodeInput(state.matchCode || '');
                      setIsSyncModalOpen(true);
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg mt-1 transition-all active:scale-95 ${isSynced ? 'bg-blue-500/10 border border-blue-500/30' : 'hover:bg-white/5'}`}
                  >
                    {isSynced && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3m-3-3-2.25-2.25"/></svg>
                    )}
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isSynced ? 'text-blue-400' : 'text-emerald-400'}`}>
                      {isSynced ? 'Synced' : 'Private'}: {state.matchCode}
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <TeamEditor battingTeam={state.battingTeam} bowlingTeam={state.bowlingTeam} totalOvers={state.totalOvers} onSave={(bat, bowl, ov) => setState(prev => ({ ...prev, battingTeam: bat, bowlingTeam: bowl, totalOvers: ov }))} />
          </header>

          <main className="flex-1 px-6 flex flex-col justify-start min-h-0 relative z-10 overflow-y-auto custom-scrollbar py-2">
            <ScoreDisplay 
              runs={state.runs} 
              wickets={state.wickets} 
              balls={state.balls} 
              battingTeam={state.battingTeam} 
              isSecondInnings={state.innings === 2}
              target={state.firstInnings ? state.firstInnings.runs + 1 : undefined}
              totalOvers={state.totalOvers}
            />
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 shadow-2xl border border-white shrink-0 mb-4">
              <OverHistory events={state.overHistory} />
              <div className="flex justify-between items-center text-[9px] font-bold text-gray-500 uppercase tracking-widest pt-2 mt-1 border-t border-gray-100">
                <span className="flex items-center gap-1">Balls: <span className="text-emerald-600 font-black">{legalBallsInCurrentOver}/6</span></span>
                <span className="flex items-center gap-1">Total: <span className="text-emerald-600 font-black">{(state.balls / 6).toFixed(1)} / {state.totalOvers}</span></span>
              </div>
            </div>
          </main>
          
          <footer className="shrink-0 z-20">
            <Controls 
              onAction={handleAction} 
              onUndo={handleUndo} 
              onReset={() => { if(window.confirm('Reset match?')) handleReset(); }} 
              onNextOver={handleNextOver} 
              onShowSummary={() => setState(prev => ({ ...prev, status: 'summary' }))}
              legalBallsInOver={legalBallsInCurrentOver} 
            />
          </footer>
        </div>
      )}
    </div>
  );
};

export default App;
