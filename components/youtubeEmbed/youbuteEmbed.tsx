// components/YouTubeEmbed.tsx
import React, { useMemo } from "react";

type YouTubeEmbedProps = {
  videoId: string;
  title?: string;
  autoplay?: boolean;
  start?: number; // seconds
  controls?: boolean;
  loop?: boolean;
  mute?: boolean;
  rel?: 0 | 1; // whether to show related videos (0 recommended)
  modestBranding?: boolean;
  className?: string; // additional wrapper classes
  aspectRatio?: number; // width / height (default 16/9 => 16/9 = 1.777..)
  onLoad?: (ev: React.SyntheticEvent<HTMLIFrameElement, Event>) => void;
  allowFullScreen?: boolean;
};

export default function YouTubeEmbed({
  videoId,
  title = "YouTube video player",
  autoplay = false,
  start,
  controls = true,
  loop = false,
  mute = false,
  rel = 0,
  modestBranding = true,
  className,
  aspectRatio = 16 / 9,
  onLoad,
  allowFullScreen = true,
}: YouTubeEmbedProps) {
  const src = useMemo(() => {
    const params = new URLSearchParams();

    // controls
    params.set("controls", controls ? "1" : "0");

    // autoplay (note: many browsers require mute for autoplay to work)
    if (autoplay) params.set("autoplay", "1");

    // mute
    if (mute) params.set("mute", "1");

    // loop requires playlist param set to videoId
    if (loop) {
      params.set("loop", "1");
      params.set("playlist", videoId);
    }

    // start time
    if (typeof start === "number" && !Number.isNaN(start) && start > 0) {
      params.set("start", String(Math.floor(start)));
    }

    // related videos (0 or 1)
    params.set("rel", String(rel));

    // modest branding
    if (modestBranding) params.set("modestbranding", "1");

    // enable JS API if you want to postMessage later (optional)
    params.set("enablejsapi", "1");

    return `https://www.youtube.com/embed/${encodeURIComponent(
      videoId
    )}?${params.toString()}`;
  }, [videoId, autoplay, start, controls, loop, mute, rel, modestBranding]);

  // inline style to maintain aspect ratio: padding-top trick
  const paddingTop = `${100 / aspectRatio}%`; // e.g. for 16/9 => 100/(16/9) = 56.25%

  return (
    <div
      className={`youtube-embed rounded-md overflow-hidden ${className || ""}`}
      style={{ position: "relative", width: "100%", paddingTop }}
    >
      <iframe
        src={src}
        title={title}
        width="100%"
        height="100%"
        onLoad={onLoad}
        loading="lazy"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
        allow={`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`}
        // allowFullScreen attribute
        {...(allowFullScreen ? { allowFullScreen: true } : {})}
      />
    </div>
  );
}
