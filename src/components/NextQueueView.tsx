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
  const activeTile = queue[selectedIndex];
  
  // 選択されていないタイルたち
  const reserveTiles = queue
    .map((tile, index) => ({ tile, index }))
    .filter((_, index) => index !== selectedIndex);

  // ピタッと止まるキレのあるアニメーション設定
  const snappyTransition = { duration: 0.15, ease: "easeOut" };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-6 md:gap-8">
        
        {/* NEXT Box (Active) */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-black text-sky-600 mb-2 tracking-widest uppercase bg-sky-100 px-3 py-0.5 rounded-full shadow-sm">
            NEXT
          </div>
          <div className="relative p-4 bg-white/95 backdrop-blur-md rounded-2xl border-4 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.5)] flex items-center justify-center min-w-[80px] min-h-[80px]">
            <AnimatePresence mode="popLayout">
              {activeTile && (
                <motion.div
                  key={activeTile.id}
                  layoutId={`tile-${activeTile.id}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={snappyTransition}
                  className="z-10 scale-110 origin-center"
                >
                  <TileView
                    attribute={activeTile.attribute}
                    level={activeTile.level}
                    selected={false}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {!activeTile && (
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded border-2 border-sky-200 border-dashed bg-sky-50/50 opacity-50" />
            )}
          </div>
        </div>

        {/* STOCK Box (Reserve) */}
        <div className="flex flex-col items-center">
          <div className="text-[10px] font-bold text-slate-400 mb-2 tracking-widest uppercase">
            STOCK (Click to swap)
          </div>
          <div className="flex gap-3 p-3 bg-slate-100/80 backdrop-blur-sm rounded-xl border-2 border-slate-200 shadow-inner min-w-[120px] min-h-[70px] items-center justify-center">
            <AnimatePresence mode="popLayout">
              {reserveTiles.map(({ tile, index }) => (
                <motion.div
                  key={tile.id}
                  layoutId={`tile-${tile.id}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={snappyTransition}
                  onClick={() => onSelect(index)}
                  className="cursor-pointer scale-85 origin-center hover:scale-95 active:scale-90 transition-transform"
                >
                  <TileView
                    attribute={tile.attribute}
                    level={tile.level}
                    selected={false}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* 空枠の描画 */}
            {Array.from({ length: Math.max(0, 2 - reserveTiles.length) }).map((_, i) => (
              <div 
                key={`empty-reserve-${i}`} 
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded border-2 border-slate-300 border-dashed bg-slate-50/50 opacity-50 scale-85 origin-center" 
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
