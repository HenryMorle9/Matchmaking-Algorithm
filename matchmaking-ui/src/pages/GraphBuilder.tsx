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
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Graph Builder</h1>
        <p className="mt-2 text-gray-600">
          Add edges between players with compatibility scores, then load the graph
          into the API.
        </p>
      </div>

      {/* Edge input form */}
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Add Edges</h2>
        <div className="flex gap-3 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Player 1
            </label>
            <input
              type="number"
              value={p1}
              onChange={(e) => setP1(e.target.value)}
              placeholder="0"
              className="mt-1 w-24 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Player 2
            </label>
            <input
              type="number"
              value={p2}
              onChange={(e) => setP2(e.target.value)}
              placeholder="1"
              className="mt-1 w-24 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Score
            </label>
            <input
              type="number"
              step="0.1"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="2.0"
              className="mt-1 w-24 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleAddEdge}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Edge
          </button>
          <div className="border-l border-gray-300 pl-3 flex gap-2 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700">Players</label>
              <input
                type="number"
                value={playerCount}
                onChange={(e) => setPlayerCount(e.target.value)}
                className="mt-1 w-20 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleGenerateRandom}
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
          <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">
              Estimated Performance ({uniquePlayers} players)
            </h3>
            <table className="mt-2 w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-1 font-medium">Algorithm</th>
                  <th className="py-1 font-medium">Subsets</th>
                  <th className="py-1 font-medium">Estimate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="py-1">Local Search (First)</td>
                  <td className="py-1 text-gray-500">O(n²)</td>
                  <td className="py-1 text-green-600 font-medium">{"< 1 second"}</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="py-1">Local Search (Best)</td>
                  <td className="py-1 text-gray-500">O(n²)</td>
                  <td className="py-1 text-green-600 font-medium">{"< 1 second"}</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="py-1">Guaranteed Best (Exhaustive)</td>
                  <td className="py-1 text-gray-500">
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
            className="rounded bg-green-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-green-700"
          >
            Load Graph ({edges.length} edges)
          </button>
          {status && (
            <p className="text-sm font-medium text-gray-700">{status}</p>
          )}
        </div>
      )}

      {/* Edge list table */}
      {edges.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">
              Edges ({edges.length})
            </h2>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 bg-gray-50">
                <th className="px-5 py-2 font-medium">Player 1</th>
                <th className="px-5 py-2 font-medium">Player 2</th>
                <th className="px-5 py-2 font-medium">Score</th>
                <th className="px-5 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {edges.map((edge, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-2">{edge.p1}</td>
                  <td className="px-5 py-2">{edge.p2}</td>
                  <td className="px-5 py-2">{edge.score}</td>
                  <td className="px-5 py-2">
                    <button
                      onClick={() => handleRemoveEdge(i)}
                      className="text-red-500 hover:text-red-700 text-xs"
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
