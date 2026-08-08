'use client';

import { motion } from 'framer-motion';
import { TileAttribute, ATTRIBUTE_NAMES } from '../domain/models/Tile';

interface TileViewProps {
  attribute?: TileAttribute;
  level?: number;
  justMerged?: boolean;
  onClick?: () => void;
  selected?: boolean;
  empty?: boolean;
}

const getGradient = (attribute: TileAttribute, level: number): string => {
  const gradients: Record<TileAttribute, string[]> = {
    seal: [
      '', // Lv0
      'from-cyan-200 to-blue-300', // Lv1 (Pale)
      'from-cyan-400 to-blue-500', // Lv2 (Normal)
      'from-cyan-600 to-blue-700', // Lv3 (Dark)
    ],
    penguin: [
      '', // Lv0
      'from-slate-100 to-indigo-200', // Lv1
      'from-slate-300 to-indigo-400', // Lv2
      'from-slate-500 to-indigo-600', // Lv3
    ],
    polar_bear: [
      '', // Lv0
      'from-gray-50 to-gray-200', // Lv1
      'from-gray-200 to-gray-400', // Lv2
      'from-gray-400 to-gray-600', // Lv3
    ],
    squirrel: [
      '', // Lv0
      'from-orange-200 to-amber-300', // Lv1
      'from-orange-400 to-amber-500', // Lv2
      'from-orange-600 to-amber-700', // Lv3
    ]
  };
  return gradients[attribute]?.[Math.min(level, 3)] || gradients[attribute]?.[1] || 'from-gray-200 to-gray-300';
};

const getTextColor = (attribute: TileAttribute, level: number): string => {
  if (attribute === 'polar_bear' && level < 3) {
    return 'text-slate-800';
  }
  if (attribute === 'penguin' && level < 2) {
    return 'text-slate-800';
  }
  if (attribute === 'seal' && level < 2) {
    return 'text-slate-800';
  }
  if (attribute === 'squirrel' && level < 2) {
    return 'text-slate-800';
  }
  return 'text-white';
};

const getImagePath = (attribute: TileAttribute, level: number): string => {
  if (attribute === 'seal' && level === 3) return '/images/seal_lv3.png';
  return `/images/${attribute}.png`;
};

export function TileView({ attribute, level = 1, justMerged, onClick, selected, empty }: TileViewProps) {
  if (empty || !attribute) {
    return (
      <div 
        onClick={onClick}
        className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-xl border border-sky-200 bg-sky-100/50 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-sky-200/50 transition-colors shadow-inner"
      />
    );
  }

  // レベルに応じた見た目の変化（枠線とグロウ効果）
  const levelStyles = [
    '', // Lv0
    'border border-white/40 shadow-[0_4px_10px_rgba(0,0,0,0.1)]', // Lv1
    'border-2 border-white/70 shadow-[0_0_15px_rgba(255,255,255,0.6)]', // Lv2
    'border-2 border-yellow-300 shadow-[0_0_25px_rgba(253,224,71,0.8)]', // Lv3
    'border-2 border-fuchsia-400 shadow-[0_0_35px_rgba(232,121,249,0.8)]', // Lv4
    'border-2 border-red-500 shadow-[0_0_50px_rgba(239,68,68,1)] animate-pulse', // Lv5
  ];

  const currentLevelStyle = levelStyles[Math.min(level, 3)] || levelStyles[1];
  
  // マージ直後のアニメーション
  const animateConfig = justMerged 
    ? { scale: [0.5, 1.2, 1], opacity: [0, 1, 1], rotate: [0, -5, 5, 0], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] }
    : { scale: 1, opacity: 1 };

  const transitionConfig = justMerged 
    ? { duration: 0.4, ease: "easeOut" as const }
    : undefined;

  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={animateConfig}
      transition={transitionConfig}
      exit={{ scale: 0.5, opacity: 0 }}
      onClick={onClick}
      className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-xl flex flex-col items-center justify-center font-bold cursor-pointer relative overflow-hidden
        ${getTextColor(attribute, level)} ${currentLevelStyle} ${selected ? 'ring-4 ring-white scale-110 z-10 shadow-2xl' : 'hover:scale-105 hover:brightness-110 transition-transform duration-200'}`}
      style={{
        boxShadow: selected ? undefined : 'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -4px 8px rgba(0,0,0,0.2), 0 4px 6px rgba(0,0,0,0.3)',
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(attribute, level)} pointer-events-none transition-all duration-300`} />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full p-1">
        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 mb-0.5 relative rounded-full overflow-hidden shadow-inner border border-white/20 bg-white/20">
          {/* Using next/img or just standard img */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={getImagePath(attribute, level)} 
            alt={ATTRIBUTE_NAMES[attribute]} 
            className="w-full h-full object-cover scale-110"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>
        <span className="text-[0.60rem] md:text-[0.70rem] font-black tracking-wider drop-shadow-md leading-tight text-center">
          {ATTRIBUTE_NAMES[attribute]}
        </span>
      </div>
    </motion.div>
  );
}
