import { useCallback, useEffect, useRef } from "react";

type MetronomeOptions = {
  frequency?: number;
  volume?: number;
  duration?: number;
};

export const useMetronome = ({
  frequency = 880,
  volume = 0.8,
  duration = 0.05,
}: MetronomeOptions = {}) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize AudioContext only once.
  const initialize = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioCtx = audioContextRef.current;

    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }

    return audioCtx;
  }, []);

  // Schedule one metronome click.
  const scheduleNote = useCallback(
    (time: number, audioCtx: AudioContext) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, time);

      gainNode.gain.setValueAtTime(volume, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.start(time);
      osc.stop(time + duration);

      osc.onended = () => {
        osc.disconnect();
        gainNode.disconnect();
      };
    },
    [frequency, volume, duration],
  );

  // Play immediately or at a scheduled AudioContext time.
  const playTick = useCallback(
    async (when?: number) => {
      const audioCtx = await initialize();

      const scheduledTime = Math.max(
        when ?? audioCtx.currentTime,
        audioCtx.currentTime,
      );

      scheduleNote(scheduledTime, audioCtx);
    },
    [initialize, scheduleNote],
  );

  // Close AudioContext.
  const close = useCallback(async () => {
    if (audioContextRef.current) {
      await audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      const context = audioContextRef.current;

      if (context && context.state !== "closed") {
        void context.close();
      }

      audioContextRef.current = null;
    };
  }, []);

  return {
    initialize,
    playTick,
    close,
    audioContext: audioContextRef,
  };
};
