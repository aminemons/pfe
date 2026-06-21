import React from "react";

/* =========================================================================
   Animated, academic SVG diagrams & charts (manim-style, self-drawing).
   Curves carry the class "curve" — PresentationEngine measures their length
   and draws them with stroke-dashoffset when the slide becomes active.
   ========================================================================= */

export const NAVY = "#15324F";
export const ROI = "#2A6FB0";
export const CIEL = "#5CA9E6";
export const AMBRE = "#E08A1E";
export const GRID = "#15324F";

type Pt = [number, number];
export type MapFn = (x: number, y: number) => Pt;

/** Build an SVG path "d" from data points using a coordinate mapper. */
export function buildPath(pts: Pt[], map: MapFn): string {
  return pts
    .map(([x, y], i) => {
      const [px, py] = map(x, y);
      return `${i === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`;
    })
    .join(" ");
}

/** Smooth saturating rise: A·(1−e^{−t/τ}) + linear creep. */
export function rise(
  A: number,
  tau: number,
  creep = 0,
  tMax = 1,
  n = 90,
): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * tMax;
    out.push([t, A * (1 - Math.exp(-t / tau)) + creep * t]);
  }
  return out;
}

/** Transient peak then decay toward a plateau (for D(t)). */
export function peakDecay(
  peak: number,
  tPeak: number,
  plateau: number,
  tMax = 1,
  n = 110,
): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * tMax;
    const grow = 1 - Math.exp(-t / (tPeak * 0.35));
    const fall = Math.exp(-(t) / (tMax * 0.18));
    const v = plateau + (peak - plateau) * grow * fall;
    out.push([t, t === 0 ? plateau : v]);
  }
  return out;
}

interface ChartProps {
  width?: number;
  height?: number;
  xDomain: [number, number];
  yDomain: [number, number];
  xTicks: number[];
  yTicks: number[];
  xLabel: string;
  yLabel: string;
  tickFmt?: (v: number) => string;
  children: (map: MapFn) => React.ReactNode;
}

/** A clean cartesian chart frame with gridlines, ticks and axis labels. */
export const Chart: React.FC<ChartProps> = ({
  width = 540,
  height = 360,
  xDomain,
  yDomain,
  xTicks,
  yTicks,
  xLabel,
  yLabel,
  tickFmt = (v) => `${v}`,
  children,
}) => {
  const m = { l: 62, r: 22, t: 24, b: 50 };
  const pw = width - m.l - m.r;
  const ph = height - m.t - m.b;
  const map: MapFn = (x, y) => [
    m.l + ((x - xDomain[0]) / (xDomain[1] - xDomain[0])) * pw,
    m.t + ph - ((y - yDomain[0]) / (yDomain[1] - yDomain[0])) * ph,
  ];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      {/* gridlines */}
      {yTicks.map((v, i) => {
        const [, py] = map(0, v);
        return (
          <line
            key={`gy${i}`}
            x1={m.l}
            y1={py}
            x2={m.l + pw}
            y2={py}
            stroke={GRID}
            strokeOpacity={0.1}
            strokeWidth={1}
          />
        );
      })}
      {xTicks.map((v, i) => {
        const [px] = map(v, 0);
        return (
          <line
            key={`gx${i}`}
            x1={px}
            y1={m.t}
            x2={px}
            y2={m.t + ph}
            stroke={GRID}
            strokeOpacity={0.07}
            strokeWidth={1}
          />
        );
      })}

      {/* axes */}
      <line x1={m.l} y1={m.t} x2={m.l} y2={m.t + ph} stroke={NAVY} strokeWidth={1.6} />
      <line x1={m.l} y1={m.t + ph} x2={m.l + pw} y2={m.t + ph} stroke={NAVY} strokeWidth={1.6} />

      {/* ticks + labels */}
      {yTicks.map((v, i) => {
        const [, py] = map(0, v);
        return (
          <g key={`ty${i}`}>
            <line x1={m.l - 5} y1={py} x2={m.l} y2={py} stroke={NAVY} strokeWidth={1.4} />
            <text x={m.l - 9} y={py + 4} fontSize={12} fill={NAVY} textAnchor="end">
              {tickFmt(v)}
            </text>
          </g>
        );
      })}
      {xTicks.map((v, i) => {
        const [px] = map(v, 0);
        return (
          <g key={`tx${i}`}>
            <line x1={px} y1={m.t + ph} x2={px} y2={m.t + ph + 5} stroke={NAVY} strokeWidth={1.4} />
            <text x={px} y={m.t + ph + 20} fontSize={12} fill={NAVY} textAnchor="middle">
              {tickFmt(v)}
            </text>
          </g>
        );
      })}

      {/* axis titles */}
      <text x={m.l + pw / 2} y={height - 8} fontSize={13} fill={NAVY} textAnchor="middle" fontWeight={600}>
        {xLabel}
      </text>
      <text
        x={16}
        y={m.t + ph / 2}
        fontSize={13}
        fill={NAVY}
        textAnchor="middle"
        fontWeight={600}
        transform={`rotate(-90 16 ${m.t + ph / 2})`}
      >
        {yLabel}
      </text>

      {children(map)}
    </svg>
  );
};

