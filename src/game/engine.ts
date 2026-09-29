import { AmmoType, BossState, CollectiblePin, Dialogue, Enemy, LevelData, Particle, PickupItem, Platform, PlayerStats } from '../types/game';
import { soundManager } from '../audio/soundManager';

export interface MickeyState {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  speed: number;
  jumpForce: number;
  grounded: boolean;
  jumpsLeft: number;
  coyoteTimer: number;
  jumpPressedPrev: boolean;
  spinPressedPrev: boolean;
  hasAirSpun: boolean;
  facing: 1 | -1;
  isSpinning: boolean;
  spinTimer: number;
  invulnerableTimer: number;
  walkFrame: number;
  aimAngle: number;
  carriedPlatform?: Platform;
}

export class GameEngine {
  public level: LevelData;
  public mickey: MickeyState;
  public stats: PlayerStats;
  public particles: Particle[] = [];
  public currentDialogue: Dialogue | null = null;
  public boss: BossState | null = null;
  public cameraX: number = 0;
  public cameraY: number = 0;
  public viewWidth: number = 880;
  public viewHeight: number = 480;
  private particleIdCounter: number = 0;
  public isCompleted: boolean = false;
  public isGameOver: boolean = false;

  constructor(level: LevelData, existingStats?: PlayerStats) {
    this.level = JSON.parse(JSON.stringify(level));
    this.boss = this.level.boss ? JSON.parse(JSON.stringify(this.level.boss)) : null;

    this.stats = existingStats ? { ...existingStats } : {
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

    this.mickey = {
      x: this.level.startX,
      y: this.level.startY,
      width: 28,
      height: 42,
      vx: 0,
      vy: 0,
      speed: 4.2,
      jumpForce: -10.8,
      grounded: false,
      jumpsLeft: 2,
      coyoteTimer: 8,
      jumpPressedPrev: false,
      spinPressedPrev: false,
      hasAirSpun: false,
      facing: 1,
      isSpinning: false,
      spinTimer: 0,
      invulnerableTimer: 0,
      walkFrame: 0,
      aimAngle: 0,
    };
  }

  // Update input & physics
  public update(keys: Record<string, boolean>, mouse: { x: number; y: number; left: boolean; right: boolean }) {
    if (this.isCompleted || this.isGameOver) return;

    // Movement horizontal
    let moving = false;
    if (keys['KeyA'] || keys['ArrowLeft']) {
      this.mickey.vx = -this.mickey.speed;
      this.mickey.facing = -1;
      moving = true;
    } else if (keys['KeyD'] || keys['ArrowRight']) {
      this.mickey.vx = this.mickey.speed;
      this.mickey.facing = 1;
      moving = true;
    } else {
      this.mickey.vx *= 0.72;
      if (Math.abs(this.mickey.vx) < 0.1) this.mickey.vx = 0;
    }

    if (moving) {
      this.mickey.walkFrame += 0.25;
    }

    // Jump detection with edge trigger & Double Jump
    const jumpKeyDown = !!(keys['KeyW'] || keys['Space'] || keys['ArrowUp']);
    const jumpJustPressed = jumpKeyDown && !this.mickey.jumpPressedPrev;
    this.mickey.jumpPressedPrev = jumpKeyDown;

    // Coyote timer decrement when falling off edges
    if (!this.mickey.grounded && this.mickey.coyoteTimer > 0) {
      this.mickey.coyoteTimer--;
    }

    if (jumpJustPressed) {
      if (this.mickey.grounded || this.mickey.coyoteTimer > 0) {
        // First Jump (from ground or during coyote grace period)
        this.mickey.vy = this.mickey.jumpForce;
        this.mickey.grounded = false;
        this.mickey.coyoteTimer = 0;
        this.mickey.jumpsLeft = 1;
        soundManager.playJump();
        this.createJumpPuff(this.mickey.x + this.mickey.width / 2, this.mickey.y + this.mickey.height);
      } else if (this.mickey.jumpsLeft > 0) {
        // Double Jump in mid-air!
        this.mickey.vy = -10.2;
        this.mickey.jumpsLeft--;
        soundManager.playDoubleJump();
        this.createDoubleJumpRing(this.mickey.x + this.mickey.width / 2, this.mickey.y + this.mickey.height);
      }
    }

    // Spin Attack (KeyE or ShiftLeft or ShiftRight) with edge trigger & Mid-air flutter boost
    const spinKeyDown = !!(keys['KeyE'] || keys['ShiftLeft'] || keys['ShiftRight']);
    const spinJustPressed = spinKeyDown && !this.mickey.spinPressedPrev;
    this.mickey.spinPressedPrev = spinKeyDown;

    if (spinJustPressed && !this.mickey.isSpinning) {
      this.mickey.isSpinning = true;
      this.mickey.spinTimer = 18; // frames
      soundManager.playSpinAttack();
      this.createSpinBurst(this.mickey.x + this.mickey.width / 2, this.mickey.y + this.mickey.height / 2);

      // Epic Mickey aerial spin boost / flutter
      if (!this.mickey.grounded && !this.mickey.hasAirSpun) {
        this.mickey.vy = Math.min(this.mickey.vy, -4.2);
        this.mickey.hasAirSpun = true;
      }
    }

    if (this.mickey.isSpinning) {
      this.mickey.spinTimer--;
      if (this.mickey.spinTimer <= 0) {
        this.mickey.isSpinning = false;
      }
    }

    if (this.mickey.invulnerableTimer > 0) {
      this.mickey.invulnerableTimer--;
    }

    // Gravity: Floatier while spinning in mid-air
    const effectiveGravity = this.mickey.isSpinning ? 0.22 : 0.44;
    this.mickey.vy += effectiveGravity;
    if (this.mickey.vy > 12) this.mickey.vy = 12;

    this.mickey.x += this.mickey.vx;
    this.mickey.y += this.mickey.vy;

    // Calculate aiming angle
    const screenMickeyX = this.mickey.x - this.cameraX + this.mickey.width / 2;
    const screenMickeyY = this.mickey.y - this.cameraY + 16;
    this.mickey.aimAngle = Math.atan2(mouse.y - screenMickeyY, mouse.x - screenMickeyX);

    // Shooting Paint / Thinner (Mouse or keyboard J/K)
    const shootingPaint = (mouse.left || keys['KeyJ']) && this.stats.paint > 0;
    const shootingThinner = (mouse.right || keys['KeyK']) && this.stats.thinner > 0;

    if (shootingPaint) {
      this.shoot('paint');
      this.stats.paint = Math.max(0, this.stats.paint - 0.35);
      soundManager.playPaintSpray();
    }
    if (shootingThinner) {
      this.shoot('thinner');
      this.stats.thinner = Math.max(0, this.stats.thinner - 0.35);
      soundManager.playThinnerSpray();
    }

    // Gradual auto regen for paints
    this.stats.paint = Math.min(this.stats.maxPaint, this.stats.paint + 0.12);
    this.stats.thinner = Math.min(this.stats.maxThinner, this.stats.thinner + 0.12);

    // Update moving platforms
    this.updateMovingPlatforms();

    // Check collisions with world
    this.handleCollisions();

    // Update particles & interactions
    this.updateParticles();

    // Update enemies & spin attack hits
    this.updateEnemies();

    // Update boss if present
    if (this.boss) {
      this.updateBoss();
    }

    // Check pickups & pins
    this.updatePickups();

    // Check dialogue triggers
    this.checkDialogues();

    // Update camera follow
    this.updateCamera();

    // Death / Abyss check
    if (this.mickey.y > this.level.height + 60) {
      this.takeDamage(1);
      this.mickey.x = Math.max(40, this.mickey.x - 180);
      this.mickey.y = this.level.startY;
      this.mickey.vy = 0;
      this.mickey.vx = 0;
    }
  }

  // Shoot paint or thinner stream
  private shoot(type: AmmoType) {
    const startX = this.mickey.x + this.mickey.width / 2;
    const startY = this.mickey.y + 14;
    const speed = 8.5 + Math.random() * 2.5;
    const spread = (Math.random() - 0.5) * 0.18;
    const angle = this.mickey.aimAngle + spread;

    this.particles.push({
      id: this.particleIdCounter++,
      x: startX + Math.cos(angle) * 16,
      y: startY + Math.sin(angle) * 16,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      type,
      radius: Math.random() * 3.5 + 3,
      life: 1.0,
      maxLife: 1.0,
      color: type === 'paint' ? '#38bdf8' : '#4ade80',
    });
  }

  // Moving platforms
  private updateMovingPlatforms() {
    this.level.platforms.forEach(p => {
      if (p.type === 'moving') {
        if (p.vx !== undefined && p.minX !== undefined && p.maxX !== undefined) {
          p.x += p.vx;
          if (p.x <= p.minX || p.x >= p.maxX) {
            p.vx *= -1;
          }
        }
        if (p.vy !== undefined && p.minY !== undefined && p.maxY !== undefined) {
          p.y += p.vy;
          if (p.y <= p.minY || p.y >= p.maxY) {
            p.vy *= -1;
          }
        }
      }
    });
  }

  // Handle world collisions
  private handleCollisions() {
    this.mickey.grounded = false;

    for (const obj of this.level.platforms) {
      let isSolid = false;
      if (obj.type === 'solid' || obj.type === 'moving') isSolid = true;
      if (obj.type === 'paintable' && (obj.progress ?? 0) >= 100) isSolid = true;
      if (obj.type === 'thinnable' && (obj.health ?? 0) > 0) isSolid = true;

      if (isSolid) {
        // Vertical check
        if (this.mickey.x + this.mickey.width > obj.x + 3 && this.mickey.x < obj.x + obj.w - 3) {
          // Landing on top
          if (this.mickey.y + this.mickey.height >= obj.y &&
              this.mickey.y + this.mickey.height <= obj.y + 18 &&
              this.mickey.vy >= 0) {
            this.mickey.y = obj.y - this.mickey.height;
            this.mickey.vy = 0;
            this.mickey.grounded = true;
            this.mickey.jumpsLeft = 2;
            this.mickey.coyoteTimer = 8;
            this.mickey.hasAirSpun = false;

            // Carry with moving platform
            if (obj.type === 'moving') {
              if (obj.vx) this.mickey.x += obj.vx;
            }
          }
          // Hitting head on bottom
          else if (this.mickey.y <= obj.y + obj.h && this.mickey.y >= obj.y + obj.h - 14 && this.mickey.vy < 0) {
            this.mickey.y = obj.y + obj.h;
            this.mickey.vy = 0;
          }
        }

        // Side horizontal collisions (especially for thinnable walls)
        if (obj.type === 'thinnable' || obj.h > 40) {
          if (this.mickey.y + this.mickey.height > obj.y + 6 && this.mickey.y < obj.y + obj.h - 6) {
            if (this.mickey.x + this.mickey.width >= obj.x && this.mickey.x < obj.x + 12) {
              this.mickey.x = obj.x - this.mickey.width;
              this.mickey.vx = 0;
            } else if (this.mickey.x <= obj.x + obj.w && this.mickey.x > obj.x + obj.w - 12) {
              this.mickey.x = obj.x + obj.w;
              this.mickey.vx = 0;
            }
          }
        }
      }

      // Goal portal
      if (obj.type === 'goal') {
        // In boss level, only open when boss is purified or thinner destroyed
        const canFinishBoss = !this.boss || this.boss.hp <= 0 || this.boss.paintPurified >= 100 || this.boss.thinnerDamaged >= 100;
        if (canFinishBoss &&
            this.mickey.x + this.mickey.width > obj.x &&
            this.mickey.x < obj.x + obj.w &&
            this.mickey.y + this.mickey.height > obj.y) {
          this.isCompleted = true;
          soundManager.playVictoryFanfare();
        }
      }
    }
  }

  // Particle physics & world reactions
  private updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.16; // gravity
      p.life -= 0.024;

      // Platform hits
      for (const obj of this.level.platforms) {
        if (p.x >= obj.x && p.x <= obj.x + obj.w && p.y >= obj.y && p.y <= obj.y + obj.h) {
          if (p.type === 'paint' && obj.type === 'paintable') {
            const prevProg = obj.progress ?? 0;
            if (prevProg < 100) {
              obj.progress = Math.min(100, prevProg + 2.8);
              this.stats.paintKarma += 1;
              if (obj.progress >= 100) {
                this.stats.structuresPainted++;
                this.stats.paintKarma += 20;
                soundManager.playStructureRestored();
                this.createSparkles(obj.x + obj.w / 2, obj.y + obj.h / 2, '#38bdf8');
              }
            }
            p.life = 0;
          }

          if (p.type === 'thinner' && obj.type === 'thinnable') {
            const prevHealth = obj.health ?? 100;
            if (prevHealth > 0) {
              obj.health = Math.max(0, prevHealth - 2.8);
              this.stats.thinnerKarma += 1;
              if (obj.health <= 0) {
                this.stats.structuresThinned++;
                this.stats.thinnerKarma += 20;
                soundManager.playDissolve();
                this.createSparkles(obj.x + obj.w / 2, obj.y + obj.h / 2, '#4ade80');
              }
            }
            p.life = 0;
          }

          if (obj.type === 'solid') {
            p.life = 0;
          }
        }
      }

      // Enemy hits
      for (const en of this.level.enemies) {
        if (en.state === 'hostile') {
          if (p.x >= en.x && p.x <= en.x + en.w && p.y >= en.y && p.y <= en.y + en.h) {
            if (p.type === 'paint') {
              en.paintMeter += 3.8;
              this.createImpactSplash(p.x, p.y, '#38bdf8');
              if (en.paintMeter >= 100) {
                en.state = 'friend';
                this.stats.enemiesPurified++;
                this.stats.paintKarma += 45;
                soundManager.playPurify();
                this.createSparkles(en.x + en.w / 2, en.y + en.h / 2, '#38bdf8');
              }
            } else if (p.type === 'thinner') {
              en.thinMeter += 4.2;
              this.createImpactSplash(p.x, p.y, '#4ade80');
              if (en.thinMeter >= 100) {
                en.state = 'dead';
                this.stats.enemiesErased++;
                this.stats.thinnerKarma += 45;
                soundManager.playDissolve();
                this.createSparkles(en.x + en.w / 2, en.y + en.h / 2, '#4ade80');
              }
            }
            p.life = 0;
          }
        }
      }

      // Boss hits
      if (this.boss && (this.boss.paintPurified < 100 && this.boss.thinnerDamaged < 100)) {
        // Tentacle hits
        this.boss.tentacles.forEach(t => {
          if (p.x >= t.x && p.x <= t.x + t.w && p.y >= t.y && p.y <= t.y + t.h) {
            if (p.type === 'paint') {
              this.boss!.paintPurified = Math.min(100, this.boss!.paintPurified + 1.2);
              this.stats.paintKarma += 2;
              this.createImpactSplash(p.x, p.y, '#38bdf8');
              if (this.boss!.paintPurified >= 100) {
                this.onBossPurified();
              }
            } else if (p.type === 'thinner') {
              this.boss!.thinnerDamaged = Math.min(100, this.boss!.thinnerDamaged + 1.2);
              this.boss!.hp = Math.max(0, 100 - this.boss!.thinnerDamaged);
              this.stats.thinnerKarma += 2;
              this.createImpactSplash(p.x, p.y, '#4ade80');
              if (this.boss!.thinnerDamaged >= 100) {
                this.onBossErased();
              }
            }
            p.life = 0;
          }
        });

        // Boss main body hit (center arena ceiling)
        const bossBodyX = 580;
        const bossBodyY = 60;
        const bossBodyW = 240;
        const bossBodyH = 140;
        if (p.x >= bossBodyX && p.x <= bossBodyX + bossBodyW && p.y >= bossBodyY && p.y <= bossBodyY + bossBodyH) {
          if (p.type === 'paint') {
            this.boss.paintPurified = Math.min(100, this.boss.paintPurified + 2.0);
            this.stats.paintKarma += 3;
            this.createImpactSplash(p.x, p.y, '#38bdf8');
            if (this.boss.paintPurified >= 100) {
              this.onBossPurified();
            }
          } else if (p.type === 'thinner') {
            this.boss.thinnerDamaged = Math.min(100, this.boss.thinnerDamaged + 2.0);
            this.boss.hp = Math.max(0, 100 - this.boss.thinnerDamaged);
            this.stats.thinnerKarma += 3;
            this.createImpactSplash(p.x, p.y, '#4ade80');
            if (this.boss.thinnerDamaged >= 100) {
              this.onBossErased();
            }
          }
          p.life = 0;
        }
      }

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  // Boss defeat handlers
  private onBossPurified() {
    if (!this.boss) return;
    this.boss.eyeState = 'purified';
    soundManager.playPurify();
    this.createSparkles(700, 120, '#38bdf8');
    this.currentDialogue = {
      id: 'd_boss_purified',
      speaker: '小精靈格斯 (Gus)',
      avatar: '🧚‍♂️',
      text: '奇蹟發生了！你用純淨的油漆與善意感化了「影之污斑」！它的黑暗化作滿天星辰，荒廢之國正在重新萌發色彩！',
    };
  }

  private onBossErased() {
    if (!this.boss) return;
    soundManager.playDissolve();
    this.createSparkles(700, 120, '#4ade80');
    this.currentDialogue = {
      id: 'd_boss_erased',
      speaker: '小精靈格斯 (Gus)',
      avatar: '🧚‍♂️',
      text: '「影之污斑」在強力溶劑下徹底蒸發瓦解了…荒廢之國的夢魘已經終結，但四周的世界也變得更加孤寂殘破…',
    };
  }

  // Update enemy actions
  private updateEnemies() {
    this.level.enemies.forEach(en => {
      if (en.state === 'dead') return;

      if (en.state === 'hostile') {
        en.x += en.speed * en.dir;
        if (en.x <= en.rangeMin) {
          en.x = en.rangeMin;
          en.dir = 1;
        } else if (en.x >= en.rangeMax) {
          en.x = en.rangeMax;
          en.dir = -1;
        }

        // Contact with Mickey
        const mCenterX = this.mickey.x + this.mickey.width / 2;
        const mCenterY = this.mickey.y + this.mickey.height / 2;
        const enCenterX = en.x + en.w / 2;
        const enCenterY = en.y + en.h / 2;

        const dist = Math.hypot(mCenterX - enCenterX, mCenterY - enCenterY);
        if (dist < 32) {
          // If Mickey is spin attacking
          if (this.mickey.isSpinning) {
            // Push enemy back and stun
            en.x += (enCenterX > mCenterX ? 40 : -40);
            en.paintMeter += 15;
            this.createImpactSplash(enCenterX, enCenterY, '#38bdf8');
          } else if (this.mickey.invulnerableTimer <= 0) {
            // Take damage
            this.takeDamage(1);
            this.mickey.vx = en.dir * 6;
            this.mickey.vy = -5;
          }
        }
      } else if (en.state === 'friend') {
        // Friendly companion bounces cheerfully
        en.y += Math.sin(Date.now() * 0.008) * 0.5;
      }
    });
  }

  // Update Boss behavior
  private updateBoss() {
    if (!this.boss) return;
    this.boss.attackTimer++;

    // Boss tentacles slam
    this.boss.tentacles.forEach(t => {
      t.slamTimer++;
      if (t.slamTimer > 180) {
        t.isSlamming = true;
        t.y += 8;
        if (t.y >= 260) {
          t.slamTimer = 0;
          t.isSlamming = false;
          soundManager.playBossAttack();
          this.createJumpPuff(t.x + t.w / 2, 440);

          // Check if Mickey is squashed under tentacle
          if (this.mickey.x + this.mickey.width > t.x &&
              this.mickey.x < t.x + t.w &&
              this.mickey.y + this.mickey.height >= 400 &&
              this.mickey.invulnerableTimer <= 0) {
            this.takeDamage(1);
          }
        }
      } else {
        // Return slowly upwards
        if (t.y > 140) {
          t.y -= 2;
        }
      }
    });

    // Spawn falling ink drops periodically
    if (this.boss.attackTimer % 90 === 0 && this.boss.paintPurified < 100 && this.boss.thinnerDamaged < 100) {
      const dropX = 300 + Math.random() * 800;
      this.particles.push({
        id: this.particleIdCounter++,
        x: dropX,
        y: 80,
        vx: (Math.random() - 0.5) * 2,
        vy: 3.5,
        type: 'blot',
        radius: 6,
        life: 2.0,
        maxLife: 2.0,
        color: '#1e1b4b',
      });
    }
  }

  // Take damage
  public takeDamage(amount: number) {
    if (this.mickey.invulnerableTimer > 0) return;
    this.stats.hp = Math.max(0, this.stats.hp - amount);
    this.mickey.invulnerableTimer = 50; // frames
    soundManager.playHurt();

    if (this.stats.hp <= 0) {
      this.isGameOver = true;
    }
  }

  // Pickups
  private updatePickups() {
    this.level.pickups.forEach(p => {
      if (p.collected) return;
      p.bobPhase += 0.05;

      const mCenterX = this.mickey.x + this.mickey.width / 2;
      const mCenterY = this.mickey.y + this.mickey.height / 2;
      const dist = Math.hypot(mCenterX - (p.x + p.w / 2), mCenterY - (p.y + p.h / 2));

      if (dist < 28) {
        p.collected = true;
        if (p.type === 'paint_drop') {
          this.stats.paint = Math.min(this.stats.maxPaint, this.stats.paint + 30);
          soundManager.playPickup('paint');
          this.createSparkles(p.x, p.y, '#38bdf8');
        } else if (p.type === 'thinner_drop') {
          this.stats.thinner = Math.min(this.stats.maxThinner, this.stats.thinner + 30);
          soundManager.playPickup('thinner');
          this.createSparkles(p.x, p.y, '#4ade80');
        } else if (p.type === 'heart') {
          this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + 1);
          soundManager.playPickup('heart');
          this.createSparkles(p.x, p.y, '#f43f5e');
        }
      }
    });

    // Pins
    this.level.pins.forEach(pin => {
      if (pin.collected) return;
      const mCenterX = this.mickey.x + this.mickey.width / 2;
      const mCenterY = this.mickey.y + this.mickey.height / 2;
      const dist = Math.hypot(mCenterX - (pin.x + 16), mCenterY - (pin.y + 16));

      if (dist < 32) {
        pin.collected = true;
        if (!this.stats.pinsCollected.includes(pin.id)) {
          this.stats.pinsCollected.push(pin.id);
        }
        soundManager.playPickup('pin');
        this.createSparkles(pin.x + 16, pin.y + 16, '#facc15');
        this.currentDialogue = {
          id: `pin_${pin.id}`,
          speaker: '小精靈格斯 (Gus)',
          avatar: '🧚‍♂️',
          text: `太棒了！你發現了稀有珍藏徽章：【${pin.title}】！${pin.description}`,
        };
      }
    });
  }

