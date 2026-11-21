// The game's rules and state, with no drawing and no browser in it: which
// scene is on, which differences are found, the score, the combo, the
// hints, the timer and the screens. The renderer reads this state; the
// input layer calls its methods. Nothing here knows about pixels.
import { HINTS_PER_LEVEL, HINT_PULSE_SECONDS, SCORE, WRONG_FLASH_SECONDS } from './config.js';
import { SCENES } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_LEVEL_CLEAR = 'level-clear';
export const SCREEN_LEVEL_FAILED = 'level-failed';
export const SCREEN_VICTORY = 'victory';

export const EVENT_NONE = 0;
export const EVENT_FOUND = 1;
export const EVENT_WRONG = 2;
export const EVENT_LEVEL_CLEAR = 4;
export const EVENT_TIMEOUT = 8;
export const EVENT_TICK = 16;

export function createWorld() {
  const state = {
    screen: SCREEN_TITLE,
    level: 0,
    score: 0,
    levelScore: 0,
    best: 0,
    found: new Set(),
    combo: 0,
    comboTimer: 0,
    hintsLeft: HINTS_PER_LEVEL,
    hintIndex: -1,
    hintTimer: 0,
    timeLeft: SCENES[0].timeLimit,
    timeBonus: 0,
    wrongFlash: null,
    floaters: [],
    lastFoundLabel: '',
    levelScores: [],
    elapsed: 0,
    tickSecond: -1,
  };

  function scene() {
    return SCENES[state.level];
  }

  function startLevel(level) {
    state.level = level;
    state.found = new Set();
    state.combo = 0;
    state.comboTimer = 0;
    state.hintsLeft = HINTS_PER_LEVEL;
    state.hintIndex = -1;
    state.hintTimer = 0;
    state.levelScore = 0;
    state.timeBonus = 0;
    state.timeLeft = scene().timeLimit;
    state.wrongFlash = null;
    state.floaters = [];
    state.lastFoundLabel = '';
    state.tickSecond = -1;
    state.screen = SCREEN_PLAY;
  }

  function startGame() {
    state.score = 0;
    state.levelScores = [];
    startLevel(0);
  }

  /** Click on a panel, in scene coordinates. Returns what happened. */
  function clickAt(x, y) {
    if (state.screen !== SCREEN_PLAY) return EVENT_NONE;
    const diffs = scene().differences;
    for (let i = 0; i < diffs.length; i += 1) {
      if (state.found.has(i)) continue;
      const d = diffs[i];
      const dx = x - d.x;
      const dy = y - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) {
        state.found.add(i);
        const comboBonus = Math.min(state.combo, SCORE.comboMax) * SCORE.comboStep;
        const points = SCORE.find + comboBonus;
        state.score += points;
        state.levelScore += points;
        state.combo = Math.min(state.combo + 1, SCORE.comboMax + 1);
        state.comboTimer = SCORE.comboWindow;
        state.lastFoundLabel = d.label;
        state.floaters.push({ x, y, text: `+${points}`, until: state.elapsed + 1.2 });
        if (state.hintIndex === i) {
          state.hintIndex = -1;
          state.hintTimer = 0;
        }
        if (state.found.size === diffs.length) {
          state.timeBonus = Math.ceil(state.timeLeft) * SCORE.timeBonusPerSecond;
          state.score += state.timeBonus;
          state.levelScores.push(state.levelScore + state.timeBonus);
          state.screen = state.level === SCENES.length - 1 ? SCREEN_VICTORY : SCREEN_LEVEL_CLEAR;
          return EVENT_FOUND | EVENT_LEVEL_CLEAR;
        }
        return EVENT_FOUND;
      }
    }
    state.score = Math.max(0, state.score - SCORE.wrong);
    state.levelScore = Math.max(0, state.levelScore - SCORE.wrong);
    state.combo = 0;
    state.comboTimer = 0;
    state.wrongFlash = { x, y, until: state.elapsed + WRONG_FLASH_SECONDS };
    state.floaters.push({ x, y, text: `-${SCORE.wrong}`, until: state.elapsed + 1.0 });
    return EVENT_WRONG;
  }

  /** Spend a hint: pulse one still-hidden difference for a couple of seconds. */
  function useHint() {
    if (state.screen !== SCREEN_PLAY || state.hintsLeft <= 0) return false;
    const remaining = scene().differences
      .map((d, i) => i)
      .filter((i) => !state.found.has(i));
    if (remaining.length === 0) return false;
    state.hintIndex = remaining[Math.floor(Math.random() * remaining.length)];
    state.hintTimer = HINT_PULSE_SECONDS;
    state.hintsLeft -= 1;
    state.score = Math.max(0, state.score - SCORE.hintCost);
    state.levelScore = Math.max(0, state.levelScore - SCORE.hintCost);
    return true;
  }

  function nextLevel() {
    if (state.screen === SCREEN_LEVEL_CLEAR) startLevel(state.level + 1);
  }

  function retryLevel() {
    if (state.screen === SCREEN_LEVEL_FAILED) {
      // The timeout banked this attempt's level score; take it back so a
      // retry does not count the failed attempt twice.
      state.levelScores.pop();
      state.score -= state.levelScore;
      if (state.score < 0) state.score = 0;
      startLevel(state.level);
    }
  }

  function pause() {
    if (state.screen === SCREEN_PLAY) state.screen = SCREEN_PAUSED;
    else if (state.screen === SCREEN_PAUSED) state.screen = SCREEN_PLAY;
  }

  function tick(dt) {
    state.elapsed += dt;
    if (state.screen !== SCREEN_PLAY) return EVENT_NONE;
    let events = EVENT_NONE;
    state.timeLeft -= dt;
    if (state.comboTimer > 0) {
      state.comboTimer -= dt;
      if (state.comboTimer <= 0) state.combo = 0;
    }
    if (state.hintTimer > 0) {
      state.hintTimer -= dt;
      if (state.hintTimer <= 0) state.hintIndex = -1;
    }
    state.floaters = state.floaters.filter((f) => f.until > state.elapsed);
    if (state.wrongFlash !== null && state.wrongFlash.until <= state.elapsed) state.wrongFlash = null;
    const whole = Math.ceil(state.timeLeft);
    if (whole <= 10 && whole !== state.tickSecond && whole > 0) {
      state.tickSecond = whole;
      events |= EVENT_TICK;
    }
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.levelScores.push(state.levelScore);
      state.screen = SCREEN_LEVEL_FAILED;
      events |= EVENT_TIMEOUT;
    }
    return events;
  }

  return {
    state, scene, startGame, startLevel, clickAt, useHint, nextLevel,
    retryLevel, pause, tick,
  };
}
