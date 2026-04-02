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
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: "rgba(108, 116, 232, 0.12)",
            border: "1px solid rgba(108, 116, 232, 0.3)",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6C74E8] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B93FF]"></span>
          </span>
          <span className="text-xs font-medium tracking-widest uppercase text-[#8B93FF]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Diagnostic Gratuit · 3 Minutes
          </span>
        </div>
      </motion.div>

      {/* Main heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-4xl mx-auto"
      >
        <h1
          className="text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight mb-6"
          style={{ fontFamily: "'Calistoga', serif" }}
        >
          <span className="block text-[#EDEDEF]">Combien votre cabinet</span>
          <span className="block gradient-text mt-1">perd-il chaque année ?</span>
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="text-lg md:text-xl text-center max-w-2xl mx-auto leading-relaxed mb-12"
        style={{ color: "#8A8F98" }}
      >
        Devis non convertis, no-shows, urgences non planifiées — calculez précisément
        votre chiffre d&apos;affaires non capturé et découvrez votre potentiel récupérable.
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L10 18M2 10L18 10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="2"/>
            </svg>
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
        className="mt-12 flex flex-col sm:flex-row items-center gap-6"
      >
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                style={{
                  borderColor: "#020203",
                  background: `linear-gradient(135deg, hsl(${220 + i*20}, 70%, 55%), hsl(${240 + i*15}, 80%, 65%))`,
                }}
              >
                {["DP","MR","AC","LB"][i-1]}
              </div>
            ))}
          </div>
          <p className="text-sm" style={{ color: "#8A8F98" }}>
            <span style={{ color: "#EDEDEF" }} className="font-medium">+340 praticiens</span> ont découvert leur score
          </p>
        </div>
        <div className="hidden sm:block h-5 w-px" style={{ background: "rgba(255,255,255,0.1)" }} />
        <div className="flex items-center gap-1.5">
          {[1,2,3,4,5].map(i => (
            <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#F59E0B">
              <path d="M7 1L8.8 5.2L13.4 5.6L10.1 8.5L11.1 13L7 10.6L2.9 13L3.9 8.5L0.6 5.6L5.2 5.2L7 1Z"/>
            </svg>
          ))}
          <span className="text-sm ml-1" style={{ color: "#8A8F98" }}>
            <span style={{ color: "#EDEDEF" }} className="font-medium">4.9/5</span> · Gratuit
          </span>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
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

      {/* Three stats preview */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-24 left-0 right-0 mx-auto max-w-3xl px-4"
      >
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "€47K", label: "CA moyen perdu/an", color: "#EF4444" },
            { value: "65%", label: "Taux conversion moyen", color: "#6C74E8" },
            { value: "3.2h", label: "Perdu/semaine en no-shows", color: "#F59E0B" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-4 text-center"
            >
              <div className="text-xl font-bold mb-0.5"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: "#8A8F98" }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
