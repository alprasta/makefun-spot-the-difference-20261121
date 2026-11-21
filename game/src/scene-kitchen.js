// Scene 2 — "Cozy Kitchen". A warm kitchen at night, drawn my own
// way: a window with the moon, a fridge covered in magnets, a shelf
// of jars, a hanging lamp, a table with a teapot, cups and a bowl of
// oranges, and a cat asleep on a chair. draw(ctx, variant): variant 0
// is the left picture, variant 1 the right one with the seven
// differences applied.
import {
  disc, label, oval, pathDisc, pathOval, rect, rrect, seg, shape,
} from './draw-helpers.js';

export const kitchen = {
  name: 'Cozy Kitchen',
  subtitle: 'Tea is on, and the cat is in charge',
  timeLimit: 110,
  differences: [
    { x: 490, y: 90, r: 26, label: 'the moon turned crescent' },
    { x: 75, y: 240, r: 20, label: 'a fridge magnet went missing' },
    { x: 290, y: 80, r: 20, label: 'the jar lid changed colour' },
    { x: 330, y: 45, r: 24, label: 'the lamp went out' },
    { x: 370, y: 300, r: 22, label: 'a cup went missing' },
    { x: 425, y: 285, r: 22, label: 'an orange went missing' },
    { x: 505, y: 340, r: 24, label: 'the cat lost its bow' },
  ],

  draw(ctx, variant) {
    // Cream wall above a wooden floor.
    rect(ctx, 0, 0, 600, 300, '#f6e2b8');
    rect(ctx, 0, 300, 600, 140, '#c1905f');
    for (let y = 330; y < 440; y += 36) seg(ctx, 0, y, 600, y, '#a87c4f', 2);

    // The window, top right: a night sky, a moon and three stars, a
    // white frame and a sill with a little potted herb.
    rrect(ctx, 420, 40, 140, 140, 8, '#1e2a4a');
    disc(ctx, 540, 70, 3, '#ffffff');
    disc(ctx, 450, 60, 2.5, '#ffffff');
    disc(ctx, 520, 150, 2.5, '#ffffff');
    disc(ctx, 490, 95, 20, '#f7ead0');
    if (variant === 1) disc(ctx, 499, 89, 17, '#1e2a4a');
    ctx.strokeStyle = '#8a5a33';
    ctx.lineWidth = 5;
    ctx.strokeRect(420, 40, 140, 140);
    seg(ctx, 490, 40, 490, 180, '#8a5a33', 4);
    seg(ctx, 420, 110, 560, 110, '#8a5a33', 4);
    rrect(ctx, 412, 180, 156, 12, 4, '#fff3d6');
    rrect(ctx, 470, 158, 22, 22, 4, '#d94f3d');
    disc(ctx, 481, 156, 9, '#58a34e');
    disc(ctx, 476, 150, 6, '#58a34e');
    disc(ctx, 487, 150, 6, '#58a34e');

    // The fridge, left side: two doors, a handle, four magnets. The
    // heart magnet is gone on the right picture.
    rrect(ctx, 40, 120, 110, 210, 10, '#b8cdd8');
    ctx.strokeStyle = '#5b6b78';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 120, 110, 210);
    seg(ctx, 40, 210, 150, 210, '#5b6b78', 3);
    rrect(ctx, 132, 140, 8, 56, 4, '#5b6b78');
    rrect(ctx, 132, 230, 8, 56, 4, '#5b6b78');
    disc(ctx, 70, 160, 8, '#d94f3d');
    disc(ctx, 100, 180, 7, '#f7c948');
    if (variant === 0) shape(ctx, [[75, 232], [82, 246], [68, 246]], '#e87aa8');
    rect(ctx, 104, 254, 13, 13, '#5b9bd5');

    // A shelf with three jars. The middle jar's lid is red on the left,
    // green on the right.
    rect(ctx, 200, 105, 180, 10, '#8a5a33');
    jar(ctx, 220, 68, '#f2a541', '#d94f3d');
    jar(ctx, 290, 68, '#f7ead0', variant === 0 ? '#d94f3d' : '#58a34e');
    jar(ctx, 360, 68, '#8fb8d8', '#d94f3d');

    // A small framed picture on the wall, just for the eye to rest on.
    rrect(ctx, 190, 170, 70, 56, 6, '#fffdf5');
    ctx.strokeStyle = '#8a5a33';
    ctx.lineWidth = 4;
    ctx.strokeRect(190, 170, 70, 56);
    disc(ctx, 225, 198, 14, '#d94f3d');
    disc(ctx, 212, 206, 8, '#eda23e');
    disc(ctx, 238, 206, 8, '#eda23e');

    // A hanging lamp above the table. On the left it is on: a warm
    // glow spills down over the table. On the right it is off.
    seg(ctx, 330, 0, 330, 28, '#3a2b1e', 3);
    shape(ctx, [[312, 28], [348, 28], [342, 56], [318, 56]], '#2e5d43');
    disc(ctx, 330, 60, 6, variant === 0 ? '#ffe08a' : '#8a8a8a');
    if (variant === 0) {
      ctx.fillStyle = 'rgba(255, 224, 138, 0.18)';
      ctx.beginPath();
      ctx.moveTo(318, 56);
      ctx.lineTo(342, 56);
      ctx.lineTo(380, 300);
      ctx.lineTo(280, 300);
      ctx.closePath();
      ctx.fill();
    }

    // The table: a wooden top, legs, and a chequered cloth draped
    // over the front.
    rect(ctx, 160, 300, 300, 18, '#a87c4f');
    rect(ctx, 180, 318, 14, 92, '#8a5a33');
    rect(ctx, 440, 318, 14, 92, '#8a5a33');
    for (let i = 0; i < 6; i += 1) {
      for (let j = 0; j < 2; j += 1) {
        rect(ctx, 170 + i * 46, 318 + j * 22, 23, 22,
          (i + j) % 2 === 0 ? '#d94f3d' : '#fff3d6');
      }
    }

    // The teapot on the table, with a lid and a knob.
    teapot(ctx, 230, 288);

    // Two cups on the table. The right-hand cup is gone on the right.
    cup(ctx, 320, 296, '#3a6ea5');
    if (variant === 0) cup(ctx, 370, 296, '#d94f3d');

    // A bowl of oranges: four on the left, three on the right.
    oval(ctx, 425, 300, 34, 10, '#3a6ea5');
    disc(ctx, 408, 288, 11, '#eda23e');
    disc(ctx, 425, 282, 11, '#eda23e');
    disc(ctx, 442, 288, 11, '#eda23e');
    if (variant === 0) disc(ctx, 433, 272, 11, '#eda23e');

    // A chair with the cat asleep on it. The cat wears a red bow on
    // the left picture only.
    rect(ctx, 478, 330, 8, 80, '#8a5a33');
    rect(ctx, 556, 330, 8, 80, '#8a5a33');
    rect(ctx, 470, 330, 102, 10, '#8a5a33');
    rect(ctx, 470, 280, 8, 60, '#8a5a33');
    rect(ctx, 470, 280, 60, 8, '#8a5a33');
    catFigure(ctx, 505, 340, variant);
  },
};

