import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Edge } from "../types/matchmaking";

export default function GraphStatus() {
  const [loaded, setLoaded] = useState<boolean | null>(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);

  useEffect(() => {
    fetch("/api/graph")
      .then((res) => {
        if (!res.ok) {
          setLoaded(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.edges && data.edges.length > 0) {
          setLoaded(true);
          setEdgeCount(data.edges.length);
          const players = new Set<number>();
          data.edges.forEach((e: Edge) => {
            players.add(e.p1);
            players.add(e.p2);
          });
          setPlayerCount(players.size);
        } else {
          setLoaded(false);
        }
      })
      .catch(() => setLoaded(false));
  }, []);

  if (loaded === null) return null;

  if (!loaded) {
    return (
      <div className="theme-panel-subtle rounded-lg px-4 py-3 text-sm flex items-center gap-2">
        <span className="text-amber-400">&#9888;</span>
        <span className="theme-note">
          No graph loaded yet —{" "}
          <Link to="/graph-builder" className="text-sky-400 underline hover:text-sky-300">
            go to Graph Builder
          </Link>{" "}
          to create one.
        </span>
      </div>
    );
  }

  return (
    <div className="theme-panel-subtle rounded-lg px-4 py-3 text-sm flex items-center gap-2">
      <span className="text-green-400">&#10003;</span>
      <span className="theme-note">
        Graph loaded: {playerCount} players, {edgeCount} edges
      </span>
    </div>
  );
}
