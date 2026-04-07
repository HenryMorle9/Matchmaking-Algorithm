import { useState, useEffect, useRef } from "react";
import { runWithSteps } from "../api/matchmaking";
import type { Step, StepsResult } from "../types/matchmaking";
import GraphStatus from "../components/GraphStatus";
import HelpAccordion from "../components/HelpAccordion";
import { ALGORITHMS } from "../constants/algorithms";
import { TEAM_COLORS } from "../constants/colors";
import { parseTeamInput } from "../utils/parseTeamInput";
import { useGraph } from "../context/GraphContext";
import {
  extractPlayerIdFromAction,
  formatPlayerAction,
  formatPlayerList,
  getPlayerName,
} from "../utils/playerNames";

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
  const { apiEdges: edges, allPlayers, refreshGraph } = useGraph();
  const [algorithm, setAlgorithm] = useState<string>("localSearchFirst");
  const [initialTeam, setInitialTeam] = useState("");
  const [result, setResult] = useState<StepsResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputExample = [allPlayers[0] ?? 0, allPlayers[1] ?? 5]
    .map(getPlayerName)
    .join(", ");

  function formatScore(score: number) {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(score);
  }

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

    try {
      const team = parseTeamInput(initialTeam, allPlayers);
      await refreshGraph();
      const res = await runWithSteps({ algorithm, initialTeam: team });
      setResult(res);
      setCurrentStep(res.algorithm === "guaranteedBestTeam" ? res.steps.length - 1 : 0);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to run. Is the API running? Did you load a graph first?");
      }
    } finally {
      setLoading(false);
    }
  }

  const step: Step | null = result ? result.steps[currentStep] : null;
  const movedId = step ? extractPlayerIdFromAction(step.action) : null;
  const positions = allPlayers.length > 0
    ? circularLayout(allPlayers, 350, 300, 240)
    : {};

  return (
    <div className="theme-page">
      <div className="animate-fade-in">
        <p className="theme-section-title">Replay</p>
        <h1 className="theme-title mt-2">Replay Search</h1>
        <p className="theme-subtitle mt-3">
          Step through each move and watch the split change.
        </p>
      </div>

      <div className="mt-4 animate-fade-in delay-1">
        <GraphStatus />
      </div>

      <div className="mt-4 animate-fade-in delay-2">
        <HelpAccordion>
          <p className="theme-help-copy">
            Replay how the algorithm changes the split over time.
          </p>
          <ul className="theme-help-list">
            <li><strong>Lines</strong> show synergy between players.</li>
            <li><strong>Gold edges</strong> mark the current move.</li>
            <li><strong>Exhaustive</strong> only shows start and end because it does not swap incrementally.</li>
          </ul>
        </HelpAccordion>
      </div>

      {/* Controls */}
      <div className="mt-6 flex gap-4 items-end flex-wrap animate-fade-in delay-3">
        <div>
          <label className="theme-label block">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => { setAlgorithm(e.target.value); setResult(null); setCurrentStep(0); setPlaying(false); }}
            className="theme-input mt-2 rounded px-3 py-2 text-sm"
          >
            {ALGORITHMS.map((opt) => (
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
            placeholder={`e.g. ${inputExample}`}
            className="theme-input mt-2 w-48 rounded px-3 py-2 text-sm"
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
        <div className="mt-6 flex gap-8 flex-wrap animate-fade-in">
          {/* SVG Graph */}
          <div className="theme-panel theme-svg-panel rounded p-4">
            <svg width={700} height={600} className="block">
              {/* Edges */}
              {edges.map((edge, i) => {
                const p1 = positions[edge.p1];
                const p2 = positions[edge.p2];
                if (!p1 || !p2) return null;
                const p1InT1 = step.team.includes(edge.p1);
                const p2InT1 = step.team.includes(edge.p2);
                const isCrossTeam = p1InT1 !== p2InT1;
                const involvesMovedPlayer = movedId !== null && (edge.p1 === movedId || edge.p2 === movedId);
                const otherNode = edge.p1 === movedId ? p2 : p1;
                const cx = 350, cy = 300;
                const dx = otherNode.x - cx;
                const dy = otherNode.y - cy;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const labelOffset = 48;
                const labelX = otherNode.x + (dx / dist) * labelOffset;
                const labelY = otherNode.y + (dy / dist) * labelOffset;
                return (
                  <g key={i}>
                    <line
                      x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                      stroke={involvesMovedPlayer ? TEAM_COLORS.highlight : isCrossTeam ? TEAM_COLORS.crossTeamEdge : TEAM_COLORS.sameTeamEdge}
                      strokeWidth={involvesMovedPlayer ? 2.5 : isCrossTeam ? 1.5 : 0.5}
                      opacity={involvesMovedPlayer ? 0.95 : isCrossTeam ? 0.4 : 0.2}
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
                const isMovedNode = id === movedId;
                const fill = inTeam1 ? TEAM_COLORS.team1 : inTeam2 ? TEAM_COLORS.team2 : TEAM_COLORS.neutral;
                const strokeColor = inTeam1 ? TEAM_COLORS.team1Stroke : inTeam2 ? TEAM_COLORS.team2Stroke : TEAM_COLORS.neutralStroke;
                return (
                  <g key={id}>
                    <title>{getPlayerName(id)}</title>
                    {isMovedNode && (
                      <circle
                        cx={pos.x} cy={pos.y} r={28}
                        fill="none" stroke={TEAM_COLORS.highlight} strokeWidth={3}
                        className="transition-all duration-500"
                      />
                    )}
                    <circle
                      cx={pos.x} cy={pos.y} r={22}
                      fill={fill}
                      stroke={strokeColor} strokeWidth={2}
                      className="transition-all duration-500"
                    />
                    <text
                      x={pos.x} y={pos.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white font-bold select-none"
                      fontSize={10}
                      fontFamily="Inconsolata, monospace"
                    >
                      {getPlayerName(id)}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="theme-legend mt-2 flex flex-wrap justify-center gap-5 text-xs font-mono uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-sm" style={{ background: TEAM_COLORS.team1 }} /> Team 1
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-sm" style={{ background: TEAM_COLORS.team2 }} /> Team 2
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm bg-amber-400" /> Current move
              </span>
            </div>

            {/* Algorithm explanation for guaranteed */}
            {result?.algorithm === "guaranteedBestTeam" && (
              <div className="theme-info-banner mt-3 rounded px-4 py-3 text-sm">
                <p className="font-semibold">Why only 2 steps?</p>
                <p className="mt-1">
                  Guaranteed Best does not make step-by-step swaps. It checks every
                  possible team split, then returns the best one. With {allPlayers.length} players,
                  that meant {(2 ** allPlayers.length).toLocaleString()} combinations.
                </p>
              </div>
            )}
          </div>

          {/* Step info panel */}
          <div className="flex-1 min-w-[260px]">
            {/* Playback controls */}
            <div className="flex items-center gap-2 mb-4">
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
              <div className="theme-note mb-1 flex justify-between text-xs font-mono">
                <span>Step {currentStep} / {result.steps.length - 1}</span>
                <span>{result.runtimeMs} ms total</span>
              </div>
              <div className="theme-loading-track h-1.5 w-full overflow-hidden rounded-sm">
                <div
                  className="theme-loading-fill h-full rounded-sm transition-all duration-300"
                  style={{ width: `${result.steps.length > 1 ? (currentStep / (result.steps.length - 1)) * 100 : 100}%` }}
                />
              </div>
            </div>

            {/* Current step details */}
            <div className="theme-panel-subtle space-y-3 rounded p-4">
              <div>
                <span className="theme-label">Action</span>
                <p className="mt-2 text-lg font-semibold theme-text-primary">{formatPlayerAction(step.action)}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="theme-label theme-team-value--1">Team 1</span>
                  <p className="theme-team-value--1 mt-2 text-sm">{formatPlayerList(step.team)}</p>
                </div>
                <div>
                  <span className="theme-label theme-team-value--2">Team 2</span>
                  <p className="theme-team-value--2 mt-2 text-sm">{formatPlayerList(step.opposingTeam)}</p>
                </div>
              </div>
              <div>
                <span className="theme-label">Score</span>
                <p className="mt-2 text-2xl font-bold theme-text-primary">
                  {formatScore(step.score)}
                </p>
              </div>
            </div>

            {/* Step history */}
            <div className="theme-panel mt-4 overflow-hidden rounded">
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
                      <td className="theme-note px-3 py-2 font-mono">{i}</td>
                      <td className="px-3 py-2">{formatPlayerAction(s.action)}</td>
                      <td className="theme-mono px-3 py-2 text-right theme-text-primary">
                        {formatScore(s.score)}
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
