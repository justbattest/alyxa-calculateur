"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MESSAGES = [
  "Analyse de vos données en cours...",
  "Calcul de votre taux de conversion...",
  "Identification de vos leviers de croissance...",
  "Estimation du CA récupérable...",
  "Génération du diagnostic personnalisé...",
];

interface LoadingScreenProps {
  onDone: () => void;
}

export default function LoadingScreen({ onDone }: LoadingScreenProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => Math.min(i + 1, MESSAGES.length - 1));
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress(p => {
        const next = p + (100 / (11000 / 50));
        return Math.min(next, 99);
      });
    }, 50);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(onDone, 300);
    }, 11000);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-4"
    >
      <div className="w-full max-w-sm text-center">
        {/* Animated dots */}
        <div className="flex justify-center gap-3 mb-8">
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              className="block w-3 h-3 rounded-full"
              style={{
                background: i === 0 ? "#6C74E8" : i === 1 ? "#8B5CF6" : "#10B981",
              }}
              animate={{ y: [0, -14, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Message */}
        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}
          className="text-sm mb-6"
          style={{ color: "#8A8F98" }}
        >
          {MESSAGES[msgIndex]}
        </motion.p>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full overflow-hidden mb-3"
          style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #6C74E8, #8B93FF, #10B981)",
              width: `${progress}%`,
              transition: "width 0.05s linear",
            }}
          />
        </div>

        <p className="text-xs" style={{ color: "#4A5170", fontFamily: "'JetBrains Mono', monospace" }}>
          {Math.round(progress)}%
        </p>

        {/* Shimmer card placeholder */}
        <div className="mt-10 glass-card p-5 space-y-3">
          {[80, 60, 90, 50].map((w, i) => (
            <div
              key={i}
              className="h-2.5 rounded-full shimmer-line"
              style={{ width: `${w}%`, background: "rgba(255,255,255,0.06)" }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
