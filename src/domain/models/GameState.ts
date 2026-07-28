import { BoardState, createEmptyBoard } from './Board';
import { Tile } from './Tile';
import { Wildcard, INITIAL_WILDCARDS } from './Wildcard';
import { DeckState, createShuffledDeck, drawTiles, NEXT_QUEUE_SIZE } from './Deck';

export type GameStatus = 'playing' | 'gameOver';
export type GameOverReason = 'deckEmpty' | 'boardFull' | undefined;

export interface GameState {
  board: BoardState;
  deck: DeckState;
  nextQueue: Tile[];
  score: number;
  comboMultiplier: number;
  wildcards: Record<string, Wildcard>;
  status: GameStatus;
  gameOverReason: GameOverReason;
}

export function createInitialGameState(): GameState {
  const initialDeck = createShuffledDeck();
  const { drawn: nextQueue, newDeck } = drawTiles(initialDeck, NEXT_QUEUE_SIZE);
  
  return {
    board: createEmptyBoard(),
    deck: newDeck,
    nextQueue,
    score: 0,
    comboMultiplier: 1,
    wildcards: JSON.parse(JSON.stringify(INITIAL_WILDCARDS)),
    status: 'playing',
    gameOverReason: undefined,
  };
}
