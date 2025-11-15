"use client";
import { useEffect, useRef, useState } from "react";
import Icon from "../icon/icon";
export default function AudioPlayer(_a) {
    var playlists = _a.playlists;
    if (!playlists || playlists.length === 0)
        return null;
    var audioRef = useRef(null);
    var _b = useState(false), isPlaying = _b[0], setIsPlaying = _b[1];
    var _c = useState(0), currentIndex = _c[0], setCurrentIndex = _c[1];
    var currentSrc = playlists[currentIndex];
    useEffect(function () {
        if (!audioRef.current) {
            audioRef.current = new Audio(currentSrc.src);
            audioRef.current.onended = function () { return setIsPlaying(false); };
        }
        else {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.src = currentSrc.src;
            if (isPlaying) {
                audioRef.current.play();
            }
        }
        return function () {
            if (audioRef.current)
                audioRef.current.pause();
        };
    }, [currentSrc]);
    var playSound = function () {
        if (!audioRef.current)
            return;
        audioRef.current.play();
        setIsPlaying(true);
    };
    var stopSound = function () {
        if (!audioRef.current)
            return;
        audioRef.current.pause();
        setIsPlaying(false);
    };
    var handleSrc = function (type) {
        var newIndex = currentIndex;
        if (type === "prev")
            newIndex = currentIndex > 0 ? currentIndex - 1 : playlists.length - 1;
        else
            newIndex = currentIndex < playlists.length - 1 ? currentIndex + 1 : 0;
        setCurrentIndex(newIndex);
        // setIsPlaying(false);
    };
    return (<div className="fixed right-5 bottom-5 z-50 flex h-9
                 shadow-xl overflow-hidden rounded-xl bg-white border-2 rounded-tl-xl rounded-bl-xl rounded-tr-xl rounded-br-xl">
      {/* Prev */}
      <button onClick={function () { return handleSrc("prev"); }} className="h-full px-3  bg-gray-100/50 hover:bg-gray-300/70 
                   text-gray-700 transition border-r-0 flex items-center justify-center" title="Previous">
        <Icon name="prev" className="w-6 h-5"/>
      </button>

      {/* Play / Pause */}
      <button onClick={isPlaying ? stopSound : playSound} className="px-3
                   text-blue-600 bg-gray-100/50 hover:bg-gray-300/70  border-l border-r transition flex items-center justify-center" title={isPlaying ? "Pause" : "Play"}>
        {isPlaying ? (<Icon name="stop" className="w-6 h-6"/>) : (<Icon name="play" className="w-6 h-6"/>)}
      </button>

      {/* Next */}
      <button onClick={function () { return handleSrc("next"); }} className="px-3 bg-gray-100/50  hover:bg-gray-300/70 
                   text-gray-700 transition flex items-center justify-center" title="Next">
        <Icon name="next" className="w-6 h-5"/>
      </button>
    </div>);
}
