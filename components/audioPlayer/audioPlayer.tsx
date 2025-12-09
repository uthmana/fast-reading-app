"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "../icon/icon";
import { MdMusicNote } from "react-icons/md";

type AudioTrack = {
  src: string;
  title?: string;
};

export default function AudioPlayer({
  playlists,
}: {
  playlists: AudioTrack[];
}) {
  if (!playlists || playlists.length === 0) return null;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSrc = playlists[currentIndex];

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentSrc.src);
      audioRef.current.onended = () => setIsPlaying(false);
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = currentSrc.src;
      if (isPlaying) {
        audioRef.current.play();
      }
    }

    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [currentSrc]);

  const playSound = () => {
    if (!audioRef.current) return;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const stopSound = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const handleSrc = (type: "prev" | "next") => {
    let newIndex = currentIndex;
    if (type === "prev")
      newIndex = currentIndex > 0 ? currentIndex - 1 : playlists.length - 1;
    else newIndex = currentIndex < playlists.length - 1 ? currentIndex + 1 : 0;

    setCurrentIndex(newIndex);
    // setIsPlaying(false);
  };

  return (
    <div className="fixed flex items-center -right-[150px] transition-all hover:right-0 bottom-5 z-50">
      <div className="h-9  w-9 flex justify-center items-center bg-white border-2  shadow-xl rounded-tl-xl rounded-bl-xl">
        <MdMusicNote
          className={`w-5 h-5 ${isPlaying ? "animate-pulse" : ""}`}
        />
      </div>
      <div
        className="flex h-9
                 shadow-xl overflow-hidden rounded-xl bg-white border-2 rounded-tl-xl rounded-bl-xl rounded-tr-xl rounded-br-xl"
      >
        {/* Prev */}
        <button
          onClick={() => handleSrc("prev")}
          className="h-full px-3  bg-gray-100/50 hover:bg-gray-300/70 
                   text-gray-700 transition border-r-0 flex items-center justify-center"
          title="Previous"
        >
          <Icon name="prev" className="w-6 h-5" />
        </button>

        {/* Play / Pause */}
        <button
          onClick={isPlaying ? stopSound : playSound}
          className="px-3
                   text-blue-600 bg-gray-100/50 hover:bg-gray-300/70  border-l border-r transition flex items-center justify-center"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Icon name="stop" className="w-6 h-6" />
          ) : (
            <Icon name="play" className="w-6 h-6" />
          )}
        </button>

        {/* Next */}
        <button
          onClick={() => handleSrc("next")}
          className="px-3 bg-gray-100/50  hover:bg-gray-300/70 
                   text-gray-700 transition flex items-center justify-center"
          title="Next"
        >
          <Icon name="next" className="w-6 h-5" />
        </button>
      </div>
    </div>
  );
}
