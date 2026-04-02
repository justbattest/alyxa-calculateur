"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface DonutChartProps {
  percentage: number;
  label: string;
  sublabel?: string;
  color: string;
  glowColor: string;
  size?: number;
  animate?: boolean;
}

export default function DonutChart({
  percentage,
  label,
  sublabel,
  color,
  glowColor,
  size = 140,
  animate = true,
}: DonutChartProps) {
  const [displayed, setDisplayed] = useState(animate ? 0 : percentage);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(100, Math.max(0, displayed));
  const offset = circumference - (clampedPct / 100) * circumference;

  useEffect(() => {
    if (!animate) {
      setDisplayed(percentage);
      return;
    }
    let start = 0;
    const duration = 1200;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * percentage));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [percentage, animate]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={10}
          />
          {/* Progress */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              filter: `drop-shadow(0 0 8px ${glowColor})`,
              transition: "stroke-dashoffset 0.05s linear",
            }}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={displayed}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="text-2xl font-bold"
            style={{ fontFamily: "'JetBrains Mono', monospace", color }}
          >
            {clampedPct}%
          </motion.span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-medium" style={{ color: "#EDEDEF" }}>{label}</div>
        {sublabel && (
          <div className="text-xs mt-0.5" style={{ color: "#8A8F98" }}>{sublabel}</div>
        )}
      </div>
    </div>
  );
}
