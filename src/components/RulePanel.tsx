'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function RulePanel() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-8 top-2 bg-white text-slate-600 p-2 rounded-r-lg border border-slate-200 shadow-lg z-20 hover:bg-slate-50 hover:text-slate-800 transition-colors flex items-center justify-center"
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl border border-white/60 shadow-xl shadow-sky-900/5 w-64 h-full">
              <h3 className="text-slate-800 font-bold mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Info size={16} className="text-indigo-500" />
                動物たちの相性
              </h3>
              
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-sky-100 flex items-center justify-center border border-sky-200 mt-0.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/seal.png" alt="Seal" className="w-full h-full object-cover scale-110" style={{ mixBlendMode: 'multiply' }} />
                  </div>
                  <div>
                    <span className="font-bold text-cyan-600 block">アザラシ（基本）</span>
                    <span className="text-xs">特殊な能力を持たないスタンダードな動物。まずはアザラシをつなげてみよう！</span>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-sky-100 flex items-center justify-center border border-sky-200 mt-0.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/penguin.png" alt="Penguin" className="w-full h-full object-cover scale-110" style={{ mixBlendMode: 'multiply' }} />
                  </div>
                  <div>
                    <span className="font-bold text-indigo-600 block">ペンギン（大群ボーナス）</span>
                    <span className="text-xs">5匹以上つなげて進化させると、繋がった数に応じてスコアが大きくアップ！</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-sky-100 flex items-center justify-center border border-sky-200 mt-0.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/polar_bear.png" alt="Polar Bear" className="w-full h-full object-cover scale-110" style={{ mixBlendMode: 'multiply' }} />
                  </div>
                  <div>
                    <span className="font-bold text-gray-600 block">シロクマ（お邪魔）</span>
                    <span className="text-xs">隣に他の動物を置いたり進化させたりすると、スコアが0点になってしまう。</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-sky-100 flex items-center justify-center border border-sky-200 mt-0.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/squirrel.png" alt="Squirrel" className="w-full h-full object-cover scale-110" style={{ mixBlendMode: 'multiply' }} />
                  </div>
                  <div>
                    <span className="font-bold text-amber-600 block">リス（サポート）</span>
                    <span className="text-xs">隣で動物が進化すると、スコアをアップ（1匹につき+20%）してくれる頼もしい味方。</span>
                  </div>
                </li>
              </ul>
              
              <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500">
                <span className="font-bold text-amber-600 block mb-1">【基本ルール】</span>
                ・配置時にLv×10点<br/>
                ・同じ動物を4つくっつけると進化！<br/>
                ・進化時：(個数)×(Lv)×100点
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
