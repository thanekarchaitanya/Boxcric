export type WicketType = 
  | 'Bowled' 
  | 'Caught' 
  | 'Run Out' 
  | 'LBW' 
  | 'Stumped' 
  | 'Hit Wicket' 
  | 'Retired Out';

export interface BallHistory {
  type: 'legal' | 'wide' | 'noball';
  runs: number;
  isWicket: boolean;
  wicketType?: WicketType;
}

export type UserRole = 'admin' | 'spectator' | 'player';
export type MatchPermission = 'editable' | 'view-only';
export type AppView = 'welcome' | 'setup' | 'join' | 'join-options' | 'player-setup' | 'toss' | 'scoring';

export interface TossResult {
  winner: string;
  decision: 'bat' | 'bowl';
}

export interface InningsData {
  runs: number;
  wickets: number;
  overs: string;
  history: BallHistory[];
}

export interface SeriesScore {
  team1: number;
  team2: number;
}

export interface MatchState {
  matchId: string;
  view: AppView;
  team1: string;
  team2: string;
  battingTeam: 1 | 2;
  totalOvers: number;
  runs: number;
  wickets: number;
  ballsInCurrentOver: number;
  completedOvers: number;
  history: BallHistory[];
  overHistory: BallHistory[];
  timerSeconds: number;
  isTimerRunning: boolean;
  permission: MatchPermission;
  role: UserRole;
  toss?: TossResult;
  innings: 1 | 2;
  target: number | null;
  firstInningsData: InningsData | null;
  isGameOver: boolean;
  seriesScore: SeriesScore;
  playerName?: string;
  playerTeam?: string;
  lastUpdated?: number; // Timestamp for sync
  syncStatus?: 'synced' | 'syncing' | 'offline';
}

export interface HistorySnapshot {
  runs: number;
  wickets: number;
  ballsInCurrentOver: number;
  completedOvers: number;
  overHistory: BallHistory[];
  fullHistory: BallHistory[];
  innings: 1 | 2;
  target: number | null;
  isGameOver: boolean;
}