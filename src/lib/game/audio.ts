// ===== CHIPTUNE AUDIO ENGINE (Web Audio API) =====
// Generates 8-bit-style sound effects and background music
// entirely from oscillators - no external audio files needed.

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicLoopId: number | null = null;
  private isMuted = false;
  private musicVolume = 0.15;
  private sfxVolume = 0.25;
  private currentMusicTrack: string | null = null;

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 1;
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicVolume;
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);
    } catch (e) {
      console.warn("AudioEngine init failed:", e);
    }
  }

  resume() {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : 1;
    }
  }

  isAudioMuted() {
    return this.isMuted;
  }

  // ===== SFX HELPERS =====
  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = "square",
    when: number = 0,
    volume: number = 1,
    freqEnd?: number,
  ) {
    if (!this.ctx || !this.sfxGain) return;
    const t0 = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (freqEnd !== undefined) {
      osc.frequency.linearRampToValueAtTime(freqEnd, t0 + duration);
    }
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(volume, t0 + 0.005);
    gain.gain.linearRampToValueAtTime(0, t0 + duration);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  }

  private playNoise(duration: number, when: number = 0, volume: number = 0.5) {
    if (!this.ctx || !this.sfxGain) return;
    const t0 = this.ctx.currentTime + when;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(
      1,
      bufferSize,
      this.ctx.sampleRate,
    );
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.value = volume;
    src.connect(gain);
    gain.connect(this.sfxGain);
    src.start(t0);
  }

  // ===== SFX LIBRARY =====
  click() {
    this.resume();
    this.playTone(880, 0.04, "square", 0, 0.4);
  }

  hover() {
    this.resume();
    this.playTone(660, 0.02, "square", 0, 0.2);
  }

  correct() {
    this.resume();
    // happy ascending arpeggio
    this.playTone(523, 0.08, "square", 0, 0.5); // C5
    this.playTone(659, 0.08, "square", 0.08, 0.5); // E5
    this.playTone(784, 0.12, "square", 0.16, 0.5); // G5
    this.playTone(1047, 0.18, "square", 0.24, 0.6); // C6
  }

  wrong() {
    this.resume();
    // descending buzz
    this.playTone(220, 0.18, "sawtooth", 0, 0.5, 110);
    this.playNoise(0.1, 0, 0.2);
  }

  attack() {
    this.resume();
    // slash
    this.playTone(880, 0.06, "square", 0, 0.5, 220);
    this.playNoise(0.08, 0.02, 0.3);
  }

  enemyHit() {
    this.resume();
    this.playTone(330, 0.1, "square", 0, 0.5, 110);
    this.playNoise(0.1, 0, 0.3);
  }

  playerHit() {
    this.resume();
    this.playTone(180, 0.15, "sawtooth", 0, 0.5, 80);
    this.playNoise(0.15, 0, 0.4);
  }

  levelUp() {
    this.resume();
    // triumphant fanfare
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((n, i) => {
      this.playTone(n, 0.12, "square", i * 0.1, 0.5);
    });
    this.playTone(1568, 0.3, "square", 0.5, 0.6);
  }

  victory() {
    this.resume();
    // victory melody
    const melody = [
      { f: 523, t: 0, d: 0.15 },
      { f: 659, t: 0.15, d: 0.15 },
      { f: 784, t: 0.3, d: 0.15 },
      { f: 1047, t: 0.45, d: 0.3 },
      { f: 784, t: 0.75, d: 0.15 },
      { f: 1047, t: 0.9, d: 0.4 },
    ];
    melody.forEach((n) => {
      this.playTone(n.f, n.d, "square", n.t, 0.5);
    });
  }

  gameOver() {
    this.resume();
    // sad descending
    const melody = [523, 466, 440, 392, 349, 330, 294, 262];
    melody.forEach((n, i) => {
      this.playTone(n, 0.18, "triangle", i * 0.18, 0.5);
    });
  }

  stageClear() {
    this.resume();
    this.playTone(659, 0.1, "square", 0, 0.5);
    this.playTone(784, 0.1, "square", 0.1, 0.5);
    this.playTone(1047, 0.2, "square", 0.2, 0.6);
  }

  // ===== BACKGROUND MUSIC =====
  // Simple chiptune loop using scheduled notes
  private musicPatterns: Record<string, { freq: number; dur: number }[]> = {
    title: [
      // Calm mysterious melody in A minor
      { freq: 440, dur: 0.3 },
      { freq: 523, dur: 0.3 },
      { freq: 659, dur: 0.3 },
      { freq: 587, dur: 0.3 },
      { freq: 523, dur: 0.3 },
      { freq: 440, dur: 0.3 },
      { freq: 392, dur: 0.6 },
      { freq: 440, dur: 0.3 },
      { freq: 523, dur: 0.3 },
      { freq: 659, dur: 0.6 },
      { freq: 698, dur: 0.3 },
      { freq: 659, dur: 0.3 },
      { freq: 587, dur: 0.6 },
      { freq: 523, dur: 0.6 },
    ],
    world: [
      // Adventurous
      { freq: 392, dur: 0.2 },
      { freq: 523, dur: 0.2 },
      { freq: 659, dur: 0.2 },
      { freq: 784, dur: 0.4 },
      { freq: 659, dur: 0.2 },
      { freq: 523, dur: 0.4 },
      { freq: 440, dur: 0.2 },
      { freq: 523, dur: 0.2 },
      { freq: 659, dur: 0.4 },
      { freq: 523, dur: 0.4 },
      { freq: 392, dur: 0.6 },
    ],
    battle: [
      // Tense, fast battle
      { freq: 330, dur: 0.12 },
      { freq: 330, dur: 0.12 },
      { freq: 392, dur: 0.12 },
      { freq: 523, dur: 0.24 },
      { freq: 494, dur: 0.12 },
      { freq: 440, dur: 0.12 },
      { freq: 392, dur: 0.24 },
      { freq: 330, dur: 0.12 },
      { freq: 392, dur: 0.12 },
      { freq: 440, dur: 0.24 },
      { freq: 523, dur: 0.24 },
    ],
    victory: [
      { freq: 523, dur: 0.2 },
      { freq: 659, dur: 0.2 },
      { freq: 784, dur: 0.4 },
      { freq: 1047, dur: 0.4 },
      { freq: 784, dur: 0.2 },
      { freq: 659, dur: 0.2 },
      { freq: 523, dur: 0.6 },
    ],
  };

  private bassLines: Record<string, { freq: number; dur: number }[]> = {
    title: [
      { freq: 110, dur: 0.6 },
      { freq: 110, dur: 0.6 },
      { freq: 98, dur: 0.6 },
      { freq: 110, dur: 0.6 },
    ],
    world: [
      { freq: 98, dur: 0.4 },
      { freq: 131, dur: 0.4 },
      { freq: 165, dur: 0.4 },
      { freq: 131, dur: 0.4 },
    ],
    battle: [
      { freq: 82, dur: 0.24 },
      { freq: 82, dur: 0.24 },
      { freq: 110, dur: 0.24 },
      { freq: 82, dur: 0.24 },
    ],
    victory: [
      { freq: 131, dur: 0.4 },
      { freq: 165, dur: 0.4 },
      { freq: 196, dur: 0.4 },
      { freq: 262, dur: 0.4 },
    ],
  };

  playMusic(track: "title" | "world" | "battle" | "victory") {
    this.resume();
    if (!this.ctx || !this.musicGain) return;
    if (this.currentMusicTrack === track) return;
    this.stopMusic();

    this.currentMusicTrack = track;
    const melody = this.musicPatterns[track];
    const bass = this.bassLines[track];
    if (!melody || !bass) return;

    let melodyIdx = 0;
    let bassIdx = 0;
    let melodyTime = 0;
    let bassTime = 0;

    const scheduleAhead = () => {
      if (!this.ctx || !this.musicGain || this.currentMusicTrack !== track)
        return;

      const now = this.ctx.currentTime;
      // schedule melody notes up to 1 second ahead
      while (melodyTime < now + 1) {
        const note = melody[melodyIdx % melody.length];
        this.scheduleMusicNote(note.freq, note.dur, melodyTime, "square", 0.4);
        melodyTime += note.dur;
        melodyIdx++;
      }
      // schedule bass notes up to 1 second ahead
      while (bassTime < now + 1) {
        const note = bass[bassIdx % bass.length];
        this.scheduleMusicNote(note.freq, note.dur, bassTime, "triangle", 0.6);
        bassTime += note.dur;
        bassIdx++;
      }
    };

    scheduleAhead();
    this.musicLoopId = window.setInterval(scheduleAhead, 500);
  }

  private scheduleMusicNote(
    freq: number,
    duration: number,
    when: number,
    type: OscillatorType,
    volume: number,
  ) {
    if (!this.ctx || !this.musicGain) return;
    const t0 = Math.max(when, this.ctx.currentTime);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(volume * 0.3, t0 + 0.02);
    gain.gain.linearRampToValueAtTime(volume * 0.3, t0 + duration * 0.7);
    gain.gain.linearRampToValueAtTime(0, t0 + duration);
    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  }

  stopMusic() {
    if (this.musicLoopId !== null) {
      clearInterval(this.musicLoopId);
      this.musicLoopId = null;
    }
    this.currentMusicTrack = null;
  }
}

export const audio = new AudioEngine();
