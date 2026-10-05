// Pure Web Audio API Sound Synthesizer for Timer Chimes, Ambient Study Noise & Lo-Fi Study Music

let audioCtx: AudioContext | null = null;
let activeAmbientSource: AudioNode | null = null;
let activeAmbientGain: GainNode | null = null;
let activeLofiInterval: number | null = null;
let activeLofiOscillators: OscillatorNode[] = [];

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a soft, harmonic notification chime when timer finishes
 */
export function playChimeSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Harmonic bell sequence: 523.25 Hz (C5), 659.25 Hz (E5), 783.99 Hz (G5), 1046.50 Hz (C6)
    const freqs = [523.25, 659.25, 783.99, 1046.5];
    
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      
      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 1.3);
    });
  } catch (err) {
    console.warn('Audio playback not permitted or failed', err);
  }
}

/**
 * Starts synthesizing ambient sound or Lo-Fi study beats
 */
export function startAmbientSound(
  type: 'rain' | 'whitenoise' | 'brownnoise' | 'stream' | 'lofi',
  volume: number = 0.3
): void {
  stopAmbientSound();

  try {
    const ctx = getAudioContext();

    if (type === 'lofi') {
      startLofiBeats(ctx, volume);
      return;
    }

    const bufferSize = ctx.sampleRate * 2; // 2 seconds buffer looped
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      
      if (type === 'brownnoise') {
        // Brown noise: integrating white noise with 1/f^2 roll-off
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      } else if (type === 'rain') {
        // Rain: pink/brown noise blend with gentle drop variation
        lastOut = (lastOut + 0.04 * white) / 1.04;
        data[i] = (lastOut * 2.2 + white * 0.08);
      } else if (type === 'stream') {
        // Stream: filtered noise with subtle modulation
        lastOut = (lastOut + 0.03 * white) / 1.03;
        data[i] = lastOut * 2.5;
      } else {
        // White noise
        data[i] = white * 0.2;
      }
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter node for natural acoustic shaping
    const filter = ctx.createBiquadFilter();
    if (type === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
    } else if (type === 'brownnoise') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);
    } else if (type === 'stream') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);
    } else {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, ctx.currentTime);
    }

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start();
    activeAmbientSource = noise;
    activeAmbientGain = gainNode;
  } catch (e) {
    console.warn('Could not start ambient noise', e);
  }
}

/**
 * Lo-Fi Jazz Chord & Beat Synthesizer
 */
