import { useRef, useState } from "react";
import { runAlgorithm } from "../api/matchmaking";
import type { MatchmakingResult } from "../types/matchmaking";
import GraphStatus from "../components/GraphStatus";

const ALGORITHMS = [
  { value: "localSearchFirst", label: "Local Search (First Improvement)" },
  { value: "localSearchBest", label: "Local Search (Best Improvement)" },
  { value: "guaranteedBestTeam", label: "Guaranteed Best Team (Exhaustive)" },
];

export default function Dashboard() {
  const [algorithm, setAlgorithm] = useState(ALGORITHMS[0].value);
  const [initialTeam, setInitialTeam] = useState("");
  const [result, setResult] = useState<MatchmakingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // AbortController lets us cancel an in-flight fetch request
  const abortControllerRef = useRef<AbortController | null>(null);

  async function handleRun() {
    setLoading(true);
    setError("");
    setResult(null);

    // Create a new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const team = initialTeam
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map(Number);

    try {
      const res = await runAlgorithm({ algorithm, initialTeam: team }, controller.signal);
      setResult(res);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Request cancelled.");
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
      <h1 className="theme-title">Matchmaking Dashboard</h1>
      <p className="theme-subtitle mt-3">
        Pick an algorithm, set an optional starting team, and run it against
        your loaded graph.
      </p>

      <GraphStatus />

      {/* How does this work? */}
      <details className="theme-panel-subtle rounded-xl px-5 py-4">
        <summary className="theme-label cursor-pointer select-none text-sm font-semibold">
          How does this work?
        </summary>
        <div className="mt-4 space-y-4 text-sm leading-relaxed">
          <div>
            <p className="font-semibold text-white">What is this?</p>
            <p className="theme-note mt-1">
              This page runs a single matchmaking algorithm to split your players into two balanced teams. The goal is to put players with high synergy on opposite teams, creating the most competitive match possible.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">The Algorithms</p>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="theme-panel rounded-lg p-3">
                <p className="font-semibold text-sky-300">Local Search (First)</p>
                <p className="theme-note mt-1">Tries swapping one player at a time. Takes the first swap that improves the score. Fast but may miss the best answer.</p>
              </div>
              <div className="theme-panel rounded-lg p-3">
                <p className="font-semibold text-sky-300">Local Search (Best)</p>
                <p className="theme-note mt-1">Also swaps one player at a time, but checks every possible swap and picks the best one each round. Slower but smarter.</p>
              </div>
              <div className="theme-panel rounded-lg p-3">
                <p className="font-semibold text-sky-300">Guaranteed Best (Exhaustive)</p>
                <p className="theme-note mt-1">Checks every possible team combination to find the absolute best split. Perfect results, but gets very slow with more than ~20 players.</p>
              </div>
            </div>
          </div>
          <div>
            <p className="font-semibold text-white">Tip</p>
            <p className="theme-note mt-1">
              The "Initial Team" field lets you choose which players start on Team 1. Try different starting teams with Local Search to see how the starting point affects the result.
            </p>
          </div>
        </div>
      </details>

      {/* Controls */}
      <div className="mt-6 flex gap-4 items-end">
        <div>
          <label className="theme-label block">
            Algorithm
          </label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="theme-input mt-2 rounded-lg px-3 py-2 text-sm"
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
        <div className="mt-4">
          <p className="theme-note mb-2 text-sm">
            Running algorithm — exhaustive search may take a while on large graphs...
          </p>
          <div className="theme-loading-track h-2 w-full overflow-hidden rounded-full">
            <div className="theme-loading-fill h-full w-full animate-pulse rounded-full" />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="theme-error mt-4 text-sm">{error}</p>
      )}

      {/* Result card */}
      {result && (
        <div className="theme-panel mt-6 rounded-xl p-6">
          <h2 className="theme-section-title">
            {ALGORITHMS.find((a) => a.value === result.algorithm)?.label ?? result.algorithm}
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <p className="theme-label">Team</p>
              <p className="theme-mono mt-2 text-xl font-bold text-white">
                [{result.team.join(", ")}]
              </p>
            </div>
            <div>
              <p className="theme-label">Score</p>
              <p className="mt-2 text-xl font-bold text-white">{result.score}</p>
            </div>
            <div>
              <p className="theme-label">Runtime</p>
              <p className="theme-mono mt-2 text-xl font-bold text-white">
                {result.runtimeMs} ms
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
