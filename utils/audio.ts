// Simple synth for retro sounds without external assets

let audioCtx: AudioContext | null = null;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

export const playSound = (type: 'static' | 'click' | 'success' | 'power', volume: number = 0.5) => {
  if (volume <= 0) return;
  
  const ctx = getCtx();
  const gainNode = ctx.createGain();
  gainNode.connect(ctx.destination);
  gainNode.gain.value = volume * 0.2; // Master attenuation

  const osc = ctx.createOscillator();
  osc.connect(gainNode);

  const now = ctx.currentTime;

  switch (type) {
    case 'click':
      osc.type = 'square';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;

    case 'static':
      // White noise for static
      const bufferSize = ctx.sampleRate * 0.2; // 0.2 seconds
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.connect(gainNode);
      noise.start(now);
      break;

    case 'success':
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554, now + 0.1); // C#
      osc.frequency.setValueAtTime(659, now + 0.2); // E
      osc.frequency.setValueAtTime(880, now + 0.4); // A
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
      osc.start(now);
      osc.stop(now + 1.5);
      break;
      
    case 'power':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
      break;
  }
};
