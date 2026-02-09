
import React, { useState, useEffect, useCallback } from 'react';
import { MatchState, BallHistory, HistorySnapshot, AppView, MatchPermission, TossResult, InningsData } from './types';
import Header from './components/Header';
import MatchDetails from './components/MatchDetails';
import LiveScoreboard from './components/LiveScoreboard';
import InputPanel from './components/InputPanel';
import WicketModal from './components/WicketModal';
import SummaryModal from './components/SummaryModal';
import SettingsModal from './components/SettingsModal';
import WelcomeScreen from './components/WelcomeScreen';
import SetupScreen from './components/SetupScreen';
import JoinScreen from './components/JoinScreen';
import TossScreen from './components/TossScreen';
import MatchIDPopup from './components/MatchIDPopup';
import InningsBreakPopup from './components/InningsBreakPopup';

const STORAGE_KEY = 'playscore_match_state';

const generateMatchId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'PS';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const initialState: MatchState = {
  matchId: '',
  view: 'welcome',
  team1: 'Team Alpha',
  team2: 'Team Bravo',
  battingTeam: 1,
  totalOvers: 5,
  runs: 0,
  wickets: 0,
  ballsInCurrentOver: 0,
  completedOvers: 0,
  history: [],
  overHistory: [],
  timerSeconds: 0,
  isTimerRunning: false,
  permission: 'editable',
  role: 'admin',
  innings: 1,
  target: null,
  firstInningsData: null,
  isGameOver: false,
  seriesScore: { team1: 0, team2: 0 }
};

