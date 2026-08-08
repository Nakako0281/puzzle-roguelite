import { Tile, TileAttribute, MAX_LEVEL } from './Tile';

export const BOARD_SIZE = 5;
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
  scorePopups: { r: number; c: number; score: number; id: string }[];
}

export function placeTile(board: BoardState, row: number, col: number, tile: Tile, comboMultiplier: number = 1): PlaceResult {
  if (board[row][col] !== null) {
    throw new Error('Cell is already occupied');
  }

  const newBoard = board.map(r => [...r]);
  newBoard[row][col] = tile;

  let totalScoreGained = 0;
  let allClearedCells: { r: number; c: number }[] = [];
  const scorePopups: { r: number; c: number; score: number; id: string }[] = [];

  // Placement Score
  let placementScore = tile.level * 10;
  if (tile.attribute === 'polar_bear') {
    placementScore = tile.level * 15;
  }

  totalScoreGained += placementScore;
  if (placementScore > 0) {
    scorePopups.push({ r: row, c: col, score: placementScore, id: `pop-place-${Date.now()}-${Math.random()}` });
  }

  let currentComboMultiplier = comboMultiplier;

  // 連鎖（カスケード）処理用のキュー
  const queue = [{ r: row, c: col, currentTile: tile }];

  while (queue.length > 0) {
    const { r, c, currentTile } = queue.shift()!;

    // 別の連鎖で消去済みでないか確認
    if (newBoard[r][c]?.id !== currentTile.id) continue;

    const visited = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false));
    const cluster = findClusters(newBoard, r, c, currentTile.attribute, currentTile.level, visited);

    if (cluster.length >= COMBO_THRESHOLD) {
      allClearedCells.push(...cluster);

      // 基本マージスコア: 繋がっているピース数 × レベル × 100
      let mergeScore = cluster.length * currentTile.level * 100;

      let multiplier = 1.0;

      // ペンギン特有のボーナス（5匹以上でボーナス加算）
      if (currentTile.attribute === 'penguin') {
        multiplier *= 1.0 + (cluster.length - 4) * 0.5;
      }

      mergeScore = mergeScore * multiplier;

      const finalMergeScore = Math.floor(mergeScore) * currentComboMultiplier;
      totalScoreGained += finalMergeScore;
      if (finalMergeScore > 0) {
        scorePopups.push({ r, c, score: finalMergeScore, id: `pop-merge-${Date.now()}-${r}-${c}-${Math.random()}` });
      }

      // まずクラスターを全て消去
      for (const cell of cluster) {
        newBoard[cell.r][cell.c] = null;
      }

      // レベルが最大未満なら、最後に置いたマスに1段階上のタイルを生成
      if (currentTile.level < MAX_LEVEL) {
        const mergedTile: Tile = {
          ...currentTile,
          id: `merged-${Date.now()}-${r}-${c}-${currentTile.level + 1}`,
          level: currentTile.level + 1,
          justMerged: true,
        };
        newBoard[r][c] = mergedTile;
        allClearedCells = allClearedCells.filter(cell => cell.r !== r || cell.c !== c);

        // マージによって生成されたピースの配置スコアを加算
        let mergedPlacementScore = mergedTile.level * 10;
        if (mergedTile.attribute === 'polar_bear') {
          mergedPlacementScore = mergedTile.level * 15;
        }
        totalScoreGained += mergedPlacementScore;
        if (mergedPlacementScore > 0) {
          // 同じマスでマージスコアと発生する可能性があるため、少しユニークIDと描画位置を分けると良いが、今回はそのまま追加
          scorePopups.push({ r, c, score: mergedPlacementScore, id: `pop-merged-place-${Date.now()}-${r}-${c}-${Math.random()}` });
        }

        // 進化したタイルがさらに連鎖を起こすかチェック
        queue.push({ r, c, currentTile: mergedTile });

        currentComboMultiplier++;
      }
    }
  }

  return { newBoard, clearedCells: allClearedCells, scoreGained: totalScoreGained, scorePopups };
}

export function getNeighbors(board: BoardState, r: number, c: number): (Tile | null)[] {
  const neighbors: (Tile | null)[] = [];
  if (r > 0) neighbors.push(board[r - 1][c]);
  if (r < BOARD_SIZE - 1) neighbors.push(board[r + 1][c]);
  if (c > 0) neighbors.push(board[r][c - 1]);
  if (c < BOARD_SIZE - 1) neighbors.push(board[r][c + 1]);
  return neighbors;
}