  // Check dialogues
  private checkDialogues() {
    for (const d of this.level.dialogues) {
      if (!d.shown && d.triggerX !== undefined && this.mickey.x >= d.triggerX) {
        d.shown = true;
        this.currentDialogue = d;
        break;
      }
    }
  }

  // Camera tracking
  private updateCamera() {
    const targetX = this.mickey.x - this.viewWidth / 2 + this.mickey.width / 2;
    this.cameraX += (targetX - this.cameraX) * 0.1;

    // Clamps
    if (this.cameraX < 0) this.cameraX = 0;
    const maxCamX = Math.max(0, this.level.width - this.viewWidth);
    if (this.cameraX > maxCamX) this.cameraX = maxCamX;

    const targetY = this.mickey.y - this.viewHeight / 2 + this.mickey.height / 2;
    this.cameraY += (targetY - this.cameraY) * 0.08;
    if (this.cameraY < 0) this.cameraY = 0;
    const maxCamY = Math.max(0, this.level.height - this.viewHeight);
    if (this.cameraY > maxCamY) this.cameraY = maxCamY;
  }

  // FX helpers
  private createSparkles(x: number, y: number, color: string) {
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      this.particles.push({
        id: this.particleIdCounter++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        type: 'sparkle',
        radius: Math.random() * 3 + 2,
        life: 1.0,
        maxLife: 1.0,
        color,
      });
    }
  }

  private createImpactSplash(x: number, y: number, color: string) {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        id: this.particleIdCounter++,
        x,
        y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5 - 2,
        type: 'splash',
        radius: Math.random() * 2.5 + 2,
        life: 0.6,
        maxLife: 0.6,
        color,
      });
    }
  }

  private createJumpPuff(x: number, y: number) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        id: this.particleIdCounter++,
        x,
        y,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 1.5,
        type: 'smoke',
        radius: Math.random() * 4 + 2,
        life: 0.5,
        maxLife: 0.5,
        color: 'rgba(203, 213, 225, 0.4)',
      });
    }
  }

  private createDoubleJumpRing(x: number, y: number) {
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      this.particles.push({
        id: this.particleIdCounter++,
        x: x + Math.cos(angle) * 8,
        y: y + Math.sin(angle) * 4,
        vx: Math.cos(angle) * 3.8,
        vy: 1.0 + Math.sin(angle) * 1.6,
        type: 'sparkle',
        radius: 3.5,
        life: 0.55,
        maxLife: 0.55,
        color: '#38bdf8',
      });
    }
  }

  private createSpinBurst(x: number, y: number) {
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      this.particles.push({
        id: this.particleIdCounter++,
        x,
        y,
        vx: Math.cos(angle) * 6,
        vy: Math.sin(angle) * 6,
        type: 'sparkle',
        radius: 3,
        life: 0.4,
        maxLife: 0.4,
        color: '#e2e8f0',
      });
    }
  }
}
