"use client";

import { motion } from "framer-motion";

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pb-16 pt-12 overflow-hidden">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
        className="mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: "rgba(108, 116, 232, 0.12)", border: "1px solid rgba(108, 116, 232, 0.3)" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6C74E8] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B93FF]"></span>
          </span>
          <span className="text-xs font-medium tracking-widest uppercase text-[#8B93FF]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Outil gratuit · Diagnostic personnalisé · 2 minutes
          </span>
        </div>
      </motion.div>

      {/* Main heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
        className="text-center max-w-4xl mx-auto"
      >
        <h1
          className="text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight mb-6"
          style={{ fontFamily: "'Calistoga', serif" }}
        >
          <span className="block text-[#EDEDEF]">Combien votre cabinet</span>
          <span className="block gradient-text mt-1">perd-il chaque mois ?</span>
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
        className="text-lg md:text-xl text-center max-w-2xl mx-auto leading-relaxed mb-12"
        style={{ color: "#8A8F98" }}
      >
        Renseignez vos chiffres approximatifs. Obtenez un diagnostic basé sur votre situation.
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
      >
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="relative group px-10 py-5 rounded-2xl text-white font-semibold text-lg glow-button overflow-hidden cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #6C74E8 0%, #8B93FF 50%, #5E6AD2 100%)",
            boxShadow: "0 0 30px rgba(108, 116, 232, 0.45), 0 4px 20px rgba(0,0,0,0.4)",
            animation: "pulse-glow 3s ease-in-out infinite",
          }}
        >
          <span className="relative z-10 flex items-center gap-3">
            Lancer mon diagnostic
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M9 4L13 8L9 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </motion.button>
      </motion.div>

      {/* Social proof */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-10 flex items-center gap-3 px-5 py-2.5 rounded-full"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <span className="text-sm" style={{ color: "#8A8F98" }}>
          <span style={{ color: "#EDEDEF" }} className="font-semibold">847 cabinets analysés</span>
          {" "}·{" "}
          Économie moyenne détectée :{" "}
          <span style={{ color: "#10B981" }} className="font-semibold">26 400€/an</span>
        </span>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#8A8F98]">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
