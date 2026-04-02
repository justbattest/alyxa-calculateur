"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback } from "react";

interface Step1Data {
  devisRemis: number;
  devisAcceptes: number;
  prixMoyen: number;
}

interface Step1Props {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
  onNext: () => void;
}

function getTauxColor(taux: number) {
  if (taux >= 80) return { color: "#10B981", glow: "rgba(16, 185, 129, 0.4)", label: "Excellent" };
  if (taux >= 65) return { color: "#6C74E8", glow: "rgba(108, 116, 232, 0.4)", label: "Bon" };
  if (taux >= 50) return { color: "#F59E0B", glow: "rgba(245, 158, 11, 0.4)", label: "Moyen" };
  return { color: "#EF4444", glow: "rgba(239, 68, 68, 0.4)", label: "Faible" };
}

const inputClass = `
  w-full px-4 py-3.5 rounded-xl text-[#EDEDEF] font-medium text-lg outline-none transition-all duration-200
  placeholder:text-[#8A8F98] focus:ring-0
`;
const inputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  fontFamily: "'JetBrains Mono', monospace",
};
const inputFocusStyle = {
  border: "1px solid rgba(108, 116, 232, 0.5)",
  boxShadow: "0 0 0 3px rgba(108, 116, 232, 0.1)",
};

