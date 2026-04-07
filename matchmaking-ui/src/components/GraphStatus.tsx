import { Link } from "react-router-dom";
import { useGraph } from "../context/GraphContext";

export default function GraphStatus() {
  const { graphLoaded, allPlayers, apiEdges } = useGraph();

  if (graphLoaded === null) return null;

  if (!graphLoaded) {
    return (
      <div className="theme-status-pill rounded px-4 py-3 text-sm">
        <span className="text-amber-400">&#9888;</span>
        <span className="theme-note">
          No graph loaded yet —{" "}
          <Link to="/graph-builder" className="text-[var(--color-accent)] underline hover:opacity-80">
            go to Graph Builder
          </Link>{" "}
          to create one.
        </span>
      </div>
    );
  }

  return (
    <div className="theme-status-pill rounded px-4 py-3 text-sm">
      <span className="text-green-400">&#10003;</span>
      <span className="theme-note">
        Graph loaded: {allPlayers.length} players, {apiEdges.length} edges
      </span>
    </div>
  );
}
