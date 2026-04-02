"use client";

import { motion } from "framer-motion";
import { useCallback } from "react";

interface Step2Data {
  noShowsSemaine: number;
  urgencesSemaine: number;
}

interface Step2Props {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
  onNext: () => void;
  onBack: () => void;
}

function SliderRow({
  label, tag, desc, value, min, max, onChange, benchmarkValue, benchmarkNote,
  color,
}: {
  label: string; tag: string; desc: string; value: number; min: number; max: number;
  onChange: (v: number) => void; benchmarkValue: number; benchmarkNote: string;
  color: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const aboveBenchmark = value > benchmarkValue;

  return (
    <div className="mb-7 last:mb-0">
      <div className="flex justify-between items-start gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-semibold" style={{ color: "#EDEDEF" }}>{label}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{ background: "rgba(255,149,0,0.12)", color: "#FF9500" }}>{tag}</span>
          </div>
          <div className="text-xs" style={{ color: "#4A5170" }}>{desc}</div>
        </div>
        <div className="text-3xl font-black text-right flex-shrink-0"
          style={{ color: "#EDEDEF", fontFamily: "'Inter', sans-serif", letterSpacing: "-1px" }}>
          {value}
        </div>
      </div>

      <input
        type="range" min={min} max={max} step={1} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full mb-3"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, rgba(255,255,255,0.07) ${pct}%, rgba(255,255,255,0.07) 100%)`,
        }}
      />

      {/* Benchmark */}
      <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg"
        style={{
          background: aboveBenchmark ? "rgba(255,68,85,0.06)" : "rgba(0,214,143,0.06)",
          border: `1px solid ${aboveBenchmark ? "rgba(255,68,85,0.18)" : "rgba(0,214,143,0.18)"}`,
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: aboveBenchmark ? "#FF4455" : "#00D68F" }} />
        <span style={{ color: aboveBenchmark ? "#FF4455" : "#00D68F" }}>
          {aboveBenchmark ? "Au-dessus" : "En dessous"} de la moyenne — {benchmarkNote}
        </span>
      </div>
    </div>
  );
}

export default function Step2Sliders({ data, onChange, onNext, onBack }: Step2Props) {
  const handleChange = useCallback(<K extends keyof Step2Data>(key: K, val: number) => {
    onChange({ ...data, [key]: val });
  }, [data, onChange]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-xl mx-auto">
      {/* Title */}
      <motion.div variants={item} className="text-center mb-8">
        <div className="accent-line mx-auto mb-4" />
        <div className="text-xs uppercase tracking-widest mb-2"
          style={{ color: "#6C74E8", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: "1.5px" }}>
          Étape 2 / 2
        </div>
        <h2 className="text-3xl md:text-4xl font-normal mb-3"
          style={{ fontFamily: "'Calistoga', serif", color: "#EDEDEF" }}>
          Votre planning
        </h2>
        <p className="text-sm" style={{ color: "#8A8F98" }}>
          Ces données sont des estimations. Elles seront indiquées comme telles dans votre diagnostic.
        </p>
      </motion.div>

      <motion.div variants={item} className="glass-card p-6">
        <SliderRow
          label="No-shows par semaine"
          tag="Estimation"
          desc="Patients absents sans prévenir ou annulation en dernière minute"
          value={data.noShowsSemaine}
          min={0}
          max={10}
          onChange={v => handleChange("noShowsSemaine", v)}
          benchmarkValue={4}
          benchmarkNote="jusqu'à 4/sem en moyenne"
          color="#6C74E8"
        />

        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "24px 0" }} />

        <SliderRow
          label="Urgences non programmées par semaine"
          tag="Estimation"
          desc="Patients qui appellent ou se présentent sans rendez-vous planifié"
          value={data.urgencesSemaine}
          min={0}
          max={15}
          onChange={v => handleChange("urgencesSemaine", v)}
          benchmarkValue={5}
          benchmarkNote="jusqu'à 5/sem en moyenne"
          color="#FF9500"
        />
      </motion.div>

      {/* Note */}
      <motion.div variants={item} className="mt-3 px-1">
        <p className="text-xs text-center" style={{ color: "#4A5170" }}>
          Estimation basée sur 30 min par no-show et 20 min par urgence non programmée.
        </p>
      </motion.div>

      {/* Buttons */}
      <motion.div variants={item} className="flex gap-3 mt-5">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="py-4 px-5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
          style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.12)", color: "#8A8F98" }}
        >
          ← Retour
        </motion.button>

        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="flex-1 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #6C74E8 0%, #8B93FF 100%)",
            color: "white",
            boxShadow: "0 4px 24px rgba(108, 116, 232, 0.4)",
          }}
        >
          Analyser mon cabinet →
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