const App: React.FC = () => {
  const [match, setMatch] = useState<MatchState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, view: 'welcome' };
    }
    return initialState;
  });
  
  const [undoStack, setUndoStack] = useState<HistorySnapshot[]>([]);
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showIdPopup, setShowIdPopup] = useState(false);
  const [showInningsPopup, setShowInningsPopup] = useState(false);
  
  useEffect(() => {
    let interval: number | undefined;
    if (match.isTimerRunning && match.view === 'scoring' && !match.isGameOver) {
      interval = window.setInterval(() => {
        setMatch(prev => ({ ...prev, timerSeconds: prev.timerSeconds + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [match.isTimerRunning, match.view, match.isGameOver]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(match));
  }, [match]);

  const navigateTo = (view: AppView) => {
    setMatch(prev => ({ ...prev, view }));
  };

  const initSetup = (team1: string, team2: string, totalOvers: number, permission: MatchPermission, skipToss: boolean = false) => {
    const newId = generateMatchId();
    const nextView: AppView = skipToss ? 'scoring' : 'toss';
    
    setMatch({
      ...initialState,
      matchId: newId,
      team1,
      team2,
      totalOvers,
      permission,
      view: nextView,
      role: 'admin',
      isTimerRunning: skipToss,
      seriesScore: { team1: 0, team2: 0 }
    });
    
    // Only show ID popup on the very first creation of a match session
    setShowIdPopup(true);
    setUndoStack([]);
  };

  const handleTossComplete = (result?: TossResult) => {
    let battingTeam: 1 | 2 = 1;
    if (result) {
      const winnerIsTeam1 = result.winner === match.team1;
      if (result.decision === 'bat') {
        battingTeam = winnerIsTeam1 ? 1 : 2;
      } else {
        battingTeam = winnerIsTeam1 ? 2 : 1;
      }
    }

    setMatch(prev => ({
      ...prev,
      toss: result,
      battingTeam,
      view: 'scoring',
      isTimerRunning: true
    }));
    // We don't trigger the ID popup here to avoid interrupting the flow in a series
    setUndoStack([]);
  };

  const joinMatch = (id: string) => {
    if (id.startsWith('PS') && id.length === 6) {
      setMatch(prev => ({
        ...prev,
        matchId: id,
        view: 'scoring',
        role: 'spectator',
        permission: 'view-only',
        isTimerRunning: true
      }));
      return true;
    }
    return false;
  };

  const pushUndo = useCallback(() => {
    const snapshot: HistorySnapshot = {
      runs: match.runs,
      wickets: match.wickets,
      ballsInCurrentOver: match.ballsInCurrentOver,
      completedOvers: match.completedOvers,
      overHistory: [...match.overHistory],
      fullHistory: [...match.history],
      innings: match.innings,
      target: match.target,
      isGameOver: match.isGameOver,
    };
    setUndoStack(prev => [...prev.slice(-19), snapshot]);
  }, [match]);

  const recalculateStateFromHistory = (history: BallHistory[]) => {
    let runs = 0;
    let wickets = 0;
    let ballsInCurrentOver = 0;
    let completedOvers = 0;
    let overHistory: BallHistory[] = [];

    history.forEach(ball => {
      runs += ball.runs;
      if (ball.isWicket) wickets++;
      
      if (ball.type === 'legal') {
        ballsInCurrentOver++;
        if (ballsInCurrentOver === 6) {
          ballsInCurrentOver = 0;
          completedOvers++;
          overHistory = [];
        } else {
          overHistory.push(ball);
        }
      } else {
        overHistory.push(ball);
      }
    });

    return { runs, wickets, ballsInCurrentOver, completedOvers, overHistory };
  };

  const handleRun = (runs: number) => {
    if (match.permission === 'view-only' || match.isGameOver) return;
    pushUndo();
    const newBall: BallHistory = { type: 'legal', runs, isWicket: false };
    updateState(newBall);
  };

  const handleExtra = (type: 'wide' | 'noball') => {
    if (match.permission === 'view-only' || match.isGameOver) return;
    pushUndo();
    const newBall: BallHistory = { type, runs: 1, isWicket: false };
    updateState(newBall);
  };

  const handleWicketOutcome = (ball: BallHistory) => {
    if (match.permission === 'view-only' || match.isGameOver) return;
    pushUndo();
    updateState(ball);
    setShowWicketModal(false);
  };

  const updateState = (ball: BallHistory) => {
    setMatch(prev => {
      const newHistory = [...prev.history, ball];
      const recalculated = recalculateStateFromHistory(newHistory);
      
      let nextMatch = { ...prev, ...recalculated, history: newHistory };

      const isWicketsOut = recalculated.wickets >= 10;
      const isOversDone = recalculated.completedOvers >= prev.totalOvers;
      const isTargetReached = prev.innings === 2 && prev.target !== null && recalculated.runs >= prev.target;

      if (prev.innings === 1) {
        if (isWicketsOut || isOversDone) {
          const firstInningsData: InningsData = {
            runs: recalculated.runs,
            wickets: recalculated.wickets,
            overs: `${recalculated.completedOvers}.${recalculated.ballsInCurrentOver}`,
            history: newHistory
          };
          
          setShowInningsPopup(true);

          return {
            ...prev,
            innings: 2,
            target: recalculated.runs + 1,
            firstInningsData,
            battingTeam: prev.battingTeam === 1 ? 2 : 1,
            runs: 0,
            wickets: 0,
            ballsInCurrentOver: 0,
            completedOvers: 0,
            history: [],
            overHistory: []
          };
        }
      } else {
        if (isWicketsOut || isOversDone || isTargetReached) {
          setShowSummary(true);
          const winner = isTargetReached ? prev.battingTeam : (prev.battingTeam === 1 ? 2 : 1);
          const updatedSeries = { ...prev.seriesScore };
          if (winner === 1) updatedSeries.team1 += 1;
          else updatedSeries.team2 += 1;

          return {
            ...nextMatch,
            isGameOver: true,
            isTimerRunning: false,
            seriesScore: updatedSeries
          };
        }
      }

      return nextMatch;
    });
  };

  const handleUpdateBall = (updatedBall: BallHistory, index: number) => {
    setMatch(prev => {
      const newHistory = [...prev.history];
      newHistory[index] = updatedBall;
      const recalculated = recalculateStateFromHistory(newHistory);
      return {
        ...prev,
        ...recalculated,
        history: newHistory
      };
    });
  };

  const handleUndo = () => {
    if (undoStack.length === 0 || match.permission === 'view-only') return;
    const last = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setMatch(prev => ({
      ...prev,
      runs: last.runs,
      wickets: last.wickets,
      ballsInCurrentOver: last.ballsInCurrentOver,
      completedOvers: last.completedOvers,
      overHistory: last.overHistory,
      history: last.fullHistory,
      innings: last.innings,
      target: last.target,
      isGameOver: last.isGameOver
    }));
  };

  const handleExitMatch = () => {
    setMatch({ ...initialState, view: 'welcome' });
    setUndoStack([]);
    localStorage.removeItem(STORAGE_KEY);
    setShowSummary(false);
  };

  const handleNextMatch = (battingTeam?: 1 | 2) => {
    setMatch(prev => ({
      ...initialState,
      matchId: prev.matchId,
      team1: prev.team1,
      team2: prev.team2,
      totalOvers: prev.totalOvers,
      permission: prev.permission,
      seriesScore: prev.seriesScore, // Essential to keep the series score going
      view: battingTeam ? 'scoring' : 'toss',
      battingTeam: battingTeam || 1,
      isTimerRunning: !!battingTeam,
      innings: 1,
      history: [],
      overHistory: [],
      runs: 0,
      wickets: 0,
      completedOvers: 0,
      ballsInCurrentOver: 0,
      isGameOver: false,
      timerSeconds: 0,
      target: null,
      firstInningsData: null,
      toss: undefined
    }));
    setUndoStack([]);
    setShowSummary(false);
  };

  if (match.view === 'welcome') {
    return <WelcomeScreen onCreate={() => navigateTo('setup')} onJoin={() => navigateTo('join')} />;
  }

  if (match.view === 'setup') {
    return <SetupScreen onBack={() => navigateTo('welcome')} onCreate={initSetup} />;
  }

  if (match.view === 'toss') {
    return <TossScreen 
      team1={match.team1} 
      team2={match.team2} 
      onComplete={handleTossComplete}
      onBack={() => navigateTo('setup')}
    />;
  }

  if (match.view === 'join') {
    return <JoinScreen onBack={() => navigateTo('welcome')} onJoin={joinMatch} />;
  }

  const battingTeamName = match.battingTeam === 1 ? match.team1 : match.team2;
  const firstInningsTeam = match.battingTeam === 1 ? match.team2 : match.team1;

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-[#0B0B0B] shadow-2xl overflow-hidden relative border-x border-white/5">
      <Header timerSeconds={match.timerSeconds} />
      
      <main className="flex-1 px-4 py-1 flex flex-col min-h-0 mb-4 w-full">
        <MatchDetails 
          team1={match.team1} 
          team2={match.team2} 
          totalOvers={match.totalOvers}
          currentOvers={`${match.completedOvers}.${match.ballsInCurrentOver}`}
          onEdit={match.role === 'admin' && !match.isGameOver ? () => setShowSettings(true) : undefined}
          matchId={match.matchId}
        />
        
        <LiveScoreboard 
          battingTeamName={battingTeamName}
          runs={match.runs}
          wickets={match.wickets}
          overs={`${match.completedOvers}.${match.ballsInCurrentOver}`}
          runRate={match.history.length > 0 ? (match.runs / (Math.max(1, (match.completedOvers * 6 + match.ballsInCurrentOver)) / 6)).toFixed(2) : '0.00'}
          overHistory={match.overHistory}
          innings={match.innings}
          target={match.target}
          totalOvers={match.totalOvers}
        />
      </main>

      <footer className="bg-[#121212] rounded-t-[2.5rem] p-6 pb-8 border-t border-white/5 shadow-[0_-15px_40px_rgba(0,0,0,0.8)] relative z-20 shrink-0 w-full">
        <InputPanel 
          onRun={handleRun}
          onExtra={handleExtra}
          onWicket={() => setShowWicketModal(true)}
          onUndo={handleUndo}
          onSummary={() => setShowSummary(true)}
          canUndo={undoStack.length > 0 && match.permission === 'editable' && !match.isGameOver}
          isViewOnly={match.permission === 'view-only' || match.isGameOver}
        />
      </footer>

      <WicketModal 
        isOpen={showWicketModal} 
        onClose={() => setShowWicketModal(false)} 
        onSelect={handleWicketOutcome} 
      />

      <SummaryModal 
        isOpen={showSummary} 
        onClose={() => setShowSummary(false)} 
        match={match}
        onReset={handleExitMatch}
        onUpdateBall={handleUpdateBall}
        onNextMatch={handleNextMatch}
      />

      {match.firstInningsData && (
        <InningsBreakPopup 
          isOpen={showInningsPopup} 
          onClose={() => setShowInningsPopup(false)}
          onViewSummary={() => {
            setShowInningsPopup(false);
            setShowSummary(true);
          }}
          target={match.target || 0}
          data={match.firstInningsData}
          teamName={firstInningsTeam}
          totalOvers={match.totalOvers}
        />
      )}

      {match.role === 'admin' && (
        <SettingsModal 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)}
          initialTeam1={match.team1}
          initialTeam2={match.team2}
          initialOvers={match.totalOvers}
          onSave={(t1, t2, ov) => setMatch(prev => ({ ...prev, team1: t1, team2: t2, totalOvers: ov }))}
        />
      )}

      <MatchIDPopup 
        isOpen={showIdPopup} 
        onClose={() => setShowIdPopup(false)} 
        matchId={match.matchId} 
      />
    </div>
  );
};

export default App;
