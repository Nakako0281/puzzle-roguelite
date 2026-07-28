import { MetaProgression, INITIAL_META_PROGRESSION } from '../../domain/models/MetaProgression';

const META_STORAGE_KEY = 'banjo_sandan_meta';

export const GameRepository = {
  loadMetaProgression: (): MetaProgression => {
    if (typeof window === 'undefined') return INITIAL_META_PROGRESSION;
    try {
      const stored = localStorage.getItem(META_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load meta progression', e);
    }
    return INITIAL_META_PROGRESSION;
  },

  saveMetaProgression: (meta: MetaProgression): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(META_STORAGE_KEY, JSON.stringify(meta));
    } catch (e) {
      console.warn('Failed to save meta progression', e);
    }
  }
};
