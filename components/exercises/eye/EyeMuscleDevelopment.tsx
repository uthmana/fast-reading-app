"use client";
import Button from "@/components/button/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { GrAd, GrApple, GrBug, GrAchievement } from "react-icons/gr";
import { MdPauseCircle } from "react-icons/md";

type EyeMuscleDevelopmentProps = {
  controls?: {
    level?: 1 | 2 | 3 | 4 | 5;
    symbol?: 1 | 2 | 3 | 4 | 5;
    exercise?: 1 | 2 | 3 | 4 | 5; // 👈 NEW
  };
  onFinishTest?: (v: any) => void;
};

export default function EyeMuscleDevelopment({
  controls,
  onFinishTest,
}: EyeMuscleDevelopmentProps) {
  const [step, setStep] = useState(0);

  const icons: IconType[] = [GrAd, GrApple, GrBug, GrAchievement, GrApple];

  // 🔥 symbol controlled externally
  const [symbolIndex, setSymbolIndex] = useState(controls?.symbol || 1);

  // 🔥 When symbol changes → update icon
  useEffect(() => {
    if (controls?.symbol) {
      setSymbolIndex(controls.symbol);
    }
  }, [controls?.symbol]);

  // Speed based on level
  const speedMap = { 1: 4000, 2: 1500, 3: 1000, 4: 700, 5: 400 };
  const speed = speedMap[controls?.level || 3];

  // 🔥 5 EXERCISE MOVEMENT PATTERNS
  const exercise = controls?.exercise || 1;

  const getPosition = (step: number) => {
    switch (exercise) {
      // 1️⃣ Circle (clockwise)
      case 1:
        return [
          { top: "20%", left: "50%", transform: "translateX(-50%)" },
          { top: "50%", left: "80%", transform: "translateY(-50%)" },
          { top: "80%", left: "50%", transform: "translateX(-50%)" },
          { top: "50%", left: "20%", transform: "translateY(-50%)" },
        ][step];

      // 2️⃣ Figure-8 movement
      case 2:
        return [
          { top: "40%", left: "20%" },
          { top: "60%", left: "50%" },
          { top: "40%", left: "80%" },
          { top: "20%", left: "50%" },
        ][step];

      // 3️⃣ Four corners jump
      case 3:
        return [
          { top: "10%", left: "10%" },
          { top: "10%", right: "10%" },
          { bottom: "10%", right: "10%" },
          { bottom: "10%", left: "10%" },
        ][step];

      // 4️⃣ Horizontal scan
      case 4:
        return [
          { top: "50%", left: "10%", transform: "translateY(-50%)" },
          { top: "50%", left: "80%", transform: "translateY(-50%)" },
        ][step % 2];

      // 5️⃣ Vertical scan
      case 5:
        return [
          { top: "10%", left: "50%", transform: "translateX(-50%)" },
          { top: "80%", left: "50%", transform: "translateX(-50%)" },
        ][step % 2];

      default:
        return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    }
  };

  // Movement timer
  useEffect(() => {
    const timer = setTimeout(() => {
      // Steps depend on exercise type
      const maxSteps = exercise <= 3 ? 4 : 2;
      setStep((s) => (s + 1) % maxSteps);
    }, speed);

    return () => clearTimeout(timer);
  }, [step, speed, exercise]);

  const Icon = icons[symbolIndex - 1];
  const positionStyles = getPosition(step);

  const handlePause = () => onFinishTest?.(null);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <motion.div
        key={`${exercise}-${step}-${symbolIndex}`}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5 }}
        style={{
          position: "absolute",
          ...positionStyles,
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
