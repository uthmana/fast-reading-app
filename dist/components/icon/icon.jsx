"use client";
function Icon(_a) {
    var name = _a.name, _b = _a.className, className = _b === void 0 ? "w-6 h-6" : _b, _c = _a.fill, fill = _c === void 0 ? "currentColor" : _c, _d = _a.stroke, stroke = _d === void 0 ? "currentColor" : _d;
    switch (name) {
        case "play":
            return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fill} className={className}>
          <path d="M8 5v14l11-7z"/>
        </svg>);
        case "pause":
            return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fill} className={className}>
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>);
        case "next":
            return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fill} className={className}>
          <path d="M6 4v16l8.5-8L6 4zm9.5 0v16h2V4h-2z"/>
        </svg>);
        case "prev":
            return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fill} className={className}>
          <path d="M18 4v16l-8.5-8L18 4zM5.5 4v16h2V4h-2z"/>
        </svg>);
        case "stop":
            return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fill} className={className}>
          <path d="M6 6h12v12H6z"/>
        </svg>);
        case "chevron-right":
            return (<svg xmlns="http://www.w3.org/2000/svg" fill={fill} viewBox="0 0 24 24" className={className}>
          <path d="M9.29 6.71a1 1 0 0 1 1.42 0L16 12l-5.29 5.29a1 1 0 0 1-1.42-1.42L13.17 12l-3.88-3.88a1 1 0 0 1 0-1.41z"/>
        </svg>);
        case "chevron-left":
            return (<svg xmlns="http://www.w3.org/2000/svg" fill={fill} viewBox="0 0 24 24" className={className}>
          <path d="M14.71 17.29a1 1 0 0 1-1.42 0L8 12l5.29-5.29a1 1 0 0 1 1.42 1.42L10.83 12l3.88 3.88a1 1 0 0 1 0 1.41z"/>
        </svg>);
        case "chevron-down":
            return (<svg xmlns="http://www.w3.org/2000/svg" fill={fill} viewBox="0 0 24 24" stroke={stroke} strokeWidth="2" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>);
        case "menu":
            return (<svg xmlns="http://www.w3.org/2000/svg" fill={fill} viewBox="0 0 24 24" stroke={stroke} strokeWidth="2" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>);
        case "close":
            return (<svg xmlns="http://www.w3.org/2000/svg" fill={fill} viewBox="0 0 24 24" stroke={stroke} strokeWidth="2" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>);
        case "loading":
            return (<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 40 40" className={className}>
          <path opacity="0.2" fill="currentColor" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946
              c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946
              C35.146,11.861,28.455,5.169,20.201,5.169z
              M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
              c0-6.425,5.209-11.634,11.634-11.634
              c6.425,0,11.633,5.209,11.633,11.634
              C31.834,26.541,26.626,31.749,20.201,31.749z"/>
          <path fill="currentColor" d="M26.013,10.047l1.654-2.866
              c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
              C22.32,8.481,24.301,9.057,26.013,10.047z">
            <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite"/>
          </path>
        </svg>);
        default:
            return null;
    }
}
export default Icon;
