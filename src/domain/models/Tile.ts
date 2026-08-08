export type TileAttribute = 'seal' | 'penguin' | 'polar_bear';

export interface Tile {
  id: string;
  attribute: TileAttribute;
  level: number;
  justMerged?: boolean;
}

export const MAX_LEVEL = 3;

export const ATTRIBUTES: TileAttribute[] = ['seal', 'penguin', 'polar_bear'];

// For Japanese display
export const ATTRIBUTE_NAMES: Record<TileAttribute, string> = {
  seal: 'アザラシ',
  penguin: 'ペンギン',
  polar_bear: 'シロクマ',
};
