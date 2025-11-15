// components/YouTubeEmbed.tsx
import React, { useMemo } from "react";
export default function YouTubeEmbed(_a) {
    var videoId = _a.videoId, _b = _a.title, title = _b === void 0 ? "YouTube video player" : _b, _c = _a.autoplay, autoplay = _c === void 0 ? false : _c, start = _a.start, _d = _a.controls, controls = _d === void 0 ? true : _d, _e = _a.loop, loop = _e === void 0 ? false : _e, _f = _a.mute, mute = _f === void 0 ? false : _f, _g = _a.rel, rel = _g === void 0 ? 0 : _g, _h = _a.modestBranding, modestBranding = _h === void 0 ? true : _h, className = _a.className, _j = _a.aspectRatio, aspectRatio = _j === void 0 ? 16 / 9 : _j, onLoad = _a.onLoad, _k = _a.allowFullScreen, allowFullScreen = _k === void 0 ? true : _k;
    var src = useMemo(function () {
        var params = new URLSearchParams();
        // controls
        params.set("controls", controls ? "1" : "0");
        // autoplay (note: many browsers require mute for autoplay to work)
        if (autoplay)
            params.set("autoplay", "1");
        // mute
        if (mute)
            params.set("mute", "1");
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
        if (modestBranding)
            params.set("modestbranding", "1");
        // enable JS API if you want to postMessage later (optional)
        params.set("enablejsapi", "1");
        return "https://www.youtube.com/embed/".concat(encodeURIComponent(videoId), "?").concat(params.toString());
    }, [videoId, autoplay, start, controls, loop, mute, rel, modestBranding]);
    // inline style to maintain aspect ratio: padding-top trick
    var paddingTop = "".concat(100 / aspectRatio, "%"); // e.g. for 16/9 => 100/(16/9) = 56.25%
    return (<div className={"youtube-embed rounded-md overflow-hidden ".concat(className || "")} style={{ position: "relative", width: "100%", paddingTop: paddingTop }}>
      <iframe src={src} title={title} width="100%" height="100%" onLoad={onLoad} loading="lazy" style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
        }} allow={"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"} 
    // allowFullScreen attribute
    {...(allowFullScreen ? { allowFullScreen: true } : {})}/>
    </div>);
}
