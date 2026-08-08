'use client';
import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import confetti from 'canvas-confetti';
import { BoardState } from '../domain/models/Board';

interface ScoreViewProps {
  score: number;
  comboMultiplier: number;
  board: BoardState;
}

export function ScoreView({ score, comboMultiplier, board }: ScoreViewProps) {
  const controls = useAnimation();
  const comboControls = useAnimation();
  const prevScoreRef = useRef(score);

  useEffect(() => {
    if (score > prevScoreRef.current) {
      // 盤面にマージされたピースの最大レベルを取得
      let maxMergedLevel = 0;
      board.forEach(row => {
        row.forEach(cell => {
          if (cell && cell.justMerged) {
            maxMergedLevel = Math.max(maxMergedLevel, cell.level);
          }
        });
      });

      if (maxMergedLevel > 0) {
        // レベル3以上への進化ならエフェクト2倍
        const isHighLevelMerge = maxMergedLevel >= 3;
        const particleCount = isHighLevelMerge ? 300 : 150;
        const spread = isHighLevelMerge ? 120 : 70;
        const scaleEffect = isHighLevelMerge ? [1, 2, 1] : [1, 1.5, 1];

        // マージ発生時（4つ以上つながった時など）の豪華なエフェクト
        controls.start({
          scale: scaleEffect,
          color: ['#1e293b', '#f59e0b', '#1e293b'], // text-slate-800 -> amber-500 -> text-slate-800
          transition: { duration: 0.5, ease: "easeInOut" }
        });
        
        // 脳汁が出る紙吹雪エフェクト
        confetti({
          particleCount: particleCount,
          spread: spread,
          origin: { y: 0.5, x: 0.8 }, // 右側のScoreViewあたりから出す
          colors: ['#fbbf24', '#f87171', '#60a5fa', '#34d399'],
          zIndex: 100,
        });

        // コンボが繋がっている時はコンボも跳ねる
        if (comboMultiplier > 1) {
          comboControls.start({
            scale: [1, 1.8, 1],
            rotate: [0, 10, -10, 0],
            transition: { duration: 0.5, ease: "easeInOut" }
          });
        }
      } else {
        // 通常の配置時のエフェクト
        controls.start({
          scale: [1, 1.2, 1],
          transition: { duration: 0.3, ease: "easeInOut" }
        });
      }
    }
    prevScoreRef.current = score;
  }, [score, board, comboMultiplier, controls, comboControls]);

  return (
    <div className="flex flex-row md:flex-col justify-between md:justify-start gap-4 p-4 bg-white/80 backdrop-blur-md rounded-xl border border-white/60 shadow-xl shadow-sky-900/5 w-full">
      <div className="flex flex-col">
        <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Score</span>
        <motion.span 
          animate={controls}
          className="font-mono text-2xl md:text-4xl font-bold text-slate-800 origin-left md:origin-center"
        >
          {score.toLocaleString()}
        </motion.span>
      </div>
      
      {comboMultiplier > 1 && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-end md:items-start"
        >
          <span className="text-amber-500 font-bold text-xs uppercase tracking-widest">Combo</span>
          <motion.span 
            animate={comboControls}
            className="font-mono text-xl md:text-3xl font-bold text-amber-500 origin-right md:origin-left"
          >
            x{comboMultiplier}
          </motion.span>
        </motion.div>
      )}
    </div>
  );
}
