import type { CSSProperties, ReactNode } from "react";

type ThemePreview = {
  id: string;
  name: string;
  mood: string;
  bestFor: string;
  caution: string;
  palette: {
    bg: string;
    surface: string;
    surfaceAlt: string;
    line: string;
    ink: string;
    muted: string;
    accent: string;
    accentSoft: string;
    teamA: string;
    teamB: string;
    success: string;
    warning: string;
  };
  fonts: {
    display: string;
    body: string;
    mono: string;
  };
  backdrop: string;
  pageEmphasis: string[];
};

const themes: ThemePreview[] = [
  {
    id: "esports-broadcast",
    name: "Esports Broadcast",
    mood: "Competitive, dramatic, and live-match focused.",
    bestFor: "Making the algorithm feel exciting and spectator-friendly.",
    caution: "Needs restraint so it stays readable on dense data screens.",
    palette: {
      bg: "#090C12",
      surface: "rgba(14, 21, 33, 0.88)",
      surfaceAlt: "rgba(23, 34, 53, 0.9)",
      line: "rgba(122, 147, 184, 0.26)",
      ink: "#F4F7FB",
      muted: "#9AA9C2",
      accent: "#F5B700",
      accentSoft: "rgba(245, 183, 0, 0.14)",
      teamA: "#38BDF8",
      teamB: "#F43F5E",
      success: "#84CC16",
      warning: "#FB923C",
    },
    fonts: {
      display: '"Barlow Condensed", sans-serif',
      body: '"Space Grotesk", sans-serif',
      mono: '"IBM Plex Mono", monospace',
    },
    backdrop:
      "radial-gradient(circle at 15% 20%, rgba(56, 189, 248, 0.20), transparent 28%), radial-gradient(circle at 88% 16%, rgba(244, 63, 94, 0.16), transparent 24%), linear-gradient(145deg, #05070B 0%, #0D1320 45%, #06080D 100%)",
    pageEmphasis: ["Dashboard", "Visualise", "Compare"],
  },
  {
    id: "algorithm-atelier",
    name: "Algorithm Atelier",
    mood: "Editorial, thoughtful, and polished like a design journal.",
    bestFor: "Explaining the algorithm clearly in a portfolio-friendly way.",
    caution: "Can feel too quiet unless we keep a few stronger accents.",
    palette: {
      bg: "#F6F1E8",
      surface: "rgba(255, 252, 245, 0.88)",
      surfaceAlt: "rgba(249, 244, 235, 0.94)",
      line: "rgba(92, 100, 106, 0.18)",
      ink: "#181818",
      muted: "#5F656B",
      accent: "#D19C39",
      accentSoft: "rgba(209, 156, 57, 0.14)",
      teamA: "#4F8E86",
      teamB: "#B75A4C",
      success: "#56846D",
      warning: "#C97937",
    },
    fonts: {
      display: '"Fraunces", serif',
      body: '"IBM Plex Sans", sans-serif',
      mono: '"IBM Plex Mono", monospace',
    },
    backdrop:
      "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.10)), linear-gradient(140deg, #F9F4EC 0%, #F3EDE2 54%, #EEE7DB 100%)",
    pageEmphasis: ["Compare", "Graph Builder", "Dashboard"],
  },
  {
    id: "tactical-field-manual",
    name: "Tactical Field Manual",
    mood: "Spatial, disciplined, and mission-briefing oriented.",
    bestFor: "Framing the app like a tactical system without going full neon.",
    caution: "Can tip into theme-costume territory if the copy or palette gets heavy-handed.",
    palette: {
      bg: "#151B19",
      surface: "rgba(30, 40, 35, 0.88)",
      surfaceAlt: "rgba(43, 54, 49, 0.92)",
      line: "rgba(184, 176, 147, 0.20)",
      ink: "#F0EADB",
      muted: "#B1AA97",
      accent: "#D6A84B",
      accentSoft: "rgba(214, 168, 75, 0.16)",
      teamA: "#8ED1D8",
      teamB: "#D9735F",
      success: "#8FB676",
      warning: "#E0A458",
    },
    fonts: {
      display: '"Rajdhani", sans-serif',
      body: '"IBM Plex Sans", sans-serif',
      mono: '"IBM Plex Mono", monospace',
    },
    backdrop:
      "radial-gradient(circle at 82% 14%, rgba(214, 168, 75, 0.10), transparent 24%), linear-gradient(140deg, #121816 0%, #1B2320 60%, #0F1412 100%)",
    pageEmphasis: ["Visualise", "Graph Builder", "Dashboard"],
  },
  {
    id: "tournament-control-room",
    name: "Tournament Control Room",
    mood: "Premium, cinematic, and highly systems-oriented.",
    bestFor: "Balancing serious analytics credibility with a striking presence.",
    caution: "Dark UI needs disciplined contrast and spacing to avoid muddiness.",
    palette: {
      bg: "#0B0F14",
      surface: "rgba(16, 24, 36, 0.92)",
      surfaceAlt: "rgba(24, 33, 49, 0.94)",
      line: "rgba(127, 161, 206, 0.22)",
      ink: "#EDF4FF",
      muted: "#98A8BF",
      accent: "#4FD1FF",
      accentSoft: "rgba(79, 209, 255, 0.14)",
      teamA: "#4FD1FF",
      teamB: "#6B7CFF",
      success: "#32D583",
      warning: "#F5A524",
    },
    fonts: {
      display: '"Sora", sans-serif',
      body: '"IBM Plex Sans", sans-serif',
      mono: '"IBM Plex Mono", monospace',
    },
    backdrop:
      "radial-gradient(circle at 12% 12%, rgba(79, 209, 255, 0.14), transparent 26%), radial-gradient(circle at 90% 12%, rgba(107, 124, 255, 0.12), transparent 24%), linear-gradient(145deg, #060A10 0%, #101725 55%, #090C13 100%)",
    pageEmphasis: ["Visualise", "Compare", "Dashboard"],
  },
];

