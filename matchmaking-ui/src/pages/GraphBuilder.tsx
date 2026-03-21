import { useState } from "react";
import { loadGraph } from "../api/matchmaking";
import type { Edge } from "../types/matchmaking";

export default function GraphBuilder() {
  // Form state — tracks what the user is typing
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [score, setScore] = useState("");

  // List of edges the user has added (local state, not sent to API yet)
  const [edges, setEdges] = useState<Edge[]>([]);

  // Status message shown after loading graph
  const [status, setStatus] = useState("");

  // Player count for random generation
  const [playerCount, setPlayerCount] = useState("7");

  const statusClass = status
    ? status.toLowerCase().includes("failed")
      || status.toLowerCase().includes("please")
      || status.toLowerCase().includes("add at least one")
      ? "theme-error"
      : "theme-status"
    : "";

  function handleAddEdge() {
    // Parse inputs to numbers
    const edge: Edge = {
      p1: parseInt(p1),
      p2: parseInt(p2),
      score: parseFloat(score),
    };

    // Basic validation
    if (isNaN(edge.p1) || isNaN(edge.p2) || isNaN(edge.score)) {
      setStatus("Please enter valid numbers for all fields.");
      return;
    }

    // Add to local list and clear the form
    setEdges([...edges, edge]);
    setP1("");
    setP2("");
    setScore("");
    setStatus("");
  }

  function handleGenerateRandom() {
    const count = parseInt(playerCount) || 7;
    const generated: Edge[] = [];

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (Math.random() < 0.6) {
          generated.push({
            p1: i,
            p2: j,
            score: Math.round(Math.random() * 5 * 10) / 10,
          });
        }
      }
    }

    setEdges(generated);
    setStatus(`Generated ${generated.length} random edges for ${count} players.`);
  }

  function handleRemoveEdge(index: number) {
    setEdges(edges.filter((_, i) => i !== index));
  }

  async function handleLoadGraph() {
    if (edges.length === 0) {
      setStatus("Add at least one edge first.");
      return;
    }

    try {
      const message = await loadGraph({ edges });
      setStatus(message);
    } catch {
      setStatus("Failed to load graph. Is the API running?");
    }
  }

  return (
    <div className="theme-page space-y-6">
      {/* Header */}
      <div>
        <h1 className="theme-title">Graph Builder</h1>
        <p className="theme-subtitle mt-3">
          Add edges between players with compatibility scores, then load the graph
          into the API.
        </p>
      </div>

      {/* Edge input form */}
      <div className="theme-panel rounded-xl p-5">
        <h2 className="theme-section-title mb-3">Add Edges</h2>
        <div className="flex gap-3 items-end">
          <div>
            <label className="theme-label block">
              Player 1
            </label>
            <input
              type="number"
              value={p1}
              onChange={(e) => setP1(e.target.value)}
              placeholder="0"
              className="theme-input mt-2 w-24 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="theme-label block">
              Player 2
            </label>
            <input
              type="number"
              value={p2}
              onChange={(e) => setP2(e.target.value)}
              placeholder="1"
              className="theme-input mt-2 w-24 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="theme-label block">
              Score
            </label>
            <input
              type="number"
              step="0.1"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="2.0"
              className="theme-input mt-2 w-24 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={handleAddEdge}
            className="theme-btn-primary px-4 py-2 text-sm"
          >
            Add Edge
          </button>
          <div className="theme-divider flex gap-2 items-end border-l pl-3">
            <div>
              <label className="theme-label block">Players</label>
              <input
                type="number"
                value={playerCount}
                onChange={(e) => setPlayerCount(e.target.value)}
                className="theme-input mt-2 w-20 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <button
              onClick={handleGenerateRandom}
              className="theme-btn-secondary px-4 py-2 text-sm"
            >
              Generate Random
            </button>
          </div>
        </div>
      </div>

      {/* Performance estimate, Load button, and status — above the table */}
      {edges.length > 0 && (() => {
        const uniquePlayers = new Set(edges.flatMap((e) => [e.p1, e.p2])).size;

        // Calibrated: 2^20 subsets took ~5s on local machine → ~200k/sec
        const SUBSETS_PER_SECOND = 200_000;
        const totalSubsets = 2 ** uniquePlayers;
        const estimatedSeconds = totalSubsets / SUBSETS_PER_SECOND;

        function formatTime(seconds: number): string {
          if (seconds < 1) return "< 1 second";
          if (seconds < 60) return `~${Math.round(seconds)} seconds`;
          if (seconds < 3600) return `~${Math.round(seconds / 60)} minutes`;
          if (seconds < 86400) return `~${Math.round(seconds / 3600)} hours`;
          if (seconds < 604800) return `~${Math.round(seconds / 86400)} days`;
          if (seconds < 31536000) return `~${Math.round(seconds / 604800)} weeks`;
          return `~${Math.round(seconds / 31536000).toLocaleString()} years`;
        }

        function timeColor(seconds: number): string {
          if (seconds < 1) return "text-green-600";
          if (seconds < 10) return "text-yellow-600";
          if (seconds < 300) return "text-orange-600";
          return "text-red-600";
        }

        return (
          <div className="theme-panel-subtle mt-4 rounded-xl p-4">
            <h3 className="theme-section-title">
              Estimated Performance ({uniquePlayers} players)
            </h3>
            <table className="theme-table mt-3 w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="py-2">Algorithm</th>
                  <th className="py-2">Subsets</th>
                  <th className="py-2">Estimate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="theme-divider border-t">
                  <td className="py-1">Local Search (First)</td>
                  <td className="theme-note py-1">O(n²)</td>
                  <td className="py-1 text-green-600 font-medium">{"< 1 second"}</td>
                </tr>
                <tr className="theme-divider border-t">
                  <td className="py-1">Local Search (Best)</td>
                  <td className="theme-note py-1">O(n²)</td>
                  <td className="py-1 text-green-600 font-medium">{"< 1 second"}</td>
                </tr>
                <tr className="theme-divider border-t">
                  <td className="py-1">Guaranteed Best (Exhaustive)</td>
                  <td className="theme-note py-1">
                    2<sup>{uniquePlayers}</sup> = {totalSubsets.toLocaleString()}
                  </td>
                  <td className={`py-1 font-medium ${timeColor(estimatedSeconds)}`}>
                    {formatTime(estimatedSeconds)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      })()}

      {/* Load graph action */}
      {edges.length > 0 && (
        <div className="flex items-center gap-4">
          <button
            onClick={handleLoadGraph}
            className="theme-btn-accent px-6 py-2.5 text-sm"
          >
            Load Graph ({edges.length} edges)
          </button>
          {status && (
            <p className={`text-sm font-medium ${statusClass}`}>{status}</p>
          )}
        </div>
      )}

      {/* Edge list table */}
      {edges.length > 0 && (
        <div className="theme-panel overflow-hidden rounded-xl">
          <div className="theme-card-header theme-divider border-b px-5 py-3">
            <h2 className="theme-section-title">
              Edges ({edges.length})
            </h2>
          </div>
          <table className="theme-table w-full text-left text-sm">
            <thead>
              <tr className="theme-card-header theme-divider border-b">
                <th className="px-5 py-3">Player 1</th>
                <th className="px-5 py-3">Player 2</th>
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {edges.map((edge, i) => (
                <tr key={i} className="theme-divider border-b">
                  <td className="px-5 py-2">{edge.p1}</td>
                  <td className="px-5 py-2">{edge.p2}</td>
                  <td className="theme-mono px-5 py-2">{edge.score}</td>
                  <td className="px-5 py-2">
                    <button
                      onClick={() => handleRemoveEdge(i)}
                      className="theme-btn-danger px-3 py-1.5 text-xs"
                    >
                      Remove
                    </button>
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
