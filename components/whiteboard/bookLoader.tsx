import React, { useEffect } from "react";
import book_loader from "/public/images/book-loader.gif";

const GIF_CYCLE_MS = 1500; // adjust to match your GIF's animation duration

export default function BookLoader({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), GIF_CYCLE_MS);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="w-full h-full bg-black/5 absolute top-0 left-0 flex justify-center items-center z-30">
      <img src={book_loader.src} alt="book loader" className="max-w-20" />
    </div>
  );
}
