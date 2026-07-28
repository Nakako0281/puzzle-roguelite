import { GameState } from '../domain/models/GameState';
import { WildcardType } from '../domain/models/Wildcard';
import { BOARD_SIZE, BoardState } from '../domain/models/Board';

export function executeUseWildcard(
  state: GameState,
  wildcardType: WildcardType,
  payload?: any // e.g. { r1, c1, r2, c2 } for swap, { r, c } for clearArea or changeAttribute
): GameState {
  if (state.status !== 'playing') return state;

  const wildcard = state.wildcards[wildcardType];
  if (!wildcard || wildcard.remainingUses <= 0) return state;

  let newBoard: BoardState = state.board.map(r => [...r]);
  let newComboMultiplier = state.comboMultiplier;

  try {
    switch (wildcardType) {
      case 'swap':
        if (!payload || payload.r1 === undefined) throw new Error('Invalid payload');
        const temp = newBoard[payload.r1][payload.c1];
        newBoard[payload.r1][payload.c1] = newBoard[payload.r2][payload.c2];
        newBoard[payload.r2][payload.c2] = temp;
        // In this simple implementation, we don't automatically trigger cluster clear after swap.
        // It just prepares the board for the next tile placement.
        break;

      case 'clearArea':
        if (!payload || payload.r === undefined) throw new Error('Invalid payload');
        // Clear 3x3 area around (r, c)
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const nr = payload.r + i;
            const nc = payload.c + j;
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
              newBoard[nr][nc] = null;
            }
          }
        }
        break;

      case 'changeAttribute':
        if (!payload || payload.r === undefined || !payload.newAttribute) throw new Error('Invalid payload');
        const tile = newBoard[payload.r][payload.c];
        if (tile) {
          newBoard[payload.r][payload.c] = { ...tile, attribute: payload.newAttribute };
        }
        break;

      case 'doubleScore':
        newComboMultiplier = 2;
        break;
    }

    return {
      ...state,
      board: newBoard,
      comboMultiplier: newComboMultiplier,
      wildcards: {
        ...state.wildcards,
        [wildcardType]: {
          ...wildcard,
          remainingUses: wildcard.remainingUses - 1,
        },
      },
    };
  } catch (e) {
    console.warn(e);
    return state;
  }
}
