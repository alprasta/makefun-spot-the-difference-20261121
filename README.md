# Double Take — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/alprasta/makefun-spot-the-difference-20261121/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/alprasta/makefun-spot-the-difference-20261121/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

A complete spot-the-difference game for make.fun's
**"Make the best spot the difference game"** bounty
(`best-spot-the-difference-game-20261121-0451`).

Two pictures that look the same, side by side — except they are not.
Seven differences hide in each scene. Find them all before the clock
runs out.

## How to play

- **Click a difference** on either picture — it counts on both. A gold
  ring and a check mark appear on both panels, and the counter updates.
- **Finds in a row build a combo** (up to +100 bonus per find).
- **Wrong clicks cost 15 points** and reset your combo.
- **Hint button (or H)**: pulses a ring over one difference you have not
  found yet. Three hints per scene, 25 points each.
- **Timer**: each scene has its own clock (120 / 110 / 100 seconds).
  Finishing a scene earns a time bonus of 5 points per second left.
- **Pause (P)**, **Sound (M)**. Your best total score is kept in the browser.

## The scenes

1. **Sunny Garden** — a cottage garden in the morning (120 s)
2. **Cozy Kitchen** — tea is on, and the cat is in charge (110 s)
3. **Harbor at Dusk** — the last boat in before dark (100 s)

Every scene is drawn in code — original art, no copied images, no
network requests. Each scene hides 7 differences: things that vanish,
change colour, move, or lose a detail.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Or open `game/index.html` from any static server. The game is plain
static files under `game/` and plays offline in a desktop browser.

## Screenshots

`?shot=start|play|play2|end` stages the title, mid-hunt and victory
frames (see `shots.json`). The screenshots in `screenshots/` are real
renders of this game's own code.

## Layout

- `main.ts` — the entrypoint: copies `game/` and `screenshots/` to
  `/output` and writes `dossier.json` with the kit's `vendor/makefun-game.ts`.
- `game/index.html` — the shell; `game/src/main.js` boots the loop.
- `game/src/config.js` — tuning, layout, palette, scoring.
- `game/src/scenes.js` — the scene registry (one file per scene).
- `game/src/scene-garden.js`, `scene-kitchen.js`, `scene-harbor.js` —
  the three hand-drawn scenes and their differences.
- `game/src/world.js` — rules and state: score, combo, hints, timer.
- `game/src/render.js` — drawing: panels, markers, HUD, overlays.
- `game/src/input.js` — keyboard and pointer input.
- `game/src/audio.js` — Web Audio sounds, no audio files.
- `game/src/shots.js` — the staged screenshot scenes.
- `game/src/draw-helpers.js` — shared canvas helpers.
- `vendor/makefun-game.ts` — the kit's library, unchanged.
- `serve.ts` — a tiny static server for local play-testing.

## License

MIT — see `LICENSE`.

---

Entered on [make.fun](https://make.fun/?ref=58yp00jq&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards
