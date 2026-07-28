'use client';

import { Wildcard, WILDCARD_NAMES, WildcardType } from '../domain/models/Wildcard';

interface WildcardsViewProps {
  wildcards: Record<string, Wildcard>;
  onUse: (type: WildcardType) => void;
  activeWildcard?: WildcardType;
}

export function WildcardsView({ wildcards, onUse, activeWildcard }: WildcardsViewProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-slate-400 font-bold text-sm uppercase tracking-widest text-center">Wildcards</h2>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
        {Object.values(wildcards).map((wc) => {
          const type = wc.type as WildcardType;
          const isActive = activeWildcard === type;
          const isDisabled = wc.remainingUses <= 0;

          return (
            <button
              key={type}
              onClick={() => !isDisabled && onUse(type)}
              disabled={isDisabled}
              className={`p-3 rounded-lg flex flex-col items-center justify-center transition-all
                ${isActive ? 'bg-indigo-600 ring-2 ring-indigo-400 scale-105' : ''}
                ${isDisabled ? 'bg-slate-800 opacity-50 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-600 cursor-pointer shadow-lg'}
              `}
            >
              <span className="text-white font-bold text-sm">{WILDCARD_NAMES[type]}</span>
              <div className="flex gap-1 mt-1">
                {Array.from({ length: wc.maxUses }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i < wc.remainingUses ? 'bg-indigo-300' : 'bg-slate-900'}`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
