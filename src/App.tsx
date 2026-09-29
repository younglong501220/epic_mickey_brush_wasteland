import React, { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { InstructionsModal } from './components/InstructionsModal';
import { PinsModal } from './components/PinsModal';
import { EndingModal } from './components/EndingModal';
import { LEVELS } from './game/levels';
import { PlayerStats } from './types/game';
import { soundManager } from './audio/soundManager';
import { Sparkles, Palette, Shield, Compass, BookOpen, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const INITIAL_STATS: PlayerStats = {
  hp: 5,
  maxHp: 5,
  paint: 100,
  maxPaint: 100,
  thinner: 100,
  maxThinner: 100,
  paintKarma: 0,
  thinnerKarma: 0,
  enemiesPurified: 0,
  enemiesErased: 0,
  structuresPainted: 0,
  structuresThinned: 0,
  pinsCollected: [],
};

export default function App() {
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [playerStats, setPlayerStats] = useState<PlayerStats>(INITIAL_STATS);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [showPins, setShowPins] = useState<boolean>(false);
  const [showEnding, setShowEnding] = useState<boolean>(false);

  // Active level data
  const currentLevel = LEVELS.find(l => l.id === currentLevelId) || LEVELS[0];

  // Sound toggle
  const handleToggleSound = () => {
    const enabled = soundManager.toggleSound();
    setIsSoundEnabled(enabled);
  };

  // Chapter completion
  const handleChapterComplete = (levelId: number) => {
    if (levelId === 1) {
      setCurrentLevelId(2);
    } else if (levelId === 2) {
      setCurrentLevelId(3);
    } else if (levelId === 3) {
      setShowEnding(true);
    }
  };

  // Reset entire campaign
  const handleRestartCampaign = () => {
    setPlayerStats(INITIAL_STATS);
    setCurrentLevelId(1);
    setShowEnding(false);
    setIsPaused(false);
  };

  // Restart just current level
  const handleRestartCurrentLevel = () => {
    // Reset HP & Ammo
    setPlayerStats(prev => ({
      ...prev,
      hp: prev.maxHp,
      paint: prev.maxPaint,
      thinner: prev.maxThinner,
    }));
    // Toggle level id momentarily to force re-instantiation
    const id = currentLevelId;
    setCurrentLevelId(-1);
    setTimeout(() => setCurrentLevelId(id), 10);
    setIsPaused(false);
  };

  // Jump to specific level
  const handleSelectLevel = (levelId: number) => {
    setCurrentLevelId(levelId);
    setShowEnding(false);
    setIsPaused(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Bar Contract (3 Zones) */}
      <header className="h-16 px-4 sm:px-8 border-b border-slate-800 bg-slate-950/80 backdrop-blur flex items-center justify-between shrink-0 sticky top-0 z-30">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2 hover:text-sky-300 transition-colors"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
          傳奇米奇：荒廢之國的畫筆
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-400">
          <button
            onClick={() => handleSelectLevel(1)}
            className={`transition-colors hover:text-white cursor-pointer ${
              currentLevelId === 1 ? 'text-sky-400 font-bold' : ''
            }`}
          >
            第一章：荒廢小鎮
          </button>
          <button
            onClick={() => handleSelectLevel(2)}
            className={`transition-colors hover:text-white cursor-pointer ${
              currentLevelId === 2 ? 'text-sky-400 font-bold' : ''
            }`}
          >
            第二章：瘋狂鐘樓
          </button>
          <button
            onClick={() => handleSelectLevel(3)}
            className={`transition-colors hover:text-white cursor-pointer ${
              currentLevelId === 3 ? 'text-sky-400 font-bold' : ''
            }`}
          >
            第三章：暗黑城堡
          </button>
          <button
            onClick={() => setShowPins(true)}
            className="transition-colors hover:text-amber-300 flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            徽章圖鑑
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGuide(true)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">玩法指南</span>
          </button>
          <button
            onClick={handleRestartCampaign}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            重新啟程
          </button>
        </div>
      </header>

      {/* Main HUD */}
      <HUD
        stats={playerStats}
        chapterTitle={currentLevel.title}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
        onTogglePause={() => setIsPaused(p => !p)}
        onOpenPins={() => setShowPins(true)}
        onOpenGuide={() => setShowGuide(true)}
        onRestartLevel={handleRestartCurrentLevel}
      />

      {/* Game Playing Canvas Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 max-w-6xl w-full mx-auto">
        {currentLevelId > 0 && (
          <GameCanvas
            level={currentLevel}
            playerStats={playerStats}
            onUpdateStats={setPlayerStats}
            onChapterComplete={handleChapterComplete}
            isPaused={isPaused}
            onTogglePause={() => setIsPaused(p => !p)}
            onRestartCurrentLevel={handleRestartCurrentLevel}
          />
        )}

        {/* Level Progression & Philosophy Bar */}
        <section className="w-full mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Chapter 1 Card */}
          <div
            onClick={() => handleSelectLevel(1)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              currentLevelId === 1
                ? 'bg-slate-900 border-sky-500/80 shadow-[0_0_15px_rgba(56,189,248,0.15)] ring-1 ring-sky-500/50'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sky-400">第一章 · 荒廢小鎮之街</span>
              {currentLevelId === 1 && (
                <span className="text-[10px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800">
                  進行中
                </span>
              )}
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              修復虛幻斷橋、溶穿腐蝕路障，感化或消滅最初的墨水怪（Spatter）。
            </p>
          </div>

          {/* Chapter 2 Card */}
          <div
            onClick={() => handleSelectLevel(2)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              currentLevelId === 2
                ? 'bg-slate-900 border-sky-500/80 shadow-[0_0_15px_rgba(56,189,248,0.15)] ring-1 ring-sky-500/50'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-indigo-400">第二章 · 瘋狂齒輪鐘樓</span>
              {currentLevelId === 2 && (
                <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
                  進行中
                </span>
              )}
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              垂直齒輪跳躍、避開懸鐘機關，使用迴旋攻擊擊飛墨滴並尋得汽船威利汽笛。
            </p>
          </div>

          {/* Chapter 3 Card */}
          <div
            onClick={() => handleSelectLevel(3)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              currentLevelId === 3
                ? 'bg-slate-900 border-sky-500/80 shadow-[0_0_15px_rgba(56,189,248,0.15)] ring-1 ring-sky-500/50'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-rose-400">第三章 · 決戰影之污斑</span>
              {currentLevelId === 3 && (
                <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800">
                  進行中
                </span>
              )}
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              面對巨型墨水魔王！以油漆感化淨化抑或以溶劑徹底毀滅，揭曉多重命運結局。
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 px-6 py-4 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            致敬經典《迪士尼傳奇米奇：重製版》（Disney Epic Mickey: Rebrushed）· 創造與消融之雙生魔法
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setShowGuide(true)} className="hover:text-slate-200 cursor-pointer">
              操作規則
            </button>
            <span>·</span>
            <button onClick={() => setShowPins(true)} className="hover:text-slate-200 cursor-pointer">
              徽章珍藏
            </button>
            <span>·</span>
            <button onClick={handleToggleSound} className="hover:text-slate-200 cursor-pointer flex items-center gap-1">
              {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              {isSoundEnabled ? '音效開啟' : '音效靜音'}
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <InstructionsModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
      <PinsModal
        isOpen={showPins}
        onClose={() => setShowPins(false)}
        collectedPinIds={playerStats.pinsCollected}
      />
      <EndingModal
        isOpen={showEnding}
        stats={playerStats}
        onRestart={handleRestartCampaign}
        onSelectLevel={handleSelectLevel}
      />
    </div>
  );
}
