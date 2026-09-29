import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from '../game/engine';
import { GameRenderer } from '../game/renderer';
import { LevelData, PlayerStats } from '../types/game';
import { DialogueBox } from './DialogueBox';
import { Play, RotateCcw, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface GameCanvasProps {
  level: LevelData;
  playerStats: PlayerStats;
  onUpdateStats: (newStats: PlayerStats) => void;
  onChapterComplete: (levelId: number) => void;
  isPaused: boolean;
  onTogglePause: () => void;
  onRestartCurrentLevel: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  level,
  playerStats,
  onUpdateStats,
  onChapterComplete,
  isPaused,
  onTogglePause,
  onRestartCurrentLevel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const engineRef = useRef<GameEngine | null>(null);
  const rendererRef = useRef<GameRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const keysRef = useRef<Record<string, boolean>>({});
  const mouseRef = useRef({ x: 400, y: 220, left: false, right: false });

  const [dialogue, setDialogue] = useState(engineRef.current?.currentDialogue || null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isChapterFinished, setIsChapterFinished] = useState(false);

  // Initialize engine & renderer when level changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const engine = new GameEngine(level, playerStats);
    const renderer = new GameRenderer(ctx, canvas.width, canvas.height);

    engineRef.current = engine;
    rendererRef.current = renderer;

    setIsGameOver(false);
    setIsChapterFinished(false);
    setDialogue(null);

    soundManager.startMusic();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [level.id]);

  // Sync dialogue state with engine
  const handleDismissDialogue = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.currentDialogue = null;
      setDialogue(null);
    }
  }, []);

  // Main 60FPS Game Loop
  useEffect(() => {
    const loop = () => {
      const engine = engineRef.current;
      const renderer = rendererRef.current;

      if (engine && renderer && !isPaused) {
        // Run update step
        engine.update(keysRef.current, mouseRef.current);

        // Render current frame
        renderer.render(engine);

        // Sync dialogue if changed
        if (engine.currentDialogue && engine.currentDialogue !== dialogue) {
          setDialogue(engine.currentDialogue);
        }

        // Sync stats periodically
        onUpdateStats(engine.stats);

        // Check for Game Over
        if (engine.isGameOver && !isGameOver) {
          setIsGameOver(true);
        }

        // Check for Level Completion
        if (engine.isCompleted && !isChapterFinished) {
          setIsChapterFinished(true);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isPaused, isGameOver, isChapterFinished, dialogue, onUpdateStats]);

  // Window keyboard & mouse events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling on space / arrows
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
      keysRef.current[e.code] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Mouse handlers relative to canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    mouseRef.current.x = (e.clientX - rect.left) * scaleX;
    mouseRef.current.y = (e.clientY - rect.top) * scaleY;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) mouseRef.current.left = true;
    if (e.button === 2) mouseRef.current.right = true;
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) mouseRef.current.left = false;
    if (e.button === 2) mouseRef.current.right = false;
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Virtual touch controls for mobile / tablets
  const setKey = (code: string, pressed: boolean) => {
    keysRef.current[code] = pressed;
  };

  const setMouseAction = (type: 'left' | 'right', pressed: boolean) => {
    if (type === 'left') mouseRef.current.left = pressed;
    if (type === 'right') mouseRef.current.right = pressed;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center justify-center select-none"
    >
      {/* Canvas Wrapper */}
      <div className="relative w-full max-w-5xl aspect-[16/9] bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
        <canvas
          ref={canvasRef}
          width={880}
          height={480}
          className="w-full h-full block cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onContextMenu={handleContextMenu}
        />

        {/* Dialogue Box */}
        <DialogueBox dialogue={dialogue} onDismiss={handleDismissDialogue} />

        {/* Paused Screen Overlay */}
        {isPaused && !isGameOver && !isChapterFinished && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-40">
            <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl text-center max-w-sm w-full shadow-2xl">
              <h3 className="text-xl font-bold text-slate-100 mb-2">遊戲已暫停</h3>
              <p className="text-xs text-slate-400 mb-6">放鬆一下手指，深呼吸準備再次揮灑畫筆！</p>
              <div className="space-y-3">
                <button
                  onClick={onTogglePause}
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Play className="w-4 h-4" />
                  繼續冒險
                </button>
                <button
                  onClick={onRestartCurrentLevel}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  重新開始本關
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Over Screen Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-red-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-40">
            <div className="bg-slate-900 border-2 border-red-500/50 p-8 rounded-2xl text-center max-w-sm w-full shadow-2xl">
              <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3 animate-bounce" />
              <h3 className="text-xl font-black text-rose-300 mb-2">墨水耗盡，不慎跌落！</h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                被遺忘的世界充滿著險阻與墨水深淵，重新站起來，再次挑戰吧！
              </p>
              <button
                onClick={onRestartCurrentLevel}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-rose-950"
              >
                <RotateCcw className="w-4 h-4" />
                重新開始挑戰
              </button>
            </div>
          </div>
        )}

        {/* Chapter Clear Banner Overlay */}
        {isChapterFinished && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 z-40">
            <div className="bg-slate-900 border-2 border-sky-500/50 p-8 rounded-2xl text-center max-w-md w-full shadow-2xl">
              <Sparkles className="w-12 h-12 text-sky-400 mx-auto mb-3" />
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block mb-1">
                CHAPTER COMPLETE
              </span>
              <h3 className="text-2xl font-black text-white mb-3">
                恭喜通關：{level.title}！
              </h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                你成功突破了本區域的重重考驗！大門已為你敞開，荒廢之國的深處還有更震撼的真相等待著你。
              </p>
              <button
                onClick={() => onChapterComplete(level.id)}
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-950 transition-all"
              >
                <span>{level.id >= 3 ? '查看最終命運結局' : '前往下一章節'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* On-Screen Mobile/Tablet Virtual Controls (Responsive) */}
      <div className="w-full max-w-5xl mt-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left D-pad */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] hidden sm:inline mr-1">觸控輔助:</span>
          <button
            onPointerDown={() => setKey('KeyA', true)}
            onPointerUp={() => setKey('KeyA', false)}
            className="w-10 h-10 bg-slate-800 active:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-center font-bold border border-slate-700 cursor-pointer select-none"
          >
            ←
          </button>
          <button
            onPointerDown={() => setKey('KeyD', true)}
            onPointerUp={() => setKey('KeyD', false)}
            className="w-10 h-10 bg-slate-800 active:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-center font-bold border border-slate-700 cursor-pointer select-none"
          >
            →
          </button>
          <button
            onPointerDown={() => setKey('Space', true)}
            onPointerUp={() => setKey('Space', false)}
            className="px-4 h-10 bg-indigo-900/70 active:bg-indigo-800 text-indigo-200 rounded-lg flex items-center justify-center font-bold border border-indigo-700/60 cursor-pointer select-none"
          >
            跳躍 / 二段跳 (Space)
          </button>
          <button
            onPointerDown={() => setKey('KeyE', true)}
            onPointerUp={() => setKey('KeyE', false)}
            className="px-3 h-10 bg-slate-800 active:bg-slate-700 text-amber-300 rounded-lg flex items-center justify-center font-bold border border-slate-700 cursor-pointer select-none"
            title="迴旋攻擊"
          >
            迴旋 (E)
          </button>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onPointerDown={() => setMouseAction('left', true)}
            onPointerUp={() => setMouseAction('left', false)}
            className="px-3.5 h-10 bg-sky-900/60 active:bg-sky-700 text-sky-200 rounded-lg flex items-center justify-center font-bold border border-sky-700/60 cursor-pointer select-none"
          >
            🖌️ 油漆 (左鍵/J)
          </button>
          <button
            onPointerDown={() => setMouseAction('right', true)}
            onPointerUp={() => setMouseAction('right', false)}
            className="px-3.5 h-10 bg-emerald-900/60 active:bg-emerald-700 text-emerald-200 rounded-lg flex items-center justify-center font-bold border border-emerald-700/60 cursor-pointer select-none"
          >
            🧪 溶劑 (右鍵/K)
          </button>
        </div>
      </div>
    </div>
  );
};
