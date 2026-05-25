/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Gamepad2, Heart, Plus, Search, Sparkles, MonitorUp } from 'lucide-react';

export const Header = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  favoritesCount,
  totalGames,
}) => {
  return (
    <header className="relative z-10 w-full border-b border-cyber-border bg-[#090a0f]/90 backdrop-blur-md">
      {/* Top Banner with Ticker Info */}
      <div className="flex h-10 w-full items-center justify-between border-b border-cyber-border/60 bg-linear-to-r from-neon-blue/10 via-neon-purple/10 to-neon-pink/10 px-4 text-xs font-mono tracking-wider text-slate-400">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-neon-green" />
          <span className="font-arcade text-[10px] text-neon-green">SYSTEMS ONLINE</span>
          <span className="hidden opacity-60 sm:inline">|</span>
          <span className="hidden sm:inline">LIBRARY: <strong className="text-neon-blue">{totalGames} GAMES READY</strong></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3 fill-neon-pink text-neon-pink" />
            <span>FAVS: <strong className="text-neon-pink">{favoritesCount}</strong></span>
          </span>
          <span className="hidden select-none opacity-40 md:inline">|</span>
          <span className="hidden text-slate-500 md:inline">BYPASS MODE: UNBLOCKED COMPATIBLE</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 sm:px-6 md:flex-row lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-neon-blue/50 bg-cyber-card text-neon-blue neon-shadow-blue">
            <Gamepad2 className="h-7 w-7 animate-pulse" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-neon-pink" />
          </div>
          <div>
            <h1 className="font-arcade text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-neon-blue via-violet-300 to-neon-pink">
              UNBLOCKED<span className="text-neon-pink font-light">ARCADE</span>
            </h1>
            <p className="font-mono text-[10px] tracking-wide text-slate-400 uppercase">
              Web & Retro Classics Simulator
            </p>
          </div>
        </div>

        {/* Action Controls & Search */}
        <div className="flex w-full flex-col items-center gap-3 sm:flex-row md:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search game titles..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl border border-cyber-border bg-cyber-card/60 py-2.5 pl-10 pr-4 font-sans text-sm text-slate-100 placeholder-slate-500 transition-all duration-200 outline-hidden hover:border-slate-700 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/20"
              id="game-search-input"
            />
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute top-1/2 right-3 -translate-y-1/2 font-mono text-[10px] text-slate-500 hover:text-white"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Add Game Trigger Button */}
          <button
            onClick={onOpenAddModal}
            id="add-custom-game-btn"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-neon-purple/40 bg-linear-to-r from-neon-purple/10 to-neon-pink/10 px-4 py-2.5 font-sans text-xs font-semibold tracking-wider text-purple-200 hover:from-neon-purple/20 hover:to-neon-pink/20 hover:text-white hover:border-neon-purple/80 transition-all duration-300 sm:w-auto"
          >
            <Plus className="h-4 w-4 text-neon-pink" />
            <span>ADD CUSTOM GAME</span>
          </button>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="border-t border-cyber-border/40 bg-cyber-card/25">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar">
            <span className="mr-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">FILTER:</span>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  id={`cat-filter-${cat.toLowerCase()}`}
                  className={`cursor-pointer rounded-lg px-4 py-1.5 font-sans text-xs font-medium tracking-wide transition-all duration-300 ${
                    isActive
                      ? 'bg-neon-blue text-cyber-dark font-semibold shadow-sm'
                      : 'bg-cyber-card text-slate-400 border border-cyber-border hover:bg-cyber-border hover:text-slate-100'
                  }`}
                >
                  {cat === 'All' ? '🎮 ALL GAMES' : cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