// A glass jar standing on the shelf: body, contents and a lid.
function jar(ctx, x, y, fill, lid) {
  rrect(ctx, x, y, 34, 37, 6, fill);
  ctx.strokeStyle = 'rgba(90, 70, 50, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, 34, 37);
  rrect(ctx, x - 2, y - 9, 38, 10, 4, lid);
}

// A teapot: round body, a spout on the left, a handle on the right,
// a lid and a little knob.
function teapot(ctx, x, y) {
  oval(ctx, x, y, 32, 24, '#3a6ea5');
  shape(ctx, [[x - 30, y - 4], [x - 52, y - 20], [x - 48, y - 6]], '#3a6ea5');
  ctx.strokeStyle = '#3a6ea5';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(x + 33, y, 11, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  oval(ctx, x, y - 22, 17, 6, '#2c5680');
  disc(ctx, x, y - 28, 5, '#f7c948');
}

// A cup with a handle, sitting on the table.
function cup(ctx, x, y, color) {
  rrect(ctx, x, y, 28, 24, color);
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x + 30, y + 12, 7, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  oval(ctx, x + 14, y, 14, 3, '#fff3d6');
}

// A ginger cat curled up asleep: body, head, ears, tail, and — on
// the left picture — a little red bow at its neck.
function catFigure(ctx, x, y, variant) {
  oval(ctx, x, y + 14, 30, 16, '#e8913a');
  disc(ctx, x - 18, y - 6, 14, '#e8913a');
  shape(ctx, [[x - 28, y - 14], [x - 32, y - 28], [x - 20, y - 18]], '#e8913a');
  shape(ctx, [[x - 10, y - 16], [x - 8, y - 30], [x - 2, y - 18]], '#e8913a');
  disc(ctx, x - 23, y - 8, 2, '#10233a');
  seg(ctx, x + 6, y + 18, x + 26, y + 10, '#e8913a', 7);
  ctx.strokeStyle = '#e8913a';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(x + 22, y + 22, 12, 0, Math.PI);
  ctx.stroke();
  if (variant === 0) {
    shape(ctx, [[x - 8, y + 2], [x - 18, y - 4], [x - 18, y + 8]], '#d94f3d');
    shape(ctx, [[x - 8, y + 2], [x + 2, y - 4], [x + 2, y + 8]], '#d94f3d');
    disc(ctx, x - 8, y + 2, 3, '#a82e1e');
  }
}
