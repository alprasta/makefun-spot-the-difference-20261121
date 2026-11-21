// Scene 1 — "Sunny Garden". A cottage garden in the morning, drawn my
// own way: a smiling sun, a rainbow, a big oak, a birdhouse on a pole,
// a picket fence, a gnome, a watering can, a row of tulips and a snail
// on a leaf. draw(ctx, variant, W, H): variant 0 is the left picture,
// variant 1 the right one with the seven differences applied.
import {
  disc, label, oval, pathDisc, pathOval, rect, rrect, seg, shape,
} from './draw-helpers.js';

export const garden = {
  name: 'Sunny Garden',
  subtitle: 'A cottage garden in the morning',
  timeLimit: 120,
  differences: [
    { x: 90, y: 70, r: 40, label: 'the sun lost its smile' },
    { x: 330, y: 85, r: 30, label: 'the rainbow lost a stripe' },
    { x: 430, y: 165, r: 24, label: 'the bird on the birdhouse' },
    { x: 520, y: 350, r: 22, label: "the gnome's hat changed colour" },
    { x: 175, y: 365, r: 20, label: 'the watering can stopped pouring' },
    { x: 280, y: 405, r: 20, label: 'a tulip changed colour' },
    { x: 45, y: 415, r: 20, label: 'the snail on the leaf' },
  ],

  draw(ctx, variant) {
    // Morning sky, pale blue at the top warming to cream at the horizon.
    const sky = ctx.createLinearGradient(0, 0, 0, 280);
    sky.addColorStop(0, '#a9d6ee');
    sky.addColorStop(1, '#fff3cf');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 600, 280);

    // The sun, top left, with twelve rays. It smiles on the left only.
    for (let i = 0; i < 12; i += 1) {
      const a = (i / 12) * Math.PI * 2;
      seg(ctx, 90 + Math.cos(a) * 36, 70 + Math.sin(a) * 36,
        90 + Math.cos(a) * 48, 70 + Math.sin(a) * 48, '#f7b733', 5);
    }
    disc(ctx, 90, 70, 30, '#ffbe2e');
    disc(ctx, 82, 62, 8, '#ffe08a');
    if (variant === 0) sunFace(ctx, 90, 70);

    // A rainbow arcing over the middle of the sky: five bands on the
    // left, four on the right (the innermost band is gone).
    rainbowArc(ctx, variant);

    // A big oak on the right, trunk and three puffs of canopy.
    rect(ctx, 468, 190, 22, 250, '#7a4a2b');
    seg(ctx, 479, 240, 440, 205, '#7a4a2b', 10);
    disc(ctx, 478, 150, 58, '#4f9e4a');
    disc(ctx, 430, 172, 42, '#5cb256');
    disc(ctx, 522, 172, 42, '#5cb256');
    disc(ctx, 452, 120, 14, '#d94f3d');
    disc(ctx, 500, 128, 14, '#d94f3d');

    // A birdhouse on a pole, left of the oak. A little bird sits on the
    // roof peak on the left picture only.
    rect(ctx, 424, 200, 10, 240, '#8a5a33');
    birdhouse(ctx, 412, 168);
    if (variant === 0) perchedBird(ctx, 430, 158);

    // The lawn: a flat base with soft rolling hills on top of it.
    rect(ctx, 0, 280, 600, 160, '#79c25f');
    oval(ctx, 300, 520, 420, 130, '#79c25f');
    oval(ctx, 90, 500, 220, 90, '#8fd07e');
    oval(ctx, 520, 510, 220, 90, '#6fb95e');

    // A white picket fence across the lawn.
    ctx.fillStyle = '#f3ead8';
    for (let x = 24; x < 580; x += 26) {
      ctx.fillRect(x, 300, 12, 42);
      shape(ctx, [[x, 300], [x + 12, 300], [x + 6, 290]], '#f3ead8');
    }
    rect(ctx, 16, 322, 568, 5, '#e2d3b4');

    // A garden gnome by the fence on the right. His hat is red on the
    // left picture, blue on the right.
    gnomeFigure(ctx, 520, 350, variant === 0 ? '#d94f3d' : '#5b9bd5');

    // A watering can on the left. Water drops fall from its spout on
    // the left picture only.
    wateringCan(ctx, 150, 340);
    if (variant === 0) {
      disc(ctx, 178, 362, 4, '#5b9bd5');
      disc(ctx, 186, 372, 4, '#5b9bd5');
      disc(ctx, 172, 374, 3, '#5b9bd5');
    }

    // A row of tulips along the bottom. The one at x=280 is yellow on
    // the left, pink on the right.
    const tulipXs = [100, 160, 220, 280, 340, 400];
    for (let i = 0; i < tulipXs.length; i += 1) {
      const tx = tulipXs[i];
      const petal = (tx === 280)
        ? (variant === 0 ? '#f7c948' : '#e87aa8')
        : (i % 2 === 0 ? '#d94f3d' : '#eda23e');
      tulip(ctx, tx, 405, petal);
    }

    // A snail on a big leaf in the bottom-left corner — left only.
    oval(ctx, 45, 418, 26, 10, '#5cb256');
    if (variant === 0) snail(ctx, 45, 410);
  },
};

