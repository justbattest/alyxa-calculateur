"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import DonutChart from "./DonutChart";
import AnimatedNumber from "./AnimatedNumber";

// ─── CALCULS (identiques au HTML original) ────────────────────────────────────
interface InputData {
  devisRemis: number;
  devisAcceptes: number;
  prixMoyen: number;
  noShowsSemaine: number;
  urgencesSemaine: number;
}

function calcResults(d: InputData) {
  const emis = d.devisRemis;
  const acc = Math.min(d.devisAcceptes, emis);
  const ticket = d.prixMoyen;
  const nsW = d.noShowsSemaine;
  const ugW = d.urgencesSemaine;

  const devisSS = emis - acc;
  const tauxConv = emis > 0 ? acc / emis : 0;
  const caDevisM = devisSS * ticket;

  const nsMois = nsW * 4;
  const ugMois = ugW * 4;

  // No-show value: 17% of ticket, capped at 180€ (conservative)
  const valCren = Math.round(Math.min(ticket * 0.17, 180));
  const caNsM = nsMois * valCren;

  // Urgences: only time impact, NO CA
  const totalM = caDevisM + caNsM;
  const totalAn = totalM * 12;

  // Temps (30 min/no-show, 20 min/urgence)
  const tMins = nsMois * 30 + ugMois * 20;
  const tHeures = Math.round(tMins / 60);

  // Récupérable
  const recDevis = Math.round(devisSS * 0.30);
  const recNs = Math.round(nsMois * 0.50);
  const recMois = recDevis * ticket + recNs * valCren;
  const recAn = recMois * 12;

  const pct = Math.round(tauxConv * 100);

  // ── Profile ──
  let pIcon: string, pTitle: string, pMsg: string;

  if (pct >= 70) {
    pIcon = "70+";
    pTitle = "Excellent taux de conversion";
    pMsg = `Votre taux de conversion de <strong>${pct}%</strong> vous place parmi les meilleurs cabinets. Le vrai levier pour vous est maintenant votre gestion de l'agenda : vos <strong>${nsW} no-shows/semaine</strong>${ugW >= 3 ? ` et vos <strong>${ugW} urgences/semaine</strong>` : ""} représentent du temps et du CA récupérables directement.`;
  } else if (pct >= 52) {
    pIcon = `${pct}%`;
    pTitle = "Bon taux, encore un potentiel significatif";
    pMsg = `Avec <strong>${pct}%</strong> de conversion, vous êtes au-dessus de la moyenne nationale (48%). Mais les cabinets les plus performants atteignent <strong>70% et plus</strong> grâce aux bons outils. Vos <strong>${devisSS} devis sans suite</strong> ce mois représentent une opportunité concrète d'aller chercher ces points supplémentaires.${nsW >= 2 ? ` En parallèle, vos <strong>${nsW} no-shows/semaine</strong> sont votre second levier.` : ""}`;
  } else if (pct >= 35) {
    pIcon = `${pct}%`;
    pTitle = "Taux de conversion dans la moyenne nationale";
    pMsg = `Votre taux de conversion de <strong>${pct}%</strong> est dans la norme des cabinets français (48%). Mais "dans la norme" ne veut pas dire optimisé : vos <strong>${devisSS} devis sans suite</strong> représentent des patients qui ont besoin de plus d'accompagnement pour décider. Avec les bons outils, les cabinets similaires au vôtre passent à <strong>60-65%</strong>.${nsW >= 2 ? ` Vos <strong>${nsW} no-shows/semaine</strong> sont un second levier immédiatement actionnable.` : ""}`;
  } else {
    pIcon = `${pct}%`;
    pTitle = "Levier principal : conversion des devis";
    pMsg = `Votre taux de conversion de <strong>${pct}%</strong> est en dessous de la moyenne nationale (48%). Sur vos <strong>${emis} devis remis ce mois</strong>, seulement <strong>${acc} ont abouti</strong>. Ce n'est pas une question de qualité du praticien : les patients ont besoin d'être accompagnés dans leur décision, avec les bons messages au bon moment.`;
  }

  if (ugW >= 4 && pct >= 48) {
    pMsg += ` Par ailleurs, vos <strong>${ugW} urgences/semaine</strong> (~${ugMois}/mois) perturbent significativement votre planning.`;
  }

  // ── Donut arcs ──
  const pctDevisArc = emis > 0 ? (devisSS / emis) * 100 : 0;
  const pctNsArc = Math.min((nsW / 8) * 100, 100);
  const pctUgArc = Math.min((ugW / 10) * 100, 100);

  // ── Recos ──
  const recos = buildRecos(devisSS, nsW, nsMois, ugW, ugMois, pct, acc, emis, ticket, valCren);

  return {
    emis, acc, ticket, nsW, ugW,
    devisSS, tauxConv, caDevisM, nsMois, ugMois, valCren, caNsM,
    totalM, totalAn, tHeures, recDevis, recNs, recMois, recAn, pct,
    pIcon, pTitle, pMsg,
    pctDevisArc, pctNsArc, pctUgArc,
    recos,
  };
}

