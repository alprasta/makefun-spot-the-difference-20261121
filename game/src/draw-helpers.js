// Tiny canvas helpers shared by every scene and by the renderer.
// A scene never reaches for the raw canvas API to draw a shape: it asks
// one of these, so the two panels of a scene always share one hand and
// the art stays consistent. Nothing here knows about the game rules.

const TAU = Math.PI * 2;
const FONT_STACK = 'system-ui, -apple-system, "Segoe UI", sans-serif';
const SHADOW_FILL = 'rgba(0, 0, 0, 0.35)';

// --- Paths: begin a path, draw nothing yet. The caller fills or strokes.

export function pathDisc(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.closePath();
}

export function pathOval(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
  ctx.closePath();
}

export function pathRoundRect(ctx, x, y, w, h, r) {
  const rad = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.lineTo(x + rad, y + h);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.lineTo(x, y + rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

// --- Filled shapes: set the fill colour and fill.

export function disc(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  pathDisc(ctx, x, y, r);
  ctx.fill();
}

export function oval(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  pathOval(ctx, x, y, rx, ry);
  ctx.fill();
}

export function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

export function rrect(ctx, x, y, w, h, r, color) {
  ctx.fillStyle = color;
  pathRoundRect(ctx, x, y, w, h, r);
  ctx.fill();
}

// --- Strokes and lines.

export function strokeRrect(ctx, x, y, w, h, r, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  pathRoundRect(ctx, x, y, w, h, r);
  ctx.stroke();
}

export function seg(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function shape(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
  ctx.fill();
}

// --- Text and shadows.

export function label(ctx, value, x, y, size, color, align = 'center', weight = 700) {
  ctx.font = `${weight} ${size}px ${FONT_STACK}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(value, x, y);
}

// A soft shadow under a picture panel, offset down and right.
export function panelShadow(ctx, x, y, w, h) {
  ctx.fillStyle = SHADOW_FILL;
  pathRoundRect(ctx, x + 4, y + 5, w, h, 14);
  ctx.fill();
}
