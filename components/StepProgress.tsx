"use client";

import { motion } from "framer-motion";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

const STEPS = [
  { label: "Vos devis", shortLabel: "Devis" },
  { label: "Votre planning", shortLabel: "Planning" },
  { label: "Résultats", shortLabel: "Résultats" },
];

export default function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const progressPct = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-10 px-2">
      <div className="relative flex items-center justify-between">

        {/* Track line */}
        <div className="absolute top-5 left-0 right-0 h-px"
          style={{ background: "rgba(255,255,255,0.07)" }} />

        {/* Animated fill line */}
        <motion.div
          className="absolute top-5 left-0 h-px origin-left"
          style={{
            background: "linear-gradient(90deg, #4F8EF7, #6C74E8, #9B6FEB)",
            backgroundSize: "200% 100%",
            animation: "gradient-x 3s ease infinite",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
        />

        {STEPS.map((step, idx) => {
          const n = idx + 1;
          const done = n < currentStep;
          const active = n === currentStep;

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-2.5">
              {/* Circle */}
              <div className="relative">
                {/* Active ping */}
                {active && (
                  <div className="absolute inset-0 rounded-full"
                    style={{
                      background: "rgba(108,116,232,0.3)",
                      animation: "ping-slow 2s ease-out infinite",
                    }} />
                )}

                <motion.div
                  className="relative w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: done
                      ? "linear-gradient(135deg, #4F8EF7, #9B6FEB)"
                      : active
                      ? "rgba(108,116,232,0.15)"
                      : "rgba(255,255,255,0.04)",
                    border: done
                      ? "none"
                      : active
                      ? "1.5px solid #6C74E8"
                      : "1px solid rgba(255,255,255,0.1)",
                    boxShadow: active
                      ? "0 0 0 4px rgba(108,116,232,0.15), 0 0 20px rgba(108,116,232,0.3)"
                      : done
                      ? "0 0 12px rgba(79,142,247,0.3)"
                      : "none",
                  }}
                  initial={false}
                  animate={active ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {done ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8L6.5 11.5L13 5"
                        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span
                      className="text-sm font-bold"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: active ? "#8B93FF" : "#4A5170",
                      }}
                    >
                      {n}
                    </span>
                  )}
                </motion.div>
              </div>

              {/* Label */}
              <motion.span
                className="text-xs font-semibold hidden sm:block"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.04em",
                  color: done ? "#6C74E8" : active ? "#EDEDEF" : "#4A5170",
                }}
                animate={{ color: done ? "#6C74E8" : active ? "#EDEDEF" : "#4A5170" }}
                transition={{ duration: 0.3 }}
              >
                {step.label}
              </motion.span>

              {/* Mobile label */}
              <span className="text-xs font-semibold sm:hidden"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: active ? "#EDEDEF" : "#4A5170" }}>
                {step.shortLabel}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step counter */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mt-5"
      >
        <span className="text-xs uppercase tracking-widest"
          style={{ color: "#4A5170", fontFamily: "'JetBrains Mono', monospace" }}>
          Étape{" "}
          <span style={{ color: "#6C74E8" }}>{currentStep}</span>
          {" "}sur {totalSteps}
        </span>
      </motion.div>
    </div>
  );
}
