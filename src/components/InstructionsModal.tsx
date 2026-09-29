import React from 'react';
import { X, MousePointer, Keyboard, ShieldAlert, Sparkles, Wand2 } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-bold text-slate-100">
              《傳奇米奇：荒廢之國的畫筆》操作與哲學指南
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Section 1: Paint vs Thinner */}
          <div>
            <h4 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-sky-400" />
              雙生核心力量：油漆（Paint）與溶劑（Thinner）
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-800/50">
                <span className="font-bold text-sky-400 block mb-1 text-sm">
                  🖌️ 油漆（Paint · 藍色）—— 創造與修復
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  將虛幻半透明的藍圖平台「實體化」為安全落腳點；噴塗墨水怪（Blotlings）可感化淨化牠們成為歡樂友善的夥伴。多用油漆將開啟象徵生機重煥的【守護者結局】。
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/50">
                <span className="font-bold text-emerald-400 block mb-1 text-sm">
                  🧪 溶劑（Thinner · 綠色）—— 抹除與消融
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  將阻礙去路的腐蝕綠色厚牆、齒輪與機關迅速「溶解穿透」；噴灑敵人會將其直接抹滅成墨汁煙塵。多用溶劑掃除障礙將步向肅殺冷徹的【抹滅者結局】。
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Controls Table */}
          <div>
            <h4 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-3">
              <Keyboard className="w-4 h-4 text-amber-400" />
              鍵盤與滑鼠操控說明
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/40 border border-slate-800">
                <span className="text-slate-400">左右移動</span>
                <span className="font-bold text-slate-200">A / D 或 方向鍵 ← / →</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/40 border border-slate-800">
                <span className="text-slate-400">跳躍 / 二段跳</span>
                <span className="font-bold text-slate-200">W 或 空白鍵 / ↑（空中再按一次可二段跳）</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/40 border border-slate-800">
                <span className="text-sky-400 font-semibold">噴塗油漆（修復/感化）</span>
                <span className="font-bold text-slate-200">滑鼠左鍵 或 鍵盤 J</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/40 border border-slate-800">
                <span className="text-emerald-400 font-semibold">噴灑溶劑（消融/抹除）</span>
                <span className="font-bold text-slate-200">滑鼠右鍵 或 鍵盤 K</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/40 border border-slate-800">
                <span className="text-amber-400 font-semibold">迴旋攻擊 / 空中滯空</span>
                <span className="font-bold text-slate-200">鍵盤 E 或 Shift 鍵（空中按可向上浮空）</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/40 border border-slate-800">
                <span className="text-slate-400">瞄準畫筆射擊方向</span>
                <span className="font-bold text-slate-200">移動滑鼠準星</span>
              </div>
            </div>
          </div>

          {/* Section 3: Pro Tips */}
          <div>
            <h4 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              通關探險提示
            </h4>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>顏料槽消耗過快時不必驚慌，畫筆會緩慢自動吸收周圍游離色彩，關卡中亦有藍綠顏料滴可拾取。</li>
              <li>「迴旋攻擊」能擊退近距離撲上來的墨水怪，並擊碎從空中掉落的腐蝕墨滴。</li>
              <li>在第三章面對強大的「影之污斑」時，你可以選擇將它的雙觸手與核心用油漆填滿（感化）或是用溶劑消融（毀滅），觸發專屬最終結局！</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
          >
            我準備好了，出發！
          </button>
        </div>
      </div>
    </div>
  );
};
