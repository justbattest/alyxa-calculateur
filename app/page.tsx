"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AmbientBlobs from "@/components/AmbientBlobs";
import Hero from "@/components/Hero";
import StepProgress from "@/components/StepProgress";
import Step1Devis from "@/components/Step1Devis";
import Step2Sliders from "@/components/Step2Sliders";
import Step3Results from "@/components/Step3Results";

type AppStep = "hero" | "step1" | "step2" | "step3";

interface Step1Data {
  devisRemis: number;
  devisAcceptes: number;
  prixMoyen: number;
}

interface Step2Data {
  noShowsSemaine: number;
  urgencesSemaine: number;
}

const pageVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 60 : -60,
    scale: 0.97,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction < 0 ? 60 : -60,
    scale: 0.97,
  }),
};

export default function Home() {
  const [appStep, setAppStep] = useState<AppStep>("hero");
  const [direction, setDirection] = useState(1);

  const [step1Data, setStep1Data] = useState<Step1Data>({
    devisRemis: 0,
    devisAcceptes: 0,
    prixMoyen: 0,
  });

  const [step2Data, setStep2Data] = useState<Step2Data>({
    noShowsSemaine: 3,
    urgencesSemaine: 2,
  });

  const navigate = useCallback((to: AppStep, dir: number) => {
    setDirection(dir);
    setAppStep(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const stepNumber = appStep === "step1" ? 1 : appStep === "step2" ? 2 : appStep === "step3" ? 3 : 0;

  return (
    <div className="relative min-h-screen">
      <AmbientBlobs />

      {/* Main content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait" custom={direction}>
          {appStep === "hero" && (
            <motion.div
              key="hero"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Hero onStart={() => navigate("step1", 1)} />
            </motion.div>
          )}

          {appStep !== "hero" && (
            <motion.div
              key={appStep}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-screen px-4 py-16"
            >
              {/* Logo / Nav */}
              <div className="max-w-xl mx-auto mb-8 flex items-center justify-between">
                <button
                  onClick={() => navigate("hero", -1)}
                  className="flex items-center gap-2 cursor-pointer transition-colors duration-200"
                  style={{ color: "#8A8F98" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#EDEDEF")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#8A8F98")}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M15 9H3M7 13L3 9L7 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Alyxa
                  </span>
                </button>
                <div
                  className="text-xs uppercase tracking-widest"
                  style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Diagnostic Cabinet
                </div>
              </div>

              {/* Step Progress */}
              <div className="max-w-xl mx-auto">
                <StepProgress currentStep={stepNumber} totalSteps={3} />
              </div>

              {/* Step Content */}
              <div className="max-w-xl mx-auto">
                {appStep === "step1" && (
                  <Step1Devis
                    data={step1Data}
                    onChange={setStep1Data}
                    onNext={() => navigate("step2", 1)}
                  />
                )}
                {appStep === "step2" && (
                  <Step2Sliders
                    data={step2Data}
                    prixMoyen={step1Data.prixMoyen || 850}
                    onChange={setStep2Data}
                    onNext={() => navigate("step3", 1)}
                    onBack={() => navigate("step1", -1)}
                  />
                )}
                {appStep === "step3" && (
                  <Step3Results
                    data={{ ...step1Data, ...step2Data }}
                    onRestart={() => navigate("hero", -1)}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
