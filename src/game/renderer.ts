import { GameEngine, MickeyState } from './engine';
import { BossState, CollectiblePin, Enemy, PickupItem, Platform } from '../types/game';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  public setDimensions(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public render(engine: GameEngine) {
    const { ctx, width, height } = this;
    const { cameraX, cameraY, level, mickey, particles, boss } = engine;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Parallax Background
    this.drawBackground(cameraX, cameraY, level.ambientTone, level.id);

    ctx.save();
    ctx.translate(-cameraX, -cameraY);

    // 2. Draw Platforms & Structures
    level.platforms.forEach(p => this.drawPlatform(p));

    // 3. Draw Pickups
    level.pickups.forEach(pick => this.drawPickup(pick));

    // 4. Draw Collectible Pins
    level.pins.forEach(pin => this.drawPin(pin));

    // 5. Draw Enemies
    level.enemies.forEach(en => this.drawEnemy(en));

    // 6. Draw Boss if present
    if (boss) {
      this.drawBoss(boss);
    }

    // 7. Draw Mickey Mouse
    this.drawMickey(mickey);

    // 8. Draw Particles (Paint & Thinner droplets)
    this.drawParticles(particles);

    ctx.restore();

    // 9. Draw Brush Crosshair & Aim Line
    this.drawCrosshair(mickey, cameraX, cameraY);
  }

  // Parallax Gothic Wasteland Background
  private drawBackground(cameraX: number, cameraY: number, ambientTone: string, levelId: number) {
    const { ctx, width, height } = this;

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    if (levelId === 1) {
      skyGrad.addColorStop(0, '#0a0e17');
      skyGrad.addColorStop(0.6, '#131b2e');
      skyGrad.addColorStop(1, '#1e293b');
    } else if (levelId === 2) {
      skyGrad.addColorStop(0, '#0c1322');
      skyGrad.addColorStop(0.5, '#1e1b4b');
      skyGrad.addColorStop(1, '#312e81');
    } else {
      skyGrad.addColorStop(0, '#09090b');
      skyGrad.addColorStop(0.5, '#18181b');
      skyGrad.addColorStop(1, '#27272a');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Distant Gothic Spires & Twisted Castle Silhouette (slow parallax)
    ctx.save();
    const bgOffset1 = -(cameraX * 0.15) % 800;
    ctx.fillStyle = 'rgba(7, 10, 18, 0.7)';
    for (let i = -1; i < 3; i++) {
      const baseX = bgOffset1 + i * 800;
      ctx.beginPath();
      ctx.moveTo(baseX + 40, height);
      ctx.lineTo(baseX + 100, height - 180);
      ctx.lineTo(baseX + 130, height - 260); // Spire top
      ctx.lineTo(baseX + 160, height - 180);
      ctx.lineTo(baseX + 240, height - 140);
      ctx.lineTo(baseX + 320, height - 290); // Tall cathedral tower
      ctx.lineTo(baseX + 350, height - 340);
      ctx.lineTo(baseX + 380, height - 290);
      ctx.lineTo(baseX + 480, height - 150);
      ctx.lineTo(baseX + 540, height - 220);
      ctx.lineTo(baseX + 580, height - 140);
      ctx.lineTo(baseX + 700, height);
      ctx.fill();
    }

    // Midground clockwork gears / ruined town rooftops (medium parallax)
    const bgOffset2 = -(cameraX * 0.35) % 600;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
    for (let i = -1; i < 3; i++) {
      const baseX = bgOffset2 + i * 600;
      ctx.fillRect(baseX + 20, height - 160, 90, 160);
      ctx.fillRect(baseX + 140, height - 190, 110, 190);
      ctx.fillRect(baseX + 300, height - 140, 130, 140);
      ctx.fillRect(baseX + 460, height - 175, 100, 175);

      // Gear silhouette
      ctx.beginPath();
      ctx.arc(baseX + 280, height - 200, 34, 0, Math.PI * 2);
      ctx.fill();
    }

    // Eerie cartoon crescent moon with ink drips
    ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
    ctx.beginPath();
    ctx.arc(width - 140, 90, 48, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Draw Platform
  private drawPlatform(p: Platform) {
    const { ctx } = this;

    if (p.type === 'solid') {
      // Stylized vintage stonework
      ctx.fillStyle = p.color || '#334155';
      ctx.fillRect(p.x, p.y, p.w, p.h);

      // Highlight bevel
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(p.x, p.y, p.w, 4);

      // Brick borders
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x, p.y, p.w, p.h);
    } else if (p.type === 'moving') {
      // Clockwork moving brass platform
      ctx.fillStyle = '#475569';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x, p.y, p.w, p.h);

      // Suspension cable / gear
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(p.x + 12, p.y + p.h / 2, 4, 0, Math.PI * 2);
      ctx.arc(p.x + p.w - 12, p.y + p.h / 2, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'paintable') {
      const prog = p.progress ?? 0;
      if (prog >= 100) {
        // Fully Restored: Glowing solid cyan brickwork
        ctx.save();
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.strokeStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.lineWidth = 2.5;
        ctx.strokeRect(p.x, p.y, p.w, p.h);

        // Intricate painted filigree
        ctx.fillStyle = '#e0f2fe';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✨ 已修復完成 ✨', p.x + p.w / 2, p.y + p.h / 2 + 4);
        ctx.restore();
      } else {
        // Holographic Blueprint / Transparent phantom platform
        ctx.save();
        const alpha = 0.15 + (prog / 100) * 0.7;
        ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.fillRect(p.x, p.y, p.w, p.h);

        // Dashed glowing outline
        ctx.strokeStyle = '#38bdf8';
        ctx.setLineDash([6, 6]);
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, p.y, p.w, p.h);

        // Progress label
        ctx.fillStyle = '#bae6fd';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`🖌️ 油漆噴塗修復 ${Math.round(prog)}%`, p.x + p.w / 2, p.y + p.h / 2 + 4);
        ctx.restore();
      }
    } else if (p.type === 'thinnable') {
      const health = p.health ?? 100;
      if (health > 0) {
        ctx.save();
        const alpha = health / 100;
        ctx.globalAlpha = Math.max(0.2, alpha);
        ctx.fillStyle = 'rgba(34, 197, 94, 0.45)';
        ctx.fillRect(p.x, p.y, p.w, p.h);

        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, p.y, p.w, p.h);

        // Acid bubbling text
        ctx.fillStyle = '#bbf7d0';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`溶劑消融`, p.x + p.w / 2, p.y + p.h / 2);
        ctx.fillText(`${Math.round(health)}%`, p.x + p.w / 2, p.y + p.h / 2 + 14);
        ctx.restore();
      }
    } else if (p.type === 'goal') {
      // Grand Gothic Portal
      ctx.save();
      ctx.fillStyle = '#312e81';
      ctx.fillRect(p.x, p.y, p.w, p.h);

      // Ornate arch
      ctx.beginPath();
      ctx.arc(p.x + p.w / 2, p.y, p.w / 2, Math.PI, 0);
      ctx.fillStyle = '#312e81';
      ctx.fill();

      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 14;
      ctx.strokeRect(p.x, p.y, p.w, p.h);
      ctx.beginPath();
      ctx.arc(p.x + p.w / 2, p.y, p.w / 2, Math.PI, 0);
      ctx.stroke();

      // Portal energy
      const grad = ctx.createLinearGradient(p.x, p.y, p.x + p.w, p.y + p.h);
      grad.addColorStop(0, '#7e22ce');
      grad.addColorStop(1, '#06b6d4');
      ctx.fillStyle = grad;
      ctx.fillRect(p.x + 8, p.y + 10, p.w - 16, p.h - 10);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('奧斯華的', p.x + p.w / 2, p.y + 45);
      ctx.fillText('命運之門', p.x + p.w / 2, p.y + 65);
      ctx.restore();
    }
  }

  // Draw Pickups
  private drawPickup(pick: PickupItem) {
    if (pick.collected) return;
    const { ctx } = this;
    const bobY = pick.y + Math.sin(pick.bobPhase) * 4;

    ctx.save();
    if (pick.type === 'paint_drop') {
      // Glowing blue droplet
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(pick.x + 10, bobY + 12, 7, 0, Math.PI * 2);
      ctx.fill();

      // Droplet peak
      ctx.beginPath();
      ctx.moveTo(pick.x + 4, bobY + 10);
      ctx.lineTo(pick.x + 10, bobY + 2);
      ctx.lineTo(pick.x + 16, bobY + 10);
      ctx.fill();
    } else if (pick.type === 'thinner_drop') {
      // Acid green droplet
      ctx.fillStyle = '#4ade80';
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(pick.x + 10, bobY + 12, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(pick.x + 4, bobY + 10);
      ctx.lineTo(pick.x + 10, bobY + 2);
      ctx.lineTo(pick.x + 16, bobY + 10);
      ctx.fill();
    } else if (pick.type === 'heart') {
      // Ruby red heart
      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      const cx = pick.x + 11;
      const cy = bobY + 11;
      ctx.moveTo(cx, cy - 2);
      ctx.bezierCurveTo(cx - 8, cy - 10, cx - 12, cy + 2, cx, cy + 10);
      ctx.bezierCurveTo(cx + 12, cy + 2, cx + 8, cy - 10, cx, cy - 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Draw Collectible Pins
  private drawPin(pin: CollectiblePin) {
    if (pin.collected) return;
    const { ctx } = this;
    const bob = Math.sin(Date.now() * 0.005) * 5;
    const y = pin.y + bob;

    ctx.save();
    // Golden radiating coin
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(pin.x + 16, y + 16, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Pin icon
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(pin.icon, pin.x + 16, y + 22);

    ctx.restore();
  }

  // Draw Enemies (Blotlings)
  private drawEnemy(en: Enemy) {
    if (en.state === 'dead') return;
    const { ctx } = this;

    ctx.save();
    const cx = en.x + en.w / 2;
    const cy = en.y + en.h / 2;

    if (en.state === 'friend') {
      // Purified Friendly Blotling: Sparkly Cyan, cheerful smiling eyes
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cx, cy, en.w / 2, 0, Math.PI * 2);
      ctx.fill();

      // Cheerful eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx - 6, cy - 3, 3.5, 0, Math.PI * 2);
      ctx.arc(cx + 6, cy - 3, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Little cute smile
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy + 2, 5, 0, Math.PI);
      ctx.stroke();

      // Floating heart
      ctx.font = '11px sans-serif';
      ctx.fillText('💙', cx - 5, en.y - 8);
    } else {
      // Hostile Blotling: dripping black ink, angry glowing red eyes
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(cx, cy, en.w / 2, 0, Math.PI * 2);
      ctx.fill();

      // Angry slit red eyes
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.ellipse(cx - 6, cy - 2, 3.5, 2, en.dir * 0.2, 0, Math.PI * 2);
      ctx.ellipse(cx + 6, cy - 2, 3.5, 2, -en.dir * 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Sharp ink teeth
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy + 5);
      ctx.lineTo(cx - 2, cy + 9);
      ctx.lineTo(cx + 2, cy + 9);
      ctx.lineTo(cx + 5, cy + 5);
      ctx.fill();

      // Dual Meter: Paint Purification vs Thinner Dissolution
      if (en.paintMeter > 0 || en.thinMeter > 0) {
        const barW = en.w + 10;
        const barX = cx - barW / 2;

        // Background
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.fillRect(barX, en.y - 14, barW, 4);
        ctx.fillRect(barX, en.y - 8, barW, 4);

        // Paint meter (Cyan)
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(barX, en.y - 14, (en.paintMeter / 100) * barW, 4);

        // Thinner meter (Green)
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(barX, en.y - 8, (en.thinMeter / 100) * barW, 4);
      }
    }

    ctx.restore();
  }

  // Draw Boss (The Shadow Blot)
  private drawBoss(boss: BossState) {
    const { ctx } = this;
    const bodyX = 700;
    const bodyY = 120;

    ctx.save();

    // Towering ink aura
    const isPurified = boss.paintPurified >= 100;
    const isErased = boss.thinnerDamaged >= 100;

    // Tentacles
    boss.tentacles.forEach((t, idx) => {
      ctx.save();
      ctx.fillStyle = isPurified ? '#0284c7' : '#09090b';
      ctx.strokeStyle = isPurified ? '#38bdf8' : '#dc2626';
      ctx.lineWidth = 3;

      // Draw curved tentacle
      ctx.beginPath();
      ctx.moveTo(t.x, 0);
      ctx.quadraticCurveTo(t.x + (idx === 0 ? -40 : 40), t.y / 2, t.x + t.w / 2, t.y);
      ctx.lineTo(t.x + t.w, t.y);
      ctx.quadraticCurveTo(t.x + t.w + (idx === 0 ? -20 : 20), t.y / 2, t.x + t.w, 0);
      ctx.fill();
      ctx.stroke();

      // Tentacle slam impact aura
      if (t.isSlamming) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(t.x + t.w / 2, t.y, 40, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    });

    // Main Colossal Body
    ctx.shadowColor = isPurified ? '#38bdf8' : (isErased ? '#4ade80' : '#000000');
    ctx.shadowBlur = 30;
    ctx.fillStyle = isPurified ? 'rgba(56, 189, 248, 0.85)' : '#09090b';
    ctx.beginPath();
    ctx.ellipse(bodyX, bodyY, 130, 80, 0, 0, Math.PI * 2);
    ctx.fill();

    // Menacing / Transformed Eyes
    if (isPurified) {
      // Peaceful golden eyes
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(bodyX - 40, bodyY - 10, 16, 0, Math.PI * 2);
      ctx.arc(bodyX + 40, bodyY - 10, 16, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Glowing sinister yellow Blot eyes
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.ellipse(bodyX - 45, bodyY - 10, 20, 12, -0.2, 0, Math.PI * 2);
      ctx.ellipse(bodyX + 45, bodyY - 10, 20, 12, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Red pupils
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(bodyX - 45, bodyY - 10, 6, 0, Math.PI * 2);
      ctx.arc(bodyX + 45, bodyY - 10, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Boss Dual Status Meters (Purify vs Destroy)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(bodyX - 160, 20, 320, 32);
    ctx.strokeStyle = '#475569';
    ctx.strokeRect(bodyX - 160, 20, 320, 32);

    // Paint Purify Bar (Cyan)
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(bodyX - 156, 23, (boss.paintPurified / 100) * 152, 11);

    // Thinner Damage Bar (Green)
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(bodyX + 4, 23, (boss.thinnerDamaged / 100) * 152, 11);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('影之污斑 (THE SHADOW BLOT)', bodyX, 15);
    ctx.fillText(`【油漆感化】 ${Math.round(boss.paintPurified)}%`, bodyX - 80, 47);
    ctx.fillText(`【溶劑毀滅】 ${Math.round(boss.thinnerDamaged)}%`, bodyX + 80, 47);

    ctx.restore();
  }

  // Draw Mickey Mouse
  private drawMickey(mickey: MickeyState) {
    const { ctx } = this;
    const { x, y, width, height, facing, isSpinning, invulnerableTimer, walkFrame } = mickey;

    // Invulnerability blink
    if (invulnerableTimer > 0 && Math.floor(invulnerableTimer / 4) % 2 === 0) {
      return;
    }

    ctx.save();
    const cx = x + width / 2;
    const cy = y + height / 2;

    // Spin attack whirl effect
    if (isSpinning) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 32, 22, Date.now() * 0.02, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Facing direction
    ctx.translate(cx, cy);
    ctx.scale(facing, 1);
    ctx.translate(-cx, -cy);

    // 1. Red Shorts
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x + 4, y + 20, 20, 15);

    // Iconic White Oval Buttons
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(x + 9, y + 26, 2.5, 3.5, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 19, y + 26, 2.5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Yellow Shoes with walk cycle bounce
    const walkBob = Math.sin(walkFrame) * 4;
    ctx.fillStyle = '#eab308';
    ctx.fillRect(x + 2, y + 35 + (facing === 1 ? walkBob : -walkBob), 11, 7);
    ctx.fillRect(x + 15, y + 35 + (facing === 1 ? -walkBob : walkBob), 11, 7);

    // 3. Black Torso & Neck
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 7, y + 14, 14, 8);

    // 4. Round Mickey Head
    ctx.beginPath();
    ctx.arc(x + 14, y + 11, 10, 0, Math.PI * 2);
    ctx.fill();

    // 5. Classic Big Round Ears
    ctx.beginPath();
    ctx.arc(x + 5, y + 3, 6, 0, Math.PI * 2);
    ctx.arc(x + 23, y + 3, 6, 0, Math.PI * 2);
    ctx.fill();

    // 6. Face Snout & 1930s Pie Eyes
    ctx.fillStyle = '#fce7f3'; // Vintage cartoon skin tone
    ctx.beginPath();
    ctx.ellipse(x + 17, y + 12, 6, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Black nose
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(x + 22, y + 11, 2.5, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(x + 16, y + 9, 1.8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // 7. Magic Paint Brush in Hand
    ctx.save();
    const brushStartX = x + 16;
    const brushStartY = y + 16;
    ctx.translate(brushStartX, brushStartY);
    // Orient brush according to aim angle
    const localAngle = facing === 1 ? mickey.aimAngle : Math.PI - mickey.aimAngle;
    ctx.rotate(localAngle);

    // Brush handle (wooden brown)
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, -2, 22, 4);

    // Silver ferrule
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(22, -3, 6, 6);

    // Glowing bristle tip
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(28, -4);
    ctx.lineTo(36, 0);
    ctx.lineTo(28, 4);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  // Draw Particles
  private drawParticles(particles: GameEngine['particles']) {
    const { ctx } = this;

    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);

      if (p.type === 'paint') {
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
      } else if (p.type === 'thinner') {
        ctx.fillStyle = '#4ade80';
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur = 8;
      } else if (p.type === 'blot') {
        ctx.fillStyle = '#18181b';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 6;
      } else {
        ctx.fillStyle = p.color;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  // Draw Crosshair on screen
  private drawCrosshair(mickey: MickeyState, cameraX: number, cameraY: number) {
    const { ctx } = this;
    const screenMickeyX = mickey.x - cameraX + mickey.width / 2;
    const screenMickeyY = mickey.y - cameraY + 16;

    // Laser / splatter guide line
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(screenMickeyX, screenMickeyY);
    ctx.lineTo(
      screenMickeyX + Math.cos(mickey.aimAngle) * 70,
      screenMickeyY + Math.sin(mickey.aimAngle) * 70
    );
    ctx.stroke();
    ctx.restore();
  }
}
