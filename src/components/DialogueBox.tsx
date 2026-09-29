import React from 'react';
import { Dialogue } from '../types/game';
import { Check } from 'lucide-react';

interface DialogueBoxProps {
  dialogue: Dialogue | null;
  onDismiss: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ dialogue, onDismiss }) => {
  if (!dialogue) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-2xl bg-slate-950/90 border-2 border-amber-500/60 rounded-xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md z-30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-start gap-4">
        {/* Speaker Avatar Icon */}
        <div className="w-12 h-12 rounded-lg bg-amber-950/50 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0 shadow-inner">
          {dialogue.avatar}
        </div>

        {/* Text Area */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-amber-300 text-sm tracking-wide">
              {dialogue.speaker}
            </span>
            <span className="text-[11px] text-slate-400">荒廢之國指引</span>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed font-normal">
            {dialogue.text}
          </p>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          className="self-end px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
        >
          <Check className="w-3.5 h-3.5" />
          了解
        </button>
      </div>
    </div>
  );
};
