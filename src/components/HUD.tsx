import React from 'react';
import { PlayerStats } from '../types/game';
import { Heart, Volume2, VolumeX, Pause, Sparkles, BookOpen, RotateCcw } from 'lucide-react';

interface HUDProps {
  stats: PlayerStats;
  chapterTitle: string;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onTogglePause: () => void;
  onOpenPins: () => void;
  onOpenGuide: () => void;
  onRestartLevel: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  chapterTitle,
  isSoundEnabled,
  onToggleSound,
  onTogglePause,
  onOpenPins,
  onOpenGuide,
  onRestartLevel,
}) => {
  // Calculate karma ratio: positive = paint (guardian), negative = thinner (scrapper)
  const totalKarma = Math.max(1, stats.paintKarma + stats.thinnerKarma);
  const paintPct = Math.round((stats.paintKarma / totalKarma) * 100);
  const thinnerPct = 100 - paintPct;

  let karmaTitle = '初抵荒廢之國';
  let karmaColor = 'text-slate-300';
  if (stats.paintKarma > stats.thinnerKarma + 20) {
    karmaTitle = '守護者傾向 (Guardian)';
    karmaColor = 'text-sky-400';
  } else if (stats.thinnerKarma > stats.paintKarma + 20) {
    karmaTitle = '抹滅者傾向 (Scrapper)';
    karmaColor = 'text-emerald-400';
  } else if (stats.paintKarma > 0 || stats.thinnerKarma > 0) {
    karmaTitle = '平衡傾向 (Balanced)';
    karmaColor = 'text-purple-300';
  }

  return (
    <div className="w-full bg-slate-900/95 border-b border-slate-800 px-4 py-3 backdrop-blur shadow-lg">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Health & Chapter */}
        <div className="flex items-center gap-6">
          {/* Hearts */}
          <div className="flex items-center gap-1.5" title={`生命值: ${stats.hp}/${stats.maxHp}`}>
            {Array.from({ length: stats.maxHp }).map((_, i) => (
              <Heart
                key={i}
                className={`w-6 h-6 transition-all duration-300 ${
                  i < stats.hp
                    ? 'text-rose-500 fill-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)] scale-100'
                    : 'text-slate-700 fill-slate-800/50 scale-90'
                }`}
              />
            ))}
          </div>

          {/* Chapter Title */}
          <div className="hidden sm:block border-l border-slate-700 pl-4">
            <span className="text-xs uppercase tracking-wider text-slate-400 block font-medium">當前章節</span>
            <span className="text-sm font-semibold text-slate-200">{chapterTitle}</span>
          </div>
        </div>

        {/* Center: Dual Paint / Thinner Fluid Gauges & Karma */}
        <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 max-w-md">
          {/* Paint Gauge */}
          <div className="w-full">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-sky-400 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                油漆 PAINT (左鍵/J)
              </span>
              <span className="text-slate-400 tabular-nums">{Math.round(stats.paint)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-cyan-300 transition-all duration-150 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                style={{ width: `${stats.paint}%` }}
              />
            </div>
          </div>

          {/* Thinner Gauge */}
          <div className="w-full">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                溶劑 THINNER (右鍵/K)
              </span>
              <span className="text-slate-400 tabular-nums">{Math.round(stats.thinner)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-300 transition-all duration-150 shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                style={{ width: `${stats.thinner}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Karma Indicator & Functional Utility Buttons */}
        <div className="flex items-center gap-3">
          {/* Karma dial text */}
          <div className="hidden md:flex flex-col items-end pr-2">
            <span className="text-xs text-slate-400">道德傾向</span>
            <span className={`text-xs font-bold ${karmaColor}`}>
              {karmaTitle} ({paintPct}% / {thinnerPct}%)
            </span>
          </div>

          {/* Action buttons */}
          <button
            onClick={onOpenPins}
            className="p-2 text-slate-300 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            title="查看古董徽章收藏"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">徽章</span>
            <span className="text-amber-400 font-bold tabular-nums">({stats.pinsCollected.length})</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="p-2 text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors text-xs flex items-center gap-1.5 font-medium cursor-pointer"
            title="遊戲玩法與按鍵指南"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden lg:inline">指南</span>
          </button>

          <button
            onClick={onRestartLevel}
            className="p-2 text-slate-300 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            title="重啟本關"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleSound}
            className="p-2 text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            title={isSoundEnabled ? '靜音' : '開啟音效與音樂'}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={onTogglePause}
            className="p-2 text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            title="暫停"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
