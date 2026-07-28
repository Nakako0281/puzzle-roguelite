export type WildcardType = 'swap' | 'clearArea' | 'changeAttribute' | 'doubleScore';

export interface Wildcard {
  type: WildcardType;
  maxUses: number;
  remainingUses: number;
}

export const INITIAL_WILDCARDS: Record<WildcardType, Wildcard> = {
  swap: { type: 'swap', maxUses: 3, remainingUses: 3 },
  clearArea: { type: 'clearArea', maxUses: 1, remainingUses: 1 },
  changeAttribute: { type: 'changeAttribute', maxUses: 2, remainingUses: 2 },
  doubleScore: { type: 'doubleScore', maxUses: 1, remainingUses: 1 },
};

// For Japanese display
export const WILDCARD_NAMES: Record<WildcardType, string> = {
  swap: '入れ替え',
  clearArea: '領域クリア',
  changeAttribute: '属性変換',
  doubleScore: 'ダブルスコア',
};
