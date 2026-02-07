
export type BallEvent = '0' | '1' | '2' | '3' | '4' | '6' | 'wd' | 'nb' | 'W' | '0W' | '1W' | '2W' | '3W' | '4W' | '6W';

export interface InningsData {
  runs: number;
  wickets: number;
  balls: number;
  history: BallEvent[];
  battingTeam: string;
  bowlingTeam: string;
}

export interface MatchState {
  runs: number;
  wickets: number;
  balls: number;
  history: BallEvent[];
  overHistory: BallEvent[];
  battingTeam: string;
  bowlingTeam: string;
  totalOvers: number;
  matchStartTime: number | null;
  matchEndTime: number | null;
  matchCode: string | null;
  innings: 1 | 2;
  firstInnings: InningsData | null;
  status: 'loading' | 'setup' | 'toss' | 'live' | 'break' | 'summary' | 'finished' | 'highlights';
}
