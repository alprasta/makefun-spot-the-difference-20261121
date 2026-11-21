// All the tuning in one place. The playfield is a fixed 1280 by 720
// logical area; the renderer scales it to fit the window, so nothing
// below depends on the screen size.
export const FIELD = { width: 1280, height: 720 };

// The two picture panels, side by side, with a gap between them.
export const PANEL = { width: 600, height: 440, gap: 40, top: 96 };
export const PANEL_LEFT = { x: 20, y: PANEL.top };
export const PANEL_RIGHT = { x: 660, y: PANEL.top };

// Header strip (title, timer, score, counter) and footer strip (buttons).
export const HEADER = { height: 80 };
export const FOOTER = { top: 552 };

// Footer buttons, in logical coordinates.
export const BUTTONS = {
  hint: { x: 20, y: 580, w: 190, h: 52, label: 'Hint  (H)' },
  pause: { x: 230, y: 580, w: 190, h: 52, label: 'Pause  (P)' },
  sound: { x: 440, y: 580, w: 190, h: 52, label: 'Sound: On  (M)' },
};

// Scoring: a find is worth 100, plus 25 for each find in a row before it
// (up to 4 in a row, so at most +100). The combo lasts 10 seconds.
export const SCORE = {
  find: 100,
  comboStep: 25,
  comboWindow: 10,
  comboMax: 4,
  wrong: 15,
  hintCost: 25,
  timeBonusPerSecond: 5,
};

export const HINTS_PER_LEVEL = 3;
export const HINT_PULSE_SECONDS = 2.0;
export const WRONG_FLASH_SECONDS = 0.6;

export const PALETTE = {
  backdrop: '#171a26',
  panel: '#232838',
  panelEdge: '#3a4157',
  header: '#1e2333',
  text: '#f2f0e9',
  muted: '#9aa3b8',
  gold: '#ffd94d',
  goldDark: '#f7b733',
  green: '#7cc46a',
  red: '#e2604d',
  blue: '#6fb3e8',
  foundRing: '#ffd94d',
  foundCheck: '#2e7d32',
  hintRing: '#6fb3e8',
  wrongRing: '#e05252',
  timerOk: '#7cc46a',
  timerLow: '#e05252',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Where the best total score is kept between visits (this browser only). */
export const BEST_KEY = 'double-take.best';
