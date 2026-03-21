import { useState } from "react";
import { runAlgorithm } from "../api/matchmaking";
import type { MatchmakingResult } from "../types/matchmaking";

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

  async function handleRun() {
    setLoading(true);
    setError("");
    setResult(null);

    // Parse initial team — "0, 5" becomes [0, 5], empty string becomes []
    const team = initialTeam
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map(Number);

    try {
      const res = await runAlgorithm({ algorithm, initialTeam: team });
      setResult(res);
    } catch {
      setError("Failed to run algorithm. Is the API running? Did you load a graph first?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Matchmaking Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Pick an algorithm, set an optional starting team, and run it against
        your loaded graph.
      </p>

      {/* Controls */}
      <div className="mt-6 flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Algorithm
          </label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="mt-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            {ALGORITHMS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Initial Team (optional)
          </label>
          <input
            type="text"
            value={initialTeam}
            onChange={(e) => setInitialTeam(e.target.value)}
            placeholder="e.g. 0, 5"
            className="mt-1 w-40 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <button
          onClick={handleRun}
          disabled={loading}
          className="rounded bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Running..." : "Run"}
        </button>
      </div>

      {/* Loading bar */}
      {loading && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">
            Running algorithm — exhaustive search may take a while on large graphs...
          </p>
          <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div className="h-full rounded-full bg-blue-600 animate-pulse w-full" />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      )}

      {/* Result card */}
      {result && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            {ALGORITHMS.find((a) => a.value === result.algorithm)?.label ?? result.algorithm}
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Team</p>
              <p className="text-xl font-bold text-gray-900">
                [{result.team.join(", ")}]
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Score</p>
              <p className="text-xl font-bold text-gray-900">{result.score}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Runtime</p>
              <p className="text-xl font-bold text-gray-900">
                {result.runtimeMs} ms
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
