"use client";

import { motion } from "framer-motion";
import DonutChart from "./DonutChart";
import AnimatedNumber from "./AnimatedNumber";

interface ResultsData {
  devisRemis: number;
  devisAcceptes: number;
  prixMoyen: number;
  noShowsSemaine: number;
  urgencesSemaine: number;
}

interface Step3Props {
  data: ResultsData;
  onRestart: () => void;
}

function calcResults(d: ResultsData) {
  const tauxConversion = d.devisRemis > 0
    ? Math.min(100, Math.round((d.devisAcceptes / d.devisRemis) * 100))
    : 0;

  const caPerduDevisAnnuel = (d.devisRemis - d.devisAcceptes) * d.prixMoyen * 12;
  const caPerduNoShowsAnnuel = d.noShowsSemaine * d.prixMoyen * 52 * 0.7;
  const caPerduUrgencesAnnuel = d.urgencesSemaine * d.prixMoyen * 0.5 * 52;
  const caPerduTotal = Math.round(caPerduDevisAnnuel + caPerduNoShowsAnnuel + caPerduUrgencesAnnuel);

  const tempsPerduNoShows = Math.round(d.noShowsSemaine * 52);
  const tempsPerduUrgences = Math.round(d.urgencesSemaine * 0.5 * 52);
  const tempsPerduTotal = tempsPerduNoShows + tempsPerduUrgences;

  const potentielRecuperable = Math.round(caPerduTotal * 0.32);

  const tauxRecuperation = caPerduTotal > 0
    ? Math.min(100, Math.round((potentielRecuperable / caPerduTotal) * 100))
    : 32;

  const efficaciteAgenda = Math.max(0, Math.min(100,
    100 - Math.round(((d.noShowsSemaine * 1.2 + d.urgencesSemaine * 0.8) / 20) * 100)
  ));

  let profil: string;
  let profilColor: string;
  let profilBg: string;
  let profilDesc: string;

  if (tauxConversion >= 80 && d.noShowsSemaine <= 2) {
    profil = "Cabinet Performant";
    profilColor = "#10B981";
    profilBg = "rgba(16, 185, 129, 0.1)";
    profilDesc = "Votre cabinet affiche d'excellents indicateurs. Un gain supplémentaire est encore possible.";
  } else if (tauxConversion >= 65) {
    profil = "En Progression";
    profilColor = "#6C74E8";
    profilBg = "rgba(108, 116, 232, 0.1)";
    profilDesc = "Vous êtes dans la moyenne du secteur. Des optimisations ciblées peuvent générer un saut significatif.";
  } else if (tauxConversion >= 45) {
    profil = "À Optimiser";
    profilColor = "#F59E0B";
    profilBg = "rgba(245, 158, 11, 0.1)";
    profilDesc = "Un potentiel important est inexploité. Des actions concrètes peuvent transformer vos performances.";
  } else {
    profil = "Alerte Critique";
    profilColor = "#EF4444";
    profilBg = "rgba(239, 68, 68, 0.1)";
    profilDesc = "Votre cabinet perd une part significative de son CA potentiel. Une intervention rapide s'impose.";
  }

  const recommandations = [];
  if (tauxConversion < 65) {
    recommandations.push({
      icon: "📋",
      titre: "Optimisez vos devis",
      desc: "Mettez en place un suivi systématique post-devis. Un relance à J+3 peut augmenter votre taux de 12 à 18%.",
      impact: Math.round(caPerduDevisAnnuel * 0.15),
    });
  }
  if (d.noShowsSemaine >= 2) {
    recommandations.push({
      icon: "📱",
      titre: "Rappels automatisés",
      desc: "Implémentez des rappels SMS/WhatsApp à J-2 et J-1. Réduction des no-shows de 40 à 60% en moyenne.",
      impact: Math.round(caPerduNoShowsAnnuel * 0.5),
    });
  }
  if (d.urgencesSemaine >= 2) {
    recommandations.push({
      icon: "🗓",
      titre: "Créneaux urgences dédiés",
      desc: "Réservez 1-2 créneaux par jour pour les urgences. Évite les désorganisations et protège votre CA planifié.",
      impact: Math.round(caPerduUrgencesAnnuel * 0.4),
    });
  }
  if (recommandations.length < 2) {
    recommandations.push({
      icon: "📈",
      titre: "Plan de fidélisation patients",
      desc: "Un programme de suivi proactif peut augmenter le taux de retour de 20% et générer des recommandations.",
      impact: Math.round(potentielRecuperable * 0.1),
    });
  }

  return {
    tauxConversion,
    caPerduTotal,
    caPerduDevisAnnuel,
    caPerduNoShowsAnnuel,
    caPerduUrgencesAnnuel,
    tempsPerduTotal,
    potentielRecuperable,
    tauxRecuperation,
    efficaciteAgenda,
    profil,
    profilColor,
    profilBg,
    profilDesc,
    recommandations,
  };
}

