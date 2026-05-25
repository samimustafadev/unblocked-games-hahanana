/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GameView } from './components/GameView.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import initialGames from './games.json';
import { 
  Heart, 
  History, 
  Trash2, 
  Gamepad, 
  Layers, 
  Clock, 
  AlertCircle, 
  Sparkles,
  Gamepad2,
  X,
  HelpCircle
} from 'lucide-react';

const LOCAL_STORAGE_STATS_KEY = 'unblocked_arcade_stats_v1';

export default function App() {
  // Initialize safe user state from local storage or defaults
  const [stats, setStats] = useState(() => {
    try {
      const item = localStorage.getItem(LOCAL_STORAGE_STATS_KEY);
      if (item) {
        const parsed = JSON.parse(item);
        return {
          favorites: parsed.favorites || [],
          customGames: parsed.customGames || [],
          ratings: parsed.ratings || {},
          playTimes: parsed.playTimes || {},
          history: parsed.history || [],
        };
      }
    } catch (e) {
      console.warn('LocalStorage is blocked or non-accessible. Using memory state.', e);
    }
    return {
      favorites: [],
      customGames: [],
      ratings: {},
      playTimes: {},
      history: [],
    };
  });

  const [activeGame, setActiveGame] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(null);

  // Synchronize stats to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_STATS_KEY, JSON.stringify(stats));
    } catch (e) {
      console.warn('Could not write to LocalStorage due to safety rules', e);
    }
  }, [stats]);

  // Handle temporary notifications
  const triggerNotification = (message, type = 'success') => {
    setShowNotification({ message, type });
    const timer = setTimeout(() => setShowNotification(null), 4000);
    return () => clearTimeout(timer);
  };

  // Merge static list with newly added user games
  const allGames = useMemo(() => {
    const customList = stats.customGames.map(cg => ({ ...cg, isCustom: true }));
    return [...initialGames, ...customList];
  }, [stats.customGames]);

  // Extract all categories dynamically (including 'All')
  const categories = useMemo(() => {
    const cats = new Set();
    initialGames.forEach((g) => cats.add(g.category));
    stats.customGames.forEach((g) => cats.add(g.category));
    return ['All', ...Array.from(cats)];
  }, [stats.customGames]);

  // Main Filtered Game Computation List
  const filteredGames = useMemo(() => {
    return allGames.filter((g) => {
      const matchCategory = selectedCategory === 'All' || g.category === selectedCategory;
      const matchSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [allGames, selectedCategory, searchQuery]);

  // Compute recently played objects
  const recentGames = useMemo(() => {
    return stats.history
      .map(id => allGames.find(g => g.id === id))
      .filter((g) => !!g)
      .slice(0, 5); // display top 5
  }, [stats.history, allGames]);

  // Compute favorite games objects
  const favoriteGamesList = useMemo(() => {
    return stats.favorites
      .map(id => allGames.find(g => g.id === id))
      .filter((g) => !!g);
  }, [stats.favorites, allGames]);

  // Favorites handlings
  const handleToggleFavorite = (id, e) => {
    e.stopPropagation(); // prevent card launching
    setStats((prev) => {
      const isFav = prev.favorites.includes(id);
      const newFavs = isFav 
        ? prev.favorites.filter((favId) => favId !== id)
        : [...prev.favorites, id];
      
      triggerNotification(
        isFav ? 'Removed game from favorite cabinet' : 'Saved game to your quick cabinet!',
        isFav ? 'info' : 'success'
      );

      return { ...prev, favorites: newFavs };
    });
  };

  // Launch and Track Active Simulation
  const handlePlayGame = (game) => {
    setActiveGame(game);
    setStats((prev) => {
      const oldHistory = prev.history.filter((id) => id !== game.id);
      return {
        ...prev,
        history: [game.id, ...oldHistory].slice(0, 15), // cap history at 15 items
      };
    });
  };

  // Handle Incremental play count locally in active view
  const handleIncrementPlayCount = (id) => {
    setStats((prev) => {
      const currentCount = prev.playTimes[id] || 0;
      return {
        ...prev,
        playTimes: {
          ...prev.playTimes,
          [id]: currentCount + 1,
        },
      };
    });
  };

  // Handle voting counters
  const handleRateGame = (id, dir) => {
    setStats((prev) => {
      const currentRatingState = prev.ratings[id];
      const isUndoing = currentRatingState === dir;
      
      const newRatings = { ...prev.ratings };
      if (isUndoing) {
        newRatings[id] = null;
        triggerNotification('Retracted feedback rating', 'info');
      } else {
        newRatings[id] = dir;
        triggerNotification(dir === 'up' ? 'Upvoted game! Unblocked state validated.' : 'Downvoted game. Mirror flagged.', 'success');
      }

      return {
        ...prev,
        ratings: newRatings,
      };
    });
  };

  // Add custom games input
  const handleAddCustomGame = (game) => {
    setStats((prev) => ({
      ...prev,
      customGames: [...prev.customGames, game],
    }));
    triggerNotification(`Successfully installed cabinet: ${game.title}!`, 'success');
  };

  // Clear Game History Track
  const handleClearHistory = () => {
    setStats((prev) => ({ ...prev, history: [] }));
    triggerNotification('Cleared game play history cache', 'info');
  };

  // Delete dynamic user game completely
  const handleDeleteCustomGame = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Do you want to completely uninstall this custom emulator cabinet from your view?')) {
      setStats((prev) => {
        const filteredCustoms = prev.customGames.filter((cg) => cg.id !== id);
        const filteredFavs = prev.favorites.filter((fid) => fid !== id);
        const filteredHist = prev.history.filter((hid) => hid !== id);
        return {
          ...prev,
          customGames: filteredCustoms,
          favorites: filteredFavs,
          history: filteredHist,
        };
      });
      triggerNotification('Uninstalled custom cabinet', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-slate-100 arcade-grid pb-20">
      
      {/* Dynamic Screen notification toaster */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-neon-blue/40 bg-[#121420] px-4 py-3 text-xs text-white neon-shadow-blue backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300">
          <span className={`h-2 w-2 rounded-full ${showNotification.type === 'success' ? 'bg-neon-green' : 'bg-neon-blue'}`} />
          <span>{showNotification.message}</span>
        </div>
      )}

      {/* Primary header navigation */}
      <Header
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        favoritesCount={stats.favorites.length}
        totalGames={allGames.length}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Conditional views: Game active simulator VS Main Catalog menu */}
        {activeGame ? (
          <GameView
            game={activeGame}
            onClose={() => setActiveGame(null)}
            onRateGame={handleRateGame}
            userRating={stats.ratings[activeGame.id] || null}
            onIncrementPlayCount={handleIncrementPlayCount}
            ratingValue={(() => {
              const base = activeGame.rating || 4.5;
              const feedback = stats.ratings[activeGame.id];
              if (feedback === 'up') return Math.min(5.0, base + 0.1);
              if (feedback === 'down') return Math.max(1.0, base - 0.2);
              return base;
            })()}
          />
        ) : (
          <div className="space-y-10">
            {/* HERO INTRODUCTION SCREEN */}
            <div className="relative overflow-hidden rounded-3xl border border-cyber-border bg-[#10121e]/80 px-6 py-10 md:px-12 md:py-14 shadow-xl">
              <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-neon-blue/5 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-neon-pink/5 blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-neon-blue/15 border border-neon-blue/20 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-neon-blue">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Offline First & Fullscreen Ready</span>
                </div>
                <h1 className="mt-4 font-arcade text-3xl font-black tracking-tight text-white md:text-4xl">
                  YOUR UNBLOCKED <span className="text-neon-pink">GAMING PORTAL</span>
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  Welcome to the ultimate clean unblocked cabinet center! Run classic arcade retro models, deep textual strategy logs, and fluid puzzles right inside local sandboxed iframe nodes. Setup custom mirrors whenever standard links are blocked.
                </p>
                
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 rounded-xl bg-cyber-dark/80 px-4 py-2 border border-cyber-border text-xs text-slate-400">
                    <Gamepad className="h-4 w-4 text-neon-pink" />
                    <span>Double click to play in fullscreen</span>
                  </div>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-neon-blue px-4 py-2 text-xs font-bold text-cyber-dark hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer"
                  >
                    <span>INSTALL NEW MIRROR CODE</span>
                  </button>
                </div>
              </div>
            </div>

            {/* QUICK RETRO STATS / CONSOLES */}
            {recentGames.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-cyber-border/40 pb-2">
                  <h3 className="flex items-center gap-2 font-display text-base font-bold text-slate-200">
                    <History className="h-4.5 w-4.5 text-neon-blue" />
                    <span>RECENTLY PLAYED CABINETS</span>
                  </h3>
                  <button
                    onClick={handleClearHistory}
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-slate-500 hover:text-slate-300 hover:bg-cyber-card text-[11px] font-mono transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>CLEAR MEMORY</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {recentGames.map((game) => (
                    <div
                      key={game.id}
                      onClick={() => handlePlayGame(game)}
                      className="group cursor-pointer rounded-xl border border-cyber-border bg-cyber-card/60 p-3 hover:border-neon-purple hover:bg-cyber-card/100 transition-all duration-300 text-center"
                    >
                      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-neon-purple/10 text-neon-purple group-hover:bg-neon-purple/20 group-hover:scale-105 transition-all">
                        <Gamepad2 className="h-4 w-4" />
                      </div>
                      <p className="mt-2 text-xs font-semibold text-slate-200 truncate group-hover:text-white">
                        {game.title}
                      </p>
                      <span className="mt-0.5 block font-mono text-[9px] text-slate-500 uppercase">
                        {game.category}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SEPARATOR PANELS - FAVORITES SPECIAL AND MAIN GAMES GRID */}
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-4">
              
              {/* GAMES PORTAL GRID SELECTOR (Columns 1-3) */}
              <div className="xl:col-span-3 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="font-arcade text-lg font-bold text-slate-100">
                      CABINET LIBRARY ({filteredGames.length})
                    </h2>
                    <p className="text-xs text-slate-500">
                      Pick a slot card to fuel the simulation
                    </p>
                  </div>
                  {searchQuery && (
                    <span className="font-mono text-xs text-neon-blue bg-neon-blue/10 px-2.5 py-1 rounded-md border border-neon-blue/20">
                      Query matches: &quot;{searchQuery}&quot;
                    </span>
                  )}
                </div>

                {filteredGames.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                    {filteredGames.map((game) => (
                      <div key={game.id} className="relative">
                        <GameCard
                          game={game}
                          isFavorite={stats.favorites.includes(game.id)}
                          onToggleFavorite={handleToggleFavorite}
                          onPlayGame={handlePlayGame}
                          playCount={(stats.playTimes[game.id] || 0) + (game.playCount || 0)}
                          ratingValue={(() => {
                            const base = game.rating || 4.5;
                            const feedback = stats.ratings[game.id];
                            if (feedback === 'up') return Math.min(5.0, base + 0.1);
                            if (feedback === 'down') return Math.max(1.0, base - 0.2);
                            return base;
                          })()}
                        />
                        {game.isCustom && (
                          <button
                            onClick={(e) => handleDeleteCustomGame(game.id, e)}
                            className="absolute bottom-4 left-4 z-10 flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 border border-red-500/20 hover:border-red-500/40 transition-all text-xs"
                            title="Uninstall this custom game"
                            id={`delete-custom-${game.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-cyber-border py-20 text-center px-4">
                    <AlertCircle className="h-10 w-10 text-slate-600 mb-3" />
                    <h4 className="font-display text-base font-bold text-slate-400">No Matching Cabinets Spotted</h4>
                    <p className="mt-1 text-xs text-slate-500 max-w-sm">
                      No matches found for &quot;{searchQuery}&quot; in the current filtration tags. Reset searches or insert a customized game mirror!
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('All');
                        }}
                        className="rounded-xl border border-cyber-border bg-cyber-card px-4 py-2 font-mono text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
                      >
                        RESET FILTERS
                      </button>
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="rounded-xl bg-neon-purple px-4 py-2 font-mono text-xs font-bold text-white hover:scale-105 transition-all cursor-pointer"
                      >
                        ADD CUSTOM MIRROR URL
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* FAVORITES CABINET TRAY AND BYPASS GUIDE (Column 4) */}
              <div className="xl:col-span-1 space-y-6">
                
                {/* FAVORITES TRAY */}
                <div className="rounded-2xl border border-cyber-border bg-cyber-card/80 p-5">
                  <h3 className="flex items-center gap-2 font-display text-sm font-bold text-white mb-4">
                    <Heart className="h-4 w-4 text-neon-pink fill-neon-pink/20" />
                    <span>FAVORITES CABINET ({favoriteGamesList.length})</span>
                  </h3>

                  {favoriteGamesList.length > 0 ? (
                    <div className="space-y-3">
                      {favoriteGamesList.map((game) => (
                        <div
                          key={game.id}
                          onClick={() => handlePlayGame(game)}
                          className="group flex cursor-pointer items-center justify-between rounded-xl border border-cyber-border/80 bg-cyber-dark/40 p-2.5 hover:bg-cyber-card hover:border-slate-500 transition-all duration-200"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neon-blue/10 text-neon-blue group-hover:bg-neon-blue/20 transition-all">
                              <Gamepad2 className="h-4 w-4" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-white">
                                {game.title}
                              </p>
                              <span className="font-mono text-[9px] text-slate-500 block">
                                {game.category}
                              </span>
                            </div>
                          </div>
                          
                          <button
                            onClick={(e) => handleToggleFavorite(game.id, e)}
                            className="text-slate-500 hover:text-red-400 p-1.5 transition-all shrink-0"
                            title="Unfavorite"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-cyber-border/60 py-8 text-center px-4">
                      <p className="text-xs text-slate-500">
                        No games favorited yet. Click the <Heart className="inline h-3.5 w-3.5 text-slate-500" /> icon on cards to configure quick launch.
                      </p>
                    </div>
                  )}
                </div>

                {/* HELP & BYPASS Mirror Tutorial */}
                <div className="rounded-2xl border border-cyber-border bg-[#0d0f18] p-5">
                  <h3 className="flex items-center gap-2 font-display text-sm font-bold text-white mb-4">
                    <HelpCircle className="h-4 w-4 text-neon-green" />
                    <span>UNBLOCKED GUIDE</span>
                  </h3>
                  
                  <div className="space-y-3 font-sans text-xs text-slate-400 leading-relaxed">
                    <p>
                      🏫 School networks usually block games based on domain keywords (like <code>games</code> or <code>arcade</code>).
                    </p>
                    <p>
                      <strong>How this bypasses blocks:</strong>
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Running games inside safe <code>iframe</code> containers masks structural network tracking.</li>
                      <li>Use the <strong>&quot;Add Custom Game&quot;</strong> button to install your own secret raw HTML5 game mirrors (e.g. from Github Pages, Scratch, or custom domains) instantly!</li>
                    </ul>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* Dynamic add-cabinet modal panel */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddCustomGame}
      />
    </div>
  );
}
