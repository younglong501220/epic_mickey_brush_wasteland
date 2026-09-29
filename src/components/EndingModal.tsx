import React from 'react';
import { PlayerStats } from '../types/game';
import { Sparkles, Trophy, RotateCcw, Heart, Palette, Trash2, Award } from 'lucide-react';
import bannerShadowBlot from '../assets/images/shadow_blot_wasteland_1790687656440.jpg';
import bannerEpicMickey from '../assets/images/epic_mickey_banner_1790687630230.jpg';
import bannerOswald from '../assets/images/oswald_wasteland_portrait_1790687643935.jpg';

interface EndingModalProps {
  isOpen: boolean;
  stats: PlayerStats;
  onRestart: () => void;
  onSelectLevel: (levelId: number) => void;
}

export const EndingModal: React.FC<EndingModalProps> = ({
  isOpen,
  stats,
  onRestart,
  onSelectLevel,
}) => {
  if (!isOpen) return null;

  // Determine moral path
  const isGuardian = stats.paintKarma >= stats.thinnerKarma;
  const isScrapper = stats.thinnerKarma > stats.paintKarma + 30;
  const isBalanced = !isScrapper && Math.abs(stats.paintKarma - stats.thinnerKarma) <= 30;

  let endingKey: 'guardian' | 'scrapper' | 'balanced' = 'guardian';
  let title = '';
  let subtitle = '';
  let desc = '';
  let bannerImg = '';
  let badgeColor = '';

  if (isScrapper) {
    endingKey = 'scrapper';
    title = '【抹滅之道 · 孤寂的肅清者】';
    subtitle = 'The Scrapper\'s Desolation · 溶劑抹除了一切，世界重歸死寂';
    desc = '米奇揮動強力的溶劑，將影之污斑與擋路的所有障礙消融殆盡。怪物灰飛煙滅，荒廢之國迎來了徹底的平靜。然而，殘破的廢土並未重煥生機。幸運兔奧斯華敬畏而謹慎地注視著你那柄充滿破壞力的畫筆，默默回到了自己的鐘樓高處。';
    bannerImg = bannerShadowBlot;
    badgeColor = 'text-emerald-400 bg-emerald-950/50 border-emerald-500/40';
  } else if (isBalanced) {
    endingKey = 'balanced';
    title = '【雙生之道 · 命運的調和者】';
    subtitle = 'Master of Two Inks · 創造與抹除，乃卡通藝術的一體兩面';
    desc = '你深刻體悟到燕席特大師畫筆的真正奧秘：油漆帶來希望與色彩，溶劑則破除腐朽與阻隔。你既修復了道路，也適時抹除了不可逆的墨斑。奧斯華向你點頭致敬，荒廢之國在微妙的平衡中找到了前進的新方向。';
    bannerImg = bannerEpicMickey;
    badgeColor = 'text-purple-400 bg-purple-950/50 border-purple-500/40';
  } else {
    endingKey = 'guardian';
    title = '【救贖之道 · 重煥生機的守護者】';
    subtitle = 'Guardian of Wasteland · 兄弟重聚，荒廢之國迎來絢麗彩虹！';
    desc = '米奇始終堅持用油漆修復每一座虛幻橋樑與機關，並感化了狂暴的墨水怪，甚至將影之污斑淨化為璀璨的滿天星辰！荒廢之國重新被賦予生命的光彩。幸運兔奧斯華走上前來，卸下了多年的防備，給了米奇一個真摯的擁抱——被遺忘的兄弟終於在色彩中重逢！';
    bannerImg = bannerOswald;
    badgeColor = 'text-sky-400 bg-sky-950/50 border-sky-500/40';
  }

  const totalKarma = Math.max(1, stats.paintKarma + stats.thinnerKarma);
  const paintPct = Math.round((stats.paintKarma / totalKarma) * 100);
  const thinnerPct = 100 - paintPct;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Cinematic Banner */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-950 overflow-hidden shrink-0">
          <img
            src={bannerImg}
            alt="Ending Cinematic Banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-2 ${badgeColor}`}>
              {endingKey === 'guardian' ? '🌟 守護者結局 (GUARDIAN)' : (endingKey === 'scrapper' ? '🧪 抹滅者結局 (SCRAPPER)' : '⚖️ 平衡者結局 (BALANCED)')}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide drop-shadow-md">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Narrative & Statistics */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Narrative text */}
          <p className="text-slate-200 text-sm leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800">
            {desc}
          </p>

          {/* Statistics Grid */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              探險統計與道德記錄 (Moral Analytics)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <Palette className="w-5 h-5 text-sky-400 mx-auto mb-1" />
                <span className="text-[11px] text-slate-400 block">感化怪物</span>
                <span className="text-lg font-bold text-sky-300 tabular-nums">{stats.enemiesPurified}</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <Trash2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-[11px] text-slate-400 block">消融抹除</span>
                <span className="text-lg font-bold text-emerald-300 tabular-nums">{stats.enemiesErased}</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <Sparkles className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="text-[11px] text-slate-400 block">修復建築</span>
                <span className="text-lg font-bold text-amber-300 tabular-nums">{stats.structuresPainted}</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <Award className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <span className="text-[11px] text-slate-400 block">收集徽章</span>
                <span className="text-lg font-bold text-purple-300 tabular-nums">{stats.pinsCollected.length} / 3</span>
              </div>
            </div>
          </div>

          {/* Moral Ratio Bar */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-sky-400">油漆傾向 {paintPct}%</span>
              <span className="text-slate-400">最終道德光譜</span>
              <span className="text-emerald-400">溶劑傾向 {thinnerPct}%</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
              <div className="bg-sky-400 h-full transition-all" style={{ width: `${paintPct}%` }} />
              <div className="bg-emerald-400 h-full transition-all" style={{ width: `${thinnerPct}%` }} />
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => onSelectLevel(1)}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              回第 1 章
            </button>
            <button
              onClick={() => onSelectLevel(2)}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              回第 2 章
            </button>
            <button
              onClick={() => onSelectLevel(3)}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              再戰影之污斑
            </button>
          </div>

          <button
            onClick={onRestart}
            className="px-5 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-sky-900/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            重新探索完整旅程
          </button>
        </div>
      </div>
    </div>
  );
};