/** A curve that draws itself on slide entry (class "curve"). */
export const DrawCurve: React.FC<{
  d: string;
  color: string;
  width?: number;
  dash?: string;
  opacity?: number;
}> = ({ d, color, width = 2.4, dash, opacity = 1 }) => (
  <path
    className="curve"
    d={d}
    fill="none"
    stroke={color}
    strokeWidth={width}
    strokeOpacity={opacity}
    strokeDasharray={dash}
    strokeLinecap="round"
    strokeLinejoin="round"
    vectorEffect="non-scaling-stroke"
  />
);

/** Legend rendered as a clean card (x, y = top-left corner of the card). */
export const Legend: React.FC<{
  items: { label: string; color: string }[];
  x: number;
  y: number;
}> = ({ items, x, y }) => {
  const rowH = 22;
  const padX = 14;
  const padY = 12;
  const swatch = 26;
  const gap = 10;
  const maxChars = Math.max(...items.map((it) => it.label.length));
  const w = padX * 2 + swatch + gap + maxChars * 7.1;
  const h = padY * 2 + (items.length - 1) * rowH + 6;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        x={0}
        y={0}
        width={w}
        height={h}
        rx={8}
        fill="#ffffff"
        fillOpacity={0.94}
        stroke={NAVY}
        strokeOpacity={0.16}
      />
      {items.map((it, i) => (
        <g key={i} transform={`translate(${padX}, ${padY + 6 + i * rowH})`}>
          <line
            x1={0}
            y1={0}
            x2={swatch}
            y2={0}
            stroke={it.color}
            strokeWidth={4}
            strokeLinecap="round"
          />
          <text x={swatch + gap} y={4.5} fontSize={13.5} fill={NAVY}>
            {it.label}
          </text>
        </g>
      ))}
    </g>
  );
};

/* =========================================================================
   Brownian / diffusion field — continuously jittering particles that drift
   outward from a centre. Pure-CSS keyframe loop (see index.css .brownian).
   ========================================================================= */
