/**
 * Web Audio API Music Box Synthesizer for Pip's Cozy Dream Workshop
 * Creates gentle, bell-like music box tones with natural resonance and decay.
 */

// Musical note frequencies (Hz)
const NOTES: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50, D6: 1174.66, E6: 1318.51, G6: 1567.98,
  REST: 0,
};

// Melody definitions: [note, durationInBeats]
export interface MelodyTrack {
  id: string;
  title: string;
  tempo: number; // BPM
  notes: Array<[string, number]>;
}

export const LULLABY_TRACKS: MelodyTrack[] = [
  {
    id: 'brahms',
    title: "Pip's Sleepy Starlight Melody",
    tempo: 76,
    notes: [
      // Soothing Brahms-inspired lullaby
      ['E5', 1], ['E5', 1.5], ['G5', 1.5],
      ['E5', 1], ['E5', 1.5], ['G5', 1.5],
      ['E5', 1], ['G5', 1], ['C6', 2], ['B5', 1],
      ['A5', 1], ['A5', 1], ['G5', 2],
      ['D5', 1], ['E5', 1], ['F5', 1.5], ['D5', 1],
      ['D5', 1], ['E5', 1], ['F5', 1.5],
      ['D5', 1], ['F5', 1], ['B5', 2], ['A5', 1],
      ['G5', 1], ['B5', 1], ['C6', 3],
      ['REST', 1],
      // Second phrase
      ['C5', 1], ['C5', 1], ['C6', 2.5], ['A5', 1],
      ['F5', 1], ['G5', 1], ['E5', 2.5], ['C5', 1],
      ['F5', 1], ['G5', 1], ['A5', 2], ['F5', 1],
      ['G5', 2.5], ['REST', 0.5],
      ['C5', 1], ['C5', 1], ['C6', 2.5], ['A5', 1],
      ['F5', 1], ['G5', 1], ['E5', 2.5], ['C5', 1],
      ['F5', 1], ['E5', 1], ['D5', 2], ['E5', 1],
      ['C5', 3.5], ['REST', 1],
    ],
  },
  {
    id: 'starfall',
    title: 'Starfall Waltz in the Nursery',
    tempo: 84,
    notes: [
      ['G5', 1], ['E5', 1], ['C5', 1], ['G5', 2], ['E5', 1],
      ['A5', 1], ['F5', 1], ['D5', 1], ['A5', 2], ['F5', 1],
      ['B5', 1], ['G5', 1], ['E5', 1], ['C6', 2.5],
      ['B5', 1], ['A5', 1], ['G5', 1], ['E5', 2], ['C5', 1],
      ['D5', 1.5], ['E5', 1.5], ['C5', 3],
      ['REST', 1],
    ],
  },
  {
    id: 'clouds',
    title: 'Cotton Cloud Cradle',
    tempo: 70,
    notes: [
      ['C5', 1.5], ['E5', 1.5], ['G5', 1.5], ['C6', 2],
      ['B5', 1], ['G5', 1.5], ['E5', 1.5], ['G5', 2],
      ['A5', 1.5], ['F5', 1.5], ['D5', 1.5], ['F5', 2],
      ['E5', 1.5], ['C5', 1.5], ['D5', 1.5], ['C5', 3],
      ['REST', 1],
    ],
  },
];

