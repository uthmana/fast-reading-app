import React from "react";
import book_loader from "/public/images/book-loader.gif";

export default function BookLoader() {
  return (
    <div className="w-full h-full bg-black/5 absolute top-0 left-0 flex justify-center items-center z-30">
      <img src={book_loader.src} alt="book loader" className="max-w-20" />
    </div>
  );
}
