import React, { useState, useEffect, useCallback, useRef } from 'react';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
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
import RoleSelectScreen from './components/RoleSelectScreen';
import TossScreen from './components/TossScreen';
import MatchIDPopup from './components/MatchIDPopup';
import InningsBreakPopup from './components/InningsBreakPopup';
import PlayerSetupScreen from './components/PlayerSetupScreen';

// --- FIREBASE CONFIGURATION ---
// Uses environment variables from .env file
// The private key from the service account should NOT be exposed in the frontend
// Instead, use the web SDK config below
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "boxcriclive.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "boxcriclive",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "boxcriclive.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: process.env.FIREBASE_APP_ID || "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
  seriesScore: { team1: 0, team2: 0 },
  syncStatus: 'synced'
};

const App: React.FC = () => {
  const [match, setMatch] = useState<MatchState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, view: 'welcome', syncStatus: 'synced' };
    }
    return initialState;
  });

  const [undoStack, setUndoStack] = useState<HistorySnapshot[]>([]);
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showIdPopup, setShowIdPopup] = useState(false);
  const [showInningsPopup, setShowInningsPopup] = useState(false);
  
  const lastCloudSyncRef = useRef<number>(0);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Firestore Real-Time Listener (For Spectators and Players)
  useEffect(() => {
    if (match.matchId && match.role !== 'admin' && match.view === 'scoring') {
      console.log(`🔄 Setting up Firestore listener for: matches/${match.matchId}`);
      
      const matchDocRef = doc(db, "matches", match.matchId);
      
      // First, try to fetch the document immediately
      getDoc(matchDocRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            console.log(`✅ Found match document in Firestore:`, docSnap.data());
            const remoteState = docSnap.data() as MatchState;
            setMatch(prev => ({ 
              ...remoteState, 
              role: prev.role,
              playerName: prev.playerName,
              playerTeam: prev.playerTeam,
              syncStatus: 'synced'
            }));
          } else {
            console.log(`⚠️ Match document not found: matches/${match.matchId}`);
            setMatch(prev => ({ ...prev, syncStatus: 'waiting' }));
          }
        })
        .catch((error) => {
          console.error(`❌ Error fetching match:`, error);
          setMatch(prev => ({ ...prev, syncStatus: 'offline' }));
        });
      
      // Then set up the real-time listener for future updates
      console.log(`📡 Subscribing to real-time updates`);
      unsubscribeRef.current = onSnapshot(
        matchDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            console.log(`🔄 Match updated:`, docSnap.data());
            const remoteState = docSnap.data() as MatchState;
            
            // Update with remote data
            setMatch(prev => ({ 
              ...remoteState, 
              role: prev.role,
              playerName: prev.playerName,
              playerTeam: prev.playerTeam,
              syncStatus: 'synced'
            }));
          }
        },
        (error) => {
          console.error(`❌ Firestore listener error:`, error);
          setMatch(prev => ({ ...prev, syncStatus: 'offline' }));
        }
      );
    }

    return () => {
      if (unsubscribeRef.current) {
        console.log(`🔌 Unsubscribing from Firestore`);
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [match.matchId, match.role, match.view]);

  // Firestore Push logic for Admin
  const pushToFirestore = useCallback(async (state: MatchState) => {
    if (state.role !== 'admin' || !state.matchId) return;
    
    try {
      setMatch(prev => ({ ...prev, syncStatus: 'syncing' }));
      const matchDocRef = doc(db, "matches", state.matchId);
      
      const payload = { 
        ...state, 
        lastUpdated: Date.now(),
        syncStatus: 'synced' // Don't save the 'syncing' status to DB
      };

      await setDoc(matchDocRef, payload, { merge: true });
      setMatch(prev => ({ ...prev, syncStatus: 'synced' }));
    } catch (e) {
      console.error("Firestore Push Error:", e);
      setMatch(prev => ({ ...prev, syncStatus: 'offline' }));
    }
  }, []);

  // Sync state changes to local storage and Firestore (if admin)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(match));
    
    if (match.role === 'admin' && match.view === 'scoring' && match.matchId) {
      // Throttle pushes to avoid hitting Firestore quotas during rapid typing
      const now = Date.now();
      if (now - lastCloudSyncRef.current > 500) {
        pushToFirestore(match);
        lastCloudSyncRef.current = now;
      }
    }
  }, [match, pushToFirestore]);

  // Match Timer Logic
  useEffect(() => {
    let interval: number | undefined;
    if (match.isTimerRunning && match.view === 'scoring' && !match.isGameOver) {
      interval = window.setInterval(() => {
        setMatch(prev => ({ ...prev, timerSeconds: prev.timerSeconds + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [match.isTimerRunning, match.view, match.isGameOver]);

  const navigateTo = (view: AppView) => {
    setMatch(prev => ({ ...prev, view }));
  };

  const initSetup = (team1: string, team2: string, totalOvers: number, permission: MatchPermission, skipToss: boolean = false) => {
    const newId = generateMatchId();
    const nextView: AppView = skipToss ? 'scoring' : 'toss';
    
    const newState: MatchState = {
      ...initialState,
      matchId: newId,
      team1,
      team2,
      totalOvers,
      permission,
      view: nextView,
      role: 'admin',
      isTimerRunning: skipToss,
      seriesScore: { team1: 0, team2: 0 },
      lastUpdated: Date.now()
    };

    setMatch(newState);
    setShowIdPopup(true);
    setUndoStack([]);
    pushToFirestore(newState); // Create the doc immediately
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
      isTimerRunning: true,
      lastUpdated: Date.now()
    }));
    setUndoStack([]);
  };

  const handleJoinView = async (id: string) => {
    // Validate match ID format (starts with PS and is 6 characters)
    if (!id.startsWith('PS') || id.length !== 6) {
      alert("Invalid match ID. Please check and try again.");
      return;
    }

    setMatch(prev => ({
      ...prev,
      matchId: id,
      role: 'spectator',
      permission: 'view-only',
      view: 'role-select',
      syncStatus: 'synced'
    }));
  };

  const handleJoinPlayer = async (id: string) => {
    // Validate match ID format (starts with PS and is 6 characters)
    if (!id.startsWith('PS') || id.length !== 6) {
      alert("Invalid match ID. Please check and try again.");
      return;
    }

    setMatch(prev => ({
      ...prev,
      matchId: id,
      view: 'role-select',
      syncStatus: 'synced'
    }));
  };

  const finalizePlayerSetup = (name: string, team: string) => {
    setMatch(prev => ({
      ...prev,
      playerName: name,
      playerTeam: team,
      view: 'scoring'
    }));
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
      
      let nextMatch = { ...prev, ...recalculated, history: newHistory, lastUpdated: Date.now() };

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
            overHistory: [],
            lastUpdated: Date.now()
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
            seriesScore: updatedSeries,
            lastUpdated: Date.now()
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
        history: newHistory,
        lastUpdated: Date.now()
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
      isGameOver: last.isGameOver,
      lastUpdated: Date.now()
    }));
  };

  const handleExitMatch = () => {
    setMatch({ ...initialState, view: 'welcome' });
    setUndoStack([]);
    localStorage.removeItem(STORAGE_KEY);
    setShowSummary(false);
  };

  const handleNextMatch = (battingTeam?: 1 | 2) => {
    const nextState: MatchState = {
      ...initialState,
      matchId: match.matchId,
      team1: match.team1,
      team2: match.team2,
      totalOvers: match.totalOvers,
      permission: match.permission,
      seriesScore: match.seriesScore, 
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
      toss: undefined,
      lastUpdated: Date.now()
    };
    
    setMatch(nextState);
    setUndoStack([]);
    setShowSummary(false);
    pushToFirestore(nextState);
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
    return <JoinScreen onBack={() => navigateTo('welcome')} onJoinView={handleJoinView} onJoinPlayer={handleJoinPlayer} />;
  }

  if (match.view === 'role-select') {
    return (
      <RoleSelectScreen 
        onSelectRole={(role) => {
          if (role === 'viewer') {
            // Viewer goes directly to scoring
            setMatch(prev => ({
              ...prev,
              view: 'scoring',
              role: 'spectator',
              isTimerRunning: true
            }));
          } else {
            // Player goes to player-setup screen
            navigateTo('player-setup');
          }
        }}
        onBack={() => navigateTo('join')}
      />
    );
  }

  if (match.view === 'player-setup') {
    return <PlayerSetupScreen onBack={() => navigateTo('role-select')} team1={match.team1} team2={match.team2} onComplete={finalizePlayerSetup} />;
  }

  const battingTeamName = match.battingTeam === 1 ? match.team1 : match.team2;
  const firstInningsTeam = match.battingTeam === 1 ? match.team2 : match.team1;

  const isSpectator = match.role === 'spectator';

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-[var(--primary-bg)] shadow-2xl overflow-hidden relative border-x border-[var(--border-color)]">
      <Header timerSeconds={match.timerSeconds} syncStatus={match.syncStatus} />
      
      <main className={`flex-1 px-4 py-1 flex flex-col min-h-0 w-full ${isSpectator ? 'mb-0' : 'mb-4'}`}>
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
          fullHistory={isSpectator ? match.history : undefined}
        />
      </main>

      {!isSpectator ? (
        <footer className="bg-[var(--secondary-bg)] rounded-t-[2rem] p-6 pb-8 border-t border-white/10 shadow-[0_-15px_40px_var(--shadow-primary)] relative z-20 shrink-0 w-full">
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
      ) : (
        <footer className="bg-black/80 backdrop-blur-xl p-4 shrink-0 w-full flex items-center justify-between border-t border-white/5">
           <div className="flex flex-col">
              <span className="text-[8px] font-black text-[#00E676] uppercase tracking-[0.2em] italic">Watching As Spectator</span>
              <span className="text-[10px] font-medium text-white/30">Live updates enabled</span>
           </div>
           <button 
            onClick={() => setShowSummary(true)}
            className="px-6 py-3 bg-white/5 text-white/60 rounded-xl font-black text-[9px] uppercase tracking-widest border border-white/5 active-scale"
           >
             Full Over History
           </button>
        </footer>
      )}

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
          onSave={(t1, t2, ov) => setMatch(prev => ({ ...prev, team1: t1, team2: t2, totalOvers: ov, lastUpdated: Date.now() }))}
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