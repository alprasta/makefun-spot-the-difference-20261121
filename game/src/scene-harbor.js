// Scene 3 — "Harbor at Dusk". A small fishing harbour as the light
// goes, drawn my own way: a sinking sun, a ferry with a smokestack,
// a rowing boat, gulls overhead, a striped buoy, a wooden dock with
// an anchor and a fishing net. draw(ctx, variant): variant 0 is the
// left picture, variant 1 the right one with the seven differences
// applied.
import {
  disc, label, oval, pathDisc, pathOval, rect, rrect, seg, shape,
} from './draw-helpers.js';

export const harbor = {
  name: 'Harbor at Dusk',
  subtitle: 'The last boat in before dark',
  timeLimit: 100,
  differences: [
    { x: 480, y: 125, r: 30, label: 'the sun sank lower' },
    { x: 335, y: 228, r: 22, label: 'a ferry window went dark' },
    { x: 400, y: 160, r: 22, label: 'the smoke thinned out' },
    { x: 180, y: 90, r: 22, label: 'a seagull flew away' },
    { x: 520, y: 300, r: 22, label: 'the buoy lost its stripes' },
    { x: 150, y: 385, r: 24, label: 'the anchor vanished' },
    { x: 360, y: 385, r: 22, label: 'the starfish disappeared' },
  ],

  draw(ctx, variant) {
    // Dusk sky: dusky purple up top fading to orange at the horizon.
    const sky = ctx.createLinearGradient(0, 0, 0, 240);
    sky.addColorStop(0, '#5a4a8a');
    sky.addColorStop(0.6, '#8a5a9a');
    sky.addColorStop(1, '#ff8a4d');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 600, 240);

    // The first stars of the evening, high up.
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    for (const [sx, sy] of [[60, 30], [120, 55], [260, 28], [350, 45], [420, 25], [560, 35]]) {
      pathDisc(ctx, sx, sy, 2);
      ctx.fill();
    }

    // The setting sun: higher on the left, sunk lower on the right.
    const sunY = variant === 0 ? 110 : 145;
    disc(ctx, 480, sunY, 28, '#ff6b35');
    disc(ctx, 472, sunY - 8, 10, '#ffb35c');

    // The sea, with a few pale wave strokes.
    const sea = ctx.createLinearGradient(0, 240, 0, 440);
    sea.addColorStop(0, '#2a5a7a');
    sea.addColorStop(1, '#16324a');
    ctx.fillStyle = sea;
    ctx.fillRect(0, 240, 600, 200);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 3;
    for (const [wx, wy, wl] of [[80, 290, 55], [260, 320, 70], [430, 295, 50], [150, 400, 65], [380, 410, 80], [520, 370, 45]]) {
      ctx.beginPath();
      ctx.moveTo(wx, wy);
      ctx.quadraticCurveTo(wx + wl / 2, wy - 7, wx + wl, wy);
      ctx.stroke();
    }

    // The ferry in the middle: hull, deckhouse, five windows and a
    // smokestack. One window is dark on the right, and the smoke is
    // thinner there too.
    shape(ctx, [[200, 260], [400, 260], [385, 300], [215, 300]], '#232838');
    rect(ctx, 200, 255, 200, 8, '#f3ead8');
    rrect(ctx, 230, 210, 140, 48, 8, '#e8dcc2');
    const windows = [245, 275, 305, 335, 365];
    for (let i = 0; i < windows.length; i += 1) {
      const wx = windows[i];
      const lit = !(variant === 1 && wx === 335);
      rect(ctx, wx, 222, 16, 16, lit ? '#ffe08a' : '#2b2b3a');
    }
    rect(ctx, 388, 185, 22, 68, '#3a3a3a');
    rect(ctx, 384, 178, 30, 10, '#232838');
    disc(ctx, 400, 168, 10, 'rgba(230, 230, 230, 0.75)');
    if (variant === 0) {
      disc(ctx, 394, 148, 8, 'rgba(230, 230, 230, 0.6)');
      disc(ctx, 406, 130, 7, 'rgba(230, 230, 230, 0.45)');
    }
    seg(ctx, 300, 210, 300, 175, '#5b4636', 5);

    // A rowing boat off to the right, with one oar shipped.
    shape(ctx, [[452, 330], [540, 330], [522, 348], [470, 348]], '#8a5a33');
    seg(ctx, 470, 330, 452, 312, '#5b4636', 4);
    seg(ctx, 522, 330, 540, 312, '#5b4636', 4);

    // Gulls overhead: three on the left, two on the right.
    gull(ctx, 140, 70);
    if (variant === 0) gull(ctx, 180, 95);
    gull(ctx, 220, 60);

    // The buoy bobbing in the swell. It wears two white bands on the
    // left; on the right it is plain red.
    disc(ctx, 520, 300, 13, '#d94f3d');
    rect(ctx, 516, 284, 8, 10, '#d94f3d');
    disc(ctx, 520, 282, 4, '#f7c948');
    if (variant === 0) {
      rect(ctx, 508, 296, 24, 5, '#fff3d6');
      rect(ctx, 509, 306, 22, 4, '#fff3d6');
    }
    oval(ctx, 520, 314, 18, 4, 'rgba(255, 255, 255, 0.3)');

    // The wooden dock, bottom left, with plank lines.
    rect(ctx, 0, 360, 250, 80, '#8a5a33');
    for (let x = 0; x < 250; x += 42) seg(ctx, x, 360, x, 440, '#6e4526', 3);
    seg(ctx, 0, 384, 250, 384, '#6e4526', 3);
    seg(ctx, 0, 408, 250, 408, '#6e4526', 3);

    // A lantern post on the dock, glowing warm.
    rect(ctx, 56, 300, 8, 62, '#3a2b1e');
    rrect(ctx, 46, 282, 28, 20, 4, '#2b2b3a');
    disc(ctx, 60, 292, 6, '#ffe08a');

    // An anchor leaning against the dock — left picture only.
    if (variant === 0) anchorShape(ctx, 150, 385);

    // A fishing net draped over the dock edge, with a starfish on it
    // on the left picture only.
    ctx.strokeStyle = '#d9c08a';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i += 1) {
      seg(ctx, 320 + i * 18, 368, 320 + i * 18, 404, '#d9c08a', 2);
      seg(ctx, 320, 368 + i * 9, 408, 368 + i * 9, '#d9c08a', 2);
    }
    if (variant === 0) starfish(ctx, 360, 385);
  },
};