interface Reco {
  accentColor: string;
  numColor: string;
  numBg: string;
  title: string;
  impact: string;
  impactClass: "hi" | "mid" | "ok";
  desc: string;
}

function buildRecos(
  devisSS: number, nsW: number, nsMois: number,
  ugW: number, ugMois: number, pctConv: number,
  _acc: number, _emis: number, ticket: number, valCren: number
): Reco[] {
  const recos: Reco[] = [];
  const lossDevis = devisSS * ticket;
  const lossNs = nsMois * valCren;

  const recoDevis: Reco = {
    accentColor: "#4F8EF7", numColor: "#4F8EF7", numBg: "rgba(79,142,247,0.12)",
    title: "Système de relance et conversion des devis",
    impact: "Impact fort", impactClass: "hi",
    desc: `Vous avez environ <strong>${devisSS} devis sans suite</strong> ce mois. Ce n'est pas parce que vous avez mal expliqué, ni à cause du prix : vu l'optimisation de votre cabinet, vous faites partie des praticiens sérieux et rigoureux. Simplement, vos patients ont besoin de comprendre davantage, d'avoir des réexplications avec leurs mots, de voir peut-être un court récapitulatif visuel. Une relance personnalisée à J+3, puis à J+15 (le moment clé où la mutuelle répond), c'est la séquence qui fait la différence. Discret, non intrusif, mais décisif.`,
  };

  const recoDevisMid: Reco = {
    ...recoDevis,
    impact: "Impact moyen", impactClass: "mid",
    desc: `Vos ${devisSS} devis sans suite ne sont pas des pertes définitives. Ces patients ont besoin d'être accompagnés, de mieux comprendre leur traitement avec leurs mots, et d'être relancés au bon moment. Une séquence J+3 puis J+15 (retour mutuelle) peut convertir 25 à 35% de ces devis supplémentaires.`,
  };

  const recoNs: Reco = {
    accentColor: "#FF9500", numColor: "#FF9500", numBg: "rgba(255,149,0,0.12)",
    title: "Rappels RDV et recapture automatique",
    impact: nsW >= 3 ? "Impact fort" : "Impact moyen",
    impactClass: nsW >= 3 ? "hi" : "mid",
    desc: `${nsW} no-show${nsW > 1 ? "s" : ""}/semaine représentent ${nsMois * 12} créneaux vides sur l'année. Un rappel WhatsApp ou SMS 48h avant, avec la possibilité de reprogrammer en un clic, réduit ce chiffre de moitié en moyenne. Quand un patient annule, le système lui propose immédiatement un autre créneau disponible : moins de perte patient, et une place aussitôt occupée par quelqu'un d'autre.`,
  };

  if (lossDevis >= lossNs) {
    if (devisSS > 0) recos.push(recoDevis);
    if (nsW >= 1) recos.push(recoNs);
  } else {
    if (nsW >= 1) recos.push(recoNs);
    if (devisSS > 0) recos.push(recoDevisMid);
  }

  if (ugW >= 3) {
    recos.push({
      accentColor: "#9B6FEB", numColor: "#9B6FEB", numBg: "rgba(155,111,235,0.12)",
      title: "Réduction des urgences non programmées",
      impact: "Impact moyen", impactClass: "mid",
      desc: `Vos ${ugMois} urgences/mois perturbent votre planning et mobilisent un temps précieux. Une grande partie de ces urgences vient de patients qui cherchent des conseils post-opératoires ou qui appliquent des solutions provisoires maison faute de réponse rapide. Un suivi post-consultation automatisé (prise de nouvelles, conseils, réponses aux questions fréquentes) réduit significativement ces appels et consultations évitables.`,
    });
  }

  recos.push({
    accentColor: "#9B6FEB", numColor: "#9B6FEB", numBg: "rgba(155,111,235,0.12)",
    title: "Suivi post-consultation de qualité",
    impact: ugW >= 3 ? "Impact fort" : "Impact moyen",
    impactClass: ugW >= 3 ? "hi" : "mid",
    desc: `Après chaque traitement, un message de suivi personnalisé réduit les appels au cabinet et apporte à vos patients un service premium que peu de cabinets proposent. Cela vous différencie, augmente la satisfaction et renforce leur confiance dans leur décision de traitement, ce qui améliore naturellement votre taux de conversion des devis. C'est aussi le meilleur contexte pour collecter des avis Google ultra qualifiés, en sollicitant uniquement les patients satisfaits, au bon moment, 24h/24 7j/7.`,
  });

  recos.push({
    accentColor: "#00D68F", numColor: "#00D68F", numBg: "rgba(0,214,143,0.12)",
    title: "Collecte d'avis Google ciblée",
    impact: "Impact long terme", impactClass: "ok",
    desc: `Un cabinet avec plus d'avis positifs se positionne mieux localement et attire de nouveaux patients. La clé : demander 48 à 72h après une consultation positive, uniquement aux patients satisfaits, jamais de façon systématique.`,
  });

  return recos.filter((_, i) => i < (pctConv < 35 ? 4 : 4));
}

