export type GameState = 'TITLE' | 'PLAYING' | 'PAUSED' | 'VICTORY' | 'GAME_OVER' | 'CHAPTER_CLEAR';

export type AmmoType = 'paint' | 'thinner';

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: AmmoType | 'splash' | 'sparkle' | 'smoke' | 'blot';
  radius: number;
  life: number;
  maxLife: number;
  color: string;
}

export interface Platform {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'solid' | 'paintable' | 'thinnable' | 'hazard' | 'goal' | 'moving';
  label?: string;
  progress?: number; // 0 to 100 for paintable
  health?: number;   // 0 to 100 for thinnable
  maxHealth?: number;
  color?: string;
  vx?: number;
  vy?: number;
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
  direction?: number;
}

export type EnemyType = 'spatter' | 'sweeper' | 'slobber' | 'blot_boss';

export interface Enemy {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  state: 'hostile' | 'friend' | 'dead';
  paintMeter: number; // 0 to 100
  thinMeter: number;  // 0 to 100
  speed: number;
  dir: number;
  rangeMin: number;
  rangeMax: number;
  attackCooldown?: number;
  maxHp?: number;
  hp?: number;
}

export interface BossTentacle {
  x: number;
  y: number;
  w: number;
  h: number;
  health: number;
  maxHealth: number;
  purified: boolean;
  slamTimer: number;
  isSlamming: boolean;
}

export interface BossState {
  name: string;
  hp: number;
  maxHp: number;
  paintPurified: number; // 0 to 100
  thinnerDamaged: number; // 0 to 100
  phase: number;
  attackTimer: number;
  eyeState: 'normal' | 'enraged' | 'purified';
  tentacles: BossTentacle[];
}

export interface CollectiblePin {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
  x: number;
  y: number;
  collected: boolean;
}

export interface PickupItem {
  id: string;
  type: 'paint_drop' | 'thinner_drop' | 'heart';
  x: number;
  y: number;
  w: number;
  h: number;
  collected: boolean;
  bobPhase: number;
}

export interface Dialogue {
  id: string;
  speaker: string;
  avatar: string;
  text: string;
  triggerX?: number;
  shown?: boolean;
}

export interface LevelData {
  id: number;
  title: string;
  subtitle: string;
  width: number;
  height: number;
  startX: number;
  startY: number;
  platforms: Platform[];
  enemies: Enemy[];
  pins: CollectiblePin[];
  pickups: PickupItem[];
  dialogues: Dialogue[];
  boss?: BossState;
  ambientTone: string;
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  paint: number;
  maxPaint: number;
  thinner: number;
  maxThinner: number;
  paintKarma: number;
  thinnerKarma: number;
  enemiesPurified: number;
  enemiesErased: number;
  structuresPainted: number;
  structuresThinned: number;
  pinsCollected: string[];
}
