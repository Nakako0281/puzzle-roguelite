export interface MetaProgression {
  totalPoints: number;
  bestScore: number;
  highScores?: number[];
  unlockedWildcards: string[]; // Future feature
}

export const INITIAL_META_PROGRESSION: MetaProgression = {
  totalPoints: 0,
  bestScore: 0,
  highScores: [],
  unlockedWildcards: [],
};
