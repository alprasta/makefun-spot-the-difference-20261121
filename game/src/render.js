// Drawing only: the world's state and the current screen in, pixels out.
// The 1280x720 playfield is scaled to fit the window and centred, the
// margin filled with the backdrop colour. Both picture panels are drawn
// from the same scene module — the left panel is the original, the right
// one the twin with the differences — then the markers, the HUD and the
// screen's overlay are painted over them.
import {
  BUTTONS, FIELD, HEADER, PALETTE, PANEL,
  PANEL_LEFT, PANEL_RIGHT,
} from './config.js';
import { SCENES } from './scenes.js';
import {
  SCREEN_LEVEL_CLEAR, SCREEN_LEVEL_FAILED, SCREEN_PAUSED, SCREEN_PLAY,
  SCREEN_TITLE, SCREEN_VICTORY,
} from './world.js';
import {
  disc, label, oval, pathDisc, pathRoundRect, rect, rrect, strokeRrect,
} from './draw-helpers.js';

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  const view = { scale: 1, x: 0, y: 0 };

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(window.innerWidth * ratio);
    canvas.height = Math.round(window.innerHeight * ratio);
    view.scale = Math.min(canvas.width / FIELD.width, canvas.height / FIELD.height);
    view.x = (canvas.width - FIELD.width * view.scale) / 2;
    view.y = (canvas.height - FIELD.height * view.scale) / 2;
  }

  function toLogical(clientX, clientY) {
    const ratio = window.devicePixelRatio || 1;
    return {
      x: (clientX * ratio - view.x) / view.scale,
      y: (clientY * ratio - view.y) / view.scale,
    };
  }

  function drawPanels(state, now) {
    const scene = SCENES[state.level];
    const panels = [[PANEL_LEFT, 0, 'LEFT'], [PANEL_RIGHT, 1, 'RIGHT']];
    for (const [origin, variant, tag] of panels) {
      // Panel shadow and the picture itself, clipped to a rounded rect.
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      pathRoundRect(ctx, origin.x + 4, origin.y + 5, PANEL.width, PANEL.height, 14);
      ctx.fill();
      ctx.save();
      ctx.beginPath();
      pathRoundRect(ctx, origin.x, origin.y, PANEL.width, PANEL.height, 12);
      ctx.clip();
      ctx.translate(origin.x, origin.y);
      scene.draw(ctx, variant);
      ctx.restore();
      strokeRrect(ctx, origin.x, origin.y, PANEL.width, PANEL.height, 12, PALETTE.panelEdge, 3);
      // Tag chip in the panel's top-left corner.
      rrect(ctx, origin.x + 10, origin.y + 10, 64, 26, 13, 'rgba(23, 26, 38, 0.72)');
      label(ctx, tag, origin.x + 42, origin.y + 24, 15, PALETTE.text, 'center', 800);

      // Found markers: a gold ring and a check badge, on both panels.
      for (const index of state.found) {
        const d = scene.differences[index];
        const cx = origin.x + d.x;
        const cy = origin.y + d.y;
        ctx.strokeStyle = PALETTE.foundRing;
        ctx.lineWidth = 5;
        pathDisc(ctx, cx, cy, d.r + 5);
        ctx.stroke();
        ctx.strokeStyle = PALETTE.foundRing;
        ctx.lineWidth = 2;
        pathDisc(ctx, cx, cy, d.r + 11);
        ctx.stroke();
        disc(ctx, cx + d.r * 0.72, cy - d.r * 0.72, 12, PALETTE.foundRing);
        ctx.strokeStyle = PALETTE.foundCheck;
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx + d.r * 0.72 - 6, cy - d.r * 0.72);
        ctx.lineTo(cx + d.r * 0.72 - 1, cy - d.r * 0.72 + 5);
        ctx.lineTo(cx + d.r * 0.72 + 7, cy - d.r * 0.72 - 5);
        ctx.stroke();
      }

      // Hint pulse: a breathing dashed ring over one still-hidden difference.
      if (state.hintIndex >= 0 && state.hintTimer > 0) {
        const d = scene.differences[state.hintIndex];
        const pulse = 1 + 0.12 * Math.sin(now / 160);
        ctx.strokeStyle = PALETTE.hintRing;
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 8]);
        pathDisc(ctx, origin.x + d.x, origin.y + d.y, (d.r + 8) * pulse);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Wrong-click flash: a fading red cross where the player clicked.
      if (state.wrongFlash !== null) {
        const f = state.wrongFlash;
        const age = 1 - Math.max(0, f.until - state.elapsed) / 0.6;
        ctx.globalAlpha = Math.max(0, 1 - age);
        ctx.strokeStyle = PALETTE.wrongRing;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        const s = 14;
        ctx.beginPath();
        ctx.moveTo(origin.x + f.x - s, origin.y + f.y - s);
        ctx.lineTo(origin.x + f.x + s, origin.y + f.y + s);
        ctx.moveTo(origin.x + f.x + s, origin.y + f.y - s);
        ctx.lineTo(origin.x + f.x - s, origin.y + f.y + s);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Floating score text over the panel where the find happened.
      for (const fl of state.floaters) {
        const age = 1 - Math.max(0, fl.until - state.elapsed) / 1.2;
        ctx.globalAlpha = Math.max(0, 1 - age);
        label(ctx, fl.text, origin.x + fl.x, origin.y + fl.y - age * 26, 26, PALETTE.gold, 'center', 800);
        ctx.globalAlpha = 1;
      }
    }
  }

  function drawHeader(state) {
    const scene = SCENES[state.level];
    rect(ctx, 0, 0, FIELD.width, HEADER.height, PALETTE.header);
    label(ctx, 'DOUBLE TAKE', 24, 30, 30, PALETTE.gold, 'left', 800);
    label(ctx, `Scene ${state.level + 1} of ${SCENES.length}  ·  ${scene.name}`, 24, 62, 17, PALETTE.muted, 'left', 600);

    // Timer bar in the middle, draining as the level runs out.
    const bar = { x: 470, y: 22, w: 340, h: 20 };
    const frac = Math.max(0, state.timeLeft / scene.timeLimit);
    rrect(ctx, bar.x, bar.y, bar.w, bar.h, 10, '#10131d');
    const timerColor = frac < 0.2 ? PALETTE.timerLow : PALETTE.timerOk;
    if (frac > 0) rrect(ctx, bar.x, bar.y, bar.w * frac, bar.h, 10, timerColor);
    label(ctx, formatTime(state.timeLeft), bar.x + bar.w / 2, bar.y + 11, 15, PALETTE.text, 'center', 800);
    label(ctx, scene.subtitle, 640, 62, 16, PALETTE.muted, 'center', 600);

    // Score and the found counter on the right; a live combo rides on the score line.
    const scoreText = state.combo >= 2
      ? `SCORE  ${state.score}  ·  COMBO ×${state.combo}`
      : `SCORE  ${state.score}`;
    label(ctx, scoreText, 1256, 30, 26, PALETTE.text, 'right', 800);
    const remaining = scene.differences.length - state.found.size;
    const counter = remaining === 0
      ? `ALL ${scene.differences.length} FOUND!`
      : `FOUND ${state.found.size} / ${scene.differences.length}  ·  ${remaining} TO GO`;
    label(ctx, counter, 1256, 62, 18, remaining === 0 ? PALETTE.green : PALETTE.gold, 'right', 800);
  }

  function drawFooter(state, soundOn) {
    // Buttons.
    const buttons = [
      {
        ...BUTTONS.hint,
        label: `Hint  (${state.hintsLeft} left · H)`,
        enabled: state.hintsLeft > 0 && state.screen === SCREEN_PLAY,
      },
      {
        ...BUTTONS.pause,
        label: state.screen === SCREEN_PAUSED ? 'Resume  (P)' : 'Pause  (P)',
        enabled: true,
      },
      {
        ...BUTTONS.sound,
        label: soundOn ? 'Sound: On  (M)' : 'Sound: Off  (M)',
        enabled: true,
      },
    ];
    for (const b of buttons) {
      rrect(ctx, b.x, b.y, b.w, b.h, 10, b.enabled ? PALETTE.panel : '#1a1e2c');
      strokeRrect(ctx, b.x, b.y, b.w, b.h, 10, PALETTE.panelEdge, 2);
      label(ctx, b.label, b.x + b.w / 2, b.y + b.h / 2 + 1, 18, b.enabled ? PALETTE.text : PALETTE.muted, 'center', 700);
    }
    // How to play, on the right of the footer.
    label(ctx, 'Click a difference on either picture — it counts on both.', 660, 598, 17, PALETTE.muted, 'left', 600);
    label(ctx, 'H hint · P pause · M sound · find all 7 before the clock runs out', 660, 626, 17, PALETTE.muted, 'left', 600);
    // The last find, as a toast between the panels and the buttons.
    if (state.lastFoundLabel && state.screen === SCREEN_PLAY) {
      label(ctx, `Found: ${state.lastFoundLabel}!`, 640, 562, 18, PALETTE.gold, 'center', 700);
    }
  }

  function drawOverlay(title, lines, prompt, accent) {
    ctx.fillStyle = 'rgba(16, 18, 28, 0.72)';
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    const w = 680;
    const h = 130 + lines.length * 36 + 64;
    const x = (FIELD.width - w) / 2;
    const y = (FIELD.height - h) / 2;
    rrect(ctx, x, y, w, h, 18, PALETTE.panel);
    strokeRrect(ctx, x, y, w, h, 18, PALETTE.panelEdge, 2);
    label(ctx, title, FIELD.width / 2, y + 52, 44, accent, 'center', 800);
    for (let i = 0; i < lines.length; i += 1) {
      label(ctx, lines[i], FIELD.width / 2, y + 108 + i * 36, 21, PALETTE.text, 'center', 600);
    }
    label(ctx, prompt, FIELD.width / 2, y + h - 36, 20, PALETTE.gold, 'center', 700);
  }

  function draw(state, best, soundOn, now) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = PALETTE.backdrop;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(view.scale, 0, 0, view.scale, view.x, view.y);
    const scene = SCENES[state.level];

    if (state.screen === SCREEN_TITLE) {
      drawPanels(state, now);
      ctx.fillStyle = 'rgba(16, 18, 28, 0.66)';
      ctx.fillRect(0, 0, FIELD.width, FIELD.height);
      label(ctx, 'DOUBLE TAKE', 640, 168, 84, PALETTE.gold, 'center', 800);
      label(ctx, 'A spot-the-difference hunt in three hand-drawn scenes', 640, 232, 26, PALETTE.text, 'center', 600);
      label(ctx, 'Two pictures side by side. Seven differences hiding in each.', 640, 272, 22, PALETTE.muted, 'center', 600);
      label(ctx, 'Find them all before the clock runs out — wrong clicks cost points.', 640, 306, 22, PALETTE.muted, 'center', 600);
      label(ctx, 'Sunny Garden  ·  Cozy Kitchen  ·  Harbor at Dusk', 640, 356, 22, PALETTE.blue, 'center', 700);
      if (best > 0) label(ctx, `Best score: ${best}`, 640, 402, 20, PALETTE.gold, 'center', 700);
      label(ctx, 'Click or press Space to play', 640, 462, 26, PALETTE.gold, 'center', 800);
      label(ctx, 'Click a difference · H hint · P pause · M sound', 640, 506, 18, PALETTE.muted, 'center', 600);
      return;
    }

    drawHeader(state);
    drawPanels(state, now);
    drawFooter(state, soundOn);

    if (state.screen === SCREEN_PAUSED) {
      drawOverlay('Paused', ['The clock is waiting for you.'], 'Press P or click Resume to carry on', PALETTE.text);
    } else if (state.screen === SCREEN_LEVEL_CLEAR) {
      drawOverlay('Scene Complete!', [
        `${scene.name} — all ${scene.differences.length} differences found`,
        `Time bonus +${state.timeBonus}  ·  Scene score ${state.levelScore + state.timeBonus}`,
        `Total score ${state.score}`,
      ], 'Click or press Space for the next scene', PALETTE.green);
    } else if (state.screen === SCREEN_LEVEL_FAILED) {
      drawOverlay("Time's Up!", [
        `${scene.name} — you found ${state.found.size} of ${scene.differences.length} differences`,
        `Total score ${state.score} — the scene keeps its own score`,
      ], 'Click or press Space to retry this scene', PALETTE.red);
    } else if (state.screen === SCREEN_VICTORY) {
      const perLevel = state.levelScores.map((s, i) => `${SCENES[i].name}: ${s}`).join('   ·   ');
      drawOverlay('You Found Them All!', [
        `All ${SCENES.length} scenes complete — every difference spotted`,
        perLevel,
        `Total score ${state.score}${state.score >= best && best > 0 ? '  ·  New best!' : ''}`,
      ], 'Click or press Space to play again', PALETTE.gold);
    }
  }

  resize();
  window.addEventListener('resize', resize);
  return { draw, toLogical };
}
