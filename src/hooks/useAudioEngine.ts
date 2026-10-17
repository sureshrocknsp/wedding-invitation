import { useState, useRef, useCallback } from 'react';

export function useAudioEngine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const tanpuraGainRef = useRef<GainNode | null>(null);
  const melodyIntervalRef = useRef<number | null>(null);

  const initContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
  }, []);

  const playTempleBell = useCallback((freq = 587.33) => {
    initContext();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const partials = [1, 2.01, 3.02, 4.2, 5.4];
    const gains = [0.35, 0.22, 0.14, 0.07, 0.03];

    partials.forEach((p, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * p, now);

      gain.gain.setValueAtTime(gains[idx] * 0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2 + idx * 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 4.2);
    });
  }, [initContext]);

  const startTanpuraDrone = useCallback((ctx: AudioContext) => {
    const now = ctx.currentTime;
    const masterDroneGain = ctx.createGain();
    masterDroneGain.gain.setValueAtTime(0.001, now);
    masterDroneGain.gain.exponentialRampToValueAtTime(0.16, now + 1.8);
    masterDroneGain.connect(ctx.destination);
    tanpuraGainRef.current = masterDroneGain;

    const freqs = [110, 146.83, 220, 293.66];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(f, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420 + i * 70, now);
      filter.Q.setValueAtTime(2.5, now);

      lfo.frequency.setValueAtTime(0.2 + i * 0.1, now);
      lfoGain.gain.setValueAtTime(1.4, now);
      lfo.connect(osc.frequency);

      osc.connect(filter);
      filter.connect(masterDroneGain);

      osc.start(now);
      lfo.start(now);
    });
  }, []);

  const startMelodicPhrases = useCallback((ctx: AudioContext) => {
    const ragaScale = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99];

    const playMelodyNote = () => {
      if (ctx.state === 'suspended') return;
      const now = ctx.currentTime;
      const noteFreq = ragaScale[Math.floor(Math.random() * ragaScale.length)];
      const duration = 1.3 + Math.random() * 1.4;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(noteFreq, now);

      if (Math.random() > 0.4) {
        const targetFreq = ragaScale[Math.floor(Math.random() * ragaScale.length)];
        osc.frequency.setTargetAtTime(targetFreq, now + 0.25, 0.35);
      }

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, now);
      filter.Q.setValueAtTime(1.4, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.2);
    };

    melodyIntervalRef.current = window.setInterval(() => {
      if (Math.random() > 0.25) {
        playMelodyNote();
      }
    }, 1900);
  }, []);

  const startMusic = useCallback(() => {
    initContext();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    if (!isPlaying) {
      startTanpuraDrone(ctx);
      startMelodicPhrases(ctx);
      setIsPlaying(true);
    }
  }, [initContext, isPlaying, startTanpuraDrone, startMelodicPhrases]);

  const stopMusic = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (tanpuraGainRef.current && ctx) {
      tanpuraGainRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
    }
    if (melodyIntervalRef.current) {
      clearInterval(melodyIntervalRef.current);
      melodyIntervalRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }, [isPlaying, startMusic, stopMusic]);

  return {
    isPlaying,
    playTempleBell,
    startMusic,
    stopMusic,
    toggleMusic
  };
}
