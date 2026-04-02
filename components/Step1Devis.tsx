"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";

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

// Moyenne nationale : 48%
function getConversionInfo(pct: number) {
  if (pct < 35) return {
    color: "#FF4455", bg: "rgba(255,68,85,0.05)", borderColor: "rgba(255,68,85,0.3)",
    badge: "En dessous de la moyenne", badgeBg: "rgba(255,68,85,0.12)", badgeColor: "#FF4455",
    note: `Moyenne nationale : <strong>48%</strong><br/>Écart : ${48 - pct} points en dessous`,
    barClass: "red",
  };
  if (pct < 52) return {
    color: "#FF9500", bg: "rgba(255,149,0,0.05)", borderColor: "rgba(255,149,0,0.3)",
    badge: "Dans la moyenne nationale", badgeBg: "rgba(255,149,0,0.12)", badgeColor: "#FF9500",
    note: `Moyenne nationale : <strong>48%</strong><br/>Vous êtes dans la norme`,
    barClass: "orange",
  };
  return {
    color: "#00D68F", bg: "rgba(0,214,143,0.05)", borderColor: "rgba(0,214,143,0.3)",
    badge: "Au-dessus de la moyenne", badgeBg: "rgba(0,214,143,0.12)", badgeColor: "#00D68F",
    note: `Moyenne nationale : <strong>48%</strong><br/>+${pct - 48} points au-dessus`,
    barClass: "green",
  };
}

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1.5px solid rgba(255,255,255,0.12)",
  borderRadius: "12px",
  color: "#EDEDEF",
  fontFamily: "'Inter', sans-serif",
  fontSize: "22px",
  fontWeight: 700,
  padding: "0 16px",
  height: "52px",
  width: "100%",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

function NumberInput({
  id, value, onChange, placeholder, suffix, step = 1, min = 0, max,
}: {
  id: string;
  value: number;
  onChange: (v: number) => void;
  placeholder: string;
  suffix: string;
  step?: number;
  min?: number;
  max?: number;
}) {
  const handleStep = (delta: number) => {
    const next = Math.max(min, Math.min(max ?? 999999, (value || 0) + delta));
    onChange(next);
  };
  return (
    <div className="flex items-center rounded-xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.12)" }}>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        placeholder={placeholder}
        value={value || ""}
        onChange={e => onChange(Math.max(min, parseFloat(e.target.value) || 0))}
        className="flex-1 bg-transparent border-none outline-none text-[#EDEDEF]"
        style={{ fontFamily: "'Inter', sans-serif", fontSize: "22px", fontWeight: 700, padding: "0 16px", height: "52px", minWidth: 0 }}
      />
      <span className="px-3 text-sm font-semibold" style={{ color: "#4A5170", whiteSpace: "nowrap" }}>{suffix}</span>
      <div className="flex flex-col" style={{ borderLeft: "1px solid rgba(255,255,255,0.07)" }}>
        <button type="button" onClick={() => handleStep(step)}
          className="w-10 flex items-center justify-center text-sm cursor-pointer transition-colors hover:text-[#6C74E8]"
          style={{ height: "26px", color: "#4A5170", background: "transparent", border: "none" }}>▲</button>
        <button type="button" onClick={() => handleStep(-step)}
          className="w-10 flex items-center justify-center text-sm cursor-pointer transition-colors hover:text-[#6C74E8]"
          style={{ height: "26px", color: "#4A5170", background: "transparent", border: "none", borderTop: "1px solid rgba(255,255,255,0.07)" }}>▼</button>
      </div>
    </div>
  );
}

