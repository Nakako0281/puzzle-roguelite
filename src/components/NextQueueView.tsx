'use client';

import { Tile } from '../domain/models/Tile';
import { TileView } from './TileView';
import { motion, AnimatePresence } from 'framer-motion';

interface NextQueueViewProps {
  queue: Tile[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function NextQueueView({ queue, selectedIndex, onSelect }: NextQueueViewProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-slate-500 font-bold text-sm uppercase tracking-widest">Next</h2>
      <div className="flex gap-4 p-4 bg-white/80 backdrop-blur-md rounded-xl border border-white/60 shadow-xl shadow-sky-900/5">
        <AnimatePresence mode="popLayout">
          {queue.map((tile, index) => (
            <motion.div
              key={tile.id}
              layout
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="relative"
            >
              <TileView
                attribute={tile.attribute}
                level={tile.level}
                selected={selectedIndex === index}
                onClick={() => onSelect(index)}
              />
              {/* index 0 indicator if we wanted to enforce order, but player can pick any */}
            </motion.div>
          ))}
        </AnimatePresence>
        {Array.from({ length: Math.max(0, 3 - queue.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded border-2 border-sky-200 bg-sky-50 opacity-50" />
        ))}
      </div>
      <p className="text-slate-500 text-xs mt-1">配置するタイルを選択してください</p>
    </div>
  );
}
