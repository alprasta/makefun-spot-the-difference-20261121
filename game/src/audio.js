// All sound comes from the Web Audio API: no audio files, no network.
// A found difference rings a bright two-note chime, a wrong click a low
// buzz, a finished scene a rising arpeggio. The audio context is created
// lazily on the first user gesture (browsers insist on that), and M mutes
// everything.
export function createAudio() {
  let context = null;
  let muted = false;

  function contextNow() {
    if (context === null) {
      try {
        const AudioContext = window.AudioContext ?? window.webkitAudioContext;
        context = new AudioContext();
      } catch {
        context = null;
      }
    }
    if (context !== null && context.state === 'suspended') context.resume();
    return context;
  }

  // One note: an oscillator with a quick attack and an exponential fade.
  function note(freq, delay, length, wave, vol) {
    const ctx = contextNow();
    if (ctx === null || muted) return;
    const at = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = wave;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(vol, at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(at);
    osc.stop(at + length + 0.05);
  }

  // A little tune: [frequency, delay, length] triples, all sine.
  function tune(notes, vol) {
    for (const [freq, delay, length] of notes) note(freq, delay, length, 'sine', vol);
  }

  return {
    unlock() { contextNow(); },
    get muted() { return muted; },
    toggleMute() {
      muted = !muted;
      return muted;
    },
    click() { note(520, 0, 0.07, 'sine', 0.12); },
    found() {
      note(659, 0, 0.14, 'sine', 0.22);
      note(880, 0.09, 0.22, 'sine', 0.22);
    },
    wrong() { note(150, 0, 0.22, 'sawtooth', 0.12); },
    hint() {
      note(440, 0, 0.1, 'sine', 0.15);
      note(440, 0.12, 0.1, 'sine', 0.15);
    },
    tick() { note(988, 0, 0.05, 'square', 0.07); },
    levelClear() {
      tune([[523, 0, 0.14], [659, 0.12, 0.14], [784, 0.24, 0.14], [1047, 0.36, 0.3]], 0.2);
    },
    victory() {
      tune(
        [[523, 0, 0.22], [659, 0.13, 0.22], [784, 0.26, 0.22], [1047, 0.39, 0.22],
         [784, 0.52, 0.22], [1047, 0.65, 0.22], [1319, 0.78, 0.3]],
        0.2,
      );
    },
    fail() {
      tune([[392, 0, 0.2], [311, 0.18, 0.3]], 0.18);
    },
  };
}