function startLofiBeats(ctx: AudioContext, volume: number): void {
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(volume, ctx.currentTime);
  masterGain.connect(ctx.destination);
  activeAmbientGain = masterGain;

  // 1. Vinyl Crackle Generator
  const vinylBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const vData = vinylBuffer.getChannelData(0);
  for (let i = 0; i < vData.length; i++) {
    // Sparse pops + pink noise
    const pop = Math.random() > 0.997 ? (Math.random() * 2 - 1) * 0.35 : 0;
    vData[i] = (Math.random() * 2 - 1) * 0.015 + pop;
  }
  const vinylSource = ctx.createBufferSource();
  vinylSource.buffer = vinylBuffer;
  vinylSource.loop = true;

  const vinylFilter = ctx.createBiquadFilter();
  vinylFilter.type = 'bandpass';
  vinylFilter.frequency.setValueAtTime(2200, ctx.currentTime);
  vinylFilter.Q.setValueAtTime(0.8, ctx.currentTime);

  const vinylGain = ctx.createGain();
  vinylGain.gain.setValueAtTime(0.2, ctx.currentTime);

  vinylSource.connect(vinylFilter);
  vinylFilter.connect(vinylGain);
  vinylGain.connect(masterGain);
  vinylSource.start();
  activeAmbientSource = vinylSource;

  // 2. Chords progression (Dm9 -> G13 -> Cmaj9 -> Am7)
  const chords = [
    [146.83, 174.61, 220.0, 261.63, 329.63], // Dm9 (D3, F3, A3, C4, E4)
    [98.0, 174.61, 246.94, 329.63],          // G13 (G2, F3, B3, E4)
    [130.81, 164.81, 196.0, 246.94, 293.66], // Cmaj9 (C3, E3, G3, B3, D4)
    [110.0, 196.0, 261.63, 329.63],          // Am7 (A2, G3, C4, E4)
  ];

  let chordIndex = 0;
  const barDurationSec = 3.2; // ~75 BPM

  const playLofiBar = () => {
    if (!audioCtx || audioCtx.state === 'closed') return;
    const now = ctx.currentTime;
    const currentChord = chords[chordIndex % chords.length];
    chordIndex++;

    // Play chord tones with Rhodes/warm electric piano timbre
    currentChord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscDetune = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const noteFilter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      oscDetune.type = 'sine';
      oscDetune.frequency.setValueAtTime(freq * 1.002, now); // slight chorus warmth

      noteFilter.type = 'lowpass';
      noteFilter.frequency.setValueAtTime(750, now);
      noteFilter.Q.setValueAtTime(1.5, now);

      // Stagger slightly for gentle finger strum
      const noteStart = now + idx * 0.035;
      noteGain.gain.setValueAtTime(0, noteStart);
      noteGain.gain.linearRampToValueAtTime(0.045, noteStart + 0.06);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + barDurationSec * 0.95);

      osc.connect(noteFilter);
      oscDetune.connect(noteFilter);
      noteFilter.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(noteStart);
      oscDetune.start(noteStart);
      osc.stop(noteStart + barDurationSec);
      oscDetune.stop(noteStart + barDurationSec);

      activeLofiOscillators.push(osc, oscDetune);
    });

    // Lo-Fi Beat: Soft warm kick on beat 1 and beat 3
    const playKick = (time: number) => {
      const kOsc = ctx.createOscillator();
      const kGain = ctx.createGain();
      kOsc.type = 'sine';
      kOsc.frequency.setValueAtTime(90, time);
      kOsc.frequency.exponentialRampToValueAtTime(35, time + 0.18);
      kGain.gain.setValueAtTime(0.12, time);
      kGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.22);
      kOsc.connect(kGain);
      kGain.connect(masterGain);
      kOsc.start(time);
      kOsc.stop(time + 0.25);
      activeLofiOscillators.push(kOsc);
    };

    // Soft tape snare/brush on beat 2 and beat 4
    const playSnare = (time: number) => {
      const sBuf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
      const sData = sBuf.getChannelData(0);
      for (let i = 0; i < sData.length; i++) {
        sData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.025));
      }
      const sSource = ctx.createBufferSource();
      sSource.buffer = sBuf;
      const sFilter = ctx.createBiquadFilter();
      sFilter.type = 'bandpass';
      sFilter.frequency.setValueAtTime(1600, time);
      const sGain = ctx.createGain();
      sGain.gain.setValueAtTime(0.05, time);
      sSource.connect(sFilter);
      sFilter.connect(sGain);
      sGain.connect(masterGain);
      sSource.start(time);
      sSource.stop(time + 0.15);
    };

    const beatInterval = barDurationSec / 4;
    playKick(now);
    playSnare(now + beatInterval);
    playKick(now + beatInterval * 2 + 0.05); // slight laid-back swing
    playSnare(now + beatInterval * 3);
  };

  playLofiBar();
  activeLofiInterval = window.setInterval(playLofiBar, barDurationSec * 1000);
}

/**
 * Adjusts ambient sound volume smoothly
 */
export function setAmbientVolume(volume: number): void {
  if (activeAmbientGain && audioCtx) {
    activeAmbientGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), audioCtx.currentTime);
  }
}

/**
 * Stops any active ambient sound & Lo-Fi beats
 */
export function stopAmbientSound(): void {
  if (activeLofiInterval) {
    window.clearInterval(activeLofiInterval);
    activeLofiInterval = null;
  }
  if (activeLofiOscillators.length > 0) {
    activeLofiOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // already stopped
      }
    });
    activeLofiOscillators = [];
  }
  if (activeAmbientSource) {
    try {
      (activeAmbientSource as AudioBufferSourceNode).stop();
      activeAmbientSource.disconnect();
    } catch {
      // already stopped
    }
    activeAmbientSource = null;
  }
  if (activeAmbientGain) {
    try {
      activeAmbientGain.disconnect();
    } catch {
      // already disconnected
    }
    activeAmbientGain = null;
  }
}
