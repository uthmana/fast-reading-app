import { useRef, useState } from "react";

export const useAudioSound = (src: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopSound = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return { isPlaying, audioRef, playSound, stopSound };
};
