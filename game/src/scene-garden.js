// Scene 1 — "Sunny Garden". A cottage garden on a bright morning: sun
// and clouds overhead, a red-roofed cottage, an apple tree, a flower bed
// along the bottom and a duck pond. draw(ctx, variant) paints the whole
// 600x440 picture; variant 0 is the left picture, variant 1 is the right
// one with the seven differences applied.
import {
  disc, label, oval, pathDisc, pathOval, rect, rrect, seg, shape,
} from './draw-helpers.js';

export const garden = {
  name: 'Sunny Garden',
  subtitle: 'A cottage garden in the morning',
  timeLimit: 120,
  differences: [
    { x: 520, y: 55, r: 42, label: 'the sun lost three rays' },
    { x: 425, y: 195, r: 22, label: 'the bird on the branch' },
    { x: 180, y: 382, r: 20, label: 'the flower changed colour' },
    { x: 300, y: 250, r: 20, label: 'the butterfly' },
    { x: 170, y: 222, r: 26, label: 'the curtain in the window' },
    { x: 480, y: 386, r: 24, label: 'the duck in the pond' },
    { x: 300, y: 60, r: 34, label: 'the middle cloud' },
  ],

  draw(ctx, variant) {
    // Morning sky, pale blue at the top fading to near-white at the horizon.
    const sky = ctx.createLinearGradient(0, 0, 0, 280);
    sky.addColorStop(0, '#8ec9f0');
    sky.addColorStop(1, '#dff3ff');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 600, 280);

    // The sun: eight rays on the left picture, five on the right.
    const rayCount = variant === 0 ? 8 : 5;
    for (let i = 0; i < rayCount; i += 1) {
      const a = (i / 8) * Math.PI * 2;
      seg(ctx, 520 + Math.cos(a) * 38, 55 + Math.sin(a) * 38,
        520 + Math.cos(a) * 50, 55 + Math.sin(a) * 50, '#f7b733', 5);
    }
    disc(ctx, 520, 55, 30, '#ffd94d');
    disc(ctx, 512, 48, 8, '#ffe98a');

    // Three clouds across the sky; the middle one is gone on the right.
    puffCloud(ctx, 120, 55);
    if (variant === 0) puffCloud(ctx, 300, 60);
    puffCloud(ctx, 455, 38);

    // Lawn: a flat base, then soft rolling hills layered on top of it.
    rect(ctx, 0, 260, 600, 180, '#7cc46a');
    oval(ctx, 300, 520, 420, 130, '#7cc46a');
    oval(ctx, 90, 500, 220, 90, '#8fd07e');
    oval(ctx, 520, 510, 220, 90, '#6fb95e');

    // A stone path from the cottage door down to the fence.
    for (let i = 0; i < 4; i += 1) {
      oval(ctx, 205, 350 + i * 24, 26, 8, '#e8dcc2');
    }

    // Duck pond, bottom right, with a duck only on the left picture.
    oval(ctx, 480, 392, 78, 24, '#5db3e8');
    oval(ctx, 480, 392, 62, 17, '#7cc6ef');
    if (variant === 0) pondDuck(ctx, 480, 384);

    // Picket fence across the lawn.
    ctx.fillStyle = '#f3ead8';
    for (let x = 30; x < 580; x += 26) {
      ctx.fillRect(x, 318, 12, 34);
      shape(ctx, [[x, 318], [x + 12, 318], [x + 6, 308]], '#f3ead8');
    }
    rect(ctx, 20, 330, 560, 5, '#e2d3b4');

    // The cottage: cream walls, a red roof, a brown door, two windows.
    rect(ctx, 120, 200, 170, 132, '#fff3d6');
    rect(ctx, 112, 196, 186, 8, '#e8d9b0');
    shape(ctx, [[100, 202], [205, 128], [310, 202]], '#e2604d');
    shape(ctx, [[118, 200], [205, 140], [292, 200]], '#ef7a63');
    rrect(ctx, 188, 258, 36, 74, 6, '#8a5a33');
    disc(ctx, 216, 296, 4, '#ffd94d');
    cottageWindow(ctx, 145, 215, 50, 50);
    cottageWindow(ctx, 235, 215, 50, 50);
    // Drapes: the left window keeps its drapes only on the left panel.
    if (variant === 0) drapes(ctx, 145, 215);
    drapes(ctx, 235, 215);

    // Apple tree on the right, with a bird on the low branch (left only).
    rect(ctx, 438, 190, 22, 145, '#7a4a2b');
    seg(ctx, 449, 230, 415, 205, '#7a4a2b', 10);
    disc(ctx, 450, 150, 62, '#4f9e4a');
    disc(ctx, 405, 175, 42, '#5cb256');
    disc(ctx, 495, 175, 42, '#5cb256');
    disc(ctx, 425, 128, 12, '#e05252');
    disc(ctx, 478, 132, 12, '#e05252');
    disc(ctx, 452, 168, 12, '#e05252');
    if (variant === 0) songbird(ctx, 425, 195);

    // A butterfly over the lawn — left panel only.
    if (variant === 0) flutter(ctx, 300, 250);

    // Flower bed along the bottom; the middle flower changes colour.
    bloom(ctx, 80, 382, '#e05252');
    bloom(ctx, 130, 392, '#f2a541');
    bloom(ctx, 180, 382, variant === 0 ? '#e05252' : '#8a5cf6');
    bloom(ctx, 235, 392, '#f2a541');
    bloom(ctx, 285, 382, '#e05252');
    bloom(ctx, 340, 392, '#f2a541');
    bloom(ctx, 55, 405, '#f2a541');
    bloom(ctx, 380, 400, '#e05252');
  },
};

