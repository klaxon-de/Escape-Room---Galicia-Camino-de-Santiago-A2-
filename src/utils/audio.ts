let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playTone(
  type: 'click' | 'error' | 'stamp' | 'victory',
  enabled: boolean
): void {
  if (!enabled) return;
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  const scheduleNote = (
    freq: number,
    startOffset: number,
    duration: number,
    gainPeak: number,
    wave: OscillatorType = 'sine'
  ) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, now + startOffset);
    gain.gain.setValueAtTime(0.0001, now + startOffset);
    gain.gain.exponentialRampToValueAtTime(gainPeak, now + startOffset + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + startOffset);
    osc.stop(now + startOffset + duration + 0.02);
  };

  if (type === 'click') {
    scheduleNote(520, 0, 0.06, 0.04, 'triangle');
  } else if (type === 'error') {
    scheduleNote(230, 0, 0.14, 0.05, 'triangle');
    scheduleNote(195, 0.1, 0.16, 0.04, 'triangle');
  } else if (type === 'stamp') {
    scheduleNote(440, 0, 0.12, 0.06, 'sine');
    scheduleNote(554.37, 0.09, 0.14, 0.06, 'sine');
    scheduleNote(659.25, 0.18, 0.24, 0.07, 'sine');
  } else if (type === 'victory') {
    scheduleNote(523.25, 0, 0.14, 0.07, 'sine');
    scheduleNote(659.25, 0.11, 0.14, 0.07, 'sine');
    scheduleNote(783.99, 0.22, 0.16, 0.07, 'sine');
    scheduleNote(1046.5, 0.34, 0.38, 0.08, 'sine');
  }
}
