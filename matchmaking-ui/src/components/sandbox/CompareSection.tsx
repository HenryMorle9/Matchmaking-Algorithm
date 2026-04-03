import { useState } from "react";
import { compareAlgorithms } from "../../api/matchmaking";
import type { MatchmakingResult } from "../../types/matchmaking";

const ALGORITHM_LABELS: Record<string, string> = {
  localSearchFirst: "Local Search (First)",
  localSearchBest: "Local Search (Best)",
  guaranteedBestTeam: "Guaranteed Best (Exhaustive)",
};

interface Props {
  initialTeam: string;
}

export default function CompareSection({ initialTeam }: Props) {
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

  const bestScore = results.length > 0
    ? Math.max(...results.map((r) => r.score))
    : 0;
  const fastestTime = results.length > 0
    ? Math.min(...results.map((r) => r.runtimeMs))
    : 0;

  return (
    <div className="space-y-4">
      <button
        onClick={handleCompare}
        disabled={loading}
        className="theme-btn-primary px-6 py-2 text-sm disabled:opacity-50"
      >
        {loading ? "Comparing..." : "Compare All"}
      </button>

      {loading && (
        <div>
          <p className="theme-note mb-2 text-sm">
            Running all three algorithms — exhaustive search may take a while on large graphs...
          </p>
          <div className="theme-loading-track h-2 w-full overflow-hidden rounded-full">
            <div className="theme-loading-fill h-full w-full animate-pulse rounded-full" />
          </div>
        </div>
      )}

      {error && <p className="theme-error text-sm">{error}</p>}

      {results.length > 0 && (
        <div className="theme-panel overflow-hidden rounded-xl">
          <table className="theme-table w-full text-left text-sm">
            <thead className="theme-card-header">
              <tr>
                <th className="px-4 py-3">Algorithm</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Runtime</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr
                  key={r.algorithm}
                  className="theme-divider border-b"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {ALGORITHM_LABELS[r.algorithm] ?? r.algorithm}
                  </td>
                  <td className="theme-mono px-4 py-3">
                    [{r.team.join(", ")}]
                  </td>
                  <td className="px-4 py-3 font-bold text-white">
                    {Math.round(r.score * 100) / 100}
                    {r.score === bestScore && (
                      <span className="theme-chip-success ml-2">
                        Most Accurate
                      </span>
                    )}
                  </td>
                  <td className="theme-mono px-4 py-3">
                    {r.runtimeMs} ms
                    {r.runtimeMs === fastestTime && (
                      <span className="theme-chip-info ml-2">
                        Fastest
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
