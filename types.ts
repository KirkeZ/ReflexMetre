export enum GameState {
  IDLE = 'IDLE',         // Initial screen
  WAITING = 'WAITING',   // Red screen, waiting for random time
  READY = 'READY',       // Green screen, click now!
  TOO_EARLY = 'TOO_EARLY', // Clicked on red
  FINISHED = 'FINISHED'  // Result screen
}

export interface ReactionRecord {
  id: string;
  timestamp: number;
  reactionTime: number; // in milliseconds
}

export interface GeminiAnalysisResult {
  summary: string;
  rank: string;
  advice: string;
}

export type Language = 'tr' | 'en';