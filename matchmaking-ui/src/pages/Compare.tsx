import { useState } from "react";
import { compareAlgorithms } from "../api/matchmaking";
import type { MatchmakingResult } from "../types/matchmaking";
import GraphStatus from "../components/GraphStatus";
import HelpAccordion from "../components/HelpAccordion";
import { ALGORITHM_LABELS } from "../constants/algorithms";
import { useGraph } from "../context/GraphContext";
import { parseTeamInput } from "../utils/parseTeamInput";
import { formatPlayerList, getPlayerName } from "../utils/playerNames";

export default function Compare() {
  const { allPlayers } = useGraph();
  const [initialTeam, setInitialTeam] = useState("");
  const [results, setResults] = useState<MatchmakingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputExample = [allPlayers[0] ?? 0, allPlayers[1] ?? 5]
    .map(getPlayerName)
    .join(", ");

  async function handleCompare() {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const team = parseTeamInput(initialTeam, allPlayers);
      const res = await compareAlgorithms({
        algorithm: "compare",
        initialTeam: team,
      });
      setResults(res);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to compare. Is the API running? Did you load a graph first?");
      }
    } finally {
      setLoading(false);
    }
  }

  // Find the best score and fastest runtime
  const bestScore = results.length > 0
    ? Math.max(...results.map((r) => r.score))
    : 0;
  const fastestTime = results.length > 0
    ? Math.min(...results.map((r) => r.runtimeMs))
    : 0;


  return (
    <div className="theme-page">
      <h1 className="theme-title">Algorithm Comparison</h1>
      <p className="theme-subtitle mt-3">
        Run all three algorithms on the same graph and compare results side by
        side.
      </p>

      <GraphStatus />

      {/* How does this work? */}
      <HelpAccordion>
          <div>
            <p className="font-semibold text-white">What is this?</p>
            <p className="theme-note mt-1">
              This page runs all three algorithms on the same graph and shows you how they compare. You'll see which one found the best team split (Most Accurate) and which one was quickest (Fastest).
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">Why do scores differ?</p>
            <p className="theme-note mt-1">
              Local Search algorithms take shortcuts — they're fast but can get stuck on a "good enough" answer. The Exhaustive algorithm checks everything and always finds the best answer, but takes much longer.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">Tip</p>
            <p className="theme-note mt-1">
              This is the best page to demonstrate the trade-off between speed and accuracy.
            </p>
          </div>
      </HelpAccordion>

      {/* Controls */}
      <div className="mt-6 flex gap-4 items-end">
        <div>
          <label className="theme-label block">
            Initial Team (optional)
          </label>
          <input
            type="text"
            value={initialTeam}
            onChange={(e) => setInitialTeam(e.target.value)}
            placeholder={`e.g. ${inputExample}`}
            className="theme-input mt-2 w-48 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <button
          onClick={handleCompare}
          disabled={loading}
          className="theme-btn-primary px-6 py-2 text-sm disabled:opacity-50"
        >
          {loading ? "Comparing..." : "Compare All"}
        </button>
      </div>

      {loading && (
        <div className="mt-4">
          <p className="theme-note mb-2 text-sm">
            Running all three algorithms — exhaustive search may take a while on large graphs...
          </p>
          <div className="theme-loading-track h-2 w-full overflow-hidden rounded-full">
            <div className="theme-loading-fill h-full w-full animate-pulse rounded-full" />
          </div>
        </div>
      )}

      {error && <p className="theme-error mt-4 text-sm">{error}</p>}

      {/* Results table */}
      {results.length > 0 && (
        <div className="theme-panel mt-6 overflow-hidden rounded-xl">
          <table className="theme-table w-full text-left text-sm">
            <thead className="theme-card-header">
              <tr>
                <th className="px-4 py-3">Algorithm</th>
                <th className="px-4 py-3">Team 1</th>
                <th className="px-4 py-3">Team 2</th>
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
                  <td className="px-4 py-3">
                    <p className="theme-label">({r.team.length} players)</p>
                    <p className="mt-1">{formatPlayerList(r.team)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="theme-label">({r.opposingTeam.length} players)</p>
                    <p className="mt-1">{formatPlayerList(r.opposingTeam)}</p>
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
