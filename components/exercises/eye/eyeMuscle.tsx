"use client";
import Button from "@/components/button/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { GrAd, GrApple, GrBug, GrAchievement } from "react-icons/gr";
import { MdPauseCircle } from "react-icons/md";

type EyeMuscleProps = {
  controls?: { level?: 1 | 2 | 3 | 4 | 5 };
  onFinishTest?: (v: any) => void;
};

export default function EyeMuscle({ controls, onFinishTest }: EyeMuscleProps) {
  const [step, setStep] = useState(0);
  const positions = ["top", "right", "bottom", "left"];
  const speedMap = { 1: 4000, 2: 1500, 3: 1000, 4: 700, 5: 400 };
  const speed = speedMap[controls?.level || 3];

  const icons: IconType[] = [GrAd, GrApple, GrBug, GrAchievement];
  //const Icon = icons[step % icons.length];
  const Icon = icons[0];
  // ✅ Create sound object (you can replace the URL with your own click sound)
  const clickSound = new Audio(
    "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg"
  );
  const handlePause = () => {
    if (onFinishTest) {
      onFinishTest(null);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setStep((s) => (s + 1) % positions.length);
    }, speed);
    return () => clearTimeout(timer);
  }, [step, speed]);

  // 🔊 Play sound whenever icon changes
  useEffect(() => {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {
      /* ignore autoplay restrictions */
    });
  }, [step]);

  const side = positions[step];

  const positionStyles: Record<string, React.CSSProperties> = {
    top: { top: "10%", left: "50%", transform: "translateX(-50%)" },
    right: { top: "50%", right: "10%", transform: "translateY(-50%)" },
    bottom: { bottom: "10%", left: "50%", transform: "translateX(-50%)" },
    left: { top: "50%", left: "10%", transform: "translateY(-50%)" },
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <motion.div
        key={side}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5 }}
        style={{
          position: "absolute",
          ...positionStyles[side],
        }}
      >
        <Icon size={40} color="green" />
      </motion.div>
      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit absolute right-1 -bottom-1 my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
