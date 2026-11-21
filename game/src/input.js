// Keyboard and pointer input for the game loop.
//
// Key presses are one-shot: each press sets a flag bit, and the loop
// collects the flags once per frame, so a press that lands between two
// frames is never lost and never counted twice. Pointer clicks are queued
// in the order they arrive and handed out oldest first, already converted
// to the playfield's logical coordinates by the caller.
export const ACTION_CONFIRM = 1;
export const ACTION_HINT = 2;
export const ACTION_PAUSE = 4;
export const ACTION_MUTE = 8;

// Which physical key codes map to which action.
const KEY_TO_ACTION = {
  Space: ACTION_CONFIRM,
  Enter: ACTION_CONFIRM,
  KeyP: ACTION_PAUSE,
  Escape: ACTION_PAUSE,
  KeyH: ACTION_HINT,
  KeyM: ACTION_MUTE,
};

export function createInput(canvas, toLogical) {
  let pending = 0;
  const clicks = [];

  window.addEventListener('keydown', (event) => {
    const action = KEY_TO_ACTION[event.code];
    if (action === undefined || event.repeat) return;
    pending |= action;
    event.preventDefault();
  });

  canvas.addEventListener('pointerdown', (event) => {
    const box = canvas.getBoundingClientRect();
    clicks.push(toLogical(event.clientX - box.left, event.clientY - box.top));
  });

  return {
    /** The one-shot presses since the last call, as ACTION_* flags. */
    takeActions() {
      const taken = pending;
      pending = 0;
      return taken;
    },
    /** Clicks since the last call, in logical coordinates, oldest first. */
    takeClicks() {
      return clicks.splice(0, clicks.length);
    },
  };
}
