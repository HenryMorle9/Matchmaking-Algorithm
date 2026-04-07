import { useRef, useState } from "react";
import { runAlgorithm } from "../api/matchmaking";
import type { MatchmakingResult } from "../types/matchmaking";
import GraphStatus from "../components/GraphStatus";
import HelpAccordion from "../components/HelpAccordion";
import { ALGORITHMS } from "../constants/algorithms";
import { useGraph } from "../context/GraphContext";
import { parseTeamInput } from "../utils/parseTeamInput";
import { formatPlayerList, getPlayerName } from "../utils/playerNames";

export default function Dashboard() {
  const { allPlayers } = useGraph();
  const [algorithm, setAlgorithm] = useState<string>(ALGORITHMS[0].value);
  const [initialTeam, setInitialTeam] = useState("");
  const [result, setResult] = useState<MatchmakingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const abortControllerRef = useRef<AbortController | null>(null);
  const inputExample = [allPlayers[0] ?? 0, allPlayers[1] ?? 5]
    .map(getPlayerName)
    .join(", ");

  function formatScore(score: number) {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(score);
  }

  async function handleRun() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const team = parseTeamInput(initialTeam, allPlayers);
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const res = await runAlgorithm({ algorithm, initialTeam: team }, controller.signal);
      setResult(res);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Request cancelled.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to run algorithm. Is the API running? Did you load a graph first?");
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }

  function handleCancel() {
    abortControllerRef.current?.abort();
  }

  return (
    <div className="theme-page">
      <div className="animate-fade-in">
        <p className="theme-section-title">Execute</p>
        <h1 className="theme-title mt-2">Dashboard</h1>
        <p className="theme-subtitle mt-3">
          Pick an algorithm, set an optional starting team, and run it against
          your loaded graph.
        </p>
      </div>

      <div className="mt-4 animate-fade-in delay-1">
        <GraphStatus />
      </div>

      <div className="mt-4 animate-fade-in delay-2">
        <HelpAccordion>
          <p className="theme-help-copy">
            Run one algorithm on the loaded graph and inspect the split it produces.
          </p>
          <ul className="theme-help-list">
            <li><strong>First</strong>: stops at the first better swap.</li>
            <li><strong>Best</strong>: checks every swap before choosing.</li>
            <li><strong>Exhaustive</strong>: finds the exact split, but slows down above about 20 players.</li>
            <li><strong>Initial Team</strong>: only use it when you want to test a specific starting point.</li>
          </ul>
        </HelpAccordion>
      </div>

      {/* Controls */}
      <div className="mt-6 flex gap-4 items-end animate-fade-in delay-3">
        <div>
          <label className="theme-label block">
            Algorithm
          </label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="theme-input mt-2 rounded px-3 py-2 text-sm"
          >
            {ALGORITHMS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="theme-label block">
            Initial Team (optional)
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
        {loading && (
          <button
            onClick={handleCancel}
            className="theme-btn-danger px-4 py-2 text-sm"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Loading bar */}
      {loading && (
        <div className="mt-4 animate-fade-in">
          <p className="theme-note mb-2 text-sm">
            Running algorithm — exhaustive search may take a while on large graphs...
          </p>
          <div className="theme-loading-track h-1.5 w-full overflow-hidden rounded-sm">
            <div className="theme-loading-fill h-full w-full animate-pulse rounded-sm" />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="theme-error mt-4 text-sm">{error}</p>
      )}

      {/* Result card */}
      {result && (
        <div className="theme-panel mt-6 rounded p-6 animate-scale-in">
          <h2 className="theme-section-title">
            {ALGORITHMS.find((a) => a.value === result.algorithm)?.label ?? result.algorithm}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="theme-team-card theme-team-card--1 p-4">
              <p className="theme-label theme-team-value--1">Team 1 ({result.team.length})</p>
              <p className="theme-team-value--1 mt-2 text-lg font-bold leading-relaxed">
                {formatPlayerList(result.team)}
              </p>
            </div>
            <div className="theme-team-card theme-team-card--2 p-4">
              <p className="theme-label theme-team-value--2">Team 2 ({result.opposingTeam.length})</p>
              <p className="theme-team-value--2 mt-2 text-lg font-bold leading-relaxed">
                {formatPlayerList(result.opposingTeam)}
              </p>
            </div>
            <div className="theme-panel-subtle rounded p-4">
              <p className="theme-label">Score</p>
              <p className="mt-2 text-xl font-bold theme-text-primary">{formatScore(result.score)}</p>
            </div>
            <div className="theme-panel-subtle rounded p-4">
              <p className="theme-label">Runtime</p>
              <p className="theme-mono mt-2 text-xl font-bold theme-text-primary">
                {result.runtimeMs} ms
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
