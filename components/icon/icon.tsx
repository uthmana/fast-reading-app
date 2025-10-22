"use client";

type IconProps = {
  name:
    | "play"
    | "pause"
    | "next"
    | "prev"
    | "stop"
    | "chevron-right"
    | "chevron-left"
    | "chevron-down"
    | "menu"
    | "close"
    | "loading"
    | "lesson"
    | "eye"
    | "text"
    | "test"
    | "book"
    | "fast-reading";
  className?: string;
  fill?: string;
  stroke?: string;
};

function Icon({
  name,
  className = "w-6 h-6",
  fill = "currentColor",
  stroke = "currentColor",
}: IconProps) {
  switch (name) {
    case "play":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={fill}
          className={className}
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      );

    case "pause":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={fill}
          className={className}
        >
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      );

    case "next":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={fill}
          className={className}
        >
          <path d="M6 4v16l8.5-8L6 4zm9.5 0v16h2V4h-2z" />
        </svg>
      );

    case "prev":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={fill}
          className={className}
        >
          <path d="M18 4v16l-8.5-8L18 4zM5.5 4v16h2V4h-2z" />
        </svg>
      );

    case "stop":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={fill}
          className={className}
        >
          <path d="M6 6h12v12H6z" />
        </svg>
      );

    case "chevron-right":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={fill}
          viewBox="0 0 24 24"
          className={className}
        >
          <path d="M9.29 6.71a1 1 0 0 1 1.42 0L16 12l-5.29 5.29a1 1 0 0 1-1.42-1.42L13.17 12l-3.88-3.88a1 1 0 0 1 0-1.41z" />
        </svg>
      );

    case "chevron-left":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={fill}
          viewBox="0 0 24 24"
          className={className}
        >
          <path d="M14.71 17.29a1 1 0 0 1-1.42 0L8 12l5.29-5.29a1 1 0 0 1 1.42 1.42L10.83 12l3.88 3.88a1 1 0 0 1 0 1.41z" />
        </svg>
      );
    case "chevron-down":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={fill}
          viewBox="0 0 24 24"
          stroke={stroke}
          strokeWidth="2"
          className={className}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      );
    case "menu":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={fill}
          viewBox="0 0 24 24"
          stroke={stroke}
          strokeWidth="2"
          className={className}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      );
    case "close":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={fill}
          viewBox="0 0 24 24"
          stroke={stroke}
          strokeWidth="2"
          className={className}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      );
    case "loading":
      return (
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 40 40"
          className={className}
        >
          <path
            opacity="0.2"
            fill="currentColor"
            d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946
              c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946
              C35.146,11.861,28.455,5.169,20.201,5.169z
              M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
              c0-6.425,5.209-11.634,11.634-11.634
              c6.425,0,11.633,5.209,11.633,11.634
              C31.834,26.541,26.626,31.749,20.201,31.749z"
          />
          <path
            fill="currentColor"
            d="M26.013,10.047l1.654-2.866
              c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
              C22.32,8.481,24.301,9.057,26.013,10.047z"
          >
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="rotate"
              from="0 20 20"
              to="360 20 20"
              dur="0.5s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      );
    case "book":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={stroke}
          strokeWidth="2"
          className={className}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 7v14"></path>
          <path d="M16 12h2"></path>
          <path d="M16 8h2"></path>
          <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
          <path d="M6 12h2"></path>
          <path d="M6 8h2"></path>
        </svg>
      );
    case "eye":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={stroke}
          strokeWidth="2"
          className={className}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      );
    case "text":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={stroke}
          strokeWidth="2"
          className={className}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4v16"></path>
          <path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"></path>
          <path d="M9 20h6"></path>
        </svg>
      );
    case "test":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={stroke}
          strokeWidth="2"
          className={className}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
          <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
          <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
          <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
        </svg>
      );
    case "lesson":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={stroke}
          strokeWidth="2"
          className={className}
        >
          <rect x="3" y="5" width="18" height="12" rx="2" ry="2" />
          <line x1="7" y1="10" x2="17" y2="10" />
          <rect
            x="9"
            y="13.5"
            width="6"
            height="1.5"
            rx="0.5"
            fill={fill}
            stroke="none"
          />
        </svg>
      );
    case "fast-reading":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={stroke}
          strokeWidth="2"
          className={className}
        >
          <path d="M2 7.5C2 6.119 3.119 5 4.5 5h15c1.381 0 2.5 1.119 2.5 2.5v9c0 .966-.784 1.75-1.75 1.75H3.75C2.784 18.25 2 17.466 2 16.5v-9z" />
          <path d="M3 7v9" />
          <path d="M12 7v9" />
          <path d="M17 6v4.5l-1.5-0.9L14 10.5V6z" fill={fill} stroke="none" />

          <path
            d="M4.5 18c2.2-1.2 4.6-1.2 7.5 0 2.9-1.2 5.3-1.2 7.5 0"
            stroke={fill}
            opacity="0.5"
            fill="none"
          />
        </svg>
      );

    default:
      return null;
  }
}

export default Icon;
