import { Link } from "react-router-dom";
import { getPlayerName } from "../utils/playerNames";

const workflowCards = [
  {
    title: "Graph Builder",
    description:
      "Load pairwise player synergy as a weighted graph and estimate runtime before you run.",
    cta: "Open Builder",
    to: "/graph-builder",
  },
  {
    title: "Dashboard",
    description:
      "Run one algorithm at a time, seed an initial team, and inspect the resulting split.",
    cta: "Run A Match",
    to: "/dashboard",
  },
  {
    title: "Compare",
    description:
      "Benchmark score and runtime side by side to see how local search stacks up against exhaustive search.",
    cta: "Compare Modes",
    to: "/compare",
  },
  {
    title: "Visualise",
    description:
      "Replay the search step by step and see the graph evolve as players are added or removed.",
    cta: "Watch Replay",
    to: "/visualise",
  },
];

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

const algorithmCards = [
  {
    name: "Local Search (First)",
    complexity: "O(n²)",
    summary:
      "Takes the first improving move it finds, making it quick and intuitive to trace.",
    accentColor: "#7dd3fc",
  },
  {
    name: "Local Search (Best)",
    complexity: "O(n²)",
    summary:
      "Evaluates every one-step improvement and chooses the strongest move available.",
    accentColor: "#67e8f9",
  },
  {
    name: "Guaranteed Best",
    complexity: "O(2^n)",
    summary:
      "Explores every possible team split to provide the optimal benchmark for comparison.",
    accentColor: "#fcd34d",
  },
];

const systemNotes = [
  "Java algorithm core with graph-based team scoring",
  "Spring Boot API for graph loading, runs, comparisons, and step traces",
  "React + TypeScript interface for exploration and visual explanation",
  "Runtime, score, and team output surfaced for portfolio-ready analysis",
];

const spotlightNodes = [
  { id: 0, x: 160, y: 32, fill: "#38bdf8" },
  { id: 1, x: 246, y: 70, fill: "#38bdf8" },
  { id: 2, x: 282, y: 154, fill: "#38bdf8" },
  { id: 3, x: 240, y: 240, fill: "#ef4444" },
  { id: 4, x: 160, y: 278, fill: "#ef4444" },
  { id: 5, x: 78, y: 242, fill: "#ef4444" },
  { id: 6, x: 36, y: 154, fill: "#38bdf8" },
  { id: 7, x: 76, y: 70, fill: "#ef4444" },
];

const spotlightEdges = [
  [0, 2],
  [0, 3],
  [0, 5],
  [1, 3],
  [1, 4],
  [2, 4],
  [2, 6],
  [3, 6],
  [4, 7],
  [5, 1],
  [6, 1],
  [7, 2],
] as const;

export default function Landing() {
  return (
    <div className="theme-page theme-home space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-10">
          <p className="theme-kicker">
            Portfolio Project • Graph Search • FPS Team Balance
          </p>

          <div className="space-y-6">
            <h1 className="theme-title">MatchMatrix</h1>
            <p className="max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
              A hands-on way to explore how team-balancing algorithms work in
              First-Person Shooter games.
            </p>

            <p className="theme-subtitle">
              MatchMatrix is a technical full-stack portfolio app built on top
              of a data structures and algorithms project I originally started
              while learning about graphs. I later expanded it into a sandbox
              for exploring new DSA concepts, applying them to matchmaking
              problems, and visualising the results.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/graph-builder"
              className="theme-btn-primary px-5 py-3 text-sm"
            >
              Start With Graph Builder
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

        <div className="theme-panel theme-home-stage rounded-[30px] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="theme-section-title">Quick Preview</p>
              <p className="mt-2 text-xl font-semibold text-white">
                See how MatchMatrix turns a group of players into two possible
                teams.
              </p>
            </div>
            <span className="theme-home-tag">Visual Guide</span>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="theme-panel-subtle rounded-[24px] p-4">
              <svg viewBox="0 0 320 310" className="h-auto w-full">
                {spotlightEdges.map(([start, end], index) => {
                  const from = spotlightNodes[start];
                  const to = spotlightNodes[end];
                  return (
                    <line
                      key={index}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="#20314b"
                      strokeWidth="2"
                      opacity="0.9"
                    />
                  );
                })}
                {spotlightNodes.map((node) => (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="22"
                      fill="rgba(255,255,255,0.08)"
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="19"
                      fill={node.fill}
                      stroke="white"
                      strokeWidth="3"
                    />
                    <text
                      x={node.x}
                      y={node.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="9"
                      fontWeight="700"
                    >
                      {getPlayerName(node.id)}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {previewCards.map((card) => (
                <div
                  key={card.label}
                  className="theme-panel-subtle rounded-2xl p-4"
                >
                  <p className="theme-label">{card.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {card.title}
                  </p>
                  <p className="theme-note mt-2 text-sm">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="max-w-3xl">
          <p className="theme-section-title">Core Workflows</p>
          <h2 className="mt-3 text-3xl font-bold text-white">
            From graph to replay in four steps.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workflowCards.map((card) => (
            <div key={card.title} className="theme-panel rounded-[24px] p-5">
              <p className="theme-label">Workflow</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                {card.title}
              </h3>
              <p className="theme-note mt-3 text-sm leading-7">
                {card.description}
              </p>
              <Link
                to={card.to}
                className="theme-btn-secondary mt-6 inline-flex px-4 py-2 text-sm"
              >
                {card.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="theme-panel rounded-[28px] p-6">
          <p className="theme-section-title">Algorithms</p>
          <h2 className="mt-3 text-3xl font-bold text-white">
            The various approaches to search for the strongest team split.
          </h2>
          <div className="mt-6 grid gap-4">
            {algorithmCards.map((card) => (
              <div
                key={card.name}
                className="theme-panel-subtle rounded-[22px] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-2xl font-semibold text-white">
                    {card.name}
                  </h3>
                  <span
                    className="theme-home-tag"
                    style={{ color: card.accentColor }}
                  >
                    {card.complexity}
                  </span>
                </div>
                <p className="theme-note mt-3 text-sm leading-7">
                  {card.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="theme-panel rounded-[28px] p-6">
          <p className="theme-section-title">Under The Hood</p>
          <h2 className="mt-3 text-3xl font-bold text-white">
            Built to showcase algorithm design and full-stack delivery.
          </h2>
          <div className="mt-6 space-y-3">
            {systemNotes.map((note) => (
              <div key={note} className="theme-home-note rounded-2xl px-4 py-4">
                <p className="text-base font-medium text-white">{note}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
