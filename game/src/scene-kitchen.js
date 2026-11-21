// Scene 2 — "Cozy Kitchen". A warm kitchen in the afternoon: a window with
// sky, a wall clock, a shelf of mugs, a steaming teapot on the counter, a
// fruit bowl, a cat in charge of everything and a rug by the stove.
// variant 0 is the left picture, variant 1 the right one with the seven
// differences applied.
import {
  disc, oval, pathDisc, rect, rrect, seg, shape, strokeRrect,
} from './draw-helpers.js';

export const kitchen = {
  name: 'Cozy Kitchen',
  subtitle: 'Tea is on, and the cat is in charge',
  timeLimit: 110,
  differences: [
    { x: 330, y: 70, r: 36, label: 'the clock hands moved' },
    { x: 480, y: 272, r: 28, label: 'the cat on the counter' },
    { x: 200, y: 212, r: 24, label: 'the steam over the teapot' },
    { x: 330, y: 318, r: 26, label: 'an apple went missing' },
    { x: 120, y: 112, r: 22, label: 'the mug changed colour' },
    { x: 510, y: 75, r: 26, label: 'the picture changed from sun to moon' },
    { x: 300, y: 408, r: 20, label: 'the stripe on the rug' },
  ],

  draw(ctx, variant) {
    // Cream wall above a wooden floor.
    rect(ctx, 0, 0, 600, 300, '#f7e8c8');
    rect(ctx, 0, 300, 600, 140, '#c89b6a');
    for (let y = 318; y < 440; y += 30) seg(ctx, 0, y, 600, y, '#b3854f', 2);

    // Window, top left, with sky, sun and red curtains.
    rrect(ctx, 70, 45, 180, 160, 8, '#8ec9f0');
    disc(ctx, 215, 80, 20, '#ffd94d');
    disc(ctx, 105, 175, 14, '#ffffff');
    disc(ctx, 130, 180, 18, '#ffffff');
    ctx.strokeStyle = '#8a5a33';
    ctx.lineWidth = 5;
    ctx.strokeRect(70, 45, 180, 160);
    seg(ctx, 160, 45, 160, 205, '#8a5a33', 4);
    seg(ctx, 70, 125, 250, 125, '#8a5a33', 4);
    rect(ctx, 52, 40, 26, 170, '#e2604d');
    rect(ctx, 242, 40, 26, 170, '#e2604d');
    rrect(ctx, 58, 205, 204, 12, 4, '#fff3d6');

    // Wall clock, top centre: 3 o'clock on the left, half past 4 on the right.
    disc(ctx, 330, 70, 36, '#fffdf5');
    ctx.strokeStyle = '#5b4636';
    ctx.lineWidth = 5;
    pathDisc(ctx, 330, 70, 36);
    ctx.stroke();
    disc(ctx, 330, 70, 4, '#5b4636');
    if (variant === 0) {
      seg(ctx, 330, 70, 330, 46, '#5b4636', 5);
      seg(ctx, 330, 70, 354, 70, '#5b4636', 5);
    } else {
      seg(ctx, 330, 70, 347, 88, '#5b4636', 5);
      seg(ctx, 330, 70, 306, 70, '#5b4636', 5);
    }

    // Framed picture, top right: a sun on the left, a moon on the right.
    rrect(ctx, 468, 40, 84, 70, 6, '#fffdf5');
    strokeRrect(ctx, 468, 40, 84, 70, 6, '#8a5a33', 5);
    if (variant === 0) {
      disc(ctx, 510, 75, 18, '#ffd94d');
      seg(ctx, 510, 48, 510, 42, '#f7b733', 3);
      seg(ctx, 510, 102, 510, 108, '#f7b733', 3);
      seg(ctx, 483, 75, 477, 75, '#f7b733', 3);
      seg(ctx, 537, 75, 543, 75, '#f7b733', 3);
    } else {
      disc(ctx, 510, 75, 18, '#f2e6b8');
      disc(ctx, 518, 71, 15, '#fffdf5');
    }

    // Shelf with four mugs; the second one changes colour.
    rect(ctx, 60, 236, 220, 10, '#8a5a33');
    mug(ctx, 80, 206, '#e05252');
    mug(ctx, 120, 206, variant === 0 ? '#3a6ea5' : '#4f9e4a');
    mug(ctx, 165, 206, '#f2a541');
    mug(ctx, 210, 206, '#8a5cf6');

    // The counter and its cupboards.
    rect(ctx, 0, 300, 600, 18, '#a87c4f');
    rect(ctx, 0, 318, 600, 122, '#8a5a33');
    rect(ctx, 20, 340, 180, 80, '#7a4a2b');
    rect(ctx, 400, 340, 180, 80, '#7a4a2b');

    // Teapot on the counter, with steam curling up — left panel only.
    teapot(ctx, 200, 268);
    if (variant === 0) {
      ctx.strokeStyle = 'rgba(180,190,200,0.9)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(196, 240);
      ctx.quadraticCurveTo(188, 224, 196, 210);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(210, 240);
      ctx.quadraticCurveTo(218, 226, 210, 212);
      ctx.stroke();
    }

    // Fruit bowl: three apples on the left, two on the right.
    oval(ctx, 330, 330, 56, 16, '#3a6ea5');
    oval(ctx, 330, 326, 56, 12, '#4a86c2');
    disc(ctx, 308, 312, 13, '#e05252');
    disc(ctx, 332, 306, 13, '#e05252');
    if (variant === 0) disc(ctx, 352, 314, 13, '#e05252');
    disc(ctx, 332, 296, 3, '#3e8e41');

    // The cat, sitting on the counter — left panel only.
    if (variant === 0) cat(ctx, 480, 272);

    // Rug by the stove; its gold stripe is missing on the right.
    oval(ctx, 300, 415, 110, 20, '#e2604d');
    oval(ctx, 300, 415, 88, 14, '#ef7a63');
    if (variant === 0) oval(ctx, 300, 415, 52, 8, '#ffd94d');

    // A jar of jam and a spoon rest, for the eye to wander over.
    rrect(ctx, 420, 268, 26, 32, 6, '#c94f6d');
    rrect(ctx, 420, 268, 26, 10, 6, '#f3ead8');
    oval(ctx, 250, 306, 26, 7, '#f3ead8');
  },
};

