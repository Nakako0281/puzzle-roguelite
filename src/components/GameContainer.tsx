'use client';

import { useState, useEffect, useRef } from 'react';
import { useGameController } from '../adapters/controllers/useGameController';
import { useSound } from '../hooks/useSound';
import { BoardView } from './BoardView';
import { NextQueueView } from './NextQueueView';
import { RulePanel } from './RulePanel';
import { ScoreView } from './ScoreView';
import { RuleModal } from './RuleModal';
import { MenuModal } from './MenuModal';
import { WildcardType } from '../domain/models/Wildcard';
import { ATTRIBUTES } from '../domain/models/Tile';
import { Info, Volume2, VolumeX, Volume1, Menu } from 'lucide-react';
import { Howler } from 'howler';

export function GameContainer() {
  const { gameState, metaState, startGame, placeTile, useWildcard, returnToTitle } = useGameController();
  const [selectedQueueIndex, setSelectedQueueIndex] = useState(0);
  const [activeWildcard, setActiveWildcard] = useState<WildcardType | undefined>(undefined);
  const [swapFirstCell, setSwapFirstCell] = useState<{r: number, c: number} | undefined>(undefined);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  const { playSound, playBGM } = useSound();
  const prevScoreRef = useRef(0);

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    Howler.volume(volume);
  }, [volume]);

  useEffect(() => {
    Howler.mute(isMuted);
  }, [isMuted]);

  useEffect(() => {
    if (!gameState) {
      playBGM('title');
    } else {
      playBGM('battle');
    }
  }, [gameState, playBGM]);

  useEffect(() => {
    if (gameState) {
      // 盤面にマージされたばかりのピースがあるかチェック
      const hasMerged = gameState.board.some(row => 
        row.some(cell => cell && cell.justMerged)
      );
      if (hasMerged) {
        playSound('match');
      }
    }
  }, [gameState, playSound]);

  if (!gameState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
          盤上算段(仮)
        </h1>
        <p className="mb-8 text-slate-500">戦略パズル・ローグライト</p>
        
        {metaState && (
          <div className="mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-bold text-slate-700 mb-2">メタプログレッション</h2>
            <p className="text-slate-600">累計ポイント: <span className="text-amber-500 font-bold">{metaState.totalPoints}</span></p>
            <p className="text-slate-600">ベストスコア: <span className="text-slate-800 font-bold">{metaState.bestScore}</span></p>
          </div>
        )}

        <div className="flex gap-4">
          <button 
            onClick={startGame}
            className="px-8 py-4 bg-sky-500 hover:bg-sky-400 rounded-full text-white font-bold text-xl shadow-lg shadow-sky-200 transition-transform hover:scale-105"
          >
            ゲーム開始
          </button>
          <button 
            onClick={() => setIsRuleModalOpen(true)}
            className="p-4 bg-white hover:bg-slate-50 rounded-full text-slate-600 border border-slate-200 shadow-lg transition-transform hover:scale-105 flex items-center justify-center"
            title="遊び方"
          >
            <Info size={28} />
          </button>
        </div>

        <RuleModal isOpen={isRuleModalOpen} onClose={() => setIsRuleModalOpen(false)} />
      </div>
    );
  }

  const handleCellClick = (r: number, c: number) => {
    if (activeWildcard) {
      if (activeWildcard === 'swap') {
        if (!swapFirstCell) {
          setSwapFirstCell({ r, c });
          playSound('select');
        } else {
          useWildcard('swap', { r1: swapFirstCell.r, c1: swapFirstCell.c, r2: r, c2: c });
          playSound('swap');
          setActiveWildcard(undefined);
          setSwapFirstCell(undefined);
        }
      } else if (activeWildcard === 'clearArea') {
        useWildcard('clearArea', { r, c });
        playSound('match');
        setActiveWildcard(undefined);
      } else if (activeWildcard === 'changeAttribute') {
        // Just cycle to next attribute for simplicity in UI
        const currentTile = gameState.board[r][c];
        if (currentTile) {
          const idx = ATTRIBUTES.indexOf(currentTile.attribute);
          const nextAttr = ATTRIBUTES[(idx + 1) % ATTRIBUTES.length];
          useWildcard('changeAttribute', { r, c, newAttribute: nextAttr });
        }
        setActiveWildcard(undefined);
      }
    } else {
      // Normal placement
      if (gameState.board[r][c] === null) {
        placeTile(r, c, selectedQueueIndex);
        playSound('land');
        setSelectedQueueIndex(0); // Reset selection
      }
    }
  };

  const handleWildcardUse = (type: WildcardType) => {
    if (type === 'doubleScore') {
      useWildcard('doubleScore');
    } else {
      if (activeWildcard === type) {
        setActiveWildcard(undefined);
        setSwapFirstCell(undefined);
      } else {
        setActiveWildcard(type);
        setSwapFirstCell(undefined);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-100 p-4 md:p-8 flex flex-col items-center font-sans">
      <div className="max-w-6xl w-full flex justify-between items-center mb-4 md:mb-6 px-2">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">盤上算段(仮)</h1>
        
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1 md:gap-2 bg-white/80 backdrop-blur-sm px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-slate-200 shadow-sm">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-500 hover:text-sky-500 transition-colors p-1"
              title={isMuted ? "ミュート解除" : "ミュート"}
            >
              {isMuted || volume === 0 ? <VolumeX size={20} /> : volume < 0.5 ? <Volume1 size={20} /> : <Volume2 size={20} />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setVolume(val);
                if (val > 0 && isMuted) {
                  setIsMuted(false);
                } else if (val === 0 && !isMuted) {
                  setIsMuted(true);
                }
              }}
              className="w-16 md:w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>
          <button 
            onClick={() => setIsRuleModalOpen(true)}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 hover:bg-white transition-colors shadow-sm"
            title="遊び方"
          >
            <Info size={20} />
          </button>
          <button 
            onClick={() => setIsMenuModalOpen(true)}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 hover:bg-white transition-colors shadow-sm"
            title="メニュー"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Rules */}
        <div className="md:col-span-3 order-2 md:order-1 h-full relative z-20">
          <RulePanel />
        </div>

        {/* Center Column: Board and Next */}
        <div className="md:col-span-7 flex flex-col items-center order-1 md:order-2 z-10">
          <div className="mb-6">
            <NextQueueView 
              queue={gameState.nextQueue} 
              selectedIndex={selectedQueueIndex} 
              onSelect={(i) => !activeWildcard && setSelectedQueueIndex(i)} 
            />
          </div>
          <BoardView 
            board={gameState.board} 
            onCellClick={handleCellClick} 
            selectedCellForSwap={swapFirstCell}
          />
        </div>

        {/* Right Column: Score & Status */}
        <div className="md:col-span-2 order-3">
          <ScoreView 
            score={gameState.score} 
            comboMultiplier={gameState.comboMultiplier} 
            board={gameState.board}
          />
        </div>
      </div>

      {/* Game Over Modal overlay */}
      {gameState.status === 'gameOver' && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl border border-sky-100 flex flex-col items-center shadow-2xl shadow-sky-900/10">
            <h2 className="text-4xl font-bold text-slate-800 mb-2">ゲーム終了</h2>
            <p className="text-slate-500 mb-6">
              盤面が埋まりました
            </p>
            
            <div className="text-center mb-8">
              <p className="text-slate-400 text-sm uppercase">Final Score</p>
              <p className="text-5xl font-mono text-amber-500 font-bold">{gameState.score}</p>
            </div>

            <button 
              onClick={returnToTitle}
              className="px-6 py-3 bg-sky-500 hover:bg-sky-400 rounded-full text-white font-bold shadow-md shadow-sky-200"
            >
              タイトルへ戻る
            </button>
          </div>
        </div>
      )}

      <RuleModal isOpen={isRuleModalOpen} onClose={() => setIsRuleModalOpen(false)} />
      <MenuModal 
        isOpen={isMenuModalOpen} 
        onClose={() => setIsMenuModalOpen(false)} 
        onRetry={startGame}
        onReturnToTitle={returnToTitle}
      />
    </div>
  );
}
