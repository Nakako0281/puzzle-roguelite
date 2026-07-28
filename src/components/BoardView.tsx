'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { BoardState } from '../domain/models/Board';
import { TileView } from './TileView';

interface BoardViewProps {
  board: BoardState;
  onCellClick: (row: number, col: number) => void;
  selectedCellForSwap?: { r: number; c: number };
}



export function BoardView({ board, onCellClick, selectedCellForSwap }: BoardViewProps) {
  return (
    <div className="bg-white/70 backdrop-blur-md p-2 md:p-4 rounded-xl shadow-2xl inline-block border border-white/60 shadow-sky-900/5">
      <div className="flex flex-col gap-1 md:gap-2">
        {board.map((row, rIndex) => (
          <div key={`row-${rIndex}`} className="flex gap-1 md:gap-2">
            {row.map((cell, cIndex) => {
              const isSelected = selectedCellForSwap?.r === rIndex && selectedCellForSwap?.c === cIndex;
              return (
                <div 
                  key={`cell-wrapper-${rIndex}-${cIndex}`} 
                  className="relative"
                >
                  <TileView 
                    attribute={cell?.attribute} 
                    level={cell?.level}
                    justMerged={cell?.justMerged}
                    empty={!cell}
                    selected={isSelected}
                    onClick={() => onCellClick(rIndex, cIndex)}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
