// Boot and the one loop: input is read every frame, the world advances in
// real time, and the renderer paints what is there. The game moves between
// six screens: title, play, paused, level clear, level failed and victory.
// A click on a picture panel is tested against the scene's differences;
// a click on a footer button does that button's job; a click anywhere
// else on an overlay screen is the same as pressing Space.
//
// ?shot=start|play|play2|end (with &seed=N) stages that scene instead of
// running the loop, paints it twice and sets window.__shotReady.
import { BEST_KEY, BUTTONS, PANEL, PANEL_LEFT, PANEL_RIGHT } from './config.js';
import { createAudio } from './audio.js';
import { createInput, ACTION_CONFIRM, ACTION_HINT, ACTION_MUTE, ACTION_PAUSE } from './input.js';
import { createRenderer } from './render.js';
import { createWorld, EVENT_FOUND, EVENT_LEVEL_CLEAR, EVENT_TICK, EVENT_TIMEOUT, EVENT_WRONG, SCREEN_LEVEL_CLEAR, SCREEN_LEVEL_FAILED, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE, SCREEN_VICTORY } from './world.js';
import { runShot } from './shots.js';

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const audio = createAudio();
const world = createWorld();
const renderer = createRenderer(canvas);
const input = createInput(canvas, (x, y) => renderer.toLogical(x, y));

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best score lasts this visit.
  }
}

let best = readBest();
let soundOn = true;

function announce(message) {
  status.textContent = message;
}

function inside(rect, x, y) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

/** A click in logical coordinates: panel, button, or overlay advance. */
function handleClick(x, y) {
  const state = world.state;
  audio.unlock();
  if (state.screen === SCREEN_TITLE) {
    world.startGame();
    announce(`Playing. ${world.scene().name}: find 7 differences.`);
    return;
  }
  if (state.screen === SCREEN_LEVEL_CLEAR) {
    world.nextLevel();
    announce(`Playing. ${world.scene().name}: find 7 differences.`);
    return;
  }
  if (state.screen === SCREEN_LEVEL_FAILED) {
    world.retryLevel();
    announce(`Retrying ${world.scene().name}.`);
    return;
  }
  if (state.screen === SCREEN_VICTORY) {
    world.startGame();
    announce(`Playing. ${world.scene().name}: find 7 differences.`);
    return;
  }
  if (state.screen === SCREEN_PAUSED) {
    if (inside(BUTTONS.pause, x, y)) {
      world.pause();
      announce('Playing.');
    }
    return;
  }
  if (state.screen !== SCREEN_PLAY) return;

  if (inside(BUTTONS.hint, x, y)) {
    if (world.useHint()) {
      audio.hint();
      announce(`Hint used. ${state.hintsLeft} left. Look for the pulsing ring.`);
    } else {
      announce('No hints left on this scene.');
    }
    return;
  }
  if (inside(BUTTONS.pause, x, y)) {
    world.pause();
    announce('Paused.');
    return;
  }
  if (inside(BUTTONS.sound, x, y)) {
    soundOn = !audio.toggleMute();
    return;
  }
  for (const origin of [PANEL_LEFT, PANEL_RIGHT]) {
    if (x >= origin.x && x <= origin.x + PANEL.width && y >= origin.y && y <= origin.y + PANEL.height) {
      const events = world.clickAt(x - origin.x, y - origin.y);
      if (events & EVENT_FOUND) {
        audio.found();
        if (events & EVENT_LEVEL_CLEAR) {
          if (state.screen === SCREEN_VICTORY) {
            audio.victory();
            if (state.score > best) {
              best = state.score;
              saveBest(best);
            }
            announce(`You found them all! Total score ${state.score}.`);
          } else {
            audio.levelClear();
            announce(`Scene complete! Time bonus ${state.timeBonus}.`);
          }
        } else {
          announce(`Found: ${state.lastFoundLabel}. ${state.found.size} of 7.`);
        }
      } else if (events & EVENT_WRONG) {
        audio.wrong();
        announce('Not a difference. 15 points off.');
      }
      return;
    }
  }
}

function handleActions() {
  const actions = input.takeActions();
  const state = world.state;
  if (actions & ACTION_MUTE) {
    soundOn = !audio.toggleMute();
  }
  if (actions & ACTION_HINT && state.screen === SCREEN_PLAY) {
    if (world.useHint()) {
      audio.hint();
      announce(`Hint used. ${state.hintsLeft} left.`);
    }
  }
  if (actions & ACTION_PAUSE && (state.screen === SCREEN_PLAY || state.screen === SCREEN_PAUSED)) {
    world.pause();
    announce(state.screen === SCREEN_PAUSED ? 'Paused.' : 'Playing.');
  }
  if (actions & ACTION_CONFIRM) {
    audio.unlock();
    if (state.screen === SCREEN_TITLE) {
      world.startGame();
      announce(`Playing. ${world.scene().name}: find 7 differences.`);
    } else if (state.screen === SCREEN_LEVEL_CLEAR) {
      world.nextLevel();
    } else if (state.screen === SCREEN_LEVEL_FAILED) {
      world.retryLevel();
    } else if (state.screen === SCREEN_VICTORY) {
      world.startGame();
    }
  }
}

function runGame() {
  let last = performance.now();
  announce('Double Take. Press Space or click to play.');

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.25);
    last = now;
    handleActions();
    for (const click of input.takeClicks()) handleClick(click.x, click.y);
    const events = world.tick(dt);
    if (events & EVENT_TICK) audio.tick();
    if (events & EVENT_TIMEOUT) {
      audio.fail();
      announce(`Time's up on ${world.scene().name}.`);
    }
    renderer.draw(world.state, best, soundOn, now);
  }

  // Leaving the tab pauses a running game rather than letting the clock run unseen.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && world.state.screen === SCREEN_PLAY) {
      world.pause();
      announce('Paused.');
    }
  });

  requestAnimationFrame(frame);
}

if (shot) runShot(shot, world, renderer);
else runGame();