// --- Little painters, one per motif in the garden.

function puffCloud(ctx, x, y) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  pathDisc(ctx, x, y, 20);
  ctx.fill();
  pathDisc(ctx, x - 22, y + 6, 15);
  ctx.fill();
  pathDisc(ctx, x + 22, y + 6, 15);
  ctx.fill();
  ctx.fillRect(x - 38, y, 76, 14);
}

function cottageWindow(ctx, x, y, w, h) {
  ctx.fillStyle = '#bfe6f5';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#8a5a33';
  ctx.lineWidth = 4;
  ctx.strokeRect(x, y, w, h);
  seg(ctx, x + w / 2, y, x + w / 2, y + h, '#8a5a33', 3);
  seg(ctx, x, y + h / 2, x + w, y + h / 2, '#8a5a33', 3);
}

function drapes(ctx, x, y) {
  ctx.fillStyle = '#f2a541';
  ctx.fillRect(x + 3, y + 3, 12, 44);
  ctx.fillRect(x + 35, y + 3, 12, 44);
}

function songbird(ctx, x, y) {
  oval(ctx, x, y, 13, 9, '#3a6ea5');
  disc(ctx, x + 11, y - 7, 6, '#3a6ea5');
  shape(ctx, [[x + 16, y - 8], [x + 24, y - 5], [x + 16, y - 3]], '#f2a541');
  disc(ctx, x + 12, y - 9, 1.6, '#10233a');
  seg(ctx, x - 12, y - 6, x - 20, y - 14, '#2c5680', 3);
}

function pondDuck(ctx, x, y) {
  oval(ctx, x, y, 16, 10, '#fff7d6');
  disc(ctx, x + 13, y - 8, 8, '#fff7d6');
  shape(ctx, [[x + 20, y - 9], [x + 29, y - 6], [x + 20, y - 4]], '#f2a541');
  disc(ctx, x + 14, y - 10, 1.6, '#10233a');
}

function flutter(ctx, x, y) {
  ctx.fillStyle = '#8a5cf6';
  pathOval(ctx, x - 9, y - 6, 10, 7);
  ctx.fill();
  pathOval(ctx, x + 9, y - 6, 10, 7);
  ctx.fill();
  ctx.fillStyle = '#b79bff';
  pathOval(ctx, x - 8, y + 7, 8, 6);
  ctx.fill();
  pathOval(ctx, x + 8, y + 7, 8, 6);
  ctx.fill();
  seg(ctx, x, y - 4, x, y + 10, '#3a2b5c', 2);
}

function bloom(ctx, x, y, petal) {
  seg(ctx, x, y + 8, x, y + 26, '#3e8e41', 4);
  for (let i = 0; i < 5; i += 1) {
    const a = (i / 5) * Math.PI * 2;
    disc(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 6, petal);
  }
  disc(ctx, x, y, 6, '#ffd94d');
}
