import React from "react";
import { Mathx } from "../components/MathFx";

import {
  Chart,
  DrawCurve,
  Legend,
  buildPath,
  rise,
  peakDecay,
  PeriodicBox,
  NAVY,
  ROI,
  CIEL,
  AMBRE,
} from "../components/Diagrams";

// --- Real figures & logos extracted from the mémoire ---
import logoUMMTO from "../assets/images/logo_ummto.png";
import logoENSM from "../assets/images/logo_ensm.png";
import imgDiffusion from "../assets/images/fig_diffusion.png";
import imgISS from "../assets/images/fig_iss_construction.png";
import imgDouble from "../assets/images/fig_double_couche.png";

const TOTAL = 22;

// --- Shared inline emphasis ---
const Kw = ({ children }: { children: React.ReactNode }) => (
  <span className="font-bold text-[#E08A1E]">{children}</span>
);
const Bl = ({ children }: { children: React.ReactNode }) => (
  <span className="font-bold text-[#2A6FB0]">{children}</span>
);

// 6-size ordered palette (small -> large): navy/blues -> amber
const SIZE_COLORS = ["#15324F", "#1E5187", "#2A6FB0", "#5CA9E6", "#E0A63A", "#E0741E"];
const SIZE_LABELS = ["10 nm", "12 nm", "14 nm", "16 nm", "18 nm", "20,41 nm"];
const comma = (v: number) => `${v}`.replace(".", ",");

// --- Shared components ---

const Block = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div
    data-anim="block"
    className="w-full mb-4 font-serif border-l-4 border-[#2A6FB0] pl-6 py-2"
  >
    <div className="text-[#2A6FB0] text-lg font-bold tracking-wide mb-1 uppercase">
      {title}
    </div>
    <div className="text-[#1F2A33] text-xl leading-[1.5]">{children}</div>
  </div>
);

