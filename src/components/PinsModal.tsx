import React from 'react';
import { X, Sparkles, Lock } from 'lucide-react';

interface PinsModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectedPinIds: string[];
}

interface PinDetail {
  id: string;
  title: string;
  chapter: string;
  rarity: string;
  icon: string;
  lore: string;
  hint: string;
}

const ALL_PINS: PinDetail[] = [
  {
    id: 'pin_oswald_remote',
    title: '幸運兔奧斯華的遙控器',
    chapter: '第一章：荒廢小鎮之街',
    rarity: 'Rare 稀有',
    icon: '🎮',
    lore: '在米奇誕生之前，奧斯華曾是華特最受喜愛的長子。被世人遺忘的他來到這座廢土世界，用這台發條遙控器接通了整座王國的電路與心跳。',
    hint: '位於小鎮中段高空的浮石平台上，需要用油漆噴塗隱形石階才能攀登上去。',
  },
  {
    id: 'pin_steamboat_whistle',
    title: '蒸汽船威利的金色汽笛',
    chapter: '第二章：顛倒鐘樓與瘋狂齒輪',
    rarity: 'Rare 稀有',
    icon: '🚢',
    lore: '1928年劃時代的第一部有聲卡通《汽船威利號》上的招牌汽笛。當蒸氣鳴響時，黑白膠捲裡的歡笑聲彷彿仍在荒廢之國的天空迴盪。',
    hint: '藏在巨大鐘樓機關頂部的隱藏雲端通道，需躍過移動的旋轉齒輪才能獲取。',
  },
  {
    id: 'pin_yen_sid_hat',
    title: '魔法師燕席特的尖頂星月帽',
    chapter: '第三章：暗黑美感城堡',
    rarity: 'Legendary 傳奇',
    icon: '🧙‍♂️',
    lore: '魔法師燕席特在工作室裡所戴的尖頂法冠。正是因為米奇戴上它把玩魔法畫筆，才無意間創造了影之污斑與這座荒廢之國。它見證了創造與責任的起點。',
    hint: '位於暗黑美感城堡中央聖壇的最高點，在與影之污斑交戰時攀上純淨聖壇拾取。',
  },
];

export const PinsModal: React.FC<PinsModalProps> = ({
  isOpen,
  onClose,
  collectedPinIds,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-slate-100">
              荒廢之國古董徽章收藏庫 (Pin Gallery)
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
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            荒廢之國散落著承載往昔卡通光輝的稀有珍品徽章。在冒險探索中尋找隱蔽路徑，利用油漆鋪路將它們全數珍藏！
            （已收集：{collectedPinIds.length} / {ALL_PINS.length}）
          </p>

          <div className="grid grid-cols-1 gap-4">
            {ALL_PINS.map(pin => {
              const isUnlocked = collectedPinIds.includes(pin.id);
              return (
                <div
                  key={pin.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isUnlocked
                      ? 'bg-slate-800/80 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                      : 'bg-slate-950/40 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Badge Icon */}
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 border ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-amber-500/30 to-amber-900/40 border-amber-400 text-amber-200 shadow-md'
                          : 'bg-slate-900 border-slate-700 text-slate-600'
                      }`}
                    >
                      {isUnlocked ? pin.icon : <Lock className="w-6 h-6 text-slate-500" />}
                    </div>

                    {/* Badge Details */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <h4 className="font-bold text-slate-200 text-base flex items-center gap-2">
                          {isUnlocked ? pin.title : '未解鎖的神秘古董徽章'}
                        </h4>
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-semibold ${
                            pin.rarity.includes('Legendary')
                              ? 'bg-purple-900/60 text-purple-300 border border-purple-600/40'
                              : 'bg-amber-900/60 text-amber-300 border border-amber-600/40'
                          }`}
                        >
                          {pin.rarity}
                        </span>
                      </div>

                      <div className="text-xs text-sky-400 mb-2">{pin.chapter}</div>

                      <p className="text-xs text-slate-300 leading-relaxed mb-2">
                        {isUnlocked ? pin.lore : '尚未在關卡中發現此徽章。仔細尋找隱藏的浮動平台或腐蝕牆壁！'}
                      </p>

                      {!isUnlocked && (
                        <div className="text-[11px] text-slate-500 italic">
                          線索提示：{pin.hint}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
          >
            返回遊戲
          </button>
        </div>
      </div>
    </div>
  );
};