// ─── SUBCOMPONENTS ────────────────────────────────────────────────────────────
function fmt(n: number) { return Math.round(n).toLocaleString("fr-FR"); }

function StatDonut({ label, value, subtitle, arcPct, color, glow, valueLabel }: {
  label: string; value: string; subtitle: string;
  arcPct: number; color: string; glow: string; valueLabel?: string;
}) {
  const CIRC = 201.06;
  const fill = Math.min(arcPct, 100) / 100 * CIRC;
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center text-center gap-3 p-5 rounded-2xl"
      style={{
        background: `linear-gradient(160deg, ${glow}0A, rgba(0,0,0,0))`,
        border: `1px solid ${glow}30`,
      }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#4A5170", letterSpacing: "1.2px" }}>{label}</div>
      <div className="relative" style={{ width: 84, height: 84 }}>
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(ellipse at center, ${glow}15, transparent 70%)` }} />
        <svg width="84" height="84" viewBox="0 0 84 84" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="42" cy="42" r="32" fill="none" stroke={`${color}15`} strokeWidth="7" />
          <circle cx="42" cy="42" r="32" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={animated ? `${fill.toFixed(2)} ${CIRC}` : `0 ${CIRC}`}
            style={{
              transition: "stroke-dasharray 1.2s cubic-bezier(.22,1,.36,1)",
              filter: `drop-shadow(0 0 8px ${glow})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-xl font-black leading-none" style={{ color, letterSpacing: "-0.5px" }}>{value}</div>
          {valueLabel && <div className="text-xs font-semibold mt-0.5 uppercase tracking-wider" style={{ color: "#4A5170" }}>{valueLabel}</div>}
        </div>
      </div>
      <div className="text-sm font-bold" style={{ color }}>{subtitle}</div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
interface Step3Props {
  data: InputData;
  onRestart: () => void;
}

export default function Step3Results({ data, onRestart }: Step3Props) {
  const r = calcResults(data);
  const shown = useRef(false);

  useEffect(() => { shown.current = true; }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
  };

  const impactColors: Record<string, { bg: string; color: string }> = {
    hi: { bg: "rgba(255,68,85,0.12)", color: "#FF4455" },
    mid: { bg: "rgba(255,149,0,0.12)", color: "#FF9500" },
    ok: { bg: "rgba(0,214,143,0.12)", color: "#00D68F" },
  };

  // Comparatif secteur data
  const sectorData = [
    { label: "Taux de conversion devis", yours: r.pct, sector: 48, unit: "%", max: 100, higherBetter: true },
    { label: "No-shows / semaine", yours: r.nsW, sector: 4, unit: "", max: 10, higherBetter: false },
    { label: "Urgences / semaine", yours: r.ugW, sector: 5, unit: "", max: 15, higherBetter: false },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* ── Header ── */}
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="text-center mb-2 pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold uppercase tracking-widest"
          style={{ background: "rgba(108,116,232,0.1)", border: "1px solid rgba(108,116,232,0.25)", color: "#8B93FF" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#8B93FF", display: "inline-block", animation: "ping-slow 2s ease-out infinite" }} />
          Analyse complète générée
        </div>
        <h2 className="text-4xl md:text-5xl font-normal mb-3"
          style={{ fontFamily: "'Calistoga', serif", color: "#EDEDEF", letterSpacing: "-0.5px" }}>
          Votre diagnostic
        </h2>
        <p className="text-sm" style={{ color: "#4A5170" }}>Basé sur vos données · {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
      </motion.div>

      {/* ── 1. Profil ── */}
      <motion.div initial="hidden" animate="show" variants={fadeUp}
        className="gradient-border rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(79,142,247,0.06), rgba(155,111,235,0.04))" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top left, rgba(79,142,247,0.1), transparent 60%)" }} />
        <div className="relative z-10 flex gap-5 items-start">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 rounded-2xl" style={{ background: "rgba(79,142,247,0.25)", animation: "ping-slow 3s ease-out infinite", borderRadius: "14px" }} />
            <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-black"
              style={{
                background: "linear-gradient(135deg, rgba(79,142,247,0.2), rgba(155,111,235,0.15))",
                border: "1.5px solid rgba(79,142,247,0.35)",
                color: "#4F8EF7",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "-1px",
                boxShadow: "0 0 20px rgba(79,142,247,0.2)",
              }}>
              {r.pIcon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold uppercase tracking-widest mb-1.5"
              style={{ color: "#4F8EF7", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1.5px" }}>
              Diagnostic personnalisé
            </div>
            <div className="font-bold text-xl mb-3" style={{ color: "#EDEDEF", letterSpacing: "-0.5px", lineHeight: 1.2 }}>{r.pTitle}</div>
            <div className="text-sm leading-relaxed" style={{ color: "#8A8F98" }}
              dangerouslySetInnerHTML={{ __html: r.pMsg.replace(/<strong>/g, '<strong style="color:#EDEDEF">') }} />
          </div>
        </div>
      </motion.div>

      {/* ── 2. Stat donuts (3) ── */}
      <motion.div initial="hidden" animate="show" variants={fadeUp}>
        <div className="text-xs font-bold uppercase tracking-widest mb-3 text-center"
          style={{ color: "#4A5170", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1.5px" }}>
          Vos 3 indicateurs clés
        </div>
        <div className="grid grid-cols-3 gap-3">
          <StatDonut
            label="Devis sans suite"
            value={String(r.devisSS)}
            subtitle={`~${fmt(r.caDevisM)} €`}
            arcPct={r.pctDevisArc}
            color="#FF4455"
            glow="#FF4455"
            valueLabel="/ mois"
          />
          <StatDonut
            label="No-shows"
            value={String(r.nsW)}
            subtitle={`~${fmt(r.caNsM)} €`}
            arcPct={r.pctNsArc}
            color="#9B6FEB"
            glow="#9B6FEB"
            valueLabel="/ sem"
          />
          <StatDonut
            label="Urgences"
            value={String(r.ugW)}
            subtitle={`${r.ugMois} perturbations`}
            arcPct={r.pctUgArc}
            color="#FF9500"
            glow="#FF9500"
            valueLabel="/ sem"
          />
        </div>
      </motion.div>

      {/* ── 3. CA non capturé annuel ── */}
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
        className="rounded-2xl p-8 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, rgba(255,68,85,0.12) 0%, rgba(20,5,8,0.8) 60%)",
          border: "1px solid rgba(255,68,85,0.3)",
          boxShadow: "0 0 60px rgba(255,68,85,0.08)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(255,68,85,0.22), transparent 65%)" }} />
        {/* Decorative corner dots */}
        <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,68,85,0.4)" }} />
        <div className="absolute top-4 right-8 w-1 h-1 rounded-full" style={{ background: "rgba(255,68,85,0.2)" }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 text-xs font-bold uppercase tracking-widest"
            style={{ background: "rgba(255,68,85,0.12)", border: "1px solid rgba(255,68,85,0.25)", color: "#FF4455" }}>
            CA non capturé / an
          </div>
          <div className="font-black leading-none mb-1"
            style={{ color: "#FF4455", letterSpacing: "-3px", fontSize: "clamp(52px, 12vw, 80px)", textShadow: "0 0 40px rgba(255,68,85,0.5)" }}>
            ~<AnimatedNumber value={r.totalAn} />€
          </div>
          <div className="text-base font-semibold mb-6" style={{ color: "rgba(255,68,85,0.7)" }}>
            soit ~{fmt(r.totalM)} € par mois
          </div>

          {/* Explain box */}
          <div className="text-left rounded-xl p-4"
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(8px)" }}>
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold" style={{ color: "#4A5170" }}>
              <span style={{ color: "#4F8EF7", fontSize: 13 }}>ℹ</span>
              Comment ce chiffre est-il calculé ?
            </div>
            <div className="text-xs leading-relaxed" style={{ color: "#8A8F98", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "8px" }}>
              Ce montant représente le <strong style={{ color: "#EDEDEF" }}>maximum théorique</strong> non capturé, basé sur vos chiffres.<br /><br />
              En pratique, il est impossible de tout récupérer : certains patients ne reprogramment pas, certains devis ne se convertiront jamais.{" "}
              <strong style={{ color: "#EDEDEF" }}>Ce qui compte, c'est le pourcentage récupérable</strong> grâce aux bons outils, affiché ci-dessous.
              Plus votre CA non capturé est élevé, plus votre potentiel de récupération est important.
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 4. Temps mobilisé ── */}
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "rgba(108,116,232,0.05)", border: "1px solid rgba(108,116,232,0.18)" }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top right, rgba(108,116,232,0.08), transparent 60%)" }} />
        <div className="relative z-10">
          <div className="mb-5">
            <div className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ color: "#6C74E8", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1.5px" }}>
              Impact sur votre agenda
            </div>
            <div className="font-bold text-lg" style={{ color: "#EDEDEF", letterSpacing: "-0.3px" }}>Temps mobilisé par l'imprévu chaque mois</div>
            <div className="text-sm mt-1" style={{ color: "#8A8F98" }}>
              No-shows et urgences non anticipées perturbent votre organisation et mobilisent du temps non facturable.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-4 text-center"
              style={{ background: "rgba(255,68,85,0.07)", border: "1px solid rgba(255,68,85,0.2)" }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#FF4455", letterSpacing: "1px" }}>Actuellement</div>
              <div className="text-5xl font-black mb-1" style={{ color: "#FF4455", letterSpacing: "-1.5px", textShadow: "0 0 20px rgba(255,68,85,0.4)" }}>~{r.tHeures}h</div>
              <div className="text-xs" style={{ color: "#4A5170" }}>
                {r.nsMois} no-shows + {r.ugMois} urgences
              </div>
            </div>
            <div className="rounded-xl p-4 text-center"
              style={{ background: "rgba(0,214,143,0.07)", border: "1px solid rgba(0,214,143,0.2)" }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#00D68F", letterSpacing: "1px" }}>Avec automatisation</div>
              <div className="text-5xl font-black mb-1" style={{ color: "#00D68F", letterSpacing: "-1.5px", textShadow: "0 0 20px rgba(0,214,143,0.4)" }}>~1-2h</div>
              <div className="text-xs" style={{ color: "#4A5170" }}>de suivi mensuel</div>
            </div>
          </div>
          <p className="text-xs text-center mt-3" style={{ color: "#4A5170" }}>
            Estimation basée sur 30 min par no-show et 20 min par urgence non programmée.
          </p>
        </div>
      </motion.div>

      {/* ── 5. Potentiel récupérable ── */}
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
        className="rounded-2xl p-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, rgba(0,214,143,0.1) 0%, rgba(3,10,8,0.8) 60%)",
          border: "1px solid rgba(0,214,143,0.28)",
          boxShadow: "0 0 60px rgba(0,214,143,0.07)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% -5%, rgba(0,214,143,0.2), transparent 65%)" }} />
        <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full" style={{ background: "rgba(0,214,143,0.4)" }} />
        <div className="absolute top-4 right-8 w-1 h-1 rounded-full" style={{ background: "rgba(0,214,143,0.2)" }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 text-xs font-bold uppercase tracking-widest"
            style={{ background: "rgba(0,214,143,0.12)", border: "1px solid rgba(0,214,143,0.25)", color: "#00D68F" }}>
            Potentiel récupérable
          </div>
          <div className="font-black leading-none mb-1"
            style={{ color: "#00D68F", letterSpacing: "-3px", fontSize: "clamp(52px, 12vw, 80px)", textShadow: "0 0 40px rgba(0,214,143,0.5)" }}>
            ~+<AnimatedNumber value={r.recAn} />€
          </div>
          <div className="text-base font-semibold mb-6" style={{ color: "rgba(0,214,143,0.7)" }}>
            soit ~+{fmt(r.recMois)} € par mois
          </div>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "#8A8F98" }}>
            En s'appuyant sur les outils d'optimisation les plus performants du marché, les cabinets dentaires observent en moyenne une récupération de{" "}
            <strong style={{ color: "#EDEDEF" }}>30 à 35%</strong> de leur CA non capturé dès les 3 premiers mois d'utilisation.
          </p>
          <div className="text-xs rounded-xl px-4 py-3 leading-relaxed"
            style={{ color: "#4A5170", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)" }}>
            ⚠️ Ces projections s'appuient sur des données observées dans des cabinets ayant adopté des outils d'automatisation personnalisés à leur cabinet. Vos résultats peuvent varier selon votre contexte.
          </div>
        </div>
      </motion.div>

      {/* ── 6. Mes 3 indicateurs KPI ── */}
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: "rgba(13,13,16,0.95)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(108,116,232,0.06), transparent 60%)" }} />
        <div className="text-xs font-bold uppercase tracking-widest mb-4 text-center relative z-10"
          style={{ color: "#4A5170", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1.5px" }}>
          Vos indicateurs de performance
        </div>
        <div className="grid grid-cols-3 gap-3">
          <DonutChart
            percentage={r.pct}
            label="Taux de conversion"
            sublabel="Moy. nationale : 48%"
            color="#4F8EF7"
            glowColor="rgba(79,142,247,0.6)"
            size={110}
          />
          <DonutChart
            percentage={r.totalAn > 0 ? Math.min(100, Math.round((r.recAn / r.totalAn) * 100)) : 32}
            label="Part récupérable"
            sublabel="Du CA non capturé"
            color="#00D68F"
            glowColor="rgba(0,214,143,0.6)"
            size={110}
          />
          <DonutChart
            percentage={Math.max(0, 100 - Math.min(100, Math.round(((r.nsMois + r.ugMois) / 20) * 100)))}
            label="Fluidité agenda"
            sublabel="Score organisation"
            color="#FF9500"
            glowColor="rgba(255,149,0,0.6)"
            size={110}
          />
        </div>
      </motion.div>

      {/* ── 7. Comparatif secteur dentaire ── */}
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "rgba(13,13,16,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top left, rgba(108,116,232,0.06), transparent 55%)" }} />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-1"
                style={{ color: "#6C74E8", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1.5px" }}>
                Comparatif secteur dentaire
              </div>
              <div className="text-xl font-normal" style={{ fontFamily: "'Calistoga', serif", color: "#EDEDEF" }}>
                Où vous situez-vous ?
              </div>
            </div>
            <div className="hidden sm:flex gap-3">
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "#4A5170" }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
                Secteur
              </div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "#4A5170" }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#6C74E8" }} />
                Vous
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {sectorData.map((metric, idx) => {
              const isGood = metric.higherBetter ? metric.yours >= metric.sector : metric.yours <= metric.sector;
              const yoursWidth = (metric.yours / metric.max) * 100;
              const sectorWidth = (metric.sector / metric.max) * 100;
              const yourColor = isGood ? "#00D68F" : "#FF4455";

              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2.5 gap-2">
                    <span className="text-sm font-semibold" style={{ color: "#B0B5BF" }}>{metric.label}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.05)", color: "#4A5170", fontFamily: "'JetBrains Mono', monospace" }}>
                        moy. {metric.sector}{metric.unit}
                      </span>
                      <span className="text-sm font-black px-2.5 py-0.5 rounded-full"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: yourColor, background: `${yourColor}12`, border: `1px solid ${yourColor}30` }}>
                        {metric.yours}{metric.unit}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Vous", width: yoursWidth, color: yourColor, glow: yourColor },
                      { label: "Moy.", width: sectorWidth, color: "rgba(255,255,255,0.18)", glow: "transparent" },
                    ].map((bar, bi) => (
                      <div key={bi} className="flex items-center gap-3">
                        <span className="text-xs w-8 flex-shrink-0 text-right"
                          style={{ color: "#4A5170", fontFamily: "'JetBrains Mono', monospace" }}>{bar.label}</span>
                        <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: bar.color,
                              boxShadow: bi === 0 ? `0 0 8px ${bar.glow}60` : "none",
                            }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${bar.width}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number,number,number,number], delay: idx * 0.15 + bi * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── 8. Plan d'action ── */}
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
      >
        <div className="text-xs font-bold uppercase tracking-widest mb-1.5"
          style={{ color: "#6C74E8", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1.5px" }}>
          Plan d&apos;action
        </div>
        <div className="text-2xl font-normal mb-1" style={{ fontFamily: "'Calistoga', serif", color: "#EDEDEF" }}>
          Comment récupérer ce CA
        </div>
        <p className="text-sm mb-4" style={{ color: "#8A8F98" }}>
          Actions prioritaires basées sur votre profil, classées par impact.
        </p>

        <div className="space-y-3">
          {r.recos.map((rec, idx) => {
            const ic = impactColors[rec.impactClass];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
                className="rounded-2xl flex items-stretch overflow-hidden relative"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(16px)",
                }}
              >
                {/* Accent bar */}
                <div className="w-1 flex-shrink-0" style={{ background: `linear-gradient(to bottom, ${rec.accentColor}, ${rec.accentColor}60)`, borderRadius: "16px 0 0 16px" }} />
                {/* Number */}
                <div className="flex items-start justify-center px-4 pt-5 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
                    style={{
                      background: rec.numBg,
                      color: rec.numColor,
                      border: `1px solid ${rec.numColor}30`,
                      boxShadow: `0 0 10px ${rec.numColor}20`,
                    }}>
                    {idx + 1}
                  </div>
                </div>
                {/* Content */}
                <div className="flex-1 py-5 pr-5">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-sm font-bold" style={{ color: "#EDEDEF" }}>{rec.title}</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background: ic.bg, color: ic.color, border: `1px solid ${ic.color}30` }}>
                      {rec.impact}
                    </span>
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: "#8A8F98" }}
                    dangerouslySetInnerHTML={{ __html: rec.desc.replace(/<strong>/g, '<strong style="color:#EDEDEF">') }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── 9. Comparatif outils ── */}
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
      >
        <div className="text-xs font-bold uppercase tracking-widest mb-1.5"
          style={{ color: "#8A8F98", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1.5px" }}>
          Comparatif coût
        </div>
        <div className="text-2xl font-normal mb-1" style={{ fontFamily: "'Calistoga', serif", color: "#EDEDEF" }}>
          Vous payez peut-être déjà trop
        </div>
        <p className="text-sm mb-4" style={{ color: "#8A8F98" }}>
          Si vous équipez votre cabinet outil par outil pour couvrir toutes ces fonctionnalités, voici ce que cela représente chaque mois.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Outil par outil */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#4A5170", letterSpacing: "1.5px" }}>
                Stack outil par outil
              </div>
            </div>
            {[
              { abbr: "AS", name: "Askara", feat: "Transcription + compte-rendu IA", price: "43€/m", bg: "#2563EB" },
              { abbr: "LF", name: "La Fraise", feat: "Conversion devis, relance, signature", price: "~125€/m", bg: "#DC2626" },
              { abbr: "DG", name: "DentistryGPT", feat: "WhatsApp suivi post-consultation", price: "99€/m", bg: "#059669" },
              { abbr: "MT", name: "Meditrust", feat: "Avis Google patients", price: "34€/m", bg: "#0891B2" },
            ].map((tool, i, arr) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3.5"
                style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 text-white"
                  style={{ background: tool.bg }}>
                  {tool.abbr}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: "#EDEDEF" }}>{tool.name}</div>
                  <div className="text-xs" style={{ color: "#4A5170" }}>{tool.feat}</div>
                </div>
                <div className="text-sm font-bold flex-shrink-0" style={{ color: "#8A8F98" }}>{tool.price}</div>
              </div>
            ))}
            <div className="flex justify-between items-center px-5 py-4"
              style={{ borderTop: "1.5px solid rgba(255,255,255,0.1)", background: "rgba(255,68,85,0.05)" }}>
              <span className="text-sm font-bold" style={{ color: "#8A8F98" }}>Total / mois</span>
              <span className="text-2xl font-black" style={{ color: "#FF4455", letterSpacing: "-1px" }}>~301€</span>
            </div>
          </div>

          {/* Solution Alyxa */}
          <div className="gradient-border rounded-2xl overflow-hidden p-5 flex flex-col"
            style={{ background: "linear-gradient(160deg, rgba(79,142,247,0.06), rgba(155,111,235,0.04))" }}>
            <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-xs font-bold mb-4"
              style={{ background: "rgba(79,142,247,0.12)", border: "1px solid rgba(79,142,247,0.25)", color: "#4F8EF7" }}>
              ✦ Recommandée pour votre profil
            </div>
            <div className="font-black text-xl mb-0.5" style={{ color: "#EDEDEF", letterSpacing: "-0.5px" }}>1 seul outil. Tout en 1.</div>
            <div className="text-xs mb-4" style={{ color: "#4A5170" }}>Aucun changement d&apos;habitude · Un seul tarif</div>
            <ul className="space-y-2 mb-5 flex-1">
              {[
                "Transcription + compte-rendu IA",
                "Conversion et relance des devis",
                "Suivi WhatsApp post-consultation",
                "Collecte avis Google ciblée",
                "Rappels RDV automatiques",
                "Tout interconnecté · HDS · RGPD",
              ].map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-xs py-1.5"
                  style={{ color: "#8A8F98", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ color: "#00D68F", flexShrink: 0, fontSize: 13 }}>✓</span> {feat}
                </li>
              ))}
            </ul>
            <div className="rounded-xl p-4 text-center mt-auto"
              style={{ background: "linear-gradient(135deg, rgba(0,214,143,0.1), rgba(0,183,168,0.05))", border: "1px solid rgba(0,214,143,0.2)" }}>
              <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#00D68F", letterSpacing: "1px" }}>Économie réalisée</div>
              <div className="text-2xl font-black" style={{ color: "#00D68F", letterSpacing: "-1px" }}>Significative</div>
              <div className="text-xs mt-1" style={{ color: "#4A5170" }}>versus le stack outil par outil</div>
            </div>
          </div>
        </div>

        <p className="text-xs mt-3 text-center" style={{ color: "#4A5170", lineHeight: 1.6 }}>
          * Prix indicatifs basés sur les offres d&apos;entrée de gamme de chaque outil, selon les grilles tarifaires publiques au moment de la rédaction.
        </p>
      </motion.div>

      {/* ── 10. CTA ── */}
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
        className="rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, rgba(79,142,247,0.1), rgba(108,116,232,0.07) 40%, rgba(155,111,235,0.06))",
          border: "1px solid rgba(79,142,247,0.25)",
          boxShadow: "0 0 80px rgba(79,142,247,0.08)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% -5%, rgba(79,142,247,0.2), transparent 60%)" }} />
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12"
          style={{ background: "linear-gradient(to bottom, rgba(79,142,247,0.5), transparent)" }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-bold uppercase tracking-widest"
            style={{ background: "rgba(79,142,247,0.12)", border: "1px solid rgba(79,142,247,0.25)", color: "#8B93FF" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#8B93FF", display: "inline-block", animation: "ping-slow 2s ease-out infinite" }} />
            Prochaine étape
          </div>
          <h3 className="text-2xl md:text-3xl font-normal mb-2"
            style={{ fontFamily: "'Calistoga', serif", color: "#EDEDEF", letterSpacing: "-0.3px" }}>
            Passez à l'action maintenant
          </h3>
          <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: "#8A8F98" }}>
            Découvrez la solution qui correspond exactement à votre profil de cabinet.
          </p>
          <motion.a
            href="https://tally.so/r/jaWB2x"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="glow-button inline-flex items-center gap-3 px-8 py-5 rounded-xl font-bold text-white relative overflow-hidden cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #4F8EF7 0%, #6C74E8 50%, #9B6FEB 100%)",
              boxShadow: "0 8px 40px rgba(79,142,247,0.4), 0 0 80px rgba(108,116,232,0.15)",
              fontSize: "16px",
              letterSpacing: "0.2px",
            }}
          >
            <span>Découvrir la solution adaptée à mon cabinet</span>
            <span style={{ fontSize: "18px" }}>→</span>
          </motion.a>
        </div>
      </motion.div>

      {/* Trust bar */}
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
        className="flex items-center justify-center gap-5 flex-wrap py-4 px-5 rounded-2xl"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {[
          { icon: "🔒", label: "RGPD Conforme" },
          { icon: "🛡", label: "HDS" },
          { icon: "⚡", label: "Données non conservées" },
          { icon: "✓", label: "Outil 100% gratuit" },
        ].map((b, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#4A5170" }}>
            <span>{b.icon}</span> {b.label}
          </div>
        ))}
      </motion.div>

      {/* Restart */}
      <div className="text-center pb-10">
        <button
          onClick={onRestart}
          className="text-sm cursor-pointer transition-colors duration-200 inline-flex items-center gap-2"
          style={{ color: "#4A5170", background: "none", border: "none" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#8A8F98")}
          onMouseLeave={e => (e.currentTarget.style.color = "#4A5170")}
        >
          ← Recommencer le diagnostic
        </button>
      </div>
    </div>
  );
}
