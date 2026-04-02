"use client";

import { motion } from "framer-motion";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

const STEPS = [
  { label: "Devis", icon: "📋" },
  { label: "Rendez-vous", icon: "📅" },
  { label: "Diagnostic", icon: "📊" },
];

export default function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      {/* Step indicators */}
      <div className="flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute top-5 left-0 right-0 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
        {/* Progress line fill */}
        <motion.div
          className="absolute top-5 left-0 h-px origin-left"
          style={{ background: "linear-gradient(90deg, #6C74E8, #8B93FF)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: (currentStep - 1) / (totalSteps - 1) }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {STEPS.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div key={idx} className="flex flex-col items-center gap-2 relative z-10">
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                style={{
                  background: isCompleted
                    ? "linear-gradient(135deg, #6C74E8, #8B93FF)"
                    : isActive
                    ? "rgba(108, 116, 232, 0.2)"
                    : "rgba(255,255,255,0.05)",
                  border: isActive
                    ? "2px solid #6C74E8"
                    : isCompleted
                    ? "2px solid transparent"
                    : "1px solid rgba(255,255,255,0.1)",
                  boxShadow: isActive ? "0 0 20px rgba(108, 116, 232, 0.5)" : "none",
                  color: isCompleted ? "white" : isActive ? "#8B93FF" : "#8A8F98",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
                animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8L6.5 11.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  stepNum
                )}
              </motion.div>
              <span
                className="text-xs font-medium hidden sm:block"
                style={{
                  color: isActive ? "#EDEDEF" : isCompleted ? "#8B93FF" : "#8A8F98",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.05em",
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step subtitle */}
      <motion.p
        key={currentStep}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mt-5 text-xs uppercase tracking-widest"
        style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace" }}
      >
        Étape {currentStep} sur {totalSteps}
      </motion.p>
    </div>
  );
}
