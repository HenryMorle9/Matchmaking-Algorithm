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

  function formatScore(score: number) {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(score);
  }

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

  const bestScore = results.length > 0
    ? Math.max(...results.map((r) => r.score))
    : 0;
  const fastestTime = results.length > 0
    ? Math.min(...results.map((r) => r.runtimeMs))
    : 0;
  const bestScoreCount = results.filter((r) => r.score === bestScore).length;
  const fastestTimeCount = results.filter((r) => r.runtimeMs === fastestTime).length;


  return (
    <div className="theme-page">
      <div className="animate-fade-in">
        <p className="theme-section-title">Benchmark</p>
        <h1 className="theme-title mt-2">Compare Algorithms</h1>
        <p className="theme-subtitle mt-3">
          Run every algorithm on the same graph and compare score against speed.
        </p>
      </div>

      <div className="mt-4 animate-fade-in delay-1">
        <GraphStatus />
      </div>

      <div className="mt-4 animate-fade-in delay-1">
        <HelpAccordion>
          <p className="theme-help-copy">
            Use this page when you want to compare speed and score on one graph.
          </p>
          <ul className="theme-help-list">
            <li><strong>Local search</strong> is faster, but may stop on a good-enough answer.</li>
            <li><strong>Exhaustive</strong> is slower, but always finds the best split.</li>
          </ul>
        </HelpAccordion>
      </div>

      {/* Controls */}
      <div className="mt-6 flex gap-4 items-end animate-fade-in delay-2">
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
          onClick={handleCompare}
          disabled={loading}
          className="theme-btn-primary px-6 py-2 text-sm disabled:opacity-50"
        >
          {loading ? "Comparing..." : "Compare All"}
        </button>
      </div>

      {loading && (
        <div className="mt-4 animate-fade-in">
          <p className="theme-note mb-2 text-sm">
            Running all three algorithms — exhaustive search may take a while on large graphs...
          </p>
          <div className="theme-loading-track h-1.5 w-full overflow-hidden rounded-sm">
            <div className="theme-loading-fill h-full w-full animate-pulse rounded-sm" />
          </div>
        </div>
      )}

      {error && <p className="theme-error mt-4 text-sm">{error}</p>}

      {/* Results table */}
      {results.length > 0 && (
        <div className="theme-panel mt-6 overflow-hidden rounded animate-scale-in">
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
                  <td className="px-4 py-3 font-medium theme-text-primary">
                    {ALGORITHM_LABELS[r.algorithm] ?? r.algorithm}
                  </td>
                  <td className="px-4 py-3">
                    <p className="theme-label theme-team-value--1">({r.team.length} players)</p>
                    <p className="theme-team-value--1 mt-1">{formatPlayerList(r.team)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="theme-label theme-team-value--2">({r.opposingTeam.length} players)</p>
                    <p className="theme-team-value--2 mt-1">{formatPlayerList(r.opposingTeam)}</p>
                  </td>
                  <td className="px-4 py-3 font-bold theme-text-primary">
                    {formatScore(r.score)}
                    {bestScoreCount === 1 && r.score === bestScore && (
                      <span className="theme-chip-success ml-2">
                        Most Accurate
                      </span>
                    )}
                  </td>
                  <td className="theme-mono px-4 py-3">
                    {r.runtimeMs} ms
                    {fastestTimeCount === 1 && r.runtimeMs === fastestTime && (
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
