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
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Graph Builder</h1>
      <p className="mt-2 text-gray-600">
        Add edges between players with compatibility scores, then load the graph
        into the API.
      </p>

      {/* Edge input form */}
      <div className="mt-6 flex gap-3 items-end">
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

      {/* Edge list table */}
      {edges.length > 0 && (
        <div className="mt-6">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="py-2 font-medium">Player 1</th>
                <th className="py-2 font-medium">Player 2</th>
                <th className="py-2 font-medium">Score</th>
                <th className="py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {edges.map((edge, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2">{edge.p1}</td>
                  <td className="py-2">{edge.p2}</td>
                  <td className="py-2">{edge.score}</td>
                  <td className="py-2">
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

          <button
            onClick={handleLoadGraph}
            className="mt-4 rounded bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Load Graph ({edges.length} edges)
          </button>
        </div>
      )}

      {/* Status message */}
      {status && (
        <p className="mt-4 text-sm font-medium text-gray-700">{status}</p>
      )}
    </div>
  );
}
