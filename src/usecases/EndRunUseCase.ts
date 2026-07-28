import { GameState } from '../domain/models/GameState';
import { MetaProgression } from '../domain/models/MetaProgression';

export function executeEndRun(state: GameState, meta: MetaProgression): MetaProgression {
  if (state.status !== 'gameOver') return meta;

  const pointsEarned = Math.floor(state.score / 10); // 10 score = 1 meta point

  return {
    ...meta,
    totalPoints: meta.totalPoints + pointsEarned,
    bestScore: Math.max(meta.bestScore, state.score),
  };
}
