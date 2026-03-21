import { useState } from "react";
import { compareAlgorithms } from "../api/matchmaking";
import type { MatchmakingResult } from "../types/matchmaking";

const ALGORITHM_LABELS: Record<string, string> = {
  localSearchFirst: "Local Search (First)",
  localSearchBest: "Local Search (Best)",
  guaranteedBestTeam: "Guaranteed Best (Exhaustive)",
};

export default function Compare() {
  const [initialTeam, setInitialTeam] = useState("");
  const [results, setResults] = useState<MatchmakingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCompare() {
    setLoading(true);
    setError("");
    setResults([]);

    const team = initialTeam
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map(Number);

    try {
      const res = await compareAlgorithms({
        algorithm: "compare",
        initialTeam: team,
      });
      setResults(res);
    } catch {
      setError("Failed to compare. Is the API running? Did you load a graph first?");
    } finally {
      setLoading(false);
    }
  }

  // Find the best score to highlight the winner
  const bestScore = results.length > 0
    ? Math.max(...results.map((r) => r.score))
    : 0;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Algorithm Comparison</h1>
      <p className="mt-2 text-gray-600">
        Run all three algorithms on the same graph and compare results side by
        side.
      </p>

      {/* Controls */}
      <div className="mt-6 flex gap-4 items-end">
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
          onClick={handleCompare}
          disabled={loading}
          className="rounded bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Comparing..." : "Compare All"}
        </button>
      </div>

      {loading && (
        <p className="mt-4 text-sm text-gray-500">
          Running all three algorithms — exhaustive search may take a while on large graphs...
        </p>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {/* Results table */}
      {results.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-500">Algorithm</th>
                <th className="px-4 py-3 font-medium text-gray-500">Team</th>
                <th className="px-4 py-3 font-medium text-gray-500">Score</th>
                <th className="px-4 py-3 font-medium text-gray-500">Runtime</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr
                  key={r.algorithm}
                  className={
                    r.score === bestScore
                      ? "bg-green-50 border-b border-green-100"
                      : "border-b border-gray-100"
                  }
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {ALGORITHM_LABELS[r.algorithm] ?? r.algorithm}
                    {r.score === bestScore && (
                      <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Best
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    [{r.team.join(", ")}]
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900">
                    {r.score}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{r.runtimeMs} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