// A gull in flight: two curved wings meeting in the middle.
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

// An anchor: a ring on top, a straight shaft, a crossbar, and two
// flukes at the bottom.
function anchorShape(ctx, x, y) {
  ctx.strokeStyle = '#2b2b3a';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x, y - 22, 7, 0, Math.PI * 2);
  ctx.stroke();
  seg(ctx, x, y - 15, x, y + 18, '#2b2b3a', 5);
  seg(ctx, x - 14, y - 6, x + 14, y - 6, '#2b2b3a', 5);
  ctx.beginPath();
  ctx.moveTo(x - 16, y + 4);
  ctx.quadraticCurveTo(x - 16, y + 22, x, y + 18);
  ctx.quadraticCurveTo(x + 16, y + 22, x + 16, y + 4);
  ctx.stroke();
  shape(ctx, [[x - 20, y + 2], [x - 12, y + 2], [x - 16, y + 12]], '#2b2b3a');
  shape(ctx, [[x + 20, y + 2], [x + 12, y + 2], [x + 16, y + 12]], '#2b2b3a');
}

// A little orange starfish with five arms.
function starfish(ctx, x, y) {
  ctx.fillStyle = '#eda23e';
  ctx.beginPath();
  for (let i = 0; i < 5; i += 1) {
    const a = -Math.PI / 2 + (i / 5) * Math.PI * 2;
    const tipX = x + Math.cos(a) * 13;
    const tipY = y + Math.sin(a) * 13;
    const midA = a + Math.PI / 5;
    const midX = x + Math.cos(midA) * 5;
    const midY = y + Math.sin(midA) * 5;
    if (i === 0) ctx.moveTo(tipX, tipY);
    else ctx.lineTo(tipX, tipY);
    ctx.lineTo(midX, midY);
  }
  ctx.closePath();
  ctx.fill();
  disc(ctx, x, y, 3, '#d94f3d');
}
