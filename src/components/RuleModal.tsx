'use client';

import { Info, X, BookOpen, Gamepad2 } from 'lucide-react';
import { useState } from 'react';

interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RuleModal({ isOpen, onClose }: RuleModalProps) {
  const [activeTab, setActiveTab] = useState<'rules' | 'pieces'>('rules');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-sky-100 shadow-2xl shadow-sky-900/10 max-w-lg w-full relative overflow-hidden flex flex-col h-[75vh] md:h-[600px]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <Info className="text-indigo-500" size={28} />
          <h2 className="text-2xl font-bold text-slate-800">遊び方・ルール</h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-slate-200 shrink-0">
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-4 py-2 font-bold text-sm md:text-base border-b-2 transition-colors whitespace-nowrap flex-1 ${activeTab === 'rules' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <Gamepad2 size={18} />
            基本ルール
          </button>
          <button
            onClick={() => setActiveTab('pieces')}
            className={`flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-4 py-2 font-bold text-sm md:text-base border-b-2 transition-colors whitespace-nowrap flex-1 ${activeTab === 'pieces' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <BookOpen size={18} />
            動物（ピース）図鑑
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 pr-2 space-y-6 text-slate-600 text-sm md:text-base leading-relaxed">
          {activeTab === 'rules' && (
            <>
              <section>
                <h3 className="text-indigo-600 font-bold mb-2 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                  基本ルール
                </h3>
                <p>
                  盤面の空いているマスにタイルを配置してスコアを稼ぎましょう。<br/>
                  手札はランダムではなく、常に見えている「Next」の3枚から<strong>好きなタイルを選んで</strong>配置できます。
                </p>
              </section>

              <section>
                <h3 className="text-indigo-600 font-bold mb-2 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                  コンボと消去
                </h3>
                <p>
                  同じ属性のタイルが<strong>縦または横に4つ以上</strong>繋がると「コンボ」となり、そのタイル群が消滅してスコアを獲得します。<br/>
                  大きく繋げてから消すほど高得点になります。
                </p>
              </section>
              
              <section className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-700 mb-2 text-sm">【得点の仕組み】</h4>
                <ul className="text-sm space-y-1 text-slate-600 list-disc list-inside">
                  <li>配置時：レベル × 10点</li>
                  <li>消去時：(消した個数) × (レベル) × 100点</li>
                </ul>
              </section>
            </>
          )}

          {activeTab === 'pieces' && (
            <div className="space-y-6">
              <p className="text-sm text-slate-500 mb-4">登場する動物たちの特徴を覚えて、高スコアを目指しましょう！</p>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4 p-4 bg-sky-50/50 rounded-xl border border-sky-100">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-sky-100 flex items-center justify-center border border-sky-200 mt-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/seal.png" alt="Seal" className="w-full h-full object-cover scale-110" style={{ mixBlendMode: 'multiply' }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-cyan-700 text-base mb-1">アザラシ（基本）</h4>
                    <p className="text-sm text-slate-600">特殊な能力を持たないスタンダードな動物。まずはアザラシをつなげて消去の基本を覚えよう！</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-indigo-100 flex items-center justify-center border border-indigo-200 mt-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/penguin.png" alt="Penguin" className="w-full h-full object-cover scale-110" style={{ mixBlendMode: 'multiply' }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-indigo-700 text-base mb-1">ペンギン（大群ボーナス）</h4>
                    <p className="text-sm text-slate-600">たくさん繋げるほど強い！5匹以上つなげて消去すると、繋がった数に応じてスコアが大きくアップするよ。</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-100/50 rounded-xl border border-slate-200">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-200 flex items-center justify-center border border-slate-300 mt-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/polar_bear.png" alt="Polar Bear" className="w-full h-full object-cover scale-110" style={{ mixBlendMode: 'multiply' }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-700 text-base mb-1">シロクマ（高スコア）</h4>
                    <p className="text-sm text-slate-600">配置した時の基本スコアが通常の1.5倍もらえるおトクな動物！</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 text-center border-t border-slate-100 shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 rounded-full text-white font-bold w-full md:w-auto min-w-[120px] shadow-md shadow-sky-200 transition-transform active:scale-95"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
