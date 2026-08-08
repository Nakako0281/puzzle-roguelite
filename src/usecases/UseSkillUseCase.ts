import { GameState, SKILL_GAUGE_MAX } from '../domain/models/GameState';

export function executeUseSkill(state: GameState, payload?: any): GameState {
  if (state.status !== 'playing' || state.skillGauge < SKILL_GAUGE_MAX) return state;

  if (payload && payload.r1 !== undefined && payload.r2 !== undefined) {
    const newBoard = state.board.map(r => [...r]);
    const temp = newBoard[payload.r1][payload.c1];
    newBoard[payload.r1][payload.c1] = newBoard[payload.r2][payload.c2];
    newBoard[payload.r2][payload.c2] = temp;

    return {
      ...state,
      skillGauge: 0,
      board: newBoard,
    };
  }

  return state;
}
