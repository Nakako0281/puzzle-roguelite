import { useState, useCallback, useEffect } from 'react';
import { GameState, createInitialGameState } from '../../domain/models/GameState';
import { executePlaceTile } from '../../usecases/PlaceTileUseCase';
import { executeUseWildcard } from '../../usecases/UseWildcardUseCase';
import { executeUseSkill } from '../../usecases/UseSkillUseCase';
import { executeEndRun } from '../../usecases/EndRunUseCase';
import { WildcardType } from '../../domain/models/Wildcard';
import { GameRepository } from '../repositories/GameRepository';
import { MetaProgression } from '../../domain/models/MetaProgression';

export function useGameController() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [metaState, setMetaState] = useState<MetaProgression | null>(null);

  useEffect(() => {
    setMetaState(GameRepository.loadMetaProgression());
  }, []);

  // スコアポップアップを一定時間後にクリアする
  useEffect(() => {
    if (gameState?.scorePopups && gameState.scorePopups.length > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => prev ? { ...prev, scorePopups: [] } : prev);
      }, 600); // アニメーションの完了を待ってからクリア
      return () => clearTimeout(timer);
    }
  }, [gameState?.scorePopups]);

  const startGame = useCallback(() => {
    setGameState(createInitialGameState());
  }, []);

  const placeTile = useCallback((row: number, col: number, tileIndex: number) => {
    setGameState(prev => {
      if (!prev) return prev;
      const nextState = executePlaceTile(prev, row, col, tileIndex);
      if (nextState.status === 'gameOver' && metaState) {
        // Game just ended, update meta
        const newMeta = executeEndRun(nextState, metaState);
        setMetaState(newMeta);
        GameRepository.saveMetaProgression(newMeta);
      }
      return nextState;
    });
  }, [metaState]);

  const useWildcard = useCallback((wildcardType: WildcardType, payload?: any) => {
    setGameState(prev => {
      if (!prev) return prev;
      return executeUseWildcard(prev, wildcardType, payload);
    });
  }, []);

  const useSkill = useCallback((payload?: any) => {
    setGameState(prev => {
      if (!prev) return prev;
      return executeUseSkill(prev, payload);
    });
  }, []);

  const returnToTitle = useCallback(() => {
    setGameState(null);
  }, []);

  return {
    gameState,
    metaState,
    startGame,
    placeTile,
    useWildcard,
    useSkill,
    returnToTitle
  };
}