const navItems = ["Graph Builder", "Dashboard", "Compare", "Visualise"];

const sampleRows = [
  { name: "Local Search (First)", score: "18.0", runtime: "4 ms" },
  { name: "Local Search (Best)", score: "20.0", runtime: "6 ms" },
  { name: "Guaranteed Best", score: "20.0", runtime: "43 ms" },
];

const sampleSteps = [
  { step: "00", action: "Initial team", score: "14.0" },
  { step: "01", action: "Added player 0", score: "16.0" },
  { step: "02", action: "Removed player 3", score: "18.0" },
  { step: "03", action: "Added player 6", score: "20.0" },
];

const graphNodes = [
  { id: 0, x: 138, y: 62, team: "a" },
  { id: 1, x: 266, y: 52, team: "b" },
  { id: 2, x: 374, y: 124, team: "a" },
  { id: 3, x: 340, y: 252, team: "b" },
  { id: 4, x: 190, y: 286, team: "b" },
  { id: 5, x: 74, y: 208, team: "a" },
  { id: 6, x: 246, y: 180, team: "a" },
];

const graphEdges = [
  { from: 0, to: 1, weight: "2.0", active: false },
  { from: 0, to: 4, weight: "4.0", active: true },
  { from: 1, to: 6, weight: "5.0", active: true },
  { from: 2, to: 3, weight: "2.0", active: false },
  { from: 2, to: 6, weight: "2.0", active: true },
  { from: 3, to: 5, weight: "3.0", active: false },
  { from: 4, to: 5, weight: "1.0", active: true },
];

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;

  const value = Number.parseInt(full, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function Surface({
  children,
  theme,
  alt = false,
  className = "",
  style,
}: {
  children: ReactNode;
  theme: ThemePreview;
  alt?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`rounded-[24px] border ${className}`}
      style={{
        background: alt ? theme.palette.surfaceAlt : theme.palette.surface,
        borderColor: theme.palette.line,
        boxShadow: `0 18px 45px ${hexToRgba(theme.palette.bg, 0.22)}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function MiniGraph({ theme }: { theme: ThemePreview }) {
  return (
    <div
      className="relative overflow-hidden rounded-[20px] border p-3"
      style={{
        borderColor: theme.palette.line,
        background:
          theme.id === "algorithm-atelier"
            ? `linear-gradient(180deg, ${hexToRgba("#FFFFFF", 0.42)}, transparent), repeating-linear-gradient(0deg, transparent 0 30px, ${hexToRgba(theme.palette.line, 0.8)} 30px 31px), repeating-linear-gradient(90deg, transparent 0 30px, ${hexToRgba(theme.palette.line, 0.55)} 30px 31px), ${hexToRgba(theme.palette.surfaceAlt, 0.95)}`
            : `radial-gradient(circle at 30% 25%, ${hexToRgba(
                theme.palette.accent,
                0.12,
              )}, transparent 28%), linear-gradient(180deg, ${hexToRgba(
                theme.palette.surfaceAlt,
                0.98,
              )}, ${hexToRgba(theme.palette.bg, 0.88)})`,
      }}
    >
      <div
        className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.26em]"
        style={{
          color: theme.palette.muted,
          fontFamily: theme.fonts.body,
        }}
      >
        <span>Step Visualiser</span>
        <span>Move 03</span>
      </div>
      <svg viewBox="0 0 440 320" className="h-[280px] w-full">
        {graphEdges.map((edge) => {
          const from = graphNodes.find((node) => node.id === edge.from);
          const to = graphNodes.find((node) => node.id === edge.to);

          if (!from || !to) {
            return null;
          }

          return (
            <g key={`${edge.from}-${edge.to}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={edge.active ? theme.palette.accent : hexToRgba(theme.palette.muted, 0.28)}
                strokeWidth={edge.active ? 2.6 : 1.2}
                opacity={edge.active ? 0.82 : 0.45}
              />
              <text
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2 - 8}
                textAnchor="middle"
                fontSize="10"
                fill={theme.palette.muted}
                style={{ fontFamily: theme.fonts.mono }}
              >
                {edge.weight}
              </text>
            </g>
          );
        })}

        {graphNodes.map((node) => {
          const fill = node.team === "a" ? theme.palette.teamA : theme.palette.teamB;
          const halo = node.id === 6 || node.id === 4;

          return (
            <g key={node.id}>
              {halo ? (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={25}
                  fill="none"
                  stroke={theme.palette.accent}
                  strokeWidth={3}
                  opacity={0.7}
                />
              ) : null}
              <circle cx={node.x} cy={node.y} r={20} fill={fill} />
              <circle
                cx={node.x}
                cy={node.y}
                r={20}
                fill="none"
                stroke={hexToRgba("#FFFFFF", 0.86)}
                strokeWidth={2}
              />
              <text
                x={node.x}
                y={node.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="#FFFFFF"
                style={{ fontFamily: theme.fonts.mono, fontWeight: 700 }}
              >
                {node.id}
              </text>
            </g>
          );
        })}
      </svg>
      <div
        className="mt-3 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.2em]"
        style={{ color: theme.palette.muted, fontFamily: theme.fonts.body }}
      >
        <span className="inline-flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: theme.palette.teamA }}
          />
          Team 1
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: theme.palette.teamB }}
          />
          Team 2
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: theme.palette.accent }}
          />
          Current move
        </span>
      </div>
    </div>
  );
}

