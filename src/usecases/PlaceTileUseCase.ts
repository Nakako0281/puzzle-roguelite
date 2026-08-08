import { GameState, GameStatus } from '../domain/models/GameState';
import { placeTile, isBoardFull } from '../domain/models/Board';
import { drawTiles } from '../domain/models/Deck';

export function executePlaceTile(
  state: GameState,
  row: number,
  col: number,
  tileIndex: number
): GameState {
  if (state.status !== 'playing') return state;

  const tileToPlace = state.nextQueue[tileIndex];
  if (!tileToPlace) return state;

  try {
    // 古いフラグをクリア
    const cleanBoard = state.board.map(row => 
      row.map(tile => tile ? { ...tile, justMerged: false } : null)
    );

    const { newBoard, scoreGained, scorePopups } = placeTile(cleanBoard, row, col, tileToPlace, state.comboMultiplier);
    
    // Remove the placed tile
    const newNextQueue = [...state.nextQueue];
    newNextQueue.splice(tileIndex, 1);
    
    // Draw a new tile
    const { drawn, newDeck: updatedDeck } = drawTiles(state.deck, 1);
    newNextQueue.push(...drawn);
    const newDeck = updatedDeck;

    const newScore = state.score + scoreGained;

    let newStatus: GameStatus = state.status;
    let gameOverReason = state.gameOverReason;

    // Check end conditions
    if (isBoardFull(newBoard)) {
      newStatus = 'gameOver';
      gameOverReason = 'boardFull';
    }

    return {
      ...state,
      board: newBoard,
      deck: newDeck,
      nextQueue: newNextQueue,
      score: newScore,
      comboMultiplier: 1, // Reset after placement
      status: newStatus,
      gameOverReason,
      scorePopups,
    };
  } catch (e) {
    // Cannot place tile
    return state;
  }
}
