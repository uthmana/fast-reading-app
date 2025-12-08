import { useEffect, useState, useRef } from "react";
import { IoMdClock } from "react-icons/io";
import { MdCheck } from "react-icons/md";

export default function Countdown({
  initial = 180,
  start = false,
  onFinish,
  className = "",
  text = "sec.",
}: {
  initial: number;
  start: boolean;
  onFinish?: () => void;
  className?: string;
  text?: string;
}) {
  const [time, setTime] = useState(initial);
  const finishedRef = useRef(false);

  // Reset when initial changes
  useEffect(() => {
    setTime(initial);
    finishedRef.current = false;
  }, [initial]);

  useEffect(() => {
    if (!start || time <= 0) return;

    const timer = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [start, time]);

  useEffect(() => {
    if (time === 0 && !finishedRef.current) {
      finishedRef.current = true;
      onFinish && onFinish();
    }
  }, [time, onFinish]);

  return (
    <div
      className={`flex gap-1 px-3 opacity-45 py-2 rounded  text-white items-center justify-center bg-blue-500 ${className}`}
    >
      {time === 0 ? (
        <MdCheck className="w-5 h-5 text-white" />
      ) : (
        <IoMdClock className="w-5 h-5 text-white" />
      )}
      <span className="font-bold"> {time} </span> {text}
    </div>
  );
}
