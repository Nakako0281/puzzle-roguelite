'use client';

import { Info, X } from 'lucide-react';

interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RuleModal({ isOpen, onClose }: RuleModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-sky-100 shadow-2xl shadow-sky-900/10 max-w-lg w-full relative overflow-y-auto max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <Info className="text-indigo-500" size={28} />
          <h2 className="text-2xl font-bold text-slate-800">遊び方・ルール</h2>
        </div>
        
        <div className="space-y-6 text-slate-600 text-sm md:text-base leading-relaxed">
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

          <section>
            <h3 className="text-indigo-600 font-bold mb-2 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
              ワイルドカード
            </h3>
            <p>
              画面左側のワイルドカード（特殊アクション）を使うことで、ピンチを切り抜けられます。
              各アクションには<strong>1プレイ中の使用回数制限</strong>があるため、ここぞというタイミングで使いましょう。
            </p>
          </section>

          <section>
            <h3 className="text-indigo-600 font-bold mb-2 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
              終了条件
            </h3>
            <p>
              有限の<strong>デッキ（山札）がすべて尽きる</strong>か、<strong>盤面にタイルが置けなくなる</strong>とゲームオーバー（ラン終了）です。<br/>
              終了時のスコアに応じて獲得したポイントは、次回のプレイに持ち越されます（メタプログレッション）。
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-sky-500 hover:bg-sky-400 rounded-full text-white font-bold w-full md:w-auto shadow-md shadow-sky-200"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
