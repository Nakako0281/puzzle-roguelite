'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { BoardState } from '../domain/models/Board';
import { TileView } from './TileView';

interface BoardViewProps {
  board: BoardState;
  onCellClick: (row: number, col: number) => void;
  selectedCellForSwap?: { r: number; c: number };
  scorePopups?: { r: number; c: number; score: number; id: string }[];
}



export function BoardView({ board, onCellClick, selectedCellForSwap, scorePopups }: BoardViewProps) {
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
                  <AnimatePresence>
                    {scorePopups?.filter(p => p.r === rIndex && p.c === cIndex).map((popup, i) => (
                      <motion.div
                        key={popup.id}
                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                        animate={{ opacity: 1, y: -40 - (i * 20), scale: 1.2 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
                      >
                        <span className="text-amber-400 font-black text-xl md:text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" style={{ textShadow: "0px 2px 4px rgba(0,0,0,1), 0px 0px 2px rgba(0,0,0,0.8)" }}>
                          +{popup.score}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
