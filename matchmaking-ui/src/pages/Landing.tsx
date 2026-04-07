import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getPlayerName } from "../utils/playerNames";
import { TEAM_COLORS } from "../constants/colors";
import RotatingText from "../components/RotatingText";

const workflowCards = [
  {
    step: "01",
    title: "Graph Builder",
    description:
      "Load pairwise player synergy as a weighted graph and estimate runtime before you run.",
    cta: "Open Builder",
    to: "/graph-builder",
  },
  {
    step: "02",
    title: "Dashboard",
    description:
      "Run one algorithm at a time, seed an initial team, and inspect the resulting split.",
    cta: "Run A Match",
    to: "/dashboard",
  },
  {
    step: "03",
    title: "Compare",
    description:
      "Benchmark score and runtime side by side to see how local search stacks up against exhaustive search.",
    cta: "Compare Modes",
    to: "/compare",
  },
  {
    step: "04",
    title: "Visualise",
    description:
      "Replay the search step by step and see the graph evolve as players are added or removed.",
    cta: "Watch Replay",
    to: "/visualise",
  },
];

const HERO_PREFIX = ["Explore", "how", "graph-based", "algorithms"];
const HERO_SUFFIXES = [
  ["balance", "teams", "in", "FPS", "matchmaking."],
  ["evaluate", "player", "synergy", "across", "matches."],
];

const initialNodes = [
  { id: 0, x: 160, y: 32, fill: TEAM_COLORS.team1 },
  { id: 1, x: 246, y: 70, fill: TEAM_COLORS.team1 },
  { id: 2, x: 282, y: 154, fill: TEAM_COLORS.team1 },
  { id: 3, x: 240, y: 240, fill: TEAM_COLORS.team2 },
  { id: 4, x: 160, y: 278, fill: TEAM_COLORS.team2 },
  { id: 5, x: 78, y: 242, fill: TEAM_COLORS.team2 },
  { id: 6, x: 36, y: 154, fill: TEAM_COLORS.team1 },
  { id: 7, x: 76, y: 70, fill: TEAM_COLORS.team2 },
];

const spotlightEdges = [
  [0, 2], [0, 3], [0, 5], [1, 3], [1, 4],
  [2, 4], [2, 6], [3, 6], [4, 7], [5, 1],
  [6, 1], [7, 2],
] as const;

const previewCards = [
  {
    label: "Players",
    title: "Each circle is a player",
    description:
      "Every node is a player in the lobby waiting to be sorted into one of two teams.",
  },
  {
    label: "Connections",
    title: "Lines are synergy scores",
    description:
      "Each edge carries a weight based on how well two players have performed together in past matches.",
  },
  {
    label: "Team Split",
    title: "Colours show the split",
    description:
      "Blue and red mark opposite teams. The algorithm places high-synergy players on opposing sides for a balanced match.",
  },
];

export default function Landing() {
  const [nodes, setNodes] = useState(initialNodes);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Node cycling: randomly swap 1-2 nodes between teams every 2s
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setNodes((prev) => {
        const next = [...prev];
        const swapCount = Math.random() < 0.5 ? 1 : 2;
        for (let s = 0; s < swapCount; s++) {
          const idx = Math.floor(Math.random() * next.length);
          const node = next[idx];
          next[idx] = {
            ...node,
            fill:
              node.fill === TEAM_COLORS.team1
                ? TEAM_COLORS.team2
                : TEAM_COLORS.team1,
          };
        }
        return next;
      });
    }, 2000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="theme-page theme-home space-y-16">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-6">
          <p className="theme-kicker animate-fade-in">
            Graph-Based Matchmaking
          </p>

          <div className="space-y-4">
            <h1 className="theme-title animate-fade-in-up delay-1">
              Match<span className="text-[var(--color-accent)]">/</span>Matrix
            </h1>
            <RotatingText
              prefix={HERO_PREFIX}
              suffixes={HERO_SUFFIXES}
              className="animate-fade-in delay-2 max-w-4xl text-xl font-medium leading-relaxed theme-text-primary sm:text-2xl min-h-[4.1rem] sm:min-h-[5rem]"
              dynamicClassName="text-black"
            />
            <p className="theme-subtitle animate-fade-in delay-3">
              A technical portfolio app built on a data structures &amp; algorithms
              foundation. Load a player graph, run matchmaking algorithms, and
              visualise the results step by step.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 animate-slide-in-left delay-3">
            <Link
              to="/graph-builder"
              className="theme-btn-primary px-6 py-3 text-sm"
            >
              Start Building
            </Link>
            <Link
              to="/visualise"
              className="theme-btn-secondary px-5 py-3 text-sm"
            >
              Watch The Visualiser
            </Link>
            <Link
              to="/compare"
              className="theme-btn-secondary px-5 py-3 text-sm"
            >
              Compare Algorithms
            </Link>
          </div>
        </div>

        {/* ── Hero Preview Panel ─────────────────────── */}
        <div className="theme-panel theme-home-stage rounded p-5 animate-scale-in delay-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="theme-section-title">Quick Preview</p>
              <p className="mt-2 text-lg font-semibold theme-text-primary">
                See how MatchMatrix turns a group of players into two teams.
              </p>
            </div>
            <span className="theme-home-tag">Visual Guide</span>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="theme-panel-subtle rounded p-3">
              <svg viewBox="0 0 320 310" className="h-auto w-full">
                {spotlightEdges.map(([start, end], index) => {
                  const from = nodes[start];
                  const to = nodes[end];
                  const isCross = from.fill !== to.fill;
                  return (
                    <line
                      key={index}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={isCross ? TEAM_COLORS.crossTeamEdge : TEAM_COLORS.sameTeamEdge}
                      strokeWidth={isCross ? 1.5 : 1}
                      opacity={isCross ? 0.35 : 0.5}
                      className="transition-all duration-500"
                    />
                  );
                })}
                {nodes.map((node) => (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="22"
                      fill="rgba(0,0,0,0.04)"
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="18"
                      fill={node.fill}
                      stroke={node.fill === TEAM_COLORS.team2 ? TEAM_COLORS.team2Stroke : TEAM_COLORS.team1Stroke}
                      strokeWidth="2"
                      className="transition-all duration-500"
                    />
                    <text
                      x={node.x}
                      y={node.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="8.5"
                      fontWeight="700"
                      fontFamily="Inconsolata, monospace"
                    >
                      {getPlayerName(node.id)}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              {previewCards.map((card) => (
                <div
                  key={card.label}
                  className="theme-panel-subtle rounded p-3"
                >
                  <p className="theme-label">{card.label}</p>
                  <p className="mt-1.5 text-sm font-semibold theme-text-primary">
                    {card.title}
                  </p>
                  <p className="theme-note mt-1.5 text-xs leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Workflows ────────────────────────────────── */}
      <section className="space-y-6">
        <div className="max-w-3xl animate-fade-in">
          <p className="theme-section-title">Core Workflows</p>
          <h2 className="mt-3 text-2xl font-bold theme-text-primary">
            From graph to replay in four steps.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workflowCards.map((card, i) => (
            <div
              key={card.title}
              className={`theme-panel rounded p-5 animate-fade-in delay-${i + 1}`}
            >
              <span className="text-[var(--color-accent)] font-mono text-xs font-bold opacity-80">
                {card.step}
              </span>
              <h3 className="mt-2 text-lg font-bold theme-text-primary">
                {card.title}
              </h3>
              <p className="theme-note mt-3 text-sm leading-7">
                {card.description}
              </p>
              <Link
                to={card.to}
                className="theme-btn-secondary mt-5 inline-flex px-4 py-2 text-xs"
              >
                {card.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
