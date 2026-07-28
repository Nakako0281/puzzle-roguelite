import { Tile, TileAttribute, MAX_LEVEL } from './Tile';

export const BOARD_SIZE = 6;
export const COMBO_THRESHOLD = 4;

export type BoardState = (Tile | null)[][];

export function createEmptyBoard(): BoardState {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
}

export function isBoardFull(board: BoardState): boolean {
  return board.every(row => row.every(cell => cell !== null));
}

export function findClusters(board: BoardState, row: number, col: number, attribute: TileAttribute, level: number, visited: boolean[][]): { r: number; c: number }[] {
  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return [];
  if (visited[row][col]) return [];
  
  const tile = board[row][col];
  if (!tile || tile.attribute !== attribute || tile.level !== level) return [];

  visited[row][col] = true;
  let cluster = [{ r: row, c: col }];

  cluster = cluster.concat(findClusters(board, row - 1, col, attribute, level, visited));
  cluster = cluster.concat(findClusters(board, row + 1, col, attribute, level, visited));
  cluster = cluster.concat(findClusters(board, row, col - 1, attribute, level, visited));
  cluster = cluster.concat(findClusters(board, row, col + 1, attribute, level, visited));

  return cluster;
}

export interface PlaceResult {
  newBoard: BoardState;
  clearedCells: { r: number; c: number }[];
  scoreGained: number;
}

export function placeTile(board: BoardState, row: number, col: number, tile: Tile, comboMultiplier: number = 1): PlaceResult {
  if (board[row][col] !== null) {
    throw new Error('Cell is already occupied');
  }

  const newBoard = board.map(r => [...r]);
  newBoard[row][col] = tile;

  let scoreGained = 0;

  // Placement Score
  let placementScore = tile.level * 10;
  
  const neighbors = getNeighbors(newBoard, row, col);
  const isPolluted = neighbors.some(n => n && n.attribute === 'polar_bear');

  // シロクマが隣にいるとスコア無効化（自身がシロクマの場合を除く）
  if (tile.attribute !== 'polar_bear' && isPolluted) {
    placementScore = 0;
  }
  
  scoreGained += placementScore;

  const visited = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false));
  const cluster = findClusters(newBoard, row, col, tile.attribute, tile.level, visited);

  let clearedCells: { r: number; c: number }[] = [];

  if (cluster.length >= COMBO_THRESHOLD) {
    clearedCells = cluster;

    // 基本マージスコア: 繋がっているピース数 × レベル × 100
    let mergeScore = cluster.length * tile.level * 100;

    // シナジー適用（リスによるスコア底上げボーナス）
    const squirrelCount = neighbors.filter(n => n && n.attribute === 'squirrel').length;
    let multiplier = 1.0 + (squirrelCount * 0.2);

    // ペンギン特有のボーナス（5匹以上でボーナス加算）
    if (tile.attribute === 'penguin') {
      multiplier *= 1.0 + (cluster.length - 4) * 0.5;
    }

    mergeScore = mergeScore * multiplier;

    if (tile.attribute !== 'polar_bear' && isPolluted) {
      mergeScore = 0;
    }

    scoreGained += Math.floor(mergeScore) * comboMultiplier;

    // まずクラスターを全て消去
    for (const cell of clearedCells) {
      newBoard[cell.r][cell.c] = null;
    }

    // レベルが最大未満なら、最後に置いたマスに1段階上のタイルを生成
    if (tile.level < MAX_LEVEL) {
      const mergedTile: Tile = {
        ...tile,
        id: `merged-${Date.now()}-${row}-${col}`,
        level: tile.level + 1,
        justMerged: true,
      };
      newBoard[row][col] = mergedTile;
      clearedCells = clearedCells.filter(cell => cell.r !== row || cell.c !== col);

      // マージによって生成されたピースの配置スコアを加算
      let mergedPlacementScore = mergedTile.level * 10;
      if (mergedTile.attribute !== 'polar_bear' && isPolluted) {
        mergedPlacementScore = 0;
      }
      scoreGained += mergedPlacementScore;
    }
  }

  return { newBoard, clearedCells, scoreGained };
}

export function getNeighbors(board: BoardState, r: number, c: number): (Tile | null)[] {
  const neighbors: (Tile | null)[] = [];
  if (r > 0) neighbors.push(board[r - 1][c]);
  if (r < BOARD_SIZE - 1) neighbors.push(board[r + 1][c]);
  if (c > 0) neighbors.push(board[r][c - 1]);
  if (c < BOARD_SIZE - 1) neighbors.push(board[r][c + 1]);
  return neighbors;
}
