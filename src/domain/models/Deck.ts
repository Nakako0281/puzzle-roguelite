import { Tile, ATTRIBUTES } from './Tile';

export const INITIAL_DECK_SIZE = 40;
export const NEXT_QUEUE_SIZE = 3;

export interface DeckState {
  tiles: Tile[];
}

export function createShuffledDeck(): DeckState {
  return { tiles: [] }; // デッキ自体はもう管理せず、都度生成する
}

export function drawTiles(deck: DeckState, count: number): { drawn: Tile[]; newDeck: DeckState } {
  const drawn: Tile[] = [];
  for (let i = 0; i < count; i++) {
    const attribute = ATTRIBUTES[Math.floor(Math.random() * ATTRIBUTES.length)];
    drawn.push({
      id: `tile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      attribute,
      level: 1,
    });
  }
  return {
    drawn,
    newDeck: deck, // デッキ状態は変更なし
  };
}
