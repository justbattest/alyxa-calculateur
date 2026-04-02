"use client";

import { motion } from "framer-motion";
import { useCallback } from "react";

interface Step2Data {
  noShowsSemaine: number;
  urgencesSemaine: number;
}

interface Step2Props {
  data: Step2Data;
  prixMoyen: number;
  onChange: (data: Step2Data) => void;
  onNext: () => void;
  onBack: () => void;
}

function SliderCard({
  label,
  description,
  value,
  min,
  max,
  step,
  unit,
  color,
  glowColor,
  impactLabel,
  impactValue,
  onChange,
  icon,
  benchmarkValue,
  benchmarkLabel,
}: {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  color: string;
  glowColor: string;
  impactLabel: string;
  impactValue: number;
  onChange: (v: number) => void;
  icon: React.ReactNode;
  benchmarkValue: number;
  benchmarkLabel: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const aboveBenchmark = value > benchmarkValue;

  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${glowColor}30`, border: `1px solid ${glowColor}50` }}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-base" style={{ color: "#EDEDEF" }}>{label}</h3>
            <p className="text-xs mt-0.5" style={{ color: "#8A8F98" }}>{description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold"
            style={{ fontFamily: "'JetBrains Mono', monospace", color }}>
            {value}
          </div>
          <div className="text-xs" style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace" }}>
            {unit}
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative mb-4">
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            className="w-full"
            style={{
              background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, rgba(255,255,255,0.1) ${pct}%, rgba(255,255,255,0.1) 100%)`,
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace" }}>{min}</span>
          <span className="text-xs" style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace" }}>{max}</span>
        </div>
      </div>

      {/* Benchmark indicator */}
      <div className="flex items-center gap-2 mb-4 p-3 rounded-lg"
        style={{
          background: aboveBenchmark ? "rgba(239, 68, 68, 0.08)" : "rgba(16, 185, 129, 0.08)",
          border: `1px solid ${aboveBenchmark ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)"}`,
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: aboveBenchmark ? "#EF4444" : "#10B981" }} />
        <span className="text-xs" style={{ color: aboveBenchmark ? "#EF4444" : "#10B981" }}>
          Vous êtes {aboveBenchmark ? "au-dessus" : "en dessous"} de la moyenne ({benchmarkValue} {unit} — {benchmarkLabel})
        </span>
      </div>

      {/* Impact preview */}
      <div className="flex items-center justify-between p-3 rounded-lg"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <span className="text-xs" style={{ color: "#8A8F98" }}>{impactLabel}</span>
        <motion.span
          key={impactValue}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-bold"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: "#EF4444" }}
        >
          -{impactValue.toLocaleString("fr-FR")} €/an
        </motion.span>
      </div>
    </div>
  );
}

export default function Step2Sliders({ data, prixMoyen, onChange, onNext, onBack }: Step2Props) {
  const handleChange = useCallback(<K extends keyof Step2Data>(key: K, val: number) => {
    onChange({ ...data, [key]: val });
  }, [data, onChange]);

  const impactNoShows = Math.round(data.noShowsSemaine * prixMoyen * 52 * 0.7);
  const impactUrgences = Math.round(data.urgencesSemaine * prixMoyen * 0.5 * 52);
  const totalImpact = impactNoShows + impactUrgences;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
          Vos rendez-vous
        </h2>
        <p className="text-base" style={{ color: "#8A8F98" }}>
          Évaluez l&apos;impact des rendez-vous manqués sur votre activité
        </p>
      </motion.div>

      {/* Total impact banner */}
      <motion.div variants={item} className="mb-6 p-4 rounded-xl"
        style={{
          background: "linear-gradient(135deg, rgba(108, 116, 232, 0.1), rgba(139, 147, 255, 0.05))",
          border: "1px solid rgba(108, 116, 232, 0.2)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest mb-1"
              style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace" }}>
              Impact combiné estimé
            </p>
            <motion.p
              key={totalImpact}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: "#EF4444" }}
            >
              -{totalImpact.toLocaleString("fr-FR")} €/an
            </motion.p>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: "#8A8F98" }}>Basé sur votre</div>
            <div className="text-xs" style={{ color: "#8A8F98" }}>prix moyen de {prixMoyen} €</div>
          </div>
        </div>
      </motion.div>

      {/* Sliders */}
      <motion.div variants={item} className="mb-4">
        <SliderCard
          label="No-shows par semaine"
          description="Patients qui ne se présentent pas sans prévenir"
          value={data.noShowsSemaine}
          min={0}
          max={20}
          step={1}
          unit="par semaine"
          color="#EF4444"
          glowColor="rgba(239, 68, 68, 0.5)"
          impactLabel="Manque à gagner annuel (no-shows)"
          impactValue={impactNoShows}
          onChange={v => handleChange("noShowsSemaine", v)}
          benchmarkValue={3}
          benchmarkLabel="moyenne secteur"
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2C5.13 2 2 5.13 2 9s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12.5A5.5 5.5 0 1 1 9 3.5a5.5 5.5 0 0 1 0 11zM9 5v4.5l3 1.8-.75 1.23L8 10V5h1z" fill="#EF4444"/>
            </svg>
          }
        />
      </motion.div>

      <motion.div variants={item} className="mb-6">
        <SliderCard
          label="Urgences non planifiées / semaine"
          description="Patients urgents qui perturbent l'agenda"
          value={data.urgencesSemaine}
          min={0}
          max={10}
          step={1}
          unit="par semaine"
          color="#F59E0B"
          glowColor="rgba(245, 158, 11, 0.5)"
          impactLabel="Temps/CA perdu (urgences non planifiées)"
          impactValue={impactUrgences}
          onChange={v => handleChange("urgencesSemaine", v)}
          benchmarkValue={2}
          benchmarkLabel="moyenne secteur"
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1L16.5 14H1.5L9 1Z" stroke="#F59E0B" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
              <line x1="9" y1="7" x2="9" y2="10" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="9" cy="12" r="0.75" fill="#F59E0B"/>
            </svg>
          }
        />
      </motion.div>

      {/* Buttons */}
      <motion.div variants={item} className="flex gap-3">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="flex-1 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#8A8F98",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13 8H3M7 12L3 8L7 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Retour
        </motion.button>

        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="flex-[2] py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #6C74E8 0%, #8B93FF 100%)",
            color: "white",
            boxShadow: "0 4px 24px rgba(108, 116, 232, 0.4)",
          }}
        >
          Voir mon diagnostic
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
