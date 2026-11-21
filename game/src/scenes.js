// The scene registry: the three hand-drawn scenes in play order, easiest
// first. Each scene is one module with its own draw() and its own list of
// differences, so a new scene is one new file plus one line here.
import { garden } from './scene-garden.js';
import { kitchen } from './scene-kitchen.js';
import { harbor } from './scene-harbor.js';

export const SCENES = [garden, kitchen, harbor];

/** Total differences across the whole game (7 a scene, 3 scenes). */
export const TOTAL_DIFFERENCES = SCENES.reduce((n, s) => n + s.differences.length, 0);