export const DiffusionField: React.FC<{ n?: number; tone?: "dark" | "light" }> = ({
  n = 34,
  tone = "dark",
}) => {
  const cA = tone === "light" ? "#E0A63A" : AMBRE;
  const cB = tone === "light" ? CIEL : ROI;
  const parts = React.useMemo(
    () =>
      Array.from({ length: n }, (_, i) => {
        const ang = (i / n) * Math.PI * 2 + (i % 3);
        const r = 6 + ((i * 37) % 40);
        return {
          left: 50 + Math.cos(ang) * (3 + (i % 5)),
          top: 50 + Math.sin(ang) * (3 + (i % 5)),
          dx: Math.cos(ang) * r,
          dy: Math.sin(ang) * r,
          dur: 5 + (i % 6),
          delay: -(i % 7),
          size: 7 + (i % 3) * 2,
        };
      }),
    [n],
  );
  return (
    <div className="relative w-full h-full overflow-hidden">
      {parts.map((p, i) => (
        <span
          key={i}
          className="brownian absolute rounded-full"
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              background: i % 4 === 0 ? cA : cB,
              ["--dx" as any]: `${p.dx}px`,
              ["--dy" as any]: `${p.dy}px`,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

/* =========================================================================
   Cover hero: a single nanoparticle tracing a self-drawing brownian path
   across a navy panel — the signature graphic of the title page.
   ========================================================================= */
export const CoverHero: React.FC = () => {
  const gx = [60, 120, 180, 240, 300];
  const gy = [70, 140, 210, 280, 350, 420, 490];
  const dots = [
    [40, 120], [300, 90], [70, 250], [320, 300], [50, 430],
    [290, 470], [150, 60], [210, 520], [110, 360],
  ];
  return (
    <svg viewBox="0 0 360 560" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      {/* faint grid */}
      {gx.map((x) => (
        <line key={`x${x}`} x1={x} y1={0} x2={x} y2={560} stroke="#fff" strokeOpacity={0.05} />
      ))}
      {gy.map((y) => (
        <line key={`y${y}`} x1={0} y1={y} x2={360} y2={y} stroke="#fff" strokeOpacity={0.05} />
      ))}

      {/* scattered NP */}
      {dots.map((d, i) => (
        <circle key={i} cx={d[0]} cy={d[1]} r={3.5} fill="#5CA9E6" fillOpacity={0.5} />
      ))}

      {/* self-drawing brownian trajectory */}
      <path
        className="curve"
        d="M 70 480 L 104 442 L 86 398 L 138 378 L 122 330 L 176 312 L 158 262 L 206 244 L 188 196 L 244 178 L 224 132 L 268 104"
        fill="none"
        stroke="#E0A63A"
        strokeWidth={2.6}
        strokeDasharray="3 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={70} cy={480} r={5} fill="#E0A63A" />

      {/* nanoparticle at the end, with halo rings */}
      <circle cx={268} cy={104} r={30} fill="none" stroke="#5CA9E6" strokeOpacity={0.18} />
      <circle cx={268} cy={104} r={21} fill="none" stroke="#5CA9E6" strokeOpacity={0.32} />
      <circle cx={268} cy={104} r={13} fill="#5CA9E6" />
      <text x={268} y={109} fill="#15324F" fontSize={15} textAnchor="middle" fontWeight="bold" fontFamily="serif">
        −
      </text>

      {/* caption */}
      <text x={28} y={534} fill="#7FB0DC" fontSize={13} fontFamily="monospace" letterSpacing="1">
        dynamique brownienne · MSD(t)
      </text>
    </svg>
  );
};

/* =========================================================================
   Periodic simulation box: a tiled 2×2 lattice with a highlighted central
   cell and particles, to illustrate periodic boundary conditions.
   ========================================================================= */
export const PeriodicBox: React.FC = () => {
  const cell = 92;
  const dots = [
    [18, 22], [60, 30], [40, 64], [74, 72], [28, 80], [80, 16], [52, 48],
  ];
  const cells = [
    { x: 0, y: 0, faded: true },
    { x: cell, y: 0, faded: true },
    { x: 0, y: cell, faded: true },
    { x: cell, y: cell, faded: false },
  ];
  return (
    <svg viewBox="-6 -6 196 210" className="w-full h-full max-w-[260px]">
      {cells.map((c, i) => (
        <g key={i} transform={`translate(${c.x},${c.y})`}>
          <rect
            width={cell}
            height={cell}
            fill={c.faded ? "rgba(42,111,176,0.04)" : "#fff"}
            stroke={c.faded ? "rgba(21,50,79,0.35)" : NAVY}
            strokeWidth={c.faded ? 1 : 2.4}
          />
          {dots.map((d, j) => (
            <circle
              key={j}
              cx={(d[0] / 100) * cell}
              cy={(d[1] / 100) * cell}
              r={3}
              fill={c.faded ? "rgba(42,111,176,0.45)" : ROI}
            />
          ))}
        </g>
      ))}
      <text x={cell} y={205} fontSize={11} fill={NAVY} textAnchor="middle" fontWeight={600}>
        cellule répétée (conditions périodiques)
      </text>
    </svg>
  );
};