function mug(ctx, x, y, color) {
  rrect(ctx, x, y, 30, 28, 4, color);
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x + 32, y + 14, 8, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
}

function teapot(ctx, x, y) {
  // Round body, spout, handle, lid.
  oval(ctx, x, y, 34, 26, '#3a6ea5');
  shape(ctx, [[x - 32, y - 6], [x - 56, y - 22], [x - 52, y - 8]], '#3a6ea5');
  ctx.strokeStyle = '#3a6ea5';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(x + 36, y - 2, 12, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  oval(ctx, x, y - 24, 18, 7, '#2c5680');
  disc(ctx, x, y - 30, 5, '#ffd94d');
}

function cat(ctx, x, y) {
  // A sitting ginger cat, tail curled around its paws.
  oval(ctx, x, y + 22, 26, 16, '#e8913a');
  disc(ctx, x, y - 8, 16, '#e8913a');
  shape(ctx, [[x - 12, y - 18], [x - 16, y - 32], [x - 5, y - 22]], '#e8913a');
  shape(ctx, [[x + 12, y - 18], [x + 16, y - 32], [x + 5, y - 22]], '#e8913a');
  disc(ctx, x - 6, y - 10, 2, '#10233a');
  disc(ctx, x + 6, y - 10, 2, '#10233a');
  seg(ctx, x - 2, y - 2, x + 2, y - 2, '#8a5a33', 2);
  ctx.strokeStyle = '#e8913a';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(x + 18, y + 26, 14, 0, Math.PI * 1.1);
  ctx.stroke();
  seg(ctx, x - 14, y + 6, x - 20, y + 6, '#c97a2e', 2);
  seg(ctx, x - 14, y + 12, x - 20, y + 12, '#c97a2e', 2);
}
