/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Gamepad2, Info, Check, Sword, Shield, Trophy, Activity, MessageSquare, Target, Smile } from 'lucide-react';

export const AddGameModal = ({ isOpen, onClose, onAddGame }) => {
  const [title, setTitle] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');
  const [category, setCategory] = useState('Retro');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [controlsInput, setControlsInput] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Gamepad2');

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  // Set of Lucide icons users can pick for their custom games
  const AVAILABLE_ICONS = [
    { name: 'Gamepad2', label: 'Classic Gamepad' },
    { name: 'Activity', label: 'Pulse/Action' },
    { name: 'Sword', label: 'Sword RPG' },
    { name: 'Shield', label: 'Shield Strategy' },
    { name: 'Trophy', label: 'Sports Trophy' },
    { name: 'Target', label: 'Aim Target' },
    { name: 'MessageSquare', label: 'Text RPG' },
    { name: 'Smile', label: 'Casual Smile' },
  ];

  const validate = () => {
    const errorMap = {};

    if (!title.trim()) {
      errorMap.title = 'Game title is requested';
    }
    if (!iframeUrl.trim()) {
      errorMap.iframeUrl = 'Embed URL/Iframe Source is requested';
    } else {
      try {
        // Simple URI verification
        new URL(iframeUrl);
      } catch (err) {
        errorMap.iframeUrl = 'Please provide a valid working HTTPS website URL';
      }
    }
    if (!description.trim()) {
      errorMap.description = 'Provide a brief summary for this game';
    }

    setErrors(errorMap);
    return Object.keys(errorMap).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Split custom controls string by commas and filter out empty values
    const controls = controlsInput
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const newGame = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category,
      description: description.trim(),
      iframeUrl: iframeUrl.trim(),
      instructions: instructions.trim() || undefined,
      controls: controls.length > 0 ? controls : ["Left Click / Tap - Interact"],
      iconName: selectedIcon,
      isCustom: true,
      rating: 5.0,
      playCount: 1,
    };

    onAddGame(newGame);
    
    // Clear inputs
    setTitle('');
    setIframeUrl('');
    setCategory('Retro');
    setDescription('');
    setInstructions('');
    setControlsInput('');
    setSelectedIcon('Gamepad2');
    setErrors({});
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-dark/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-neon-purple/30 bg-cyber-card p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Glow corner elements */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-neon-purple/5 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 -bottom-32 h-64 w-64 rounded-full bg-neon-pink/5 blur-3xl" />

        {/* Modal Close */}
        <button
          onClick={onClose}
          id="close-add-modal-btn"
          className="absolute top-5 right-5 rounded-lg p-1 text-slate-500 hover:bg-cyber-border hover:text-white transition-all duration-200 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="font-arcade text-lg font-black tracking-wider text-transparent bg-clip-text bg-linear-to-r from-neon-blue via-violet-300 to-neon-purple">
            CUSTOM CABINET INSTALMENT
          </h2>
          <p className="mt-1 text-xs text-slate-400 font-sans">
            Have a custom game mirror or URL? Enter details to construct a local unblocked simulator cabinet!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} id="add-game-form" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Title */}
            <div>
              <label htmlFor="custom-game-title" className="block font-mono text-[10px] tracking-wider text-slate-400 uppercase mb-1.5">
                Game Title
              </label>
              <input
                type="text"
                id="custom-game-title"
                placeholder="e.g. Moto X3M Mirror"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full rounded-xl border bg-cyber-dark/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-hidden transition-all duration-200 focus:ring-1 focus:ring-neon-purple/20 ${
                  errors.title ? 'border-red-500 focus:border-red-500' : 'border-cyber-border focus:border-neon-purple'
                }`}
              />
              {errors.title && <span className="mt-1 block text-[10px] font-mono text-red-400">{errors.title}</span>}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="custom-game-category" className="block font-mono text-[10px] tracking-wider text-slate-400 uppercase mb-1.5">
                Cabinet Category
              </label>
              <select
                id="custom-game-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-cyber-border bg-cyber-dark/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-hidden transition-all duration-200 focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/20"
              >
                <option value="Retro">👾 Retro Classics</option>
                <option value="Puzzle">🧠 Puzzle / Brain</option>
                <option value="Action">⚡ Action / Skill</option>
                <option value="Strategy">🗺️ Strategic / Idle</option>
                <option value="Sports">🏆 Sports / Races</option>
                <option value="Endless">🏃 Endless Runners</option>
              </select>
            </div>
          </div>

          {/* Iframe URL */}
          <div>
            <label htmlFor="custom-game-url" className="block font-mono text-[10px] tracking-wider text-slate-400 uppercase mb-1.5 flex items-center justify-between">
              <span>Game IFrame Code Source (HTTPS URL)</span>
              <span className="text-[9px] text-neon-blue lowercase font-normal">Must support direct iframe loading (HTTPS)</span>
            </label>
            <input
              type="text"
              id="custom-game-url"
              placeholder="e.g. https://example.github.io/moto-x3m/"
              value={iframeUrl}
              onChange={(e) => setIframeUrl(e.target.value)}
              className={`w-full rounded-xl border bg-cyber-dark/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-hidden transition-all duration-200 focus:ring-1 focus:ring-neon-purple/20 ${
                errors.iframeUrl ? 'border-red-500 focus:border-red-500' : 'border-cyber-border focus:border-neon-purple'
              }`}
            />
            {errors.iframeUrl && <span className="mt-1 block text-[10px] font-mono text-red-400">{errors.iframeUrl}</span>}
          </div>

          {/* Prompt info about iframe restrictions */}
          <div className="flex gap-2.5 rounded-lg bg-neon-blue/5 border border-neon-blue/15 px-3 py-2.5 text-slate-400 text-[11px] leading-relaxed">
            <Info className="h-4 w-4 text-neon-blue shrink-0 mt-0.5" />
            <p>
              <strong>Bypass Note:</strong> Make sure the game URL starts with <strong>https://</strong> and supports hosting inside external sandbox blocks (i.e., does not send a blocking <code>X-Frame-Options: DENY</code> header). Let's test standard Github Pages, Scratch, or Itch embeds.
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="custom-game-desc" className="block font-mono text-[10px] tracking-wider text-slate-400 uppercase mb-1.5">
              Cabinet Short Description
            </label>
            <input
              type="text"
              id="custom-game-desc"
              placeholder="e.g. Accelerate around highly creative physics tracks and complete loops."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full rounded-xl border bg-cyber-dark/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-hidden transition-all duration-200 focus:ring-1 focus:ring-neon-purple/20 ${
                errors.description ? 'border-red-500 focus:border-red-500' : 'border-cyber-border focus:border-neon-purple'
              }`}
            />
            {errors.description && <span className="mt-1 block text-[10px] font-mono text-red-400">{errors.description}</span>}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Instructions */}
            <div>
              <label htmlFor="custom-game-inst" className="block font-mono text-[10px] tracking-wider text-slate-400 uppercase mb-1.5">
                Game Instructions (Objective)
              </label>
              <textarea
                id="custom-game-inst"
                placeholder="e.g. Steer Moto and maintain balance over hills. Don't crash."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-cyber-border bg-cyber-dark/80 px-4 py-2 text-xs text-slate-100 placeholder-slate-600 outline-hidden transition-all duration-200 focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/20 resize-none"
              />
            </div>

            {/* Controls */}
            <div>
              <label htmlFor="custom-game-ctrl" className="block font-mono text-[10px] tracking-wider text-slate-400 uppercase mb-1.5">
                Layout Key Controls (comma-separated list)
              </label>
              <textarea
                id="custom-game-ctrl"
                placeholder="e.g. W - Accelerate, S - Brake, Arrow Left - Tilt back, Arrow Right - Tilt front"
                value={controlsInput}
                onChange={(e) => setControlsInput(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-cyber-border bg-cyber-dark/80 px-4 py-2 text-xs text-slate-100 placeholder-slate-600 outline-hidden transition-all duration-200 focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/20 resize-none"
              />
            </div>
          </div>

          {/* Icon Choice Row */}
          <div>
            <span className="block font-mono text-[10px] tracking-wider text-slate-400 uppercase mb-2">
              Select Display Theme Icon
            </span>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_ICONS.map((ico) => {
                const isSelected = selectedIcon === ico.name;
                return (
                  <button
                    key={ico.name}
                    type="button"
                    onClick={() => setSelectedIcon(ico.name)}
                    className="flex items-center gap-1.5 rounded-lg border border-cyber-border bg-cyber-dark hover:border-slate-705 hover:bg-cyber-dark/65 px-3 py-2 text-xs font-medium cursor-pointer transition-all duration-200"
                  >
                    {ico.name === 'Gamepad2' && <Gamepad2 className="h-4 w-4" />}
                    {ico.name === 'Activity' && <Activity className="h-4 w-4" />}
                    {ico.name === 'Sword' && <Sword className="h-4 w-4" />}
                    {ico.name === 'Shield' && <Shield className="h-4 w-4" />}
                    {ico.name === 'Trophy' && <Trophy className="h-4 w-4" />}
                    {ico.name === 'Target' && <Target className="h-4 w-4" />}
                    {ico.name === 'MessageSquare' && <MessageSquare className="h-4 w-4" />}
                    {ico.name === 'Smile' && <Smile className="h-4 w-4" />}
                    <span>{ico.label}</span>
                    {isSelected && <Check className="h-3 w-3 text-neon-green ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row border-t border-cyber-border/60 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-cyber-border hover:bg-cyber-order/50 px-5 py-2.5 font-sans text-xs font-semibold tracking-wider text-slate-400 hover:text-white hover:border-slate-600 transition-all cursor-pointer"
            >
              DISMISS
            </button>
            <button
              type="submit"
              id="submit-add-game-btn"
              className="rounded-xl border border-neon-purple bg-linear-to-r from-neon-purple to-neon-pink px-6 py-2.5 font-sans text-xs font-bold tracking-wider text-white neon-shadow-purple hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer"
            >
              INSTALL TO CABINET GRID
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
