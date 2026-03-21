import { useState, useEffect, useRef } from "react";
import { runWithSteps } from "../api/matchmaking";
import type { Step, StepsResult, Edge } from "../types/matchmaking";

const ALGORITHM_OPTIONS = [
  { value: "localSearchFirst", label: "Local Search (First)" },
  { value: "localSearchBest", label: "Local Search (Best)" },
  { value: "guaranteedBestTeam", label: "Guaranteed Best (Exhaustive)" },
];

/** Lay nodes evenly around a circle. */
function circularLayout(nodeIds: number[], cx: number, cy: number, radius: number) {
  const positions: Record<number, { x: number; y: number }> = {};
  nodeIds.forEach((id, i) => {
    const angle = (2 * Math.PI * i) / nodeIds.length - Math.PI / 2;
    positions[id] = {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });
  return positions;
}

export default function Visualise() {
  const [algorithm, setAlgorithm] = useState("localSearchFirst");
  const [initialTeam, setInitialTeam] = useState("");
  const [result, setResult] = useState<StepsResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [edges, setEdges] = useState<Edge[]>([]);
  const [allPlayers, setAllPlayers] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch graph edges on mount so we can draw the graph
  useEffect(() => {
    fetch("/api/graph")
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.edges) {
          setEdges(data.edges);
          const players = new Set<number>();
          data.edges.forEach((e: Edge) => {
            players.add(e.p1);
            players.add(e.p2);
          });
          setAllPlayers([...players].sort((a, b) => a - b));
        }
      })
      .catch(() => {});
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (playing && result) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= result.steps.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, result]);

  async function handleRun() {
    setLoading(true);
    setError("");
    setResult(null);
    setCurrentStep(0);
    setPlaying(false);

    const team = initialTeam
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map(Number);

    try {
      // Refresh graph edges
      const graphRes = await fetch("/api/graph");
      if (graphRes.ok) {
        const graphData = await graphRes.json();
        if (graphData?.edges) {
          setEdges(graphData.edges);
          const players = new Set<number>();
          graphData.edges.forEach((e: Edge) => {
            players.add(e.p1);
            players.add(e.p2);
          });
          setAllPlayers([...players].sort((a, b) => a - b));
        }
      }

      const res = await runWithSteps({ algorithm, initialTeam: team });
      setResult(res);
    } catch {
      setError("Failed to run. Is the API running? Did you load a graph first?");
    } finally {
      setLoading(false);
    }
  }

  const step: Step | null = result ? result.steps[currentStep] : null;
  const positions = allPlayers.length > 0
    ? circularLayout(allPlayers, 350, 300, 240)
    : {};

  return (
    <div className="theme-page">
      <h1 className="theme-title">Step-by-Step Visualisation</h1>
      <p className="theme-subtitle mt-3">
        Watch how local search algorithms explore team splits move by move.
      </p>

      {/* Controls */}
      <div className="mt-6 flex gap-4 items-end flex-wrap">
        <div>
          <label className="theme-label block">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => { setAlgorithm(e.target.value); setResult(null); setCurrentStep(0); setPlaying(false); }}
            className="theme-input mt-2 rounded-lg px-3 py-2 text-sm"
          >
            {ALGORITHM_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="theme-label block">
            Initial Team
          </label>
          <input
            type="text"
            value={initialTeam}
            onChange={(e) => setInitialTeam(e.target.value)}
            placeholder="e.g. 0, 5"
            className="theme-input theme-mono mt-2 w-40 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <button
          onClick={handleRun}
          disabled={loading}
          className="theme-btn-primary px-6 py-2 text-sm disabled:opacity-50"
        >
          {loading ? "Running..." : "Run"}
        </button>
      </div>

      {error && <p className="theme-error mt-4 text-sm">{error}</p>}

      {/* Graph + Step info */}
      {result && step && (
        <div className="mt-6 flex gap-8 flex-wrap">
          {/* SVG Graph */}
          <div className="theme-panel theme-svg-panel rounded-xl p-4">
            <svg width={700} height={600} className="block">
              {/* Edges — faint by default, highlighted if crossing teams */}
              {edges.map((edge, i) => {
                const p1 = positions[edge.p1];
                const p2 = positions[edge.p2];
                if (!p1 || !p2) return null;
                const p1InT1 = step.team.includes(edge.p1);
                const p2InT1 = step.team.includes(edge.p2);
                const isCrossTeam = p1InT1 !== p2InT1;
                // Find which player just moved (compare action text)
                const movedPlayer = step.action.match(/player (\d+)/);
                const movedId = movedPlayer ? Number(movedPlayer[1]) : -1;
                const involvesMovedPlayer = edge.p1 === movedId || edge.p2 === movedId;
                // Position the weight label on the outside of the ring, near the other node
                const otherNode = edge.p1 === movedId ? p2 : p1;
                // Direction from center of ring outward through the other node
                const cx = 350, cy = 300;
                const dx = otherNode.x - cx;
                const dy = otherNode.y - cy;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const labelX = otherNode.x + (dx / dist) * 32;
                const labelY = otherNode.y + (dy / dist) * 32;
                return (
                  <g key={i}>
                    <line
                      x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                      stroke={involvesMovedPlayer ? "#f59e0b" : isCrossTeam ? "#38bdf8" : "#516179"}
                      strokeWidth={involvesMovedPlayer ? 2.5 : isCrossTeam ? 1.5 : 0.5}
                      opacity={involvesMovedPlayer ? 0.95 : isCrossTeam ? 0.6 : 0.2}
                      className="transition-all duration-500"
                    />
                    {involvesMovedPlayer && (
                      <text
                        x={labelX} y={labelY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={11}
                        fontWeight="bold"
                        className="select-none fill-amber-300"
                      >
                        {edge.score}
                      </text>
                    )}
                  </g>
                );
              })}
              {/* Nodes */}
              {allPlayers.map((id) => {
                const pos = positions[id];
                if (!pos) return null;
                const inTeam1 = step.team.includes(id);
                const inTeam2 = step.opposingTeam.includes(id);
                const movedPlayer = step.action.match(/player (\d+)/);
                const movedId = movedPlayer ? Number(movedPlayer[1]) : -1;
                const isMovedNode = id === movedId;
                const fill = inTeam1 ? "#3b82f6" : inTeam2 ? "#ef4444" : "#9ca3af";
                return (
                  <g key={id}>
                    {isMovedNode && (
                      <circle
                        cx={pos.x} cy={pos.y} r={28}
                        fill="none" stroke="#f59e0b" strokeWidth={3}
                        className="transition-all duration-500"
                      />
                    )}
                    <circle
                      cx={pos.x} cy={pos.y} r={22}
                      fill={fill}
                      stroke="white" strokeWidth={3}
                      className="transition-all duration-500"
                    />
                    <text
                      x={pos.x} y={pos.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white font-bold select-none"
                      fontSize={14}
                    >
                      {id}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="theme-legend mt-2 flex flex-wrap justify-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-blue-500" /> Team 1
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-red-500" /> Team 2
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-3 w-3 rounded-full bg-amber-400" /> Current move
              </span>
            </div>

            {/* Algorithm explanation for guaranteed */}
            {result?.algorithm === "guaranteedBestTeam" && (
              <div className="theme-info-banner mt-3 rounded-lg px-4 py-3 text-sm">
                <p className="font-semibold">Why only 2 steps?</p>
                <p className="mt-1">
                  The Guaranteed Best algorithm doesn't make moves like local search.
                  Instead, it tries <strong>every possible team combination</strong> (all
                  2<sup>n</sup> of them) and returns the one with the highest score.
                  There's no step-by-step decision process to visualise — just the
                  final optimal result. With {allPlayers.length} players, it checked{" "}
                  {(2 ** allPlayers.length).toLocaleString()} combinations to find this answer.
                </p>
              </div>
            )}
          </div>

          {/* Step info panel */}
          <div className="flex-1 min-w-[260px]">
            {/* Playback controls */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setCurrentStep(0)}
                disabled={currentStep === 0}
                className="theme-btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"
                title="Reset"
              >
                ⏮
              </button>
              <button
                onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                disabled={currentStep === 0}
                className="theme-btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"
                title="Previous step"
              >
                ◀
              </button>
              <button
                onClick={() => setPlaying(!playing)}
                className="theme-btn-primary px-4 py-1.5 text-sm"
              >
                {playing ? "⏸ Pause" : "▶ Play"}
              </button>
              <button
                onClick={() => setCurrentStep((s) => Math.min(result.steps.length - 1, s + 1))}
                disabled={currentStep >= result.steps.length - 1}
                className="theme-btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"
                title="Next step"
              >
                ▶
              </button>
              <button
                onClick={() => setCurrentStep(result.steps.length - 1)}
                disabled={currentStep >= result.steps.length - 1}
                className="theme-btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"
                title="Skip to end"
              >
                ⏭
              </button>
            </div>

            {/* Step progress bar */}
            <div className="mb-4">
              <div className="theme-note mb-1 flex justify-between text-xs">
                <span>Step {currentStep} of {result.steps.length - 1}</span>
                <span>{result.runtimeMs} ms total</span>
              </div>
              <div className="theme-loading-track h-2 w-full overflow-hidden rounded-full">
                <div
                  className="theme-loading-fill h-full rounded-full transition-all duration-300"
                  style={{ width: `${result.steps.length > 1 ? (currentStep / (result.steps.length - 1)) * 100 : 100}%` }}
                />
              </div>
            </div>

            {/* Current step details */}
            <div className="theme-panel-subtle space-y-3 rounded-xl p-4">
              <div>
                <span className="theme-label">Action</span>
                <p className="mt-2 text-lg font-semibold text-white">{step.action}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="theme-label">Team 1 (Blue)</span>
                  <p className="theme-mono mt-2 text-sm text-sky-100">[{step.team.join(", ")}]</p>
                </div>
                <div>
                  <span className="theme-label">Team 2 (Red)</span>
                  <p className="theme-mono mt-2 text-sm text-rose-100">[{step.opposingTeam.join(", ")}]</p>
                </div>
              </div>
              <div>
                <span className="theme-label">Score</span>
                <p className="mt-2 text-2xl font-bold text-white">
                  {Math.round(step.score * 100) / 100}
                </p>
              </div>
            </div>

            {/* Step history */}
            <div className="theme-panel mt-4 overflow-hidden rounded-xl">
              <table className="theme-table w-full text-sm">
                <thead className="theme-card-header">
                  <tr>
                    <th className="px-3 py-2 text-left">Step</th>
                    <th className="px-3 py-2 text-left">Action</th>
                    <th className="px-3 py-2 text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {result.steps.map((s, i) => (
                    <tr
                      key={i}
                      onClick={() => { setCurrentStep(i); setPlaying(false); }}
                      className={`theme-divider cursor-pointer border-t ${
                        i === currentStep ? "theme-row-active" : ""
                      }`}
                    >
                      <td className="theme-note px-3 py-2">{i}</td>
                      <td className="px-3 py-2">{s.action}</td>
                      <td className="theme-mono px-3 py-2 text-right text-white">
                        {Math.round(s.score * 100) / 100}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
