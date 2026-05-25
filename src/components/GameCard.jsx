/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import * as Icons from 'lucide-react';

export const GameCard = ({
  game,
  isFavorite,
  onToggleFavorite,
  onPlayGame,
  playCount,
  ratingValue,
}) => {
  // Dynamically resolve custom or default lucide icons safely
  const getIcon = (name) => {
    if (name && name in Icons) {
      const IconComponent = Icons[name];
      return <IconComponent className="h-6 w-6" />;
    }
    return <Icons.Gamepad2 className="h-6 w-6" />;
  };

  // Assign neon colors based on the category for vibrant visual identity
  const getCategoryTheme = (category) => {
    switch (category) {
      case 'Retro':
        return { border: 'group-hover:border-neon-pink/70', bg: 'bg-neon-pink/10', text: 'text-neon-pink', label: 'Retro' };
      case 'Puzzle':
        return { border: 'group-hover:border-neon-blue/70', bg: 'bg-neon-blue/10', text: 'text-neon-blue', label: 'Puzzle' };
      case 'Action':
        return { border: 'group-hover:border-neon-purple/70', bg: 'bg-neon-purple/10', text: 'text-neon-purple', label: 'Action' };
      case 'Strategy':
        return { border: 'group-hover:border-neon-green/70', bg: 'bg-neon-green/10', text: 'text-neon-green', label: 'Strategy' };
      case 'Endless':
        return { border: 'group-hover:border-amber-400/70', bg: 'bg-amber-400/10', text: 'text-amber-400', label: 'Endless' };
      default:
        return { border: 'group-hover:border-neon-blue/70', bg: 'bg-neon-blue/10', text: 'text-neon-blue', label: 'Custom' };
    }
  };

  const theme = getCategoryTheme(game.category);

  return (
    <div
      onClick={() => onPlayGame(game)}
      id={`game-card-${game.id}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-cyber-border bg-cyber-card/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-cyber-card cursor-pointer ${theme.border}`}
    >
      {/* Background glow overlay */}
      <div className={`absolute -right-12 -top-12 h-24 w-24 rounded-full opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-10 ${theme.bg}`} />

      {/* Card Header Info */}
      <div className="flex items-start justify-between">
        {/* Game icon wrapper with brand style */}
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl border border-cyber-border transition-colors duration-300 ${theme.bg} ${theme.text}`}>
          {getIcon(game.iconName)}
        </div>

        {/* Favorite Icon Option */}
        <button
          onClick={(e) => onToggleFavorite(game.id, e)}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-cyber-border hover:text-neon-pink focus:outline-hidden transition-all duration-200"
          title={isFavorite ? "Remove from favorite cabinet" : "Add to favorite cabinet"}
          id={`fav-btn-${game.id}`}
        >
          <Icons.Heart
            className={`h-5 w-5 transition-all ${isFavorite ? 'fill-neon-pink text-neon-pink scale-110' : 'text-slate-500'}`}
          />
        </button>
      </div>

      {/* Main Metadata */}
      <div className="mt-4 flex-grow">
        <div className="flex items-center gap-2">
          <span className={`inline-block rounded-md px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${theme.bg} ${theme.text}`}>
            {game.category}
          </span>
          {game.isCustom && (
            <span className="inline-block rounded-md bg-neon-purple/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-neon-purple border border-neon-purple/20">
              User Game
            </span>
          )}
        </div>

        <h3 className="mt-2.5 font-display text-lg font-bold tracking-tight text-slate-100 group-hover:text-white group-hover:underline decoration-neon-blue decoration-2 cursor-pointer transition-colors">
          {game.title}
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-2">
          {game.description}
        </p>
      </div>

      {/* Actions and Play stats */}
      <div className="mt-5 border-t border-cyber-border/60 pt-4 flex items-center justify-between">
        {/* Stats */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <Icons.Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400/30" />
            <strong className="text-slate-300">{ratingValue.toFixed(1)}</strong>
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-700" />
          <span className="flex items-center gap-1">
            <Icons.Play className="h-3 w-3 text-slate-400 fill-slate-400/25" />
            <span>{playCount} plays</span>
          </span>
        </div>

        {/* Action play button */}
        <span className={`flex items-center gap-1 font-mono text-xs font-bold tracking-wider transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 ${theme.text}`}>
          PLAY <Icons.ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
};
