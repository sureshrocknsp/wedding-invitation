import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Authentic South Indian Wedding Audio Engine (Nadaswaram, Tambura & Mangala Vaathiyam)
 * Supports audio track playback with seamless procedural Indian Classical synthesis fallback.
 */
export function useAudioEngine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const tanpuraGainRef = useRef<GainNode | null>(null);
  const phraseTimerRef = useRef<number | null>(null);
  const thavilTimerRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const isAudioFilePlayingRef = useRef(false);

  // Initialize Audio Context with user gesture compatibility
  const initContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const master = ctx.createGain();
        master.gain.setValueAtTime(0.85, ctx.currentTime);
        master.connect(ctx.destination);
        masterGainRef.current = master;
        audioCtxRef.current = ctx;
      }
    }
  }, []);

  // Auspicious Temple Bell (Brass Ghanta)
  const playTempleBell = useCallback((fundamentalFreq = 587.33) => {
    initContext();
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    // Harmonic partials of an authentic temple brass bell
    const partials = [1, 2.01, 3.03, 4.22, 5.45, 6.78];
    const gains = [0.4, 0.26, 0.18, 0.09, 0.05, 0.02];

    partials.forEach((p, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamentalFreq * p, now);

      gain.gain.setValueAtTime(gains[idx] * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5 + idx * 0.3);

      osc.connect(gain);
      gain.connect(master);

      osc.start(now);
      osc.stop(now + 4.5);
    });
  }, [initContext]);

  // Create WaveShaper curve to simulate double-reed Nadaswaram saturation
  const createNadaswaramCurve = (amount = 25) => {
    const k = amount;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  };

  // 4-String Traditional Tambura Drone in Panchama Shruti (D / Sa-Pa)
  const startTanpuraDrone = useCallback((ctx: AudioContext, master: GainNode) => {
    const now = ctx.currentTime;
    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.001, now);
    droneGain.gain.exponentialRampToValueAtTime(0.22, now + 2.0);
    droneGain.connect(master);
    tanpuraGainRef.current = droneGain;

    // Panchama (Pa=146.83Hz), Madhyama Sa (220Hz), Tara Sa (220Hz), Mandra Sa (110Hz)
    const tamburaStrings = [
      { freq: 146.83, pan: -0.3, detune: 2 },
      { freq: 220.00, pan: -0.1, detune: -3 },
      { freq: 220.00, pan: 0.1, detune: 3 },
      { freq: 110.00, pan: 0.3, detune: 0 }
    ];

    tamburaStrings.forEach((str) => {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const stringGain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(str.freq, now);
      osc.detune.setValueAtTime(str.detune, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(str.freq, now);
      osc2.detune.setValueAtTime(-str.detune, now);

      // Acoustic wood body resonator filter
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(str.freq * 2.2, now);
      filter.Q.setValueAtTime(3.0, now);

      stringGain.gain.setValueAtTime(0.18, now);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(stringGain);
      stringGain.connect(droneGain);

      osc.start(now);
      osc2.start(now);
    });
  }, []);

  // Auspicious Carnatic Nadaswaram Phrasing (Raga Gambheera Nattai / Kalyani)
  const startNadaswaramMelody = useCallback((ctx: AudioContext, master: GainNode) => {
    // Sacred swaras in D tonic:
    // Sa: 293.66, Ga3: 367.08, Ma1: 391.53, Pa: 440.00, Ni3: 550.00, Tar Sa: 587.33, Tar Ga: 734.16
    const gamakaPhrases = [
      [293.66, 367.08, 391.53, 440.00],               // Sa Ga Ma Pa (Auspicious rising invocation)
      [440.00, 550.00, 587.33, 550.00, 440.00],       // Pa Ni Sa' Ni Pa (Divine crown grace)
      [587.33, 550.00, 440.00, 367.08, 293.66],       // Sa' Ni Pa Ga Sa (Cascading blessing)
      [293.66, 367.08, 440.00, 587.33],               // Fast ascending floral flourish
      [440.00, 391.53, 367.08, 293.66]                // Pa Ma Ga Sa
    ];

    let phraseIndex = 0;

    const playPhrase = () => {
      if (ctx.state === 'suspended') return;

      const phrase = gamakaPhrases[phraseIndex % gamakaPhrases.length];
      phraseIndex++;

      const nadaswaramGain = ctx.createGain();
      const shaper = ctx.createWaveShaper();
      shaper.curve = createNadaswaramCurve(15);
      shaper.oversample = '2x';

      // Characteristic Nadaswaram nasal reed resonance (1.8kHz - 2.4kHz)
      const formantFilter = ctx.createBiquadFilter();
      formantFilter.type = 'peaking';
      formantFilter.frequency.setValueAtTime(2200, ctx.currentTime);
      formantFilter.Q.setValueAtTime(3.5, ctx.currentTime);
      formantFilter.gain.setValueAtTime(10, ctx.currentTime);

      const highCut = ctx.createBiquadFilter();
      highCut.type = 'lowpass';
      highCut.frequency.setValueAtTime(4500, ctx.currentTime);

      nadaswaramGain.connect(shaper);
      shaper.connect(formantFilter);
      formantFilter.connect(highCut);
      highCut.connect(master);

      const startTime = ctx.currentTime + 0.05;
      let noteTime = startTime;

      phrase.forEach((freq, idx) => {
        const noteDuration = 0.55 + Math.random() * 0.45;
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        // Authentic dual-reed wave mix
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, noteTime);

        // Add Carnatic Gamaka (subtle pitch slide / kampita ornament)
        if (idx > 0) {
          const prevFreq = phrase[idx - 1];
          osc.frequency.setValueAtTime(prevFreq, noteTime);
          osc.frequency.exponentialRampToValueAtTime(freq, noteTime + 0.12);
        }

        // Gamaka microtonal vibrato
        const vibrato = ctx.createOscillator();
        const vibratoGain = ctx.createGain();
        vibrato.frequency.setValueAtTime(5.8, noteTime);
        vibratoGain.gain.setValueAtTime(freq * 0.018, noteTime);
        vibrato.connect(osc.frequency);
        vibrato.start(noteTime);
        vibrato.stop(noteTime + noteDuration);

        // Breath envelope (soft attack, sustained singing tone, gentle release)
        noteGain.gain.setValueAtTime(0.001, noteTime);
        noteGain.gain.linearRampToValueAtTime(0.08, noteTime + 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + noteDuration);

        osc.connect(noteGain);
        noteGain.connect(nadaswaramGain);

        osc.start(noteTime);
        osc.stop(noteTime + noteDuration + 0.05);

        noteTime += noteDuration * 0.88;
      });
    };

    // Initial phrase
    setTimeout(playPhrase, 500);
    // Recurring traditional melodic sequences every ~3.2 seconds
    phraseTimerRef.current = window.setInterval(playPhrase, 3200);
  }, []);

  // Subtle traditional Thavil bass pulse (tha-dhim)
  const startThavilRhythm = useCallback((ctx: AudioContext, master: GainNode) => {
    const playThavilStroke = () => {
      if (ctx.state === 'suspended') return;
      const now = ctx.currentTime;

      // Resonant bass membrane (Valanthalai)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(85, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      osc.start(now);
      osc.stop(now + 0.4);
    };

    // Auspicious 4-beat gentle rhythm
    thavilTimerRef.current = window.setInterval(playThavilStroke, 1600);
  }, []);

  // Primary Start Music Handler
  const startMusic = useCallback(() => {
    initContext();
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    if (!isPlaying) {
      // Check if an audio file exists in public/assets/audio/
      if (!audioElementRef.current) {
        const audio = new Audio();
        audio.src = '/assets/audio/alanati_ramachandrudu.mp3';
        audio.loop = true;
        audio.volume = 0.85;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              isAudioFilePlayingRef.current = true;
            })
            .catch(() => {
              // If audio file playback is blocked or fails, fall back to procedural Indian Classical synthesis
              isAudioFilePlayingRef.current = false;
              startTanpuraDrone(ctx, master);
              startNadaswaramMelody(ctx, master);
              startThavilRhythm(ctx, master);
            });
        }

        audioElementRef.current = audio;
      } else {
        audioElementRef.current.play().catch(() => {
          startTanpuraDrone(ctx, master);
          startNadaswaramMelody(ctx, master);
          startThavilRhythm(ctx, master);
        });
      }

      setIsPlaying(true);
    }
  }, [initContext, isPlaying, startTanpuraDrone, startNadaswaramMelody, startThavilRhythm]);

  // Stop Music Handler with gentle fade-out
  const stopMusic = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    if (tanpuraGainRef.current && ctx) {
      tanpuraGainRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    }
    if (phraseTimerRef.current) {
      clearInterval(phraseTimerRef.current);
      phraseTimerRef.current = null;
    }
    if (thavilTimerRef.current) {
      clearInterval(thavilTimerRef.current);
      thavilTimerRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  // Toggle Music
  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }, [isPlaying, startMusic, stopMusic]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (phraseTimerRef.current) clearInterval(phraseTimerRef.current);
      if (thavilTimerRef.current) clearInterval(thavilTimerRef.current);
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
    };
  }, []);

  return {
    isPlaying,
    playTempleBell,
    startMusic,
    stopMusic,
    toggleMusic
  };
}
