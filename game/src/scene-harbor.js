// Scene 3 — "Harbor at Dusk". A small fishing harbour as the light goes:
// a striped lighthouse, a sailboat, a rowing boat, gulls overhead, crates
// on the dock and a buoy bobbing in the swell.
// variant 0 is the left picture, variant 1 the right one with the seven
// differences applied.
import {
  disc, oval, pathDisc, rect, rrect, seg, shape, strokeRrect,
} from './draw-helpers.js';

export const harbor = {
  name: 'Harbor at Dusk',
  subtitle: 'The last boat in before dark',
  timeLimit: 100,
  differences: [
    { x: 150, y: 115, r: 30, label: 'the lighthouse beam' },
    { x: 330, y: 150, r: 30, label: 'the sail changed colour' },
    { x: 430, y: 62, r: 26, label: 'one of the gulls' },
    { x: 500, y: 360, r: 22, label: 'the buoy in the water' },
    { x: 520, y: 55, r: 28, label: 'the moon went crescent' },
    { x: 150, y: 365, r: 28, label: 'a crate on the dock' },
    { x: 330, y: 95, r: 20, label: 'the flag on the mast' },
  ],

  draw(ctx, variant) {
    // Dusk sky, deep purple up top fading to orange at the horizon.
    const sky = ctx.createLinearGradient(0, 0, 0, 270);
    sky.addColorStop(0, '#3a3a6e');
    sky.addColorStop(0.55, '#7b5ea7');
    sky.addColorStop(1, '#ff9a5c');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 600, 270);

    // The first stars of the evening.
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for (const [sx, sy] of [[60, 40], [150, 28], [240, 48], [350, 30], [440, 34], [290, 20], [190, 70]]) {
      pathDisc(ctx, sx, sy, 2);
      ctx.fill();
    }

    // The moon: full on the left, a crescent on the right.
    disc(ctx, 520, 55, 24, '#f7ead0');
    if (variant === 1) disc(ctx, 530, 49, 20, '#4a4a80');

    // Gulls: three on the left, two on the right.
    gull(ctx, 400, 55);
    if (variant === 0) gull(ctx, 430, 70);
    gull(ctx, 460, 50);

    // The sea, with a few white wave strokes.
    const sea = ctx.createLinearGradient(0, 260, 0, 440);
    sea.addColorStop(0, '#2e6f8e');
    sea.addColorStop(1, '#173f57');
    ctx.fillStyle = sea;
    ctx.fillRect(0, 260, 600, 180);
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 3;
    for (const [wx, wy, wl] of [[120, 300, 60], [300, 330, 80], [450, 305, 55], [200, 380, 70], [380, 395, 90], [520, 350, 50]]) {
      ctx.beginPath();
      ctx.moveTo(wx, wy);
      ctx.quadraticCurveTo(wx + wl / 2, wy - 7, wx + wl, wy);
      ctx.stroke();
    }

    // The lighthouse on the point: a striped tower with a lamp room.
    rect(ctx, 52, 240, 66, 30, '#5b4636');
    rect(ctx, 60, 120, 50, 122, '#fff3d6');
    rect(ctx, 60, 150, 50, 18, '#e2604d');
    rect(ctx, 60, 196, 50, 18, '#e2604d');
    ctx.strokeStyle = '#5b4636';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 120, 50, 122);
    rrect(ctx, 56, 96, 58, 26, 4, '#2b2b3a');
    disc(ctx, 85, 109, 9, '#ffe98a');
    shape(ctx, [[50, 98], [85, 76], [120, 98]], '#e2604d');
    // The beam sweeps out to the right — left panel only.
    if (variant === 0) {
      ctx.fillStyle = 'rgba(255,233,138,0.35)';
      ctx.beginPath();
      ctx.moveTo(114, 100);
      ctx.lineTo(330, 74);
      ctx.lineTo(330, 140);
      ctx.lineTo(114, 118);
      ctx.closePath();
      ctx.fill();
    }

    // The sailboat in the middle. Its big sail is red on the left, white
    // on the right, and it flies a small flag only on the left.
    seg(ctx, 330, 88, 330, 250, '#5b4636', 6);
    shape(ctx, [[330, 96], [330, 210], [392, 210]], variant === 0 ? '#e2604d' : '#fff3d6');
    shape(ctx, [[324, 110], [324, 210], [282, 210]], '#f2a541');
    shape(ctx, [[292, 250], [368, 250], [352, 272], [308, 272]], '#7a4a2b');
    if (variant === 0) shape(ctx, [[330, 88], [362, 96], [330, 104]], '#e05252');

    // A rowing boat, off to the right.
    shape(ctx, [[452, 330], [540, 330], [522, 348], [470, 348]], '#8a5a33');
    seg(ctx, 470, 330, 452, 312, '#5b4636', 4);
    seg(ctx, 522, 330, 540, 312, '#5b4636', 4);

    // The buoy bobbing in the swell — left panel only.
    if (variant === 0) {
      disc(ctx, 500, 360, 13, '#e05252');
      rect(ctx, 496, 342, 8, 10, '#e05252');
      disc(ctx, 500, 340, 4, '#ffd94d');
      oval(ctx, 500, 374, 18, 4, 'rgba(255,255,255,0.3)');
    }

    // The wooden dock, bottom left, with crates stacked on it.
    rect(ctx, 0, 368, 250, 72, '#8a5a33');
    for (let x = 0; x < 250; x += 42) seg(ctx, x, 368, x, 440, '#6e4526', 3);
    seg(ctx, 0, 392, 250, 392, '#6e4526', 3);
    seg(ctx, 0, 416, 250, 416, '#6e4526', 3);
    crate(ctx, 120, 368, 44);
    crate(ctx, 168, 368, 44);
    // A third crate sits on top of the other two — left panel only.
    if (variant === 0) crate(ctx, 144, 324, 44);
    // A coil of rope on the dock.
    ctx.strokeStyle = '#d9c08a';
    ctx.lineWidth = 5;
    pathDisc(ctx, 60, 408, 16);
    ctx.stroke();
    pathDisc(ctx, 60, 408, 9);
    ctx.stroke();
  },
};

function gull(ctx, x, y) {
  ctx.strokeStyle = '#2b2b3a';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 12, y);
  ctx.quadraticCurveTo(x - 5, y - 8, x, y);
  ctx.quadraticCurveTo(x + 5, y - 8, x + 12, y);
  ctx.stroke();
}

function crate(ctx, x, y, s) {
  rect(ctx, x, y - s, s, s, '#c89b6a');
  ctx.strokeStyle = '#8a5a33';
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y - s, s, s);
  seg(ctx, x, y - s, x + s, y, '#8a5a33', 2);
  seg(ctx, x + s, y - s, x, y, '#8a5a33', 2);
}
