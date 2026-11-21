// Double Take — a spot-the-difference game. The game is the static files
// in game/ (index.html plus its ES modules), which a desktop browser
// loads offline with no library and no network request. This program is
// the entrypoint the grader runs: it hands the game in by copying game/
// and screenshots/ into /output and writing /output/dossier.json, the
// summary the judge reads, using the kit's vendored make.fun library.
//
// Play it locally with `node serve.ts` and open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for
// /output, so this also works:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

// Where this file lives, and where the entry goes.
const rootDir = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copyTree(from, to) {
  mkdirSync(to, { recursive: true });
  cpSync(join(rootDir, from), join(outDir, to), { recursive: true });
}

copyTree('game', 'game');
if (existsSync(join(rootDir, 'screenshots'))) copyTree('screenshots', 'screenshots');

// The scorer's own caps (reference/gate.json). Only text_max_bytes shapes
// the dossier's bytes; the rest mirror what the scorer refuses: more than
// 4 screenshots, or one over 256 KiB; more than 993 files in game/, or
// over 48 MiB of game files; a path under game/ over 1000 bytes. game/
// shares /output's own 1000-entry cap with screenshots/ and dossier.json.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