function ThemePreviewSection({ theme }: { theme: ThemePreview }) {
  return (
    <section
      className="overflow-hidden rounded-[32px] border p-6 md:p-8"
      style={{
        color: theme.palette.ink,
        backgroundImage: theme.backdrop,
        borderColor: theme.palette.line,
        boxShadow: `0 28px 70px ${hexToRgba(theme.palette.bg, 0.22)}`,
        fontFamily: theme.fonts.body,
      }}
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.28em]"
              style={{
                backgroundColor: theme.palette.accentSoft,
                color: theme.palette.accent,
                border: `1px solid ${hexToRgba(theme.palette.accent, 0.34)}`,
              }}
            >
              Theme Preview
            </span>
            <span
              className="text-[12px] uppercase tracking-[0.26em]"
              style={{ color: theme.palette.muted }}
            >
              Best for {theme.bestFor.toLowerCase()}
            </span>
          </div>
          <div className="space-y-2">
            <h2
              className="text-3xl md:text-4xl"
              style={{
                fontFamily: theme.fonts.display,
                letterSpacing: theme.id === "algorithm-atelier" ? "-0.03em" : "0.02em",
                textTransform: theme.id === "algorithm-atelier" ? "none" : "uppercase",
                fontWeight: theme.id === "algorithm-atelier" ? 600 : 700,
              }}
            >
              {theme.name}
            </h2>
            <p className="max-w-2xl text-sm md:text-base" style={{ color: theme.palette.muted }}>
              {theme.mood}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Surface theme={theme} className="px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: theme.palette.muted }}>
              Graph
            </div>
            <div
              className="mt-2 text-xl font-semibold"
              style={{ fontFamily: theme.fonts.mono }}
            >
              7 Players
            </div>
          </Surface>
          <Surface theme={theme} className="px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: theme.palette.muted }}>
              Live Focus
            </div>
            <div className="mt-2 text-xl font-semibold">Algorithm stage</div>
          </Surface>
          <Surface theme={theme} className="px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: theme.palette.muted }}>
              Best Pages
            </div>
            <div className="mt-2 text-sm font-semibold">{theme.pageEmphasis.join(" / ")}</div>
          </Surface>
        </div>
      </div>

      <Surface theme={theme} className="overflow-hidden">
        <div
          className="border-b px-5 py-4"
          style={{
            borderColor: theme.palette.line,
            background: `linear-gradient(180deg, ${hexToRgba(theme.palette.surfaceAlt, 0.95)}, ${hexToRgba(
              theme.palette.surface,
              0.8,
            )})`,
          }}
        >
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div
                className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.28em]"
                style={{
                  backgroundColor: hexToRgba(theme.palette.accent, 0.12),
                  color: theme.palette.accent,
                }}
              >
                Matchmaking Lab
              </div>
              <div
                className="text-sm"
                style={{
                  color: theme.palette.muted,
                  fontFamily: theme.fonts.mono,
                }}
              >
                Graph loaded / Local Search Best / Ready
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {navItems.map((item, index) => (
                <button
                  key={item}
                  className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em]"
                  style={{
                    border: `1px solid ${
                      index === 3 ? hexToRgba(theme.palette.accent, 0.4) : theme.palette.line
                    }`,
                    backgroundColor:
                      index === 3 ? hexToRgba(theme.palette.accent, 0.12) : "transparent",
                    color: index === 3 ? theme.palette.accent : theme.palette.muted,
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
          <div className="space-y-5">
            <MiniGraph theme={theme} />

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
              <Surface theme={theme} className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div
                      className="text-[11px] uppercase tracking-[0.24em]"
                      style={{ color: theme.palette.muted }}
                    >
                      Compare View
                    </div>
                    <h3
                      className="mt-2 text-lg font-semibold"
                      style={{ fontFamily: theme.fonts.display }}
                    >
                      Algorithm ranking at a glance
                    </h3>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.22em]"
                    style={{
                      backgroundColor: hexToRgba(theme.palette.success, 0.14),
                      color: theme.palette.success,
                    }}
                  >
                    Best score detected
                  </span>
                </div>
                <div className="overflow-hidden rounded-[18px] border" style={{ borderColor: theme.palette.line }}>
                  <table className="w-full text-left text-sm">
                    <thead
                      style={{
                        backgroundColor: hexToRgba(theme.palette.accent, 0.08),
                        color: theme.palette.muted,
                      }}
                    >
                      <tr>
                        <th className="px-3 py-3 font-medium">Algorithm</th>
                        <th className="px-3 py-3 font-medium">Score</th>
                        <th className="px-3 py-3 font-medium">Runtime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleRows.map((row, index) => (
                        <tr
                          key={row.name}
                          style={{
                            borderTop: `1px solid ${theme.palette.line}`,
                            backgroundColor:
                              index === 1 ? hexToRgba(theme.palette.accent, 0.08) : "transparent",
                          }}
                        >
                          <td className="px-3 py-3">{row.name}</td>
                          <td
                            className="px-3 py-3"
                            style={{ fontFamily: theme.fonts.mono, fontWeight: 600 }}
                          >
                            {row.score}
                          </td>
                          <td
                            className="px-3 py-3"
                            style={{ color: theme.palette.muted, fontFamily: theme.fonts.mono }}
                          >
                            {row.runtime}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Surface>

              <Surface theme={theme} alt className="p-4">
                <div
                  className="text-[11px] uppercase tracking-[0.24em]"
                  style={{ color: theme.palette.muted }}
                >
                  Graph Builder
                </div>
                <h3
                  className="mt-2 text-lg font-semibold"
                  style={{ fontFamily: theme.fonts.display }}
                >
                  Input + performance risk
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {["Player 1", "Player 2", "Score"].map((label, index) => (
                    <div key={label}>
                      <div className="mb-1 text-xs uppercase tracking-[0.18em]" style={{ color: theme.palette.muted }}>
                        {label}
                      </div>
                      <div
                        className="rounded-2xl border px-3 py-3 text-sm"
                        style={{
                          borderColor: theme.palette.line,
                          backgroundColor: hexToRgba(theme.palette.bg, 0.12),
                        }}
                      >
                        {index === 0 ? "0" : index === 1 ? "4" : "4.0"}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{
                      backgroundColor: theme.palette.accent,
                      color: theme.id === "algorithm-atelier" ? "#171717" : "#081018",
                    }}
                  >
                    Add Edge
                  </button>
                  <button
                    className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{
                      borderColor: theme.palette.line,
                      color: theme.palette.ink,
                    }}
                  >
                    Generate Sample Graph
                  </button>
                </div>
                <div
                  className="mt-5 rounded-[18px] border px-4 py-4"
                  style={{
                    borderColor: theme.palette.line,
                    backgroundColor: hexToRgba(theme.palette.warning, 0.1),
                  }}
                >
                  <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: theme.palette.muted }}>
                    Exhaustive estimate
                  </div>
                  <div className="mt-2 flex items-end justify-between gap-4">
                    <div
                      className="text-2xl font-semibold"
                      style={{ fontFamily: theme.fonts.mono }}
                    >
                      ~43 ms
                    </div>
                    <div className="text-sm" style={{ color: theme.palette.muted }}>
                      2<sup>7</sup> subsets
                    </div>
                  </div>
                </div>
              </Surface>
            </div>
          </div>

          <div className="space-y-5">
            <Surface theme={theme} className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className="text-[11px] uppercase tracking-[0.24em]"
                    style={{ color: theme.palette.muted }}
                  >
                    Dashboard
                  </div>
                  <h3
                    className="mt-2 text-lg font-semibold"
                    style={{ fontFamily: theme.fonts.display }}
                  >
                    Run one algorithm cleanly
                  </h3>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.22em]"
                  style={{
                    backgroundColor: hexToRgba(theme.palette.success, 0.14),
                    color: theme.palette.success,
                  }}
                >
                  Recommended
                </span>
              </div>
              <div className="mt-4 grid gap-3">
                {[
                  "Algorithm / Local Search (Best)",
                  "Initial Team / 0, 5",
                  "Graph Status / Loaded with 10 edges",
                ].map((item) => {
                  const [label, value] = item.split(" / ");

                  return (
                    <div
                      key={item}
                      className="rounded-[18px] border px-4 py-3"
                      style={{
                        borderColor: theme.palette.line,
                        backgroundColor: hexToRgba(theme.palette.bg, 0.12),
                      }}
                    >
                      <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: theme.palette.muted }}>
                        {label}
                      </div>
                      <div className="mt-1 font-semibold">{value}</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div
                  className="rounded-[20px] border p-4"
                  style={{
                    borderColor: hexToRgba(theme.palette.teamA, 0.3),
                    backgroundColor: hexToRgba(theme.palette.teamA, 0.1),
                  }}
                >
                  <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: theme.palette.muted }}>
                    Team 1
                  </div>
                  <div className="mt-2 text-xl font-semibold" style={{ fontFamily: theme.fonts.mono }}>
                    [0, 2, 5, 6]
                  </div>
                </div>
                <div
                  className="rounded-[20px] border p-4"
                  style={{
                    borderColor: hexToRgba(theme.palette.teamB, 0.3),
                    backgroundColor: hexToRgba(theme.palette.teamB, 0.1),
                  }}
                >
                  <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: theme.palette.muted }}>
                    Team 2
                  </div>
                  <div className="mt-2 text-xl font-semibold" style={{ fontFamily: theme.fonts.mono }}>
                    [1, 3, 4]
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div
                  className="rounded-[20px] border p-4"
                  style={{
                    borderColor: theme.palette.line,
                    backgroundColor: hexToRgba(theme.palette.accent, 0.08),
                  }}
                >
                  <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: theme.palette.muted }}>
                    Score
                  </div>
                  <div className="mt-1 text-3xl font-semibold" style={{ fontFamily: theme.fonts.mono }}>
                    20.0
                  </div>
                </div>
                <div
                  className="rounded-[20px] border p-4"
                  style={{
                    borderColor: theme.palette.line,
                    backgroundColor: hexToRgba(theme.palette.bg, 0.12),
                  }}
                >
                  <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: theme.palette.muted }}>
                    Runtime
                  </div>
                  <div className="mt-1 text-3xl font-semibold" style={{ fontFamily: theme.fonts.mono }}>
                    6 ms
                  </div>
                </div>
              </div>
            </Surface>

            <Surface theme={theme} alt className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className="text-[11px] uppercase tracking-[0.24em]"
                    style={{ color: theme.palette.muted }}
                  >
                    Step Timeline
                  </div>
                  <h3
                    className="mt-2 text-lg font-semibold"
                    style={{ fontFamily: theme.fonts.display }}
                  >
                    How the algorithm should be seen
                  </h3>
                </div>
                <div
                  className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.2em]"
                  style={{ borderColor: theme.palette.line, color: theme.palette.muted }}
                >
                  Playback first
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {sampleSteps.map((step, index) => (
                  <div
                    key={step.step}
                    className="flex items-center gap-3 rounded-[18px] border px-4 py-3"
                    style={{
                      borderColor: index === 3 ? hexToRgba(theme.palette.accent, 0.4) : theme.palette.line,
                      backgroundColor:
                        index === 3 ? hexToRgba(theme.palette.accent, 0.1) : hexToRgba(theme.palette.bg, 0.12),
                    }}
                  >
                    <div
                      className="rounded-full px-2.5 py-1 text-xs"
                      style={{
                        backgroundColor: hexToRgba(theme.palette.accent, 0.14),
                        color: theme.palette.accent,
                        fontFamily: theme.fonts.mono,
                      }}
                    >
                      {step.step}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{step.action}</div>
                    </div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: theme.palette.ink, fontFamily: theme.fonts.mono }}
                    >
                      {step.score}
                    </div>
                  </div>
                ))}
              </div>
            </Surface>
          </div>
        </div>
      </Surface>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Surface theme={theme} className="p-4">
          <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: theme.palette.muted }}>
            Why it fits the product
          </div>
          <p className="mt-2 text-sm leading-6">{theme.bestFor}</p>
        </Surface>
        <Surface theme={theme} className="p-4">
          <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: theme.palette.muted }}>
            Design caution
          </div>
          <p className="mt-2 text-sm leading-6">{theme.caution}</p>
        </Surface>
      </div>
    </section>
  );
}

