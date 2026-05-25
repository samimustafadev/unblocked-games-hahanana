/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Info,
  Layers,
  Sparkles,
  HelpCircle,
  X,
  Volume2,
  Cpu
} from 'lucide-react';

export const GameView = ({
  game,
  onClose,
  onRateGame,
  userRating,
  onIncrementPlayCount,
  ratingValue,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadStep, setLoadStep] = useState(0);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Increment play statistics when loaded
  useEffect(() => {
    onIncrementPlayCount(game.id);
  }, [game.id]);

  // Loading steps text effect for immersive retro gaming feel
  useEffect(() => {
    setIsLoading(true);
    setLoadStep(0);
    const steps = [
      'ALLOCATING VIRTUAL MEMORY...',
      'DECRYPTING IFRAME HANDSHAKE...',
      'ESTABLISHING FULLSCREEN CHANNELS...',
      'GAMESYSTEM_BOOT_SUCCESS_101%'
    ];

    const timers = [];
    steps.forEach((_, idx) => {
      const timer = setTimeout(() => {
        setLoadStep(idx);
      }, (idx + 1) * 450);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [game.id, iframeKey]);

  // Handle standard element fullscreen API
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Follow document's fullscreen change standard triggers
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Force game iframe reset
  const handleReload = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const loadProgressTexts = [
    'ALLOCATING VIRTUAL MEMORY...',
    'CONNECTING SECURE SANDBOX...',
    'ESTABLISHING SECURE IFRAME TUNNEL...',
    'LAUNCHING EMULATOR EMULATION...'
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Back Button and Title */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onClose}
          id="back-to-library-btn"
          className="flex items-center gap-2 rounded-xl bg-cyber-card border border-cyber-border px-4 py-2.5 font-sans text-xs font-semibold tracking-wider text-slate-300 hover:text-white hover:border-slate-500 transition-all duration-300"
        >
          <X className="h-4 w-4" />
          <span>CLOSE & LEAVE CABINET</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="animate-pulse h-2.5 w-2.5 rounded-full bg-neon-green" />
          <h2 className="font-arcade text-lg md:text-xl font-extrabold text-white uppercase tracking-tight">
            CURRENT CABINET: <span className="text-neon-blue">{game.title}</span>
          </h2>
        </div>
      </div>

      {/* Main Sandbox Interactive Portal */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Play Stage Panel (Columns 1-3) */}
        <div className={`col-span-1 lg:col-span-3 flex flex-col gap-4 ${isTheaterMode ? 'lg:col-span-4' : ''}`}>
          {/* Virtual TV Frame Container */}
          <div
            ref={containerRef}
            id={`gaming-container-${game.id}`}
            className="relative overflow-hidden rounded-2xl border-2 border-cyber-border bg-black neon-shadow-purple aspect-video w-full"
          >
            {/* Custom Scanline filter overlays */}
            <div className="pointer-events-none absolute inset-0 z-1 bg-gradient-to-b from-transparent via-white/1 to-transparent opacity-15" />
            
            {/* Display Iframe */}
            <iframe
              key={iframeKey}
              src={game.iframeUrl}
              onLoad={() => setIsLoading(false)}
              className="h-full w-full border-none bg-black"
              allow="autoplay; gamepad; fullscreen; keyboard; focus"
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
              title={game.title}
            />

            {/* Simulated Retro Bios Bootup sequence overlay */}
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-cyber-dark/95 px-6 font-mono text-center select-none border border-neon-purple/20">
                <div className="relative flex flex-col items-center max-w-md">
                  {/* Rotating Neon Matrix Indicator */}
                  <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
                    <span className="absolute h-full w-full animate-spin rounded-full border-4 border-solid border-neon-purple border-t-transparent" />
                    <Cpu className="h-8 w-8 text-neon-blue font-bold animate-pulse" />
                  </div>

                  {/* Retro Text logs */}
                  <h3 className="font-arcade text-lg font-black tracking-wider text-transparent bg-clip-text bg-linear-to-r from-neon-blue to-neon-purple">
                    BOOTING VIRTUAL ARCADE
                  </h3>
                  
                  <div className="mt-4 w-64 rounded-full bg-cyber-border p-1">
                    <div
                      className="h-2 rounded-full bg-linear-to-r from-neon-blue via-neon-purple to-neon-pink transition-all duration-300"
                      style={{ width: `${(loadStep + 1) * 25}%` }}
                    />
                  </div>

                  <p className="mt-5 text-[10px] tracking-widest text-[#39ff14] animate-pulse">
                    &gt; {loadProgressTexts[loadStep] || 'PROBING EMULATOR...'}
                  </p>
                  <p className="mt-1 text-[9px] text-slate-500 uppercase">
                    Status: Initializing Sandbox container &bull; Please wait
                  </p>
                </div>
              </div>
            )}
            
            {/* Sub-bar overlay during real Fullscreen mode to allow escape action */}
            {isFullscreen && (
              <div className="absolute top-4 right-4 z-40 bg-cyber-dark/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyber-border flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono">PRESS ESC TO ENTER REALITY</span>
                <button
                  onClick={handleToggleFullscreen}
                  className="p-1 hover:text-red-400 text-white transition-all"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Cabinet Dashboard Action Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-cyber-border bg-cyber-card/70 p-4">
            {/* Left Options: Rating and Feedback */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate-400">CABINET VALUE:</span>
              <div className="flex items-center gap-1 rounded-lg bg-cyber-dark border border-cyber-border p-0.5">
                <button
                  onClick={() => onRateGame(game.id, 'up')}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-sans text-xs font-semibold transition-all duration-200 ${
                    userRating === 'up'
                      ? 'bg-neon-green/20 text-neon-green border border-neon-green/50'
                      : 'text-slate-400 hover:text-white hover:bg-cyber-card'
                  }`}
                  id={`rate-up-${game.id}`}
                  title="This game is completely unblocked and fully playable"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>UP VOTE</span>
                </button>

                <button
                  onClick={() => onRateGame(game.id, 'down')}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-sans text-xs font-semibold transition-all duration-200 ${
                    userRating === 'down'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                      : 'text-slate-400 hover:text-white hover:bg-cyber-card'
                  }`}
                  id={`rate-down-${game.id}`}
                  title="This game link is blocked, laggy, or fails to play"
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span>DOWN VOTE</span>
                </button>
              </div>
              <span className="font-mono text-xs text-slate-400">
                RATINGS: <strong className="text-neon-blue">{ratingValue.toFixed(1)}/5.0</strong>
              </span>
            </div>

            {/* Right Options: Sizing and Reload Controls */}
            <div className="flex items-center gap-2">
              {/* Force reload */}
              <button
                onClick={handleReload}
                className="flex items-center gap-1.5 rounded-lg border border-cyber-border bg-cyber-dark px-3 py-1.5 font-sans text-xs font-medium text-slate-400 hover:text-white hover:bg-cyber-card/60 transition-all cursor-pointer"
                title="Restart the current simulation"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">RESET CORE</span>
              </button>

              {/* Theater Mode toggle */}
              <button
                onClick={() => setIsTheaterMode((p) => !p)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-sans text-xs font-medium transition-all cursor-pointer ${
                  isTheaterMode
                    ? 'border-neon-pink bg-neon-pink/10 text-neon-pink'
                    : 'border-cyber-border bg-cyber-dark text-slate-400 hover:text-white hover:bg-cyber-card'
                }`}
                title="Toggle Expanded Theater Stage"
              >
                <Layers className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">THEATER MODE</span>
              </button>

              {/* Real Fullscreen toggle */}
              <button
                onClick={handleToggleFullscreen}
                className="flex items-center gap-1.5 rounded-lg border border-neon-blue bg-neon-blue/10 px-3 py-1.5 font-sans text-xs font-bold text-neon-blue neon-shadow-blue hover:text-white hover:bg-neon-blue/20 transition-all cursor-pointer"
                title="Launch genuine monitor-fitted fullscreen gameplay"
              >
                <Maximize2 className="h-3.5 w-3.5 animate-pulse" />
                <span>GO FULLSCREEN</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Panel containing Instructions/Controls (Column 4) */}
        {!isTheaterMode && (
          <div className="col-span-1 flex flex-col gap-6">
            {/* Specifications Card */}
            <div className="rounded-2xl border border-cyber-border bg-cyber-card/80 p-5">
              <h3 className="flex items-center gap-2 font-display text-base font-bold text-white mb-4">
                <Info className="h-4 w-4 text-neon-blue" />
                <span>ABOUT THIS CABINET</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-mono text-[10px] tracking-wider text-slate-500 uppercase">Description</h4>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    {game.description}
                  </p>
                </div>

                <div className="border-t border-cyber-border/40 pt-3">
                  <h4 className="font-mono text-[10px] tracking-wider text-slate-500 uppercase">Category Tag</h4>
                  <span className="mt-1.5 inline-block rounded-md bg-neon-blue/10 border border-neon-blue/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-neon-blue">
                    {game.category}
                  </span>
                </div>

                <div className="border-t border-cyber-border/40 pt-3">
                  <h4 className="font-mono text-[10px] tracking-wider text-slate-500 uppercase">Direct Link Bypass</h4>
                  <p className="mt-1 font-mono text-[9px] text-slate-400 break-all select-all bg-cyber-dark/80 p-1.5 rounded-md border border-cyber-border">
                    {game.iframeUrl}
                  </p>
                </div>
              </div>
            </div>

            {/* Instruction manual Card */}
            <div className="rounded-2xl border border-cyber-border bg-cyber-card/80 p-5">
              <h3 className="flex items-center gap-2 font-display text-base font-bold text-white mb-4">
                <HelpCircle className="h-4 w-4 text-neon-pink" />
                <span>OPERATING INSTRUCTIONS</span>
              </h3>

              <div className="space-y-4">
                {game.instructions && (
                  <div>
                    <h4 className="font-mono text-[10px] tracking-wider text-slate-500 uppercase">Objective</h4>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                      {game.instructions}
                    </p>
                  </div>
                )}

                {game.controls && game.controls.length > 0 && (
                  <div className="border-t border-cyber-border/40 pt-3">
                    <h4 className="font-mono text-[10px] tracking-wider text-slate-500 uppercase mb-2">Controls Command</h4>
                    <ul className="space-y-1.5">
                      {game.controls.map((control, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neon-pink" />
                          <span className="font-mono text-[11px] text-slate-300">{control}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Theater instructions hint if sidebar is disabled */}
      {isTheaterMode && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-cyber-card border border-neon-pink/20 px-4 py-3">
          <p className="font-mono text-[11px] text-slate-400">
            🎭 <strong className="text-neon-pink">Theater mode active:</strong> Sidebar is hidden. Disable Theater mode to read manuals, scores, and instructions.
          </p>
          <button
            onClick={() => setIsTheaterMode(false)}
            className="font-mono text-[10px] text-neon-pink hover:underline uppercase font-bold"
          >
            Show manual
          </button>
        </div>
      )}
    </div>
  );
};