export default function Step1Devis({ data, onChange, onNext }: Step1Props) {
  const taux = data.devisRemis > 0
    ? Math.round((data.devisAcceptes / data.devisRemis) * 100)
    : 0;
  const taux_clamped = Math.min(100, taux);
  const tauxInfo = getTauxColor(taux_clamped);
  const isValid = data.devisRemis > 0 && data.devisAcceptes >= 0 && data.prixMoyen > 0 && data.devisAcceptes <= data.devisRemis;

  const handleChange = useCallback(<K extends keyof Step1Data>(key: K, val: string) => {
    const num = parseFloat(val) || 0;
    onChange({ ...data, [key]: num });
  }, [data, onChange]);

  const circumference = 2 * Math.PI * 38;
  const offset = circumference - (taux_clamped / 100) * circumference;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-xl mx-auto"
    >
      {/* Title */}
      <motion.div variants={item} className="text-center mb-8">
        <div className="accent-line mx-auto mb-4" />
        <h2
          className="text-3xl md:text-4xl font-normal mb-3"
          style={{ fontFamily: "'Calistoga', serif", color: "#EDEDEF" }}
        >
          Vos devis
        </h2>
        <p className="text-base" style={{ color: "#8A8F98" }}>
          Combien de devis remettez-vous et acceptez-vous chaque mois ?
        </p>
      </motion.div>

      {/* Live Conversion Gauge */}
      <motion.div variants={item} className="glass-card p-6 mb-6">
        <div className="flex items-center gap-6">
          {/* Mini donut */}
          <div className="relative flex-shrink-0">
            <svg width="96" height="96" className="-rotate-90">
              <circle cx="48" cy="48" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <motion.circle
                cx="48" cy="48" r="38"
                fill="none"
                stroke={tauxInfo.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{
                  filter: `drop-shadow(0 0 6px ${tauxInfo.glow})`,
                  transition: "stroke-dashoffset 0.4s ease, stroke 0.4s ease",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                key={taux_clamped}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-lg font-bold"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: tauxInfo.color }}
              >
                {taux_clamped}%
              </motion.span>
            </div>
          </div>

          {/* Labels */}
          <div>
            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace" }}>
              Taux de conversion
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={tauxInfo.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="text-2xl font-semibold"
                style={{ color: tauxInfo.color }}
              >
                {tauxInfo.label}
              </motion.div>
            </AnimatePresence>
            <p className="text-sm mt-1" style={{ color: "#8A8F98" }}>
              Moyenne secteur : <span style={{ color: "#EDEDEF" }}>65%</span>
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${tauxInfo.color}99, ${tauxInfo.color})` }}
            animate={{ width: `${taux_clamped}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace" }}>0%</span>
          <span className="text-xs" style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace" }}>100%</span>
        </div>
      </motion.div>

      {/* Inputs */}
      <motion.div variants={item} className="space-y-4 mb-6">
        {/* Devis remis */}
        <div className="glass-card p-5">
          <label className="block text-sm font-medium mb-3" style={{ color: "#B0B5BF" }}>
            Devis remis par mois
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(108,116,232,0.15)", color: "#8B93FF", fontFamily: "'JetBrains Mono', monospace" }}
            >
              total
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="ex: 40"
              value={data.devisRemis || ""}
              onChange={e => handleChange("devisRemis", e.target.value)}
              className={inputClass}
              style={inputStyle}
              onFocus={e => Object.assign(e.currentTarget.style, inputFocusStyle)}
              onBlur={e => Object.assign(e.currentTarget.style, inputStyle)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm"
              style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace" }}>
              devis
            </div>
          </div>
        </div>

        {/* Devis acceptés */}
        <div className="glass-card p-5">
          <label className="block text-sm font-medium mb-3" style={{ color: "#B0B5BF" }}>
            Devis acceptés par mois
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(16,185,129,0.15)", color: "#10B981", fontFamily: "'JetBrains Mono', monospace" }}
            >
              convertis
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max={data.devisRemis || undefined}
              placeholder="ex: 26"
              value={data.devisAcceptes || ""}
              onChange={e => handleChange("devisAcceptes", e.target.value)}
              className={inputClass}
              style={inputStyle}
              onFocus={e => Object.assign(e.currentTarget.style, inputFocusStyle)}
              onBlur={e => Object.assign(e.currentTarget.style, inputStyle)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm"
              style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace" }}>
              devis
            </div>
          </div>
          {data.devisAcceptes > data.devisRemis && data.devisRemis > 0 && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-xs mt-2"
              style={{ color: "#EF4444" }}
            >
              ⚠ Les devis acceptés ne peuvent pas dépasser les devis remis
            </motion.p>
          )}
        </div>

        {/* Prix moyen */}
        <div className="glass-card p-5">
          <label className="block text-sm font-medium mb-3" style={{ color: "#B0B5BF" }}>
            Prix moyen d&apos;un devis
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B", fontFamily: "'JetBrains Mono', monospace" }}
            >
              valeur
            </span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold"
              style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace" }}>
              €
            </div>
            <input
              type="number"
              min="0"
              placeholder="ex: 850"
              value={data.prixMoyen || ""}
              onChange={e => handleChange("prixMoyen", e.target.value)}
              className={inputClass + " pl-10"}
              style={inputStyle}
              onFocus={e => Object.assign(e.currentTarget.style, inputFocusStyle)}
              onBlur={e => Object.assign(e.currentTarget.style, inputStyle)}
            />
          </div>
        </div>
      </motion.div>

      {/* Preview of loss */}
      <AnimatePresence>
        {isValid && (data.devisRemis - data.devisAcceptes) > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            variants={item}
            className="mb-6 p-4 rounded-xl flex items-center gap-3"
            style={{
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(239, 68, 68, 0.15)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#EF4444">
                <path d="M8 1L15 13H1L8 1Z" stroke="#EF4444" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                <line x1="8" y1="6" x2="8" y2="9" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="11" r="0.75" fill="#EF4444"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: "#EDEDEF" }}>
                CA potentiellement perdu ce mois
              </p>
              <p className="text-xl font-bold mt-0.5"
                style={{ color: "#EF4444", fontFamily: "'JetBrains Mono', monospace" }}>
                -{((data.devisRemis - data.devisAcceptes) * data.prixMoyen).toLocaleString("fr-FR")} €
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next button */}
      <motion.div variants={item}>
        <motion.button
          onClick={onNext}
          disabled={!isValid}
          whileHover={isValid ? { scale: 1.02 } : {}}
          whileTap={isValid ? { scale: 0.98 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
          style={{
            background: isValid
              ? "linear-gradient(135deg, #6C74E8 0%, #8B93FF 100%)"
              : "rgba(255,255,255,0.06)",
            color: isValid ? "white" : "#8A8F98",
            boxShadow: isValid ? "0 4px 24px rgba(108, 116, 232, 0.4)" : "none",
          }}
        >
          Étape suivante
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