export default function DesignLab() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-black px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white">
              Design Lab
            </span>
            <span className="text-sm text-gray-600">
              Previewing themes before touching the real product flows
            </span>
          </div>
          <div className="max-w-4xl space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
              Wireframed directions for an algorithm-visualisation product
            </h1>
            <p className="max-w-3xl text-base leading-7 text-gray-600 sm:text-lg">
              Since the app exists to let people see the matchmaking algorithms work,
              each concept is centered around the same priorities: a strong graph stage,
              readable score and runtime output, obvious algorithm controls, and a
              step-by-step story that helps the user understand the result instead of
              just receiving it.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Big visual stage for the graph and current move",
              "Persistent context for algorithm, graph status, and performance risk",
              "Readable compare + timeline views so the logic stays understandable",
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm leading-6 text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </header>

        <div className="grid gap-4 rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm lg:grid-cols-4">
          {themes.map((theme) => (
            <div key={theme.id} className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-[11px] uppercase tracking-[0.25em] text-gray-500">Quick read</div>
              <h2 className="mt-2 text-lg font-semibold text-gray-950">{theme.name}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">{theme.bestFor}</p>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          {themes.map((theme) => (
            <ThemePreviewSection key={theme.id} theme={theme} />
          ))}
        </div>
      </div>
    </div>
  );
}
