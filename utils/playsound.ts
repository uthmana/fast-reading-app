let globalAudioCtx: AudioContext | null = null;
let currentOsc: OscillatorNode | null = null;
let currentGain: GainNode | null = null;

/**
 * Plays a sound for brain exercise feedback.
 * @param type "true" | "false" | "transition"
 */
export function playSound(type: "true" | "false" | "transition") {
  if (typeof window === "undefined") return;
  if (!globalAudioCtx) {
    globalAudioCtx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
  }
  // Stop any currently playing sound
  if (currentOsc) {
    try {
      currentOsc.stop();
    } catch {}
    currentOsc.disconnect();
    currentOsc = null;
  }
  if (currentGain) {
    currentGain.disconnect();
    currentGain = null;
  }
  const ctx = globalAudioCtx;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  currentOsc = osc;
  currentGain = gain;

  switch (type) {
    case "transition":
      osc.type = "sine";
      osc.frequency.value = 700;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.18);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
      break;
    case "true":
      // Rising arpeggio (success)
      osc.type = "triangle";
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.08);
      osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.38, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.18);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
      break;
    case "false":
      // Double short buzz (fail)
      osc.type = "square";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      gain.gain.setValueAtTime(0.32, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
      // Second buzz after short delay
      setTimeout(() => {
        if (!globalAudioCtx) return;
        const osc2 = globalAudioCtx.createOscillator();
        const gain2 = globalAudioCtx.createGain();
        osc2.type = "square";
        osc2.frequency.setValueAtTime(120, globalAudioCtx.currentTime);
        gain2.gain.setValueAtTime(0.22, globalAudioCtx.currentTime);
        gain2.gain.linearRampToValueAtTime(
          0,
          globalAudioCtx.currentTime + 0.07,
        );
        osc2.connect(gain2);
        gain2.connect(globalAudioCtx.destination);
        osc2.start();
        osc2.stop(globalAudioCtx.currentTime + 0.07);
        osc2.onended = () => {
          gain2.disconnect();
          osc2.disconnect();
        };
      }, 90);
      break;
    default:
      break;
  }
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.onended = () => {
    if (currentOsc === osc) currentOsc = null;
    if (currentGain === gain) currentGain = null;
    gain.disconnect();
    osc.disconnect();
  };
}
