import { LevelData } from '../types/game';

export const LEVELS: LevelData[] = [
  {
    id: 1,
    title: '第一章：荒廢小鎮之街',
    subtitle: 'Mean Street Ruins · 學習畫筆的創造與消融之力',
    width: 2400,
    height: 520,
    startX: 60,
    startY: 380,
    ambientTone: '#0f172a',
    dialogues: [
      {
        id: 'd1_intro',
        speaker: '小精靈格斯 (Gus)',
        avatar: '🧚‍♂️',
        text: '米奇！歡迎來到被遺忘的「荒廢之國」。手握燕席特的神奇畫筆，按【滑鼠左鍵/J】噴灑油漆修復世界，按【滑鼠右鍵/K】噴灑溶劑消融阻礙！',
        triggerX: 80,
      },
      {
        id: 'd1_bridge',
        speaker: '小精靈格斯 (Gus)',
        avatar: '🧚‍♂️',
        text: '看前方的斷橋！那是虛幻的半透明結構，對著它噴灑【油漆】，就能將橋樑實體化！',
        triggerX: 420,
      },
      {
        id: 'd1_enemy',
        speaker: '小精靈格斯 (Gus)',
        avatar: '🧚‍♂️',
        text: '注意！前方的墨水怪（Blotling）！用油漆可以將牠淨化感化為友善同伴；若用溶劑則會將牠徹底抹除。你的每一次選擇都將決定荒廢之國的命運！',
        triggerX: 980,
      },
      {
        id: 'd1_jump_tip',
        speaker: '小精靈格斯 (Gus)',
        avatar: '🧚‍♂️',
        text: '登上高台小秘技：踩著石階起跳，或在空中再次按下【跳躍鍵 (W/空白鍵)】施展【二段跳】！在空中按【迴旋 (E/Shift)】還能微升滯空！',
        triggerX: 1040,
      },
      {
        id: 'd1_end',
        speaker: '小精靈格斯 (Gus)',
        avatar: '🧚‍♂️',
        text: '前面就是前往顛倒鐘樓的通道了！快踏上奧斯華的領地大門！',
        triggerX: 1950,
      }
    ],
    pins: [
      {
        id: 'pin_oswald_remote',
        title: '奧斯華的遙控器',
        description: '幸運兔奧斯華用來操控荒廢之國電力的神祕遙控裝置。象徵被遺忘長子的最初執念。',
        icon: '🎮',
        rarity: 'Rare',
        x: 1315,
        y: 205,
        collected: false,
      }
    ],
    pickups: [
      { id: 'p1_1', type: 'paint_drop', x: 260, y: 390, w: 20, h: 20, collected: false, bobPhase: 0 },
      { id: 'p1_2', type: 'paint_drop', x: 580, y: 340, w: 20, h: 20, collected: false, bobPhase: 1 },
      { id: 'p1_3', type: 'thinner_drop', x: 860, y: 380, w: 20, h: 20, collected: false, bobPhase: 2 },
      { id: 'p1_4', type: 'heart', x: 1130, y: 275, w: 22, h: 22, collected: false, bobPhase: 0.5 },
      { id: 'p1_5', type: 'paint_drop', x: 1540, y: 330, w: 20, h: 20, collected: false, bobPhase: 1.5 },
      { id: 'p1_6', type: 'thinner_drop', x: 1720, y: 380, w: 20, h: 20, collected: false, bobPhase: 2.2 },
    ],
    enemies: [
      {
        id: 'e1_spatter_1',
        type: 'spatter',
        x: 1040,
        y: 410,
        w: 32,
        h: 30,
        vx: 0,
        vy: 0,
        state: 'hostile',
        paintMeter: 0,
        thinMeter: 0,
        speed: 1.1,
        dir: 1,
        rangeMin: 980,
        rangeMax: 1220,
      },
      {
        id: 'e1_spatter_2',
        type: 'spatter',
        x: 1520,
        y: 410,
        w: 32,
        h: 30,
        vx: 0,
        vy: 0,
        state: 'hostile',
        paintMeter: 0,
        thinMeter: 0,
        speed: 1.3,
        dir: -1,
        rangeMin: 1440,
        rangeMax: 1680,
      },
      {
        id: 'e1_sweeper_1',
        type: 'sweeper',
        x: 1800,
        y: 320,
        w: 38,
        h: 34,
        vx: 0,
        vy: 0,
        state: 'hostile',
        paintMeter: 0,
        thinMeter: 0,
        speed: 1.5,
        dir: 1,
        rangeMin: 1720,
        rangeMax: 1960,
      }
    ],
    platforms: [
      // 起始地面
      { id: 'p1', type: 'solid', x: 0, y: 440, w: 460, h: 80, color: '#334155' },
      
      // 【油漆修復橋樑 1】
      { id: 'p_bridge_1', type: 'paintable', x: 460, y: 440, w: 220, h: 24, progress: 0, label: '虛幻斷橋（需油漆）' },

      // 中段平臺
      { id: 'p2', type: 'solid', x: 680, y: 440, w: 240, h: 80, color: '#334155' },

      // 【溶劑消融牆 1】擋住去路的大型腐蝕木障礙
      { id: 'w_thin_1', type: 'thinnable', x: 920, y: 290, w: 36, h: 150, health: 100, maxHealth: 100, label: '腐蝕木障（需溶劑）' },

      // 中間低窪廣場
      { id: 'p3', type: 'solid', x: 920, y: 440, w: 400, h: 80, color: '#334155' },

      // 中繼矮階梯（方便輕鬆跳上中層高台）
      { id: 'p_step_mid_1', type: 'solid', x: 990, y: 385, w: 75, h: 55, color: '#475569', label: '石階台階' },

      // 高處平台（藏有奧斯華遙控器徽章）
      { id: 'p_high_1', type: 'solid', x: 1070, y: 330, w: 140, h: 22, color: '#475569' },
      { id: 'p_high_paint', type: 'paintable', x: 1240, y: 260, w: 150, h: 20, progress: 0, label: '高空浮石（需油漆）' },

      // 溶劑可融穿的暗房地板
      { id: 'p4', type: 'solid', x: 1320, y: 440, w: 320, h: 80, color: '#334155' },

      // 第二堵溶劑牆
      { id: 'w_thin_2', type: 'thinnable', x: 1640, y: 310, w: 34, h: 130, health: 100, maxHealth: 100, label: '荒廢大門鐵柵' },

      // 終點前台階
      { id: 'p5', type: 'solid', x: 1640, y: 440, w: 400, h: 80, color: '#334155' },
      { id: 'p_step_1', type: 'solid', x: 1860, y: 380, w: 90, h: 60, color: '#334155' },
      { id: 'p_step_2', type: 'paintable', x: 1980, y: 330, w: 100, h: 20, progress: 0, label: '迎賓拱門石階' },

      // 終點大門平台
      { id: 'p_end', type: 'solid', x: 2100, y: 440, w: 300, h: 80, color: '#1e293b' },
      { id: 'goal_gate', type: 'goal', x: 2240, y: 330, w: 70, h: 110, label: '鐘樓樞紐大門' },
    ]
  },
  {
    id: 2,
    title: '第二章：顛倒鐘樓與瘋狂齒輪',
    subtitle: 'Crazy Clock Tower · 齒輪轉動、機關消融與高空跳躍',
    width: 2600,
    height: 540,
    startX: 60,
    startY: 400,
    ambientTone: '#172554',
    dialogues: [
      {
        id: 'd2_intro',
        speaker: '小精靈格斯 (Gus)',
        avatar: '🧚‍♂️',
        text: '小心！我們來到了失控的鐘樓！底下的墨水深淵深不見底，千萬別失足掉下去！',
        triggerX: 70,
      },
      {
        id: 'd2_gears',
        speaker: '小精靈格斯 (Gus)',
        avatar: '🧚‍♂️',
        text: '鐘樓的擺鐘齒輪正在移動！你可以噴灑油漆補全斷裂齒條，或是用溶劑溶解擋路的發條重錘！',
        triggerX: 520,
      },
      {
        id: 'd2_spin',
        speaker: '小精靈格斯 (Gus)',
        avatar: '🧚‍♂️',
        text: '別忘了你的【迴旋攻擊】（按空白鍵/E/Shift），可以擊飛墨水怪噴出的墨滴並打破易碎寶箱！',
        triggerX: 1180,
      }
    ],
    pins: [
      {
        id: 'pin_steamboat_whistle',
        title: '蒸汽船威利的金色汽笛',
        description: '1928年第一部有聲卡通《汽船威利號》上的金色汽笛，蘊含著歡笑與旋律的古董寶物。',
        icon: '🚢',
        rarity: 'Rare',
        x: 1420,
        y: 130,
        collected: false,
      }
    ],
    pickups: [
      { id: 'p2_1', type: 'paint_drop', x: 340, y: 360, w: 20, h: 20, collected: false, bobPhase: 0 },
      { id: 'p2_2', type: 'thinner_drop', x: 740, y: 260, w: 20, h: 20, collected: false, bobPhase: 1 },
      { id: 'p2_3', type: 'heart', x: 1040, y: 190, w: 22, h: 22, collected: false, bobPhase: 2 },
      { id: 'p2_4', type: 'paint_drop', x: 1620, y: 290, w: 20, h: 20, collected: false, bobPhase: 0.8 },
      { id: 'p2_5', type: 'thinner_drop', x: 1950, y: 370, w: 20, h: 20, collected: false, bobPhase: 1.8 },
    ],
    enemies: [
      {
        id: 'e2_spatter_1',
        type: 'spatter',
        x: 640,
        y: 320,
        w: 32,
        h: 30,
        vx: 0,
        vy: 0,
        state: 'hostile',
        paintMeter: 0,
        thinMeter: 0,
        speed: 1.2,
        dir: 1,
        rangeMin: 580,
        rangeMax: 760,
      },
      {
        id: 'e2_slobber_1',
        type: 'slobber',
        x: 1200,
        y: 400,
        w: 42,
        h: 38,
        vx: 0,
        vy: 0,
        state: 'hostile',
        paintMeter: 0,
        thinMeter: 0,
        speed: 0.9,
        dir: -1,
        rangeMin: 1100,
        rangeMax: 1360,
      },
      {
        id: 'e2_sweeper_2',
        type: 'sweeper',
        x: 1780,
        y: 280,
        w: 38,
        h: 34,
        vx: 0,
        vy: 0,
        state: 'hostile',
        paintMeter: 0,
        thinMeter: 0,
        speed: 1.4,
        dir: 1,
        rangeMin: 1700,
        rangeMax: 1950,
      }
    ],
    platforms: [
      // 起點基座
      { id: 'p2_start', type: 'solid', x: 0, y: 450, w: 320, h: 90, color: '#1e293b' },

      // 移動平台 1 (垂直升降齒輪)
      { id: 'p2_mov_1', type: 'moving', x: 380, y: 380, w: 110, h: 22, color: '#475569', vy: 1.2, minY: 220, maxY: 420 },

      // 中繼高塔平台
      { id: 'p2_tower_1', type: 'solid', x: 560, y: 350, w: 220, h: 190, color: '#334155' },

      // 可修復的旋轉木齒輪橋
      { id: 'p2_paint_gear', type: 'paintable', x: 780, y: 300, w: 180, h: 24, progress: 0, label: '鐘樓巨型齒輪橋' },

      // 溶劑溶解的吊鐘鐘錘障礙
      { id: 'p2_thin_hammer', type: 'thinnable', x: 990, y: 180, w: 40, h: 180, health: 100, maxHealth: 100, label: '懸掛巨鐘錘' },

      // 水平移動平台
      { id: 'p2_mov_2', type: 'moving', x: 1080, y: 270, w: 120, h: 22, color: '#475569', vx: 1.5, minX: 1060, maxX: 1280 },

      // 隱藏高台（汽船威利號汽笛）
      { id: 'p2_secret_paint', type: 'paintable', x: 1360, y: 180, w: 140, h: 20, progress: 0, label: '雲端秘徑' },

      // 中間安全平台
      { id: 'p2_mid', type: 'solid', x: 1100, y: 440, w: 340, h: 100, color: '#334155' },

      // 溶劑腐蝕牆壁 2
      { id: 'p2_thin_wall2', type: 'thinnable', x: 1440, y: 310, w: 36, h: 130, health: 100, maxHealth: 100, label: '腐蝕鐘樓發條' },

      // 齒輪連環跳躍
      { id: 'p2_paint_step1', type: 'paintable', x: 1540, y: 370, w: 120, h: 22, progress: 0, label: '半月發條' },
      { id: 'p2_mov_3', type: 'moving', x: 1720, y: 310, w: 110, h: 22, color: '#475569', vy: -1.3, minY: 180, maxY: 380 },
      { id: 'p2_paint_step2', type: 'paintable', x: 1900, y: 260, w: 130, h: 22, progress: 0, label: '鐘盤指標' },

      // 終點山崖
      { id: 'p2_goal_plat', type: 'solid', x: 2100, y: 430, w: 500, h: 110, color: '#1e293b' },
      { id: 'goal_tower_gate', type: 'goal', x: 2360, y: 320, w: 80, h: 110, label: '前往暗黑美感城堡' },
    ]
  },
  {
    id: 3,
    title: '第三章：暗黑美感城堡與影之污斑',
    subtitle: 'Dark Beauty Castle & The Shadow Blot · 終極決戰與荒廢之國的宿命',
    width: 1400,
    height: 520,
    startX: 80,
    startY: 380,
    ambientTone: '#18181b',
    dialogues: [
      {
        id: 'd3_intro',
        speaker: '小精靈格斯 (Gus)',
        avatar: '🧚‍♂️',
        text: '那就是…「影之污斑」（The Shadow Blot）！正是因為當年米奇無意間灑翻的墨水與溶劑而誕生的巨型夢魘！',
        triggerX: 90,
      },
      {
        id: 'd3_choice',
        speaker: '小精靈格斯 (Gus)',
        avatar: '🧚‍♂️',
        text: '米奇，這是最後的抉擇！你可以用【溶劑】徹底消滅污斑，讓一切毀滅；亦或是用【油漆】灌注它的心靈核心，感化淨化這個悲劇的造物！',
        triggerX: 250,
      }
    ],
    pins: [
      {
        id: 'pin_yen_sid_hat',
        title: '魔法師燕席特的尖頂帽',
        description: '偉大巫師燕席特的星月法冠。記載著無盡的創造力與墨水魔法之始源。',
        icon: '🧙‍♂️',
        rarity: 'Legendary',
        x: 680,
        y: 110,
        collected: false,
      }
    ],
    pickups: [
      { id: 'p3_1', type: 'paint_drop', x: 180, y: 380, w: 20, h: 20, collected: false, bobPhase: 0 },
      { id: 'p3_2', type: 'thinner_drop', x: 280, y: 380, w: 20, h: 20, collected: false, bobPhase: 1 },
      { id: 'p3_3', type: 'heart', x: 680, y: 220, w: 22, h: 22, collected: false, bobPhase: 1.5 },
      { id: 'p3_4', type: 'paint_drop', x: 1150, y: 380, w: 20, h: 20, collected: false, bobPhase: 0.5 },
      { id: 'p3_5', type: 'thinner_drop', x: 1250, y: 380, w: 20, h: 20, collected: false, bobPhase: 1.8 },
    ],
    enemies: [
      {
        id: 'e3_minion_1',
        type: 'spatter',
        x: 420,
        y: 410,
        w: 32,
        h: 30,
        vx: 0,
        vy: 0,
        state: 'hostile',
        paintMeter: 0,
        thinMeter: 0,
        speed: 1.3,
        dir: 1,
        rangeMin: 360,
        rangeMax: 560,
      },
      {
        id: 'e3_minion_2',
        type: 'spatter',
        x: 950,
        y: 410,
        w: 32,
        h: 30,
        vx: 0,
        vy: 0,
        state: 'hostile',
        paintMeter: 0,
        thinMeter: 0,
        speed: 1.3,
        dir: -1,
        rangeMin: 840,
        rangeMax: 1060,
      }
    ],
    boss: {
      name: '影之污斑 (The Shadow Blot)',
      hp: 100,
      maxHp: 100,
      paintPurified: 0,
      thinnerDamaged: 0,
      phase: 1,
      attackTimer: 0,
      eyeState: 'normal',
      tentacles: [
        { x: 500, y: 140, w: 55, h: 220, health: 60, maxHealth: 60, purified: false, slamTimer: 0, isSlamming: false },
        { x: 850, y: 140, w: 55, h: 220, health: 60, maxHealth: 60, purified: false, slamTimer: 60, isSlamming: false },
      ]
    },
    platforms: [
      // 城堡主殿地板
      { id: 'p3_main', type: 'solid', x: 0, y: 440, w: 1400, h: 80, color: '#1e1b4b' },

      // 左側高階防禦柱
      { id: 'p3_pillar_L', type: 'solid', x: 200, y: 320, w: 120, h: 22, color: '#312e81' },
      { id: 'p3_paint_L', type: 'paintable', x: 220, y: 220, w: 100, h: 20, progress: 0, label: '王座左浮雕' },

      // 右側高階防禦柱
      { id: 'p3_pillar_R', type: 'solid', x: 1080, y: 320, w: 120, h: 22, color: '#312e81' },
      { id: 'p3_paint_R', type: 'paintable', x: 1080, y: 220, w: 100, h: 20, progress: 0, label: '王座右浮雕' },

      // 中間神聖浮石（巫師帽所在之處）
      { id: 'p3_sacred', type: 'paintable', x: 620, y: 180, w: 160, h: 22, progress: 0, label: '純淨墨水聖壇' },

      // 終點光環（當Boss淨化或消滅時啟用）
      { id: 'p3_destiny_gate', type: 'goal', x: 650, y: 330, w: 100, h: 110, label: '荒廢之國命運核心' },
    ]
  }
];
