// Small canvas helpers shared by the three scenes. Every scene draws with
// these, so the two panels of a scene share one hand: filled shapes, soft
// outlines and a little text. Nothing here knows about the game rules.
export function pathDisc(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
}

export function pathOval(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.closePath();
}

export function pathRoundRect(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

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
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

export function label(ctx, value, x, y, size, color, align = 'center', weight = 700) {
  ctx.font = `${weight} ${size}px system-ui, -apple-system, "Segoe UI", sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(value, x, y);
}

// A soft shadow under a picture panel.
export function panelShadow(ctx, x, y, w, h) {
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  pathRoundRect(ctx, x + 4, y + 5, w, h, 14);
  ctx.fill();
}
