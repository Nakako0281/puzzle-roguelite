'use client';
import { BoardState } from '../domain/models/Board';
interface ScoreViewProps {
  score: number;
  comboMultiplier: number;
  board: BoardState;
}

export function ScoreView({ score, comboMultiplier, board }: ScoreViewProps) {
  return (
    <div className="flex flex-row md:flex-col justify-between md:justify-start gap-4 p-4 bg-white/80 backdrop-blur-md rounded-xl border border-white/60 shadow-xl shadow-sky-900/5 w-full">
      <div className="flex flex-col">
        <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Score</span>
        <span className="font-mono text-2xl md:text-4xl font-bold text-slate-800">
          {score.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
