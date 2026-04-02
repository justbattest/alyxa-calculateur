"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    const msgInterval = setInterval(() => {
      setMsgIndex(i => Math.min(i + 1, MESSAGES.length - 1));
    }, 2000);
    const progInterval = setInterval(() => {
      setProgress(p => Math.min(p + (100 / (11000 / 50)), 99));
    }, 50);
    const timeout = setTimeout(() => {
      clearInterval(msgInterval);
      clearInterval(progInterval);
      setProgress(100);
      setTimeout(onDone, 400);
    }, 11000);
    return () => { clearInterval(msgInterval); clearInterval(progInterval); clearTimeout(timeout); };
  }, [onDone]);

  const pct = Math.round(progress);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
    >
      <div className="w-full max-w-sm flex flex-col items-center">

        {/* ── Scanner orbital ── */}
        <div className="relative mb-12" style={{ width: 200, height: 200 }}>
          {/* Outer ping */}
          <div className="absolute inset-0 rounded-full" style={{
            background: "rgba(108,116,232,0.04)",
            animation: "ping-slow 3s ease-out infinite",
          }} />
          {/* Ring 1 — slow CW */}
          <div className="absolute inset-0" style={{ animation: "orbit-cw 8s linear infinite" }}>
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="96" stroke="url(#g-ring1)" strokeWidth="1.5" strokeDasharray="60 540" strokeLinecap="round" />
              <defs>
                <linearGradient id="g-ring1" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6C74E8" />
                  <stop offset="1" stopColor="#9B6FEB" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Ring 2 — medium CCW */}
          <div className="absolute" style={{ inset: 14, animation: "orbit-ccw 5s linear infinite" }}>
            <svg width="172" height="172" viewBox="0 0 172 172" fill="none">
              <circle cx="86" cy="86" r="82" stroke="url(#g-ring2)" strokeWidth="1" strokeDasharray="40 480" strokeLinecap="round" />
              <defs>
                <linearGradient id="g-ring2" x1="0" y1="0" x2="172" y2="172" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4F8EF7" />
                  <stop offset="1" stopColor="#4F8EF7" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Ring 3 — fast CW */}
          <div className="absolute" style={{ inset: 32, animation: "orbit-cw 3s linear infinite" }}>
            <svg width="136" height="136" viewBox="0 0 136 136" fill="none">
              <circle cx="68" cy="68" r="64" stroke="url(#g-ring3)" strokeWidth="1" strokeDasharray="25 380" strokeLinecap="round" />
              <defs>
                <linearGradient id="g-ring3" x1="0" y1="0" x2="136" y2="136" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00D68F" />
                  <stop offset="1" stopColor="#00D68F" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Center glow disc */}
          <div className="absolute" style={{ inset: 56 }}>
            <div className="w-full h-full rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(108,116,232,0.2), rgba(155,111,235,0.15))",
                border: "1px solid rgba(108,116,232,0.3)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 0 30px rgba(108,116,232,0.3), inset 0 0 20px rgba(108,116,232,0.1)",
              }}
            >
              <motion.span
                key={pct}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-black"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B93FF" }}
              >
                {pct}%
              </motion.span>
            </div>
          </div>

          {/* 4 orbital dots */}
          {[0, 90, 180, 270].map((deg, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                top: "50%", left: "50%",
                marginTop: -4, marginLeft: -4,
                background: ["#6C74E8", "#00D68F", "#FF4455", "#FF9500"][i],
                boxShadow: `0 0 8px ${["#6C74E8", "#00D68F", "#FF4455", "#FF9500"][i]}`,
                transform: `rotate(${deg}deg) translateX(92px)`,
                animation: `orbit-cw ${4 + i * 0.5}s linear infinite`,
              }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>

        {/* ── Message animé ── */}
        <div className="h-6 flex items-center justify-center mb-8 w-full">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-sm text-center"
              style={{ color: "#8A8F98" }}
            >
              {MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* ── Barre de progression premium ── */}
        <div className="w-full mb-3">
          <div className="relative h-1.5 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}>
            {/* Fill */}
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #4F8EF7, #6C74E8, #9B6FEB, #00D68F)",
                backgroundSize: "200% 100%",
                animation: "gradient-x 3s ease infinite",
                transition: "width 0.05s linear",
              }}
            />
            {/* Glowing head */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
              style={{
                left: `calc(${progress}% - 6px)`,
                background: "white",
                boxShadow: "0 0 10px #6C74E8, 0 0 20px #6C74E8",
                transition: "left 0.05s linear",
              }}
            />
          </div>
        </div>

        {/* Steps indicateur */}
        <div className="flex items-center gap-2 mt-2">
          {MESSAGES.map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width: i === msgIndex ? 20 : 6,
                height: 6,
                background: i <= msgIndex
                  ? "linear-gradient(90deg, #6C74E8, #9B6FEB)"
                  : "rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>

        {/* Skeleton shimmer cards */}
        <div className="mt-10 w-full space-y-3">
          {[
            { w: "75%", delay: 0 },
            { w: "55%", delay: 0.15 },
            { w: "90%", delay: 0.3 },
            { w: "40%", delay: 0.45 },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item.delay, duration: 0.5 }}
              className="h-2 rounded-full shimmer-line"
              style={{ width: item.w, background: "rgba(255,255,255,0.05)" }}
            />
          ))}
        </div>

      </div>
    </motion.div>
  );
}