class MusicBoxAudioService {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.65;
  private currentTrackIndex = 0;
  private currentNoteIndex = 0;
  private timerId: number | null = null;
  private listeners: Set<(state: { isPlaying: boolean; isMuted: boolean; currentTrackTitle: string; currentNote: string }) => void> = new Set();
  private currentNoteName = '';

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public subscribe(cb: (state: { isPlaying: boolean; isMuted: boolean; currentTrackTitle: string; currentNote: string }) => void) {
    this.listeners.add(cb);
    cb(this.getState());
    return () => {
      this.listeners.delete(cb);
    };
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      currentTrackTitle: LULLABY_TRACKS[this.currentTrackIndex]?.title || 'Sleepy Tune',
      currentNote: this.currentNoteName,
    };
  }

  private notify() {
    const st = this.getState();
    this.listeners.forEach((cb) => cb(st));
  }

  /**
   * Synthesizes a delicate music-box chime note
   */
  public playChimeNote(freq: number, durationSec: number = 1.2, noteVolumeScale = 1) {
    if (this.isMuted || freq <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const masterVol = this.volume * noteVolumeScale;

      // Master gain for this note
      const noteGain = ctx.createGain();
      noteGain.connect(ctx.destination);

      // Low pass filter to keep tones warm and soft like a wooden music box
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.Q.setValueAtTime(1.2, now);
      filter.connect(noteGain);

      // Fundamental oscillator (sine with quick attack, singing decay)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      const gain1 = ctx.createGain();
      // Attack: gentle pluck
      gain1.gain.setValueAtTime(0.0001, now);
      gain1.gain.linearRampToValueAtTime(masterVol * 0.45, now + 0.008);
      // Bell exponential decay
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc1.connect(gain1);
      gain1.connect(filter);

      // Overtone 1: high metallic tine chime (2.0x or 3.0x frequency)
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.76, now);

      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0.0001, now);
      gain2.gain.linearRampToValueAtTime(masterVol * 0.16, now + 0.005);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + Math.min(0.45, durationSec * 0.5));

      osc2.connect(gain2);
      gain2.connect(filter);

      // Overtone 2: warm octave harmonic
      const osc3 = ctx.createOscillator();
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(freq * 2, now);

      const gain3 = ctx.createGain();
      gain3.gain.setValueAtTime(0.0001, now);
      gain3.gain.linearRampToValueAtTime(masterVol * 0.12, now + 0.012);
      gain3.gain.exponentialRampToValueAtTime(0.0001, now + durationSec * 0.85);

      osc3.connect(gain3);
      gain3.connect(filter);

      // Start & Stop
      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      const stopTime = now + durationSec + 0.1;
      osc1.stop(stopTime);
      osc2.stop(stopTime);
      osc3.stop(stopTime);
    } catch {
      // AudioContext may be restricted by browser until interacted
    }
  }

  public playNamedNote(noteName: string, durationSec = 1.2) {
    const freq = NOTES[noteName];
    if (freq) {
      this.playChimeNote(freq, durationSec, 1.2);
    }
  }

  public start() {
    if (this.isPlaying) return;
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    this.isPlaying = true;
    this.scheduleNextNote();
    this.notify();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.currentNoteName = '';
    this.notify();
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.start();
    }
  }

  public stop() {
    this.pause();
    this.currentNoteIndex = 0;
    this.currentNoteName = '';
    this.notify();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    this.notify();
  }

  public setTrack(trackIndex: number) {
    if (trackIndex >= 0 && trackIndex < LULLABY_TRACKS.length) {
      const wasPlaying = this.isPlaying;
      this.stop();
      this.currentTrackIndex = trackIndex;
      if (wasPlaying) {
        this.start();
      } else {
        this.notify();
      }
    }
  }

  public nextTrack() {
    const nextIdx = (this.currentTrackIndex + 1) % LULLABY_TRACKS.length;
    this.setTrack(nextIdx);
  }

  private scheduleNextNote() {
    if (!this.isPlaying) return;
    const track = LULLABY_TRACKS[this.currentTrackIndex];
    if (!track || track.notes.length === 0) return;

    if (this.currentNoteIndex >= track.notes.length) {
      this.currentNoteIndex = 0; // Loop seamlessly
    }

    const [noteName, beats] = track.notes[this.currentNoteIndex];
    this.currentNoteName = noteName;
    const secondsPerBeat = 60 / track.tempo;
    const noteDurationMs = beats * secondsPerBeat * 1000;

    const freq = NOTES[noteName] || 0;
    if (freq > 0) {
      // Gentle chime ringing
      const ringDuration = Math.max(1.2, beats * secondsPerBeat * 1.5);
      this.playChimeNote(freq, ringDuration, 1.0);
    }

    this.notify();
    this.currentNoteIndex++;

    this.timerId = window.setTimeout(() => {
      this.scheduleNextNote();
    }, noteDurationMs);
  }
}

export const musicBox = new MusicBoxAudioService();
