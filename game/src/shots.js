// The screenshot scenes behind ?shot=start|play|play2|end. Each one
// stages the real game state — no fake pixels: the play shots are
// mid-level with some differences already ringed in gold and several
// still hidden, and the counter shows how many remain, exactly as the
// bounty asks. After painting twice, window.__shotReady is set for
// the screenshot.
import { SCREEN_TITLE, SCREEN_VICTORY } from './world.js';
import { SCENES } from './scenes.js';

// What each named shot shows. found: which differences are already
// ringed. score/levelScore/timeLeft/hintsLeft/combo: the HUD numbers.
// label: the "Found: ..." toast. levelScores: the scores of the
// finished scenes. best: the best score shown on the frame.
const SHOTS = {
  start: {
    level: 0, screen: SCREEN_TITLE, found: [], score: 0, timeLeft: null,
    best: 1150,
  },
  play: {
    level: 0, screen: null, found: [0, 2, 4], score: 350, levelScore: 350,
    timeLeft: 74, hintsLeft: 2, combo: 2, label: 'the bird on the birdhouse',
    best: 0,
  },
  play2: {
    level: 2, screen: null, found: [0, 1, 2, 4, 6], score: 1240, levelScore: 640,
    timeLeft: 41, hintsLeft: 1, combo: 2, label: 'the buoy lost its stripes',
    levelScores: [420, 380], best: 1150,
  },
  end: {
    level: 2, screen: SCREEN_VICTORY, found: 'all', score: 2310, levelScore: 690,
    timeLeft: 23, timeBonus: 115, levelScores: [520, 480, 805], best: 2310,
  },
};

// Set `world` to the named shot and return the best score to show.
export function stageShot(name, world) {
  const shot = SHOTS[name] ?? SHOTS.start;
  const state = world.state;
  world.startGame();
  if (shot.screen === SCREEN_TITLE) {
    state.screen = SCREEN_TITLE;
    state.level = shot.level;
    state.found = new Set();
    state.score = 0;
    state.timeLeft = SCENES[shot.level].timeLimit;
    return shot.best;
  }
  world.startLevel(shot.level);
  state.found = new Set(
    shot.found === 'all'
      ? SCENES[shot.level].differences.map((d, i) => i)
      : shot.found,
  );
  state.score = shot.score;
  state.levelScore = shot.levelScore ?? 0;
  state.timeLeft = shot.timeLeft;
  state.hintsLeft = shot.hintsLeft ?? state.hintsLeft;
  state.combo = shot.combo ?? 0;
  state.comboTimer = shot.combo ? 6 : 0;
  state.lastFoundLabel = shot.label ?? '';
  if (shot.timeBonus !== undefined) state.timeBonus = shot.timeBonus;
  if (shot.levelScores !== undefined) state.levelScores = shot.levelScores;
  if (shot.screen !== null) state.screen = shot.screen;
  return shot.best;
}

// Paint the staged scene twice, then signal that the shot is ready.
export function runShot(name, world, renderer) {
  const best = stageShot(name, world);
  let painted = 0;
  function paint() {
    renderer.draw(world.state, best, true, performance.now());
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}