const List = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="space-y-5 text-xl text-[#1F2A33] font-serif">
    {items.map((item, i) => (
      <li key={i} className="flex items-start leading-[1.5]">
        <span className="text-[#2A6FB0] mr-3 mt-[6px] shrink-0 text-xs">▶</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const EqMath = ({ math }: { math: string }) => (
  <div
    className="flex justify-center py-2 text-[#15324F]"
    style={{ fontSize: "30px" }}
  >
    <Mathx tex={math} display draw />
  </div>
);

// --- Layouts ---

const MetropolisFrame = ({
  title,
  children,
  progress,
}: {
  title: string;
  children: React.ReactNode;
  progress: number;
}) => {
  const idx = Math.round(progress * (TOTAL - 1));
  return (
    <div className="w-full h-full flex flex-col bg-white text-[#1F2A33]">
      {/* header: serif title + classic double rule + discreet page number */}
      <header className="flex-none px-16 pt-8">
        <div className="flex items-baseline justify-between gap-6">
          <h2 className="text-[2.05rem] leading-tight font-bold text-[#15324F]">
            {title}
          </h2>
          <div className="mono text-[#15324F]/30 text-sm shrink-0">
            {String(idx + 1).padStart(2, "0")} / {TOTAL}
          </div>
        </div>
        <div className="mt-3 border-t-2 border-[#15324F]" />
        <div className="mt-[2px] border-t border-[#15324F]/25" />
      </header>

      {/* content */}
      <main className="flex-grow flex flex-col px-16 py-7 relative overflow-hidden">
        {children}
      </main>
    </div>
  );
};

const SectionPage = ({
  title,
  progress,
}: {
  title: string;
  progress: number;
}) => {
  const [num, ...rest] = title.split(". ");
  const label = rest.join(". ");
  return (
    <div className="w-full h-full flex items-center bg-[#15324F] text-white relative overflow-hidden">
      <div className="flex items-center gap-12 px-24">
        <div
          className="font-bold leading-none text-white/[0.14] select-none"
          style={{ fontSize: "13rem" }}
        >
          {num.padStart(2, "0")}
        </div>
        <div className="border-l border-[#5CA9E6]/40 pl-12">
          <h2 className="text-5xl font-bold leading-tight max-w-2xl">{label}</h2>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 h-1 bg-[#5CA9E6]/70"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
};

const ChartCard = ({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption?: string;
}) => (
  <div className="w-full flex flex-col items-center">
    <div
      data-anim="card"
      className="w-full bg-white border border-[#15324F]/15 shadow-sm rounded-sm p-3"
    >
      {children}
    </div>
    {caption && (
      <p className="text-xs text-center text-[#1F2A33]/60 mt-2">{caption}</p>
    )}
  </div>
);

// --- Slides ---

const S01_Title = () => (
  <div className="w-full h-full bg-white text-[#26323d] flex flex-col items-center justify-center px-16 text-center">
    {/* institution */}
    <div className="text-[13px] text-[#3a4a5a]">
      République Algérienne Démocratique et Populaire
    </div>
    <div className="text-[13px] text-[#3a4a5a] mt-0.5">
      Ministère de l'Enseignement Supérieur et de la Recherche Scientifique
    </div>
    <div className="text-[16.5px] font-bold text-[#15324F] mt-2">
      Université Mouloud Mammeri, Tizi Ouzou, Algérie
    </div>

    <img src={logoUMMTO} alt="UMMTO" className="h-[56px] w-auto mt-5" />

    {/* title, framed by hairline rules */}
    <div className="w-[76%] h-px bg-[#15324F]/20 mt-8" />
    <div className="text-[26px] leading-[1.38] font-bold text-[#15324F] my-5 w-[86%]">
      Simulation numérique de la diffusion de nanoparticules au sein de la
      substance grise à l'aide de la dynamique de Langevin
    </div>
    <div className="w-[76%] h-px bg-[#15324F]/20" />

    {/* degree */}
    <div className="lbl text-[12px] tracking-[0.34em] uppercase text-[#2A6FB0] font-semibold mt-7">
      Projet de fin d'études
    </div>
    <div className="text-[13.5px] text-[#3a4a5a] mt-2.5">
      Mémoire de fin d'études pour l'obtention du diplôme de
    </div>
    <div className="text-[19px] font-bold text-[#15324F] mt-1">
      Master en Nanophysique
    </div>

    {/* people */}
    <div className="grid grid-cols-2 gap-x-24 mt-9 w-[74%] items-start">
      <div className="flex flex-col items-center gap-1.5">
        <div className="lbl text-[11px] tracking-[0.2em] uppercase text-[#2A6FB0] font-semibold">
          Travail réalisé par
        </div>
        <div className="text-[15px] text-[#15324F]">Iratni Asmaa El Khanssa</div>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <div className="lbl text-[11px] tracking-[0.2em] uppercase text-[#2A6FB0] font-semibold">
          Encadré par
        </div>
        <div className="text-[15px] text-[#15324F]">Dr. Bouziane Abdelaaziz</div>
        <div className="lbl text-[11px] tracking-[0.2em] uppercase text-[#2A6FB0] font-semibold mt-2.5">
          Co-encadré par
        </div>
        <div className="text-[15px] text-[#15324F]">Dr. Bekda Ahmed</div>
      </div>
    </div>

    {/* establishment */}
    <div className="lbl text-[11px] tracking-[0.26em] uppercase text-[#3a4a5a]/75 font-semibold mt-9">
      Établissement d'accueil du stage
    </div>
    <img src={logoENSM} alt="ENSM" className="h-[42px] w-auto mt-3" />
    <div className="text-[13px] text-[#3a4a5a] mt-2.5">
      École Nationale Supérieure de Mathématiques (ENSM) — Alger, Algérie
    </div>
    <div className="text-[13px] font-semibold text-[#15324F] mt-1.5">
      Année académique : 2025–2026
    </div>
  </div>
);

const S02_Plan = ({ p }: { p: number }) => (
  <MetropolisFrame title="Plan de la présentation" progress={p}>
    <div className="flex flex-col justify-center h-full max-w-3xl mx-auto space-y-5 text-2xl w-full">
      {[
        "Contexte & problématique",
        "Le milieu et les nanoparticules",
        "Modèle physique & méthode numérique",
        "Résultats & discussions",
        "Conclusion & perspectives",
      ].map((item, idx) => (
        <div
          key={idx}
          className="flex items-center text-[#15324F] border-b border-[#2A6FB0]/15 pb-4"
        >
          <span className="text-[#2A6FB0] font-bold mr-6 text-xl font-mono">
            0{idx + 1}
          </span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  </MetropolisFrame>
);

const S03_Section1 = ({ p }: { p: number }) => (
  <SectionPage title="1. Contexte & problématique" progress={p} />
);

const S04_Defi = ({ p }: { p: number }) => (
  <MetropolisFrame
    title="Le défi : faire entrer un médicament dans le cerveau"
    progress={p}
  >
    <div className="flex h-full gap-10 items-center">
      <div className="flex-[1.15]">
        <List
          items={[
            <span key="1">
              Les maladies du système nerveux central (Alzheimer, gliome,
              Parkinson…) restent <Kw>difficiles à traiter</Kw>.
            </span>,
            <span key="2">
              La <Bl>barrière hémato-encéphalique</Bl> bloque plus de{" "}
              <Kw>98 %</Kw> des médicaments.
            </span>,
            <span key="3">
              Les <Bl>nanoparticules</Bl> (NP) peuvent la franchir grâce à leur
              petite taille et leur charge.
            </span>,
            <span key="4">
              <span className="font-bold text-[#1F2A33]">Mais</span> une fois
              entrées, elles doivent encore <Kw>diffuser</Kw> jusqu'à leur
              cible : c'est le <Bl>« dernier kilomètre »</Bl>.
            </span>,
          ]}
        />
      </div>
      <div className="flex-1 flex flex-col items-center">
        <img
          src={imgDiffusion}
          className="w-full h-auto rounded-sm border border-[#15324F]/15"
          alt="Diffusion des nanoparticules dans l'espace interstitiel"
        />
        <p className="text-xs text-center text-[#1F2A33]/60 mt-3">
          Diffusion progressive des NP dans l'espace interstitiel (d'après Chen
          et al.)
        </p>
      </div>
    </div>
  </MetropolisFrame>
);

const S05_Objectifs = ({ p }: { p: number }) => (
  <MetropolisFrame title="Problématique & objectifs" progress={p}>
    <div className="h-full flex flex-col justify-center">
      <Block title="Question centrale">
        Comment les <Bl>interactions électrostatiques</Bl>, la <Bl>taille</Bl>{" "}
        des nanoparticules et le <Bl>potentiel de la membrane</Bl>{" "}
        influencent-ils leur diffusion dans la matière grise ?
      </Block>

      <div className="mt-6">
        <h3 className="text-2xl font-bold text-[#15324F] mb-5">
          Trois objectifs :
        </h3>
        <ul className="space-y-5 text-xl font-serif text-[#1F2A33]">
          {[
            ["Développer", "un modèle de dynamique brownienne suramortie, avec les forces électrostatiques explicites."],
            ["Valider", "le modèle sur des données expérimentales (Chen et al.)."],
            ["Étudier", "l'effet de la taille et du potentiel membranaire sur la diffusion."],
          ].map(([w, rest], i) => (
            <li key={i} className="flex items-start leading-[1.5]">
              <span className="text-[#2A6FB0] mr-4 font-bold font-mono w-6">
                {i + 1}.
              </span>
              <span>
                <strong className="text-[#15324F]">{w}</strong> {rest}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </MetropolisFrame>
);

const S06_Section2 = ({ p }: { p: number }) => (
  <SectionPage title="2. Le milieu et les nanoparticules" progress={p} />
);

const S07_Milieu = ({ p }: { p: number }) => (
  <MetropolisFrame title="Où diffusent les nanoparticules ?" progress={p}>
    <div className="flex h-full gap-10 items-center">
      <div className="flex-1">
        <List
          items={[
            <span key="1">
              Les cellules du cerveau sont séparées par un réseau de{" "}
              <Bl>fentes microscopiques</Bl> : l'
              <Bl>espace extracellulaire (ECS)</Bl>.
            </span>,
            <span key="2">
              Largeur des fentes : <Kw>30–60 nm</Kw>.
            </span>,
            <span key="3">
              Rempli d'un <Bl>fluide visqueux</Bl> (un électrolyte).
            </span>,
            <span key="4" className="block">
              Deux paramètres clés :
              <ul className="ml-6 mt-2 space-y-1 text-lg text-[#1F2A33]/85 border-l-2 border-[#2A6FB0] pl-4">
                <li>
                  Fraction de volume libre :{" "}
                  <Mathx tex="\alpha \approx 0{,}20" />
                </li>
                <li>
                  Tortuosité : <Mathx tex="\lambda \approx 1{,}5 - 1{,}6" />{" "}
                  (chemins détournés)
                </li>
              </ul>
            </span>,
          ]}
        />
      </div>
      <div className="flex-1 flex flex-col items-center">
        <img
          src={imgISS}
          className="w-full h-auto rounded-sm border border-[#15324F]/15"
          alt="Construction du modèle 2D de l'espace interstitiel"
        />
        <p className="text-xs text-center text-[#1F2A33]/60 mt-3">
          De l'image réelle du tissu (A) au domaine 2D de simulation (D–E)
        </p>
      </div>
    </div>
  </MetropolisFrame>
);

const S08_FITC = ({ p }: { p: number }) => (
  <MetropolisFrame title="Les nanoparticules étudiées : FITC@Fe₃O₄" progress={p}>
    <div className="flex h-full gap-10 items-center">
      <div className="flex-[1.1]">
        <List
          items={[
            <span key="1">
              Cœur magnétique (Fe₃O₄) + marqueur <Bl>fluorescent</Bl> (FITC) ➔
              imagerie <em>et</em> transport ciblé.
            </span>,
            <span key="2">
              Diamètre effectif : <Kw>20,41 nm</Kw>.
            </span>,
            <span key="3">
              Potentiel zêta : <Kw>ζ = −22,4 mV</Kw> ➔ surface{" "}
              <Kw>chargée négativement</Kw>.
            </span>,
          ]}
        />
        <div className="mt-7 border-l-4 border-[#5CA9E6] pl-6">
          <h4 className="text-lg font-bold mb-3 text-[#2A6FB0]">
            Deux conséquences directes :
          </h4>
          <ul className="space-y-2 text-lg text-[#1F2A33]">
            <li>
              • les NP se <Bl>repoussent</Bl> les unes les autres ;
            </li>
            <li>
              • elles sont <Bl>repoussées</Bl> par les parois cellulaires (aussi
              négatives).
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-[0.85] flex flex-col items-center">
        <img
          src={imgDouble}
          className="w-[88%] h-auto rounded-sm border border-[#15324F]/15"
          alt="Double couche électrique et potentiel zêta"
        />
        <p className="text-xs text-center text-[#1F2A33]/60 mt-3">
          Double couche électrique et potentiel zêta (d'après Yuan et al.)
        </p>
      </div>
    </div>
  </MetropolisFrame>
);

// --- Forces: single slide built up with synchronised fragments ---
const ForceDiagram = () => (
  <svg viewBox="0 0 420 320" className="w-full h-full max-w-md">
    <defs>
      <marker id="arrowhead" markerWidth="7" markerHeight="6" refX="5.5" refY="3" orient="auto">
        <polygon points="0 0, 7 3, 0 6" fill={NAVY} />
      </marker>
    </defs>

    {/* domain */}
    <rect x="10" y="10" width="400" height="300" rx="6" fill="none" stroke={NAVY} strokeWidth="2" />
    {/* membrane */}
    <rect x="10" y="272" width="400" height="38" fill="rgba(42,111,176,0.14)" />
    <line x1="10" y1="272" x2="410" y2="272" stroke={ROI} strokeWidth="2" />
    {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((x) => (
      <text key={x} x={x} y="295" fontSize="14" fill={ROI} textAnchor="middle" fontWeight="bold">
        −
      </text>
    ))}
    <text x="210" y="320" fontSize="12" fill={NAVY} textAnchor="middle">
      membrane (paroi cellulaire)
    </text>

    {/* brownian path — fragment index 1 */}
    <path
      className="curve fragment"
      data-fragment-index="1"
      d="M 125 150 L 138 122 L 118 96 L 150 84 L 178 104 L 168 132 L 196 120"
      fill="none"
      stroke={AMBRE}
      strokeWidth="2.4"
      strokeLinecap="round"
    />

    {/* coulomb repulsion — fragment index 2 */}
    <line
      className="fragment"
      data-fragment-index="2"
      x1="158"
      y1="150"
      x2="262"
      y2="150"
      stroke={NAVY}
      strokeWidth="3"
      markerEnd="url(#arrowhead)"
      markerStart="url(#arrowhead)"
    />
    {/* membrane repulsion — fragment index 2 */}
    <line className="fragment" data-fragment-index="2" x1="125" y1="248" x2="125" y2="190" stroke={NAVY} strokeWidth="3" markerEnd="url(#arrowhead)" />
    <line className="fragment" data-fragment-index="2" x1="295" y1="248" x2="295" y2="190" stroke={NAVY} strokeWidth="3" markerEnd="url(#arrowhead)" />

    {/* particles (always visible, on top) */}
    {[125, 295].map((cx) => (
      <g key={cx}>
        <circle cx={cx} cy="150" r="26" fill={CIEL} stroke={ROI} strokeWidth="1.5" />
        <text x={cx} y="157" fill="white" fontSize="22" textAnchor="middle" fontWeight="bold">
          −
        </text>
      </g>
    ))}
  </svg>
);

const S09_Forces = ({ p }: { p: number }) => (
  <MetropolisFrame title="Trois forces gouvernent le mouvement" progress={p}>
    <div className="flex h-full gap-10 items-center">
      <div className="flex-1 pr-6 border-r border-[#15324F]/10">
        <ul className="space-y-7 text-xl font-serif">
          <li className="flex items-start">
            <span className="bg-[#2A6FB0] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 shrink-0 text-base">
              1
            </span>
            <div>
              <span className="font-bold text-[#2A6FB0] block text-xl">
                Traînée visqueuse
              </span>
              <span className="text-[#1F2A33] text-lg">
                Le fluide freine la particule (loi de Stokes).
              </span>
            </div>
          </li>
          <li className="flex items-start fragment" data-fragment-index="1">
            <span className="bg-[#E08A1E] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 shrink-0 text-base">
              2
            </span>
            <div>
              <span className="font-bold text-[#E08A1E] block text-xl">
                Agitation thermique
              </span>
              <span className="text-[#1F2A33] text-lg">
                Chocs aléatoires du fluide ➔ mouvement brownien.
              </span>
            </div>
          </li>
          <li className="flex items-start fragment" data-fragment-index="2">
            <span className="bg-[#15324F] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 shrink-0 text-base">
              3
            </span>
            <div>
              <span className="font-bold text-[#15324F] block text-xl">
                Interactions électrostatiques
              </span>
              <ul className="mt-1 space-y-1 text-base border-l-2 border-[#15324F]/20 pl-3 text-[#1F2A33]">
                <li>• Répulsion entre NP (Coulomb)</li>
                <li>• Répulsion NP–membrane (très courte portée, ~1 nm)</li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div className="flex-1 flex justify-center items-center h-[82%]">
        <ForceDiagram />
      </div>
    </div>
  </MetropolisFrame>
);

const S10_Section3 = ({ p }: { p: number }) => (
  <SectionPage title="3. Modèle physique & méthode numérique" progress={p} />
);

const S11_Suramorti = ({ p }: { p: number }) => (
  <MetropolisFrame title="Un régime « suramorti »" progress={p}>
    <div className="flex flex-col h-full items-center justify-center max-w-4xl mx-auto w-full">
      <List
        items={[
          "À l'échelle nanométrique, le fluide est si visqueux que l'inertie est négligeable (nombre de Reynolds très faible).",
          <span key="2">
            La particule n'accumule aucune vitesse : à chaque instant,{" "}
            <Kw>forces = friction</Kw>.
          </span>,
        ]}
      />

      <div className="w-full mt-8">
        <Block title="Équation du mouvement (Langevin suramortie)">
          <EqMath
            math={String.raw`\gamma\,\dot{\mathbf{r}} = \underbrace{\mathbf{F}}_{\text{forces électrostatiques}} + \underbrace{\xi(t)}_{\text{agitation thermique}}`}
          />
        </Block>
      </div>

      <div className="w-full text-center mt-4 text-lg text-[#1F2A33]">
        <Mathx tex="\gamma" /> : coefficient de friction (loi de Stokes)
        <span className="mx-6 text-[#2A6FB0]">•</span>
        <Mathx tex="\xi(t)" /> : bruit thermique aléatoire
      </div>
    </div>
  </MetropolisFrame>
);

const S12_ModeleSimu = ({ p }: { p: number }) => (
  <MetropolisFrame title="Le modèle de simulation" progress={p}>
    <div className="flex h-full gap-10 items-center">
      <div className="flex-[1.15]">
        <List
          items={[
            <span key="1">
              <Kw>900 nanoparticules</Kw> dans une boîte 2D représentant
              l'espace interstitiel (~13 × 13 μm).
            </span>,
            <span key="2">
              <Bl>Conditions périodiques</Bl> : la boîte se répète ➔ on simule
              un milieu « infini ».
            </span>,
            "Une membrane chargée placée en bas du domaine.",
            <span key="4" className="block">
              Deux interactions :
              <ul className="ml-6 mt-2 space-y-1 border-l-2 border-[#E08A1E] pl-4 text-lg">
                <li>
                  • Répulsion <Bl>de Coulomb</Bl> (entre NP)
                </li>
                <li>
                  • Répulsion <Bl>de Debye–Hückel</Bl> (NP–membrane)
                </li>
              </ul>
            </span>,
          ]}
        />
      </div>
      <div className="flex-[0.85] flex justify-center items-center h-full">
        <PeriodicBox />
      </div>
    </div>
  </MetropolisFrame>
);

const S13_Mesure = ({ p }: { p: number }) => (
  <MetropolisFrame title="Simuler, puis mesurer la diffusion" progress={p}>
    <div className="flex flex-col h-full justify-center gap-6">
      <div className="fragment" data-fragment-index="1">
        <h3 className="text-2xl font-bold text-[#15324F] mb-2">
          1. Avancer dans le temps
          <span className="font-normal text-base ml-2 text-[#1F2A33]/70">
            — schéma d'Euler–Maruyama. À chaque petit pas Δt :
          </span>
        </h3>
        <div className="border-l-4 border-[#15324F]/25 pl-8">
          <EqMath
            math={String.raw`\mathbf{r}^{\,n+1} = \mathbf{r}^{\,n} + \underbrace{\mu\,\mathbf{F}\,\Delta t}_{\text{déplacement par les forces}} + \underbrace{\sqrt{2 D_0 \Delta t}\;\mathbf{G}}_{\text{pas aléatoire thermique}}`}
          />
        </div>
      </div>

      <div className="fragment" data-fragment-index="2">
        <h3 className="text-2xl font-bold text-[#15324F] mb-2">
          2. Mesurer
          <span className="font-normal text-base ml-2 text-[#1F2A33]/70">
            — le déplacement quadratique moyen (MSD) :
          </span>
        </h3>
        <div className="border-l-4 border-[#15324F]/25 pl-8">
          <EqMath
            math={String.raw`\text{MSD}(t) \approx 4\,D\,t \quad \text{(relation d'Einstein en 2D)}`}
          />
        </div>
      </div>

      <div
        className="fragment mt-2 border border-[#2A6FB0] text-[#2A6FB0] p-4 font-bold text-center text-xl flex items-center justify-center gap-3"
        data-fragment-index="3"
      >
        <span className="text-2xl">➔</span>
        La pente du MSD donne le coefficient de diffusion effectif&nbsp;
        <Mathx tex="D" />&nbsp;— notre indicateur principal.
      </div>
    </div>
  </MetropolisFrame>
);

const S14_Section4 = ({ p }: { p: number }) => (
  <SectionPage title="4. Résultats & discussions" progress={p} />
);

// ---- Result 1: validation MSD chart ----
const S15_Res1 = ({ p }: { p: number }) => {
  const tot = rise(1.42, 0.18, 0.07, 3);
  const mx = rise(0.82, 0.16, 0.045, 3);
  const my = rise(0.62, 0.16, 0.03, 3);
  return (
    <MetropolisFrame title="Résultat 1 — Validation du modèle" progress={p}>
      <div className="flex h-full gap-8 items-center">
        <div className="flex-[1.15]">
          <ChartCard caption="MSD en fonction du temps : composantes x, y et total">
            <Chart
              xDomain={[0, 3]}
              yDomain={[0, 1.8]}
              xTicks={[0, 1, 2, 3]}
              yTicks={[0, 0.5, 1, 1.5]}
              xLabel="t  (ms)"
              yLabel="MSD  (×10⁻¹³ m²)"
              tickFmt={comma}
            >
              {(map) => (
                <>
                  <DrawCurve d={buildPath(tot, map)} color={NAVY} width={2.8} />
                  <DrawCurve d={buildPath(mx, map)} color={ROI} />
                  <DrawCurve d={buildPath(my, map)} color={AMBRE} />
                  <Legend
                    x={360}
                    y={70}
                    items={[
                      { label: "MSD total", color: NAVY },
                      { label: "MSD selon x", color: ROI },
                      { label: "MSD selon y", color: AMBRE },
                    ]}
                  />
                </>
              )}
            </Chart>
          </ChartCard>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <Block title="Comparaison (D en m²/s)">
            <div className="flex justify-between py-1.5 border-b border-[#15324F]/15">
              <span>D simulé</span>
              <span className="font-bold font-mono">1,38 × 10⁻¹¹</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#15324F]/15">
              <span>D expérimental</span>
              <span className="font-bold font-mono">1,09 × 10⁻¹¹</span>
            </div>
            <div className="flex justify-between py-1.5 text-[#E08A1E] font-bold">
              <span>Écart</span>
              <span className="font-mono">26,6 %</span>
            </div>
          </Block>
          <div className="mt-3">
            <h4 className="font-bold text-[#15324F] text-lg mb-2">
              Lecture de la courbe :
            </h4>
            <List
              items={[
                "montée rapide puis plateau : la diffusion ralentit (confinement + répulsions).",
                "bon ordre de grandeur ➔ modèle validé, meilleur que les modèles sans électrostatique.",
              ]}
            />
          </div>
        </div>
      </div>
    </MetropolisFrame>
  );
};

// ---- Result 2a: size effect on MSD (family of curves) ----
const S16_Res2a = ({ p }: { p: number }) => {
  const curves = SIZE_COLORS.map((c, i) => {
    const A = 1.5 + i * 0.03;
    const tau = 0.32 - i * 0.035;
    return { d: rise(A, tau, 0.03, 3.5), c };
  });
  return (
    <MetropolisFrame title="Résultat 2 — Effet de la taille (MSD)" progress={p}>
      <div className="flex h-full gap-8 items-center">
        <div className="flex-[1.15] border-r border-[#15324F]/10 pr-6">
          <ChartCard caption="MSD total pour six diamètres (10 → 20,41 nm)">
            <Chart
              xDomain={[0, 3.5]}
              yDomain={[0, 1.8]}
              xTicks={[0, 1, 2, 3]}
              yTicks={[0, 0.5, 1, 1.5]}
              xLabel="t  (ms)"
              yLabel="MSD  (×10⁻¹³ m²)"
              tickFmt={comma}
            >
              {(map) => (
                <>
                  {curves.map((cu, i) => (
                    <DrawCurve key={i} d={buildPath(cu.d, map)} color={cu.c} width={2.2} />
                  ))}
                  <Legend
                    x={372}
                    y={150}
                    items={SIZE_COLORS.map((c, i) => ({
                      label: SIZE_LABELS[i],
                      color: c,
                    }))}
                  />
                </>
              )}
            </Chart>
          </ChartCard>
        </div>
        <div className="flex-[0.85]">
          <h4 className="text-xl font-bold text-[#15324F] mb-4">
            Ce que montrent les courbes :
          </h4>
          <List
            items={[
              <span key="1">
                toutes les tailles <Bl>saturent</Bl> (domaine de taille finie).
              </span>,
              <span key="2">
                <Bl>anisotropie</Bl> : MSD<sub>x</sub> {">"} MSD<sub>y</sub> — la
                membrane bloque la direction <em>y</em>.
              </span>,
              <span key="3">
                les grosses NP atteignent le plateau plus vite (répulsion
                initiale plus forte).
              </span>,
            ]}
          />
        </div>
      </div>
    </MetropolisFrame>
  );
};

// ---- Result 2b: size effect on D(t) (transient peak + decay) ----
const S17_Res2b = ({ p }: { p: number }) => {
  const peaks = [0.8, 1.3, 2.0, 3.0, 4.5, 6.1];
  const curves = SIZE_COLORS.map((c, i) => ({
    d: peakDecay(peaks[i], 0.12, 0.13, 3.5),
    c,
  }));
  return (
    <MetropolisFrame
      title="Résultat 2 — Effet de la taille (coefficient D)"
      progress={p}
    >
      <div className="flex h-full gap-8 items-center">
        <div className="flex-[1.15] border-r border-[#15324F]/10 pr-6">
          <ChartCard caption="Coefficient de diffusion D(t) pour six diamètres (10 à 20,41 nm)">
            <Chart
              xDomain={[0, 3.5]}
              yDomain={[0, 6.5]}
              xTicks={[0, 1, 2, 3]}
              yTicks={[0, 2, 4, 6]}
              xLabel="t  (ms)"
              yLabel="D  (×10⁻¹⁰ m²/s)"
              tickFmt={comma}
            >
              {(map) => (
                <>
                  {curves.map((cu, i) => (
                    <DrawCurve key={i} d={buildPath(cu.d, map)} color={cu.c} width={2.2} />
                  ))}
                  <Legend
                    x={372}
                    y={60}
                    items={SIZE_COLORS.map((c, i) => ({
                      label: SIZE_LABELS[i],
                      color: c,
                    }))}
                  />
                </>
              )}
            </Chart>
          </ChartCard>
        </div>
        <div className="flex-[0.85] flex flex-col justify-center">
          <List
            items={[
              "pic transitoire au départ (répulsion des 900 NP injectées ensemble), puis D converge.",
              <span key="2">
                de 10 à 20,41 nm, D ne varie que de <Kw>8 %</Kw> : peu sensible à
                la taille.
              </span>,
              <span key="3">
                le rapport D/D₀ augmente avec la taille (<Kw>0,29 → 0,62</Kw>).
              </span>,
            ]}
          />
          <div className="mt-6 bg-[#E08A1E]/10 border-l-4 border-[#E08A1E] p-4 text-[#15324F] text-base">
            Les répulsions électrostatiques <Bl>homogénéisent</Bl> la diffusion
            entre tailles.
          </div>
        </div>
      </div>
    </MetropolisFrame>
  );
};

// ---- Result 3: membrane potential (superposed curves) ----
const S18_Res3 = ({ p }: { p: number }) => {
  const pots = ["0 mV", "−5 mV", "−10 mV", "−15 mV", "−20 mV"];
  const cols = [NAVY, ROI, CIEL, AMBRE, "#E0741E"];
  const curves = cols.map((c, i) => ({
    d: rise(1.45 + (i - 2) * 0.004, 0.17, 0.06, 3.5),
    c,
  }));
  return (
    <MetropolisFrame
      title="Résultat 3 — Effet du potentiel membranaire"
      progress={p}
    >
      <div className="flex h-full gap-8 items-center">
        <div className="flex-[1.15] border-r border-[#15324F]/10 pr-6">
          <ChartCard caption="MSD total pour ψₘ de 0 à −20 mV (courbes superposées)">
            <Chart
              xDomain={[0, 3.5]}
              yDomain={[0, 1.8]}
              xTicks={[0, 1, 2, 3]}
              yTicks={[0, 0.5, 1, 1.5]}
              xLabel="t  (ms)"
              yLabel="MSD  (×10⁻¹³ m²)"
              tickFmt={comma}
            >
              {(map) => (
                <>
                  {curves.map((cu, i) => (
                    <DrawCurve key={i} d={buildPath(cu.d, map)} color={cu.c} width={2} opacity={0.9} />
                  ))}
                  <Legend
                    x={372}
                    y={150}
                    items={cols.map((c, i) => ({ label: pots[i], color: c }))}
                  />
                </>
              )}
            </Chart>
          </ChartCard>
        </div>
        <div className="flex-[0.85]">
          <h4 className="text-xl font-bold text-[#15324F] mb-4">
            Lecture du graphique :
          </h4>
          <List
            items={[
              <span key="1">
                les 5 courbes (ψ<sub>m</sub> de 0 à −20 mV) sont{" "}
                <Bl>superposées</Bl>.
              </span>,
              <span key="2">
                <Mathx tex="D_{\text{eff}} = 1{,}37 \times 10^{-11}\ \text{m}^2/\text{s}" />
                , identique pour tous.
              </span>,
            ]}
          />
          <div className="mt-6 bg-[#15324F] text-white p-5 border-l-4 border-[#E08A1E]">
            <strong className="text-[#E08A1E] block mb-1 text-lg">
              Conclusion :
            </strong>
            la membrane agit trop{" "}
            <span className="font-bold text-[#5CA9E6]">localement</span> (~1 nm) ;
            ce sont les répulsions <Kw>entre NP</Kw> qui dominent.
          </div>
        </div>
      </div>
    </MetropolisFrame>
  );
};

const S19_Section5 = ({ p }: { p: number }) => (
  <SectionPage title="5. Conclusion & perspectives" progress={p} />
);

const S20_Conclusion = ({ p }: { p: number }) => (
  <MetropolisFrame title="Conclusion" progress={p}>
    <div className="h-full flex flex-col justify-center max-w-4xl mx-auto w-full">
      <ul className="space-y-6 text-xl leading-[1.5]">
        <li className="flex">
          <span className="text-[#2A6FB0] font-bold text-2xl mr-5">•</span>
          <span>
            Un modèle de <Bl>dynamique brownienne suramortie</Bl> intégrant
            explicitement les interactions électrostatiques.
          </span>
        </li>
        <li className="flex">
          <span className="text-[#2A6FB0] font-bold text-2xl mr-5">•</span>
          <span>
            <strong className="text-[#1F2A33]">Validé</strong> : écart de{" "}
            <Kw>26,6 %</Kw> avec l'expérience — meilleur que les modèles
            antérieurs.
          </span>
        </li>
        <li className="flex">
          <span className="text-[#2A6FB0] font-bold text-2xl mr-5">•</span>
          <span>
            <strong className="text-[#1F2A33]">Taille</strong> : effet faible
            sur D (~<Kw>8 %</Kw>), mais <Bl>anisotropie</Bl> marquée due à la
            membrane.
          </span>
        </li>
        <li className="flex">
          <span className="text-[#2A6FB0] font-bold text-2xl mr-5">•</span>
          <span>
            <strong className="text-[#1F2A33]">Potentiel membranaire</strong> :{" "}
            <Bl>aucun effet</Bl> mesurable — transport dominé par les répulsions
            inter-particules.
          </span>
        </li>
      </ul>
    </div>
  </MetropolisFrame>
);

const S21_Perspectives = ({ p }: { p: number }) => (
  <MetropolisFrame title="Perspectives" progress={p}>
    <div className="flex h-full items-center justify-center">
      <div className="w-full max-w-3xl">
        <List
          items={[
            <span key="1">
              Passer à une géométrie <Bl>3D</Bl> et plus réaliste de l'espace
              interstitiel.
            </span>,
            <span key="2">
              Ajouter la <Bl>matrice extracellulaire</Bl> (chaînes d'héparane
              sulfate) qui freine les NP.
            </span>,
            <span key="3">
              Intégrer l'<Bl>absorption cellulaire</Bl> des nanoparticules.
            </span>,
            <span key="4">
              Explorer d'autres tailles, charges et types de nanoparticules.
            </span>,
          ]}
        />
      </div>
    </div>
  </MetropolisFrame>
);

const S22_Standout = () => (
  <div className="w-full h-full flex flex-col justify-center items-center bg-[#15324F] text-white text-center relative overflow-hidden">
    <h1 className="text-6xl font-bold tracking-wide mb-7">
      Merci de votre attention
    </h1>
    <div className="w-24 h-[3px] bg-[#5CA9E6]" />
    <h2 className="text-3xl text-white/70 mt-7 font-light italic">Questions ?</h2>
    <div className="absolute bottom-10 text-[13px] text-white/45">
      Iratni Asmaa El Khanssa &nbsp;·&nbsp; UMMTO – ENSM &nbsp;·&nbsp; 2025–2026
    </div>
  </div>
);

const slideComponents: React.FC<{ p: number }>[] = [
  S01_Title,
  S02_Plan,
  S03_Section1,
  S04_Defi,
  S05_Objectifs,
  S06_Section2,
  S07_Milieu,
  S08_FITC,
  S09_Forces,
  S10_Section3,
  S11_Suramorti,
  S12_ModeleSimu,
  S13_Mesure,
  S14_Section4,
  S15_Res1,
  S16_Res2a,
  S17_Res2b,
  S18_Res3,
  S19_Section5,
  S20_Conclusion,
  S21_Perspectives,
  S22_Standout,
];

export const slides = slideComponents.map((Component, index) => {
  const p = index / (slideComponents.length - 1);
  return <Component key={index} p={p} />;
});
