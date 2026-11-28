"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { PointerEvent } from "react";

type HeroVisualProps = {
  src: string;
  alt: string;
};

export default function HeroVisual({ src, alt }: HeroVisualProps) {
  const reduceMotion = useReducedMotion();

  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), {
    stiffness: 150,
    damping: 20,
  });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div
      className="relative mx-auto w-full max-w-[460px] [perspective:1200px] md:ml-auto"
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
    >
      {/* Glow rings */}
      <div className="absolute inset-0 -z-10 scale-110 rounded-[2rem] bg-[radial-gradient(circle_at_50%_50%,rgba(255,122,0,0.35),transparent_62%)] blur-2xl" />
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] border border-white/20" />
      <div className="absolute -inset-12 -z-10 rounded-full border border-white/10" />

      {/* Tilting glass frame */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        <div className="rounded-[1.75rem] bg-gradient-to-br from-white/50 via-white/15 to-brand-secondary-150/50 p-[1px] shadow-[0_30px_80px_-30px_rgba(3,20,45,0.65)]">
          <div className="relative overflow-hidden rounded-[1.7rem] bg-brand-primary-150/40 backdrop-blur-md">
            <Image
              src={src}
              alt={alt}
              width={460}
              height={360}
              priority
              className="h-auto w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-primary-200/25 via-transparent to-white/10" />
          </div>
        </div>
      </motion.div>

      {/* Floating accent chips */}
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-4 top-10 hidden h-16 w-16 sm:block"
      >
        <div className="absolute inset-0 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
        <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-secondary-150 shadow-[0_0_20px_4px_rgba(255,169,77,0.6)]" />
      </motion.div>

      <motion.div
        animate={reduceMotion ? undefined : { y: [0, 14, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute -right-5 bottom-12 hidden h-20 w-20 rounded-full border border-white/25 bg-white/10 backdrop-blur-md sm:block"
      >
        <div className="absolute inset-3 rounded-full border border-brand-secondary-150/50" />
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_60%)]" />
      </motion.div>
    </div>
  );
}