export default function Step3Results({ data, onRestart }: Step3Props) {
  const r = calcResults(data);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={item} className="text-center mb-8">
        <div className="accent-line mx-auto mb-4" />
        <h2
          className="text-3xl md:text-4xl font-normal mb-3"
          style={{ fontFamily: "'Calistoga', serif", color: "#EDEDEF" }}
        >
          Votre diagnostic
        </h2>
        <p className="text-base" style={{ color: "#8A8F98" }}>
          Résultats calculés sur la base de vos données
        </p>
      </motion.div>

      {/* Profil badge */}
      <motion.div variants={item} className="mb-6">
        <div
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{
            background: r.profilBg,
            border: `1px solid ${r.profilColor}30`,
          }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${r.profilColor}20`, border: `1px solid ${r.profilColor}40` }}>
            <div className="w-3 h-3 rounded-full" style={{ background: r.profilColor, boxShadow: `0 0 10px ${r.profilColor}` }} />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest mb-0.5"
              style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace" }}>
              Profil Diagnostic
            </div>
            <div className="text-xl font-bold" style={{ color: r.profilColor }}>
              {r.profil}
            </div>
            <p className="text-sm mt-0.5" style={{ color: "#8A8F98" }}>{r.profilDesc}</p>
          </div>
        </div>
      </motion.div>

      {/* Key metric — CA perdu */}
      <motion.div variants={item} className="mb-6">
        <div className="glass-card p-6 text-center relative overflow-hidden">
          <div className="shimmer-line absolute inset-0 pointer-events-none" />
          <div className="text-xs uppercase tracking-widest mb-2"
            style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace" }}>
            CA non capturé annuel
          </div>
          <div className="flex items-baseline justify-center gap-1 mb-1">
            <span className="text-5xl md:text-6xl font-bold"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: "#EF4444" }}>
              -<AnimatedNumber value={r.caPerduTotal} />
            </span>
            <span className="text-2xl font-bold" style={{ color: "#EF4444" }}>€</span>
          </div>
          <p className="text-sm" style={{ color: "#8A8F98" }}>
            Chiffre d&apos;affaires qui vous échappe chaque année
          </p>

          {/* Breakdown */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: "Devis non convertis", value: r.caPerduDevisAnnuel, color: "#6C74E8" },
              { label: "No-shows", value: r.caPerduNoShowsAnnuel, color: "#EF4444" },
              { label: "Urgences", value: r.caPerduUrgencesAnnuel, color: "#F59E0B" },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="text-xs mb-1" style={{ color: "#8A8F98" }}>{item.label}</div>
                <div className="text-sm font-bold"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: item.color }}>
                  -{Math.round(item.value).toLocaleString("fr-FR")} €
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 3 Donuts */}
      <motion.div variants={item} className="mb-6">
        <div className="glass-card p-6">
          <div className="text-xs uppercase tracking-widest mb-5 text-center"
            style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace" }}>
            Indicateurs clés
          </div>
          <div className="grid grid-cols-3 gap-4">
            <DonutChart
              percentage={r.tauxConversion}
              label="Taux de conversion"
              sublabel={`Moyenne: 65%`}
              color="#6C74E8"
              glowColor="rgba(108,116,232,0.6)"
              size={120}
            />
            <DonutChart
              percentage={r.tauxRecuperation}
              label="Potentiel récup."
              sublabel="Du CA perdu"
              color="#10B981"
              glowColor="rgba(16,185,129,0.6)"
              size={120}
            />
            <DonutChart
              percentage={r.efficaciteAgenda}
              label="Efficacité agenda"
              sublabel="Score optimisation"
              color="#F59E0B"
              glowColor="rgba(245,158,11,0.6)"
              size={120}
            />
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={item} className="mb-6">
        <div className="grid grid-cols-2 gap-3">
          {/* Temps perdu */}
          <div className="glass-card p-5">
            <div className="text-xs uppercase tracking-widest mb-2"
              style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace" }}>
              Temps perdu / an
            </div>
            <div className="text-3xl font-bold mb-1"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: "#F59E0B" }}>
              <AnimatedNumber value={r.tempsPerduTotal} suffix="h" />
            </div>
            <p className="text-xs" style={{ color: "#8A8F98" }}>
              En no-shows et urgences non planifiées
            </p>
          </div>
          {/* Potentiel récupérable */}
          <div className="glass-card p-5"
            style={{ border: "1px solid rgba(16, 185, 129, 0.2)" }}>
            <div className="text-xs uppercase tracking-widest mb-2"
              style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace" }}>
              Potentiel récupérable
            </div>
            <div className="text-3xl font-bold mb-1"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: "#10B981" }}>
              +<AnimatedNumber value={r.potentielRecuperable} />€
            </div>
            <p className="text-xs" style={{ color: "#8A8F98" }}>
              Récupérable avec les bonnes pratiques
            </p>
          </div>
        </div>
      </motion.div>

      {/* Comparatif secteur */}
      <motion.div
        variants={item}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6"
      >
        <div className="glass-card p-6">
          <div className="text-xs uppercase tracking-widest mb-4"
            style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace" }}>
            Comparatif secteur dentaire
          </div>
          <div className="space-y-4">
            {[
              {
                label: "Taux de conversion devis",
                yours: data.devisRemis > 0 ? Math.round((data.devisAcceptes / data.devisRemis) * 100) : 0,
                sector: 65,
                unit: "%",
                higherIsBetter: true,
                color: "#6C74E8",
              },
              {
                label: "No-shows / semaine",
                yours: data.noShowsSemaine,
                sector: 3,
                unit: "",
                higherIsBetter: false,
                color: "#EF4444",
              },
              {
                label: "Urgences / semaine",
                yours: data.urgencesSemaine,
                sector: 2,
                unit: "",
                higherIsBetter: false,
                color: "#F59E0B",
              },
            ].map((metric, idx) => {
              const isGood = metric.higherIsBetter
                ? metric.yours >= metric.sector
                : metric.yours <= metric.sector;

              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm" style={{ color: "#B0B5BF" }}>{metric.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: "#8A8F98" }}>
                        Secteur: {metric.sector}{metric.unit}
                      </span>
                      <span className="text-sm font-bold"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: isGood ? "#10B981" : "#EF4444" }}>
                        Vous: {metric.yours}{metric.unit}
                      </span>
                    </div>
                  </div>
                  {/* Bars */}
                  <div className="space-y-1.5">
                    <div>
                      <div className="text-xs mb-0.5" style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace" }}>Vous</div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: isGood ? "#10B981" : metric.color }}
                          initial={{ width: 0 }}
                          whileInView={{
                            width: `${Math.min(100, metric.higherIsBetter ? metric.yours : Math.max(0, 100 - (metric.yours / 20) * 100))}%`
                          }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs mb-0.5" style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace" }}>Secteur</div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: "rgba(255,255,255,0.2)" }}
                          initial={{ width: 0 }}
                          whileInView={{
                            width: `${Math.min(100, metric.higherIsBetter ? metric.sector : Math.max(0, 100 - (metric.sector / 20) * 100))}%`
                          }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 + 0.1 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Plan d'action */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6"
      >
        <div className="glass-card p-6">
          <div className="text-xs uppercase tracking-widest mb-4"
            style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace" }}>
            Plan d&apos;action recommandé
          </div>
          <div className="space-y-3">
            {r.recommandations.map((rec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-4 p-4 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ background: "rgba(255,255,255,0.06)" }}>
                  {rec.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-sm" style={{ color: "#EDEDEF" }}>{rec.titre}</h4>
                    <span className="text-xs font-bold flex-shrink-0"
                      style={{ fontFamily: "'JetBrains Mono', monospace", color: "#10B981" }}>
                      +{rec.impact.toLocaleString("fr-FR")} €/an
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#8A8F98" }}>{rec.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Principal */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6"
      >
        <div className="rounded-2xl p-8 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(108, 116, 232, 0.15) 0%, rgba(14, 165, 201, 0.08) 100%)",
            border: "1px solid rgba(108, 116, 232, 0.25)",
          }}
        >
          {/* Glow blob */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full blur-3xl pointer-events-none"
            style={{ background: "rgba(108, 116, 232, 0.2)" }} />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
              style={{ background: "rgba(108, 116, 232, 0.2)", border: "1px solid rgba(108, 116, 232, 0.3)" }}>
              <span className="text-xs font-medium"
                style={{ color: "#8B93FF", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>
                ALYXA — SOLUTION DENTAIRE
              </span>
            </div>

            <h3
              className="text-2xl md:text-3xl font-normal mb-3"
              style={{ fontFamily: "'Calistoga', serif", color: "#EDEDEF" }}
            >
              Récupérez{" "}
              <span style={{ color: "#10B981" }}>
                +{r.potentielRecuperable.toLocaleString("fr-FR")} €
              </span>
              {" "}cette année
            </h3>

            <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: "#8A8F98" }}>
              Nos experts analysent votre situation et vous proposent un plan d&apos;action personnalisé sous 48h.
              Sans engagement.
            </p>

            <motion.a
              href="https://tally.so/r/jaWB2x"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-white glow-button cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #6C74E8 0%, #8B93FF 100%)",
                boxShadow: "0 4px 30px rgba(108, 116, 232, 0.5), 0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm4 9h-3v3H9v-3H6V9h3V6h2v3h3v2z" fill="white"/>
              </svg>
              Obtenir mon plan d&apos;action gratuit
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M9 4L13 8L9 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>

            <p className="text-xs mt-3" style={{ color: "#8A8F98" }}>
              ✓ Gratuit · ✓ Sans engagement · ✓ Réponse sous 48h
            </p>
          </div>
        </div>
      </motion.div>

      {/* Restart */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <button
          onClick={onRestart}
          className="text-sm cursor-pointer transition-colors duration-200"
          style={{ color: "#8A8F98" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#EDEDEF")}
          onMouseLeave={e => (e.currentTarget.style.color = "#8A8F98")}
        >
          ← Recommencer le diagnostic
        </button>
      </motion.div>
    </motion.div>
  );
}