export default function Step1Devis({ data, onChange, onNext }: Step1Props) {
  const [preciseOpen, setPreciseOpen] = useState(false);
  const [preciseValues, setPreciseValues] = useState<string[]>(["", "", ""]);

  const taux = data.devisRemis > 0
    ? Math.min(100, Math.round((data.devisAcceptes / data.devisRemis) * 100))
    : null;
  const info = taux !== null ? getConversionInfo(taux) : null;

  const preciseAvg = (() => {
    const vals = preciseValues.map(v => parseFloat(v)).filter(v => v > 0);
    return vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  })();

  const handlePreciseChange = (i: number, v: string) => {
    const next = [...preciseValues];
    next[i] = v;
    setPreciseValues(next);
    if (preciseAvg !== null && preciseOpen) {
      onChange({ ...data, prixMoyen: preciseAvg });
    }
  };

  const addPreciseInput = () => {
    if (preciseValues.length < 15) setPreciseValues(v => [...v, ""]);
  };

  const togglePrecise = () => {
    setPreciseOpen(p => !p);
    if (!preciseOpen && preciseAvg) {
      onChange({ ...data, prixMoyen: preciseAvg });
    }
  };

  // Update prix moyen when precise avg changes while open
  const effectivePrix = preciseOpen && preciseAvg ? preciseAvg : data.prixMoyen;

  const isValid = data.devisRemis >= 1 && data.devisAcceptes >= 0 && effectivePrix >= 1 && data.devisAcceptes <= data.devisRemis;

  const handleChange = useCallback(<K extends keyof Step1Data>(key: K, val: number) => {
    onChange({ ...data, [key]: val });
  }, [data, onChange]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } }
  };

  const barColor = info?.barClass === "green"
    ? "linear-gradient(90deg, #00B7A8, #00D68F)"
    : info?.barClass === "orange"
    ? "linear-gradient(90deg, #FF9500, #FFB700)"
    : "linear-gradient(135deg, #FF4455, #FF6E7A)";

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-xl mx-auto">
      {/* Title */}
      <motion.div variants={item} className="text-center mb-8">
        <div className="accent-line mx-auto mb-4" />
        <div className="text-xs uppercase tracking-widest mb-2"
          style={{ color: "#6C74E8", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: "1.5px" }}>
          Étape 1 / 2
        </div>
        <h2 className="text-3xl md:text-4xl font-normal mb-3"
          style={{ fontFamily: "'Calistoga', serif", color: "#EDEDEF" }}>
          Vos devis ce mois-ci
        </h2>
        <p className="text-sm" style={{ color: "#8A8F98" }}>
          Ces données sont utilisées uniquement pour votre calcul personnalisé. Elles ne sont pas conservées.
        </p>
      </motion.div>

      <div className="glass-card p-6 space-y-6">
        {/* Devis remis */}
        <motion.div variants={item}>
          <label className="block text-sm font-semibold mb-2.5" style={{ color: "#EDEDEF" }}>
            Devis remis à vos patients ce mois
          </label>
          <NumberInput
            id="devis-remis"
            value={data.devisRemis}
            onChange={v => handleChange("devisRemis", v)}
            placeholder="ex : 20"
            suffix="devis / mois"
          />
        </motion.div>

        {/* Devis acceptés */}
        <motion.div variants={item}>
          <label className="block text-sm font-semibold mb-2.5" style={{ color: "#EDEDEF" }}>
            Devis acceptés{" "}
            <span className="font-normal text-xs" style={{ color: "#4A5170" }}>
              (traitements effectivement démarrés)
            </span>
          </label>
          <NumberInput
            id="devis-acceptes"
            value={data.devisAcceptes}
            onChange={v => handleChange("devisAcceptes", Math.min(v, data.devisRemis || v))}
            placeholder="ex : 9"
            suffix="acceptés / mois"
            max={data.devisRemis || undefined}
          />
        </motion.div>

        {/* Conversion live */}
        <motion.div variants={item}>
          <div
            className="rounded-xl p-4 transition-all duration-300"
            style={{
              background: info ? info.bg : "rgba(255,255,255,0.025)",
              border: `1.5px solid ${info ? info.borderColor : "rgba(255,255,255,0.08)"}`,
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ color: "#4A5170", fontFamily: "'JetBrains Mono', monospace" }}>
                  Votre taux de conversion
                </div>
                <div className="text-4xl font-black leading-none mb-2"
                  style={{ color: info?.color ?? "#4A5170", letterSpacing: "-1.5px", fontFamily: "'Inter', sans-serif" }}>
                  {taux !== null ? `${taux}%` : "—"}
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-1.5"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: info ? barColor : "transparent" }}
                    animate={{ width: taux !== null ? `${taux}%` : "0%" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
                  />
                </div>
                <div className="flex justify-between text-xs" style={{ color: "#4A5170" }}>
                  <span>0%</span>
                  <span className="hidden sm:inline">Moy. nationale : 48%</span>
                  <span>100%</span>
                </div>
                <div className="text-center text-xs mt-0.5 sm:hidden" style={{ color: "#4A5170" }}>
                  Moy. nationale : 48%
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <AnimatePresence mode="wait">
                  {info ? (
                    <motion.div key={info.badge}
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.25 }}>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-2"
                        style={{ background: info.badgeBg, color: info.badgeColor }}>
                        {info.badge}
                      </div>
                      <div className="text-xs leading-relaxed" style={{ color: "#4A5170" }}
                        dangerouslySetInnerHTML={{ __html: info.note }} />
                    </motion.div>
                  ) : (
                    <motion.div key="empty"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="text-xs" style={{ color: "#4A5170" }}>
                        Renseignez vos chiffres<br/>pour voir votre situation.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Prix moyen */}
        <motion.div variants={item}>
          <label className="block text-sm font-semibold mb-2.5" style={{ color: "#EDEDEF" }}>
            Prix moyen de vos devis
          </label>
          <div style={{ opacity: preciseOpen ? 0.35 : 1, pointerEvents: preciseOpen ? "none" : "auto", transition: "opacity 0.2s" }}>
            <NumberInput
              id="prix-moyen"
              value={data.prixMoyen}
              onChange={v => handleChange("prixMoyen", v)}
              placeholder="ex : 900"
              suffix="€ / devis"
              step={50}
            />
          </div>
        </motion.div>

        {/* Precise mode */}
        <motion.div variants={item}>
          <div
            className="rounded-xl overflow-hidden cursor-pointer"
            style={{ background: "rgba(79,142,247,0.05)", border: "1px solid rgba(79,142,247,0.12)" }}
          >
            <div className="flex items-center gap-3 p-4" onClick={togglePrecise}>
              <input
                type="checkbox"
                checked={preciseOpen}
                onChange={togglePrecise}
                onClick={e => e.stopPropagation()}
                className="w-4 h-4 cursor-pointer flex-shrink-0"
                style={{ accentColor: "#6C74E8" }}
              />
              <label className="flex-1 text-sm font-semibold cursor-pointer flex items-center gap-2 flex-wrap" style={{ color: "#EDEDEF" }}>
                Calculer mon prix moyen automatiquement
                <span className="text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: "rgba(255,149,0,0.12)", color: "#FF9500" }}>
                  Facultatif
                </span>
              </label>
            </div>

            <AnimatePresence>
              {preciseOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
                  className="overflow-hidden"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="px-4 pb-4 pt-0" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-xs mb-3 pt-3" style={{ color: "#8A8F98" }}>
                      Entrez le montant de chaque devis que vous avez remis cette semaine. La moyenne sera calculée et utilisée comme prix de référence.
                    </p>
                    <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))" }}>
                      {preciseValues.map((v, i) => (
                        <input
                          key={i}
                          type="number"
                          placeholder={["800 €", "1 200 €", "650 €"][i] ?? "€"}
                          value={v}
                          onChange={e => handlePreciseChange(i, e.target.value)}
                          className="rounded-lg text-sm font-semibold outline-none w-full transition-all duration-200"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1.5px solid rgba(255,255,255,0.12)",
                            color: "#EDEDEF",
                            padding: "10px 12px",
                            fontFamily: "'Inter', sans-serif",
                          }}
                          onFocus={e => (e.currentTarget.style.borderColor = "#6C74E8")}
                          onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                        />
                      ))}
                    </div>
                    {preciseValues.length < 15 && (
                      <button
                        type="button"
                        onClick={addPreciseInput}
                        className="inline-flex items-center gap-2 text-sm font-semibold cursor-pointer transition-colors duration-200 px-3 py-2 rounded-lg"
                        style={{ color: "#8A8F98", background: "transparent", border: "1.5px dashed rgba(255,255,255,0.12)" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#6C74E8"; e.currentTarget.style.color = "#6C74E8"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#8A8F98"; }}
                      >
                        + Ajouter un devis
                      </button>
                    )}
                    {preciseAvg !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 mt-3 p-3 rounded-xl"
                        style={{ background: "rgba(0,214,143,0.06)", border: "1px solid rgba(0,214,143,0.15)" }}
                      >
                        <span className="text-sm flex-1" style={{ color: "#8A8F98" }}>Prix moyen calculé</span>
                        <span className="text-xl font-black" style={{ color: "#00D68F", letterSpacing: "-0.5px" }}>
                          {preciseAvg.toLocaleString("fr-FR")} €
                        </span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Next button */}
      <motion.div variants={item} className="mt-5">
        <motion.button
          onClick={() => {
            if (preciseOpen && preciseAvg) {
              onChange({ ...data, prixMoyen: preciseAvg });
            }
            onNext();
          }}
          disabled={!isValid}
          whileHover={isValid ? { scale: 1.02 } : {}}
          whileTap={isValid ? { scale: 0.98 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
          style={{
            background: isValid ? "linear-gradient(135deg, #6C74E8 0%, #8B93FF 100%)" : "rgba(255,255,255,0.06)",
            color: isValid ? "white" : "#4A5170",
            boxShadow: isValid ? "0 4px 24px rgba(108, 116, 232, 0.4)" : "none",
            fontSize: "16px",
          }}
        >
          Étape suivante{" "}
          <span style={{ fontSize: "18px" }}>›</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
