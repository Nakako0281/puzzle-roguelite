import { useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';

type SoundKey = 
  | 'select'
  | 'swap'
  | 'invalid'
  | 'match'
  | 'land';

type BgmKey = 'title' | 'battle';

const SOUND_FILES: Record<SoundKey, string> = {
  select: '/sounds/se_piece_select.mp3',
  swap: '/sounds/se_piece_swap.mp3',
  invalid: '/sounds/se_piece_invalid.mp3',
  match: '/sounds/se_piece_match.mp3',
  land: '/sounds/se_piece_land.mp3',
};

const BGM_FILES: Record<BgmKey, string> = {
  title: '/sounds/bgm_title.mp3',
  battle: '/sounds/bgm_battle.mp3',
};

export function useSound() {
  const soundsRef = useRef<Partial<Record<SoundKey, Howl>>>({});
  const bgmsRef = useRef<Partial<Record<BgmKey, Howl>>>({});
  const currentBgmRef = useRef<BgmKey | null>(null);

  useEffect(() => {
    // SEのプリロード
    Object.entries(SOUND_FILES).forEach(([key, src]) => {
      soundsRef.current[key as SoundKey] = new Howl({
        src: [src],
        volume: 0.5,
        onloaderror: (id, err) => console.warn(`Sound load error (${src}):`, err),
      });
    });

    // BGMのプリロード
    Object.entries(BGM_FILES).forEach(([key, src]) => {
      bgmsRef.current[key as BgmKey] = new Howl({
        src: [src],
        volume: 0.3,
        loop: true,
        onloaderror: (id, err) => console.warn(`BGM load error (${src}):`, err),
      });
    });

    return () => {
      // アンマウント時にすべて停止・破棄
      Object.values(soundsRef.current).forEach((howl) => howl?.unload());
      Object.values(bgmsRef.current).forEach((howl) => howl?.unload());
    };
  }, []);

  const playSound = useCallback((key: SoundKey) => {
    soundsRef.current[key]?.play();
  }, []);

  const playBGM = useCallback((key: BgmKey) => {
    if (currentBgmRef.current === key) return; // 既に鳴っている場合はスキップ

    // 現在鳴っているBGMをフェードアウトして止める
    if (currentBgmRef.current) {
      const currentHowl = bgmsRef.current[currentBgmRef.current];
      if (currentHowl) {
        currentHowl.fade(currentHowl.volume(), 0, 500);
        setTimeout(() => currentHowl.stop(), 500);
      }
    }

    // 新しいBGMをフェードインして鳴らす
    const newHowl = bgmsRef.current[key];
    if (newHowl) {
      newHowl.volume(0);
      newHowl.play();
      newHowl.fade(0, 0.3, 500);
    }

    currentBgmRef.current = key;
  }, []);

  const stopBGM = useCallback(() => {
    if (currentBgmRef.current) {
      const currentHowl = bgmsRef.current[currentBgmRef.current];
      if (currentHowl) {
        currentHowl.fade(currentHowl.volume(), 0, 500);
        setTimeout(() => currentHowl.stop(), 500);
      }
      currentBgmRef.current = null;
    }
  }, []);

  return { playSound, playBGM, stopBGM };
}