// The sun's face: two dot eyes and a smile arc.
function sunFace(ctx, x, y) {
  disc(ctx, x - 10, y - 6, 3, '#7a4a2b');
  disc(ctx, x + 10, y - 6, 3, '#7a4a2b');
  ctx.strokeStyle = '#7a4a2b';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x, y + 2, 12, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();
}

// Five concentric arc bands, centred low in the picture so only the
// crowns show. The innermost band is drawn on the left picture only.
function rainbowArc(ctx, variant) {
  const bands = ['#d94f3d', '#eda23e', '#f7c948', '#58a34e', '#5b9bd5'];
  const count = variant === 0 ? 5 : 4;
  for (let i = 0; i < count; i += 1) {
    ctx.strokeStyle = bands[i];
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.arc(330, 290, 208 - i * 14, Math.PI, Math.PI * 2);
    ctx.stroke();
  }
}

// A little wooden birdhouse: box, triangular roof, round hole.
function birdhouse(ctx, x, y) {
  rect(ctx, x, y, 36, 32, '#c1905f');
  shape(ctx, [[x - 4, y], [x + 18, y - 16], [x + 40, y]], '#8a5a33');
  disc(ctx, x + 18, y + 14, 7, '#3a2b1e');
  rect(ctx, x + 14, y + 24, 8, 8, '#8a5a33');
}

// A tiny bird perched on a point: body, head, beak, tail.
function perchedBird(ctx, x, y) {
  oval(ctx, x, y + 4, 12, 8, '#3a6ea5');
  disc(ctx, x + 10, y - 3, 6, '#3a6ea5');
  shape(ctx, [[x + 15, y - 4], [x + 23, y - 1], [x + 15, y + 1]], '#eda23e');
  disc(ctx, x + 11, y - 5, 1.6, '#10233a');
  seg(ctx, x - 11, y + 2, x - 19, y - 5, '#2c5680', 3);
}

// A garden gnome: pointy hat, white beard, blue coat, belt.
function gnomeFigure(ctx, x, y, hatColor) {
  shape(ctx, [[x - 14, y - 12], [x, y - 44], [x + 14, y - 12]], hatColor);
  disc(ctx, x, y - 10, 10, '#f2c9a0');
  shape(ctx, [[x - 10, y - 4], [x, y + 18], [x + 10, y - 4]], '#f3ead8');
  rrect(ctx, x - 14, y + 4, 28, 30, 8, '#3a6ea5');
  rect(ctx, x - 14, y + 18, 28, 5, '#2b2b3a');
  disc(ctx, x, y + 20, 3, '#f7c948');
}

// A watering can: round body, a spout slanting down to the right,
// and a handle loop on the left.
function wateringCan(ctx, x, y) {
  oval(ctx, x, y, 26, 20, '#5b9bd5');
  seg(ctx, x + 20, y - 4, x + 38, y + 12, '#4a86c2', 7);
  ctx.strokeStyle = '#4a86c2';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x - 26, y, 11, Math.PI / 2, Math.PI * 1.5);
  ctx.stroke();
  disc(ctx, x, y - 18, 5, '#4a86c2');
}

// One tulip: a stem, three petals and a yellow heart.
function tulip(ctx, x, y, petal) {
  seg(ctx, x, y + 6, x, y + 28, '#3e8e41', 4);
  disc(ctx, x - 7, y - 2, 6, petal);
  disc(ctx, x + 7, y - 2, 6, petal);
  disc(ctx, x, y - 6, 7, petal);
  disc(ctx, x, y, 4, '#f7c948');
}

// A snail: a round shell with a spiral hint, on a leaf.
function snail(ctx, x, y) {
  disc(ctx, x, y, 11, '#c1905f');
  ctx.strokeStyle = '#8a5a33';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, 2.5, 0, Math.PI * 2);
  ctx.stroke();
  oval(ctx, x + 12, y + 6, 10, 5, '#e8b88a');
  disc(ctx, x + 20, y, 2.5, '#10233a');
}
