import { useRef, useState } from "react";
import { runAlgorithm } from "../../api/matchmaking";
import type { MatchmakingResult } from "../../types/matchmaking";

const ALGORITHM_LABELS: Record<string, string> = {
  localSearchFirst: "Local Search (First Improvement)",
  localSearchBest: "Local Search (Best Improvement)",
  guaranteedBestTeam: "Guaranteed Best Team (Exhaustive)",
};

interface Props {
  algorithm: string;
  initialTeam: string;
}

export default function RunSection({ algorithm, initialTeam }: Props) {
  const [result, setResult] = useState<MatchmakingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  async function handleRun() {
    setLoading(true);
    setError("");
    setResult(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const team = initialTeam
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "")
      .map(Number);

    try {
      const res = await runAlgorithm({ algorithm, initialTeam: team }, controller.signal);
      setResult(res);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Request cancelled.");
      } else {
        setError("Failed to run algorithm. Is the API running? Did you load a graph first?");
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }

  function handleCancel() {
    abortControllerRef.current?.abort();
  }

  return (
    <div className="space-y-4">
      {/* Run / Cancel */}
      <div className="flex gap-3 items-center">
        <button
          onClick={handleRun}
          disabled={loading}
          className="theme-btn-primary px-6 py-2 text-sm disabled:opacity-50"
        >
          {loading ? "Running..." : "Run"}
        </button>
        {loading && (
          <button
            onClick={handleCancel}
            className="theme-btn-danger px-4 py-2 text-sm"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Loading bar */}
      {loading && (
        <div>
          <p className="theme-note mb-2 text-sm">
            Running algorithm — exhaustive search may take a while on large graphs...
          </p>
          <div className="theme-loading-track h-2 w-full overflow-hidden rounded-full">
            <div className="theme-loading-fill h-full w-full animate-pulse rounded-full" />
          </div>
        </div>
      )}

      {/* Error */}
      {error && <p className="theme-error text-sm">{error}</p>}

      {/* Result card */}
      {result && (
        <div className="theme-panel-subtle rounded-xl p-5">
          <h3 className="theme-section-title">
            {ALGORITHM_LABELS[result.algorithm] ?? result.algorithm}
          </h3>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <p className="theme-label">Team</p>
              <p className="theme-mono mt-2 text-xl font-bold text-white">
                [{result.team.join(", ")}]
              </p>
            </div>
            <div>
              <p className="theme-label">Score</p>
              <p className="mt-2 text-xl font-bold text-white">{result.score}</p>
            </div>
            <div>
              <p className="theme-label">Runtime</p>
              <p className="theme-mono mt-2 text-xl font-bold text-white">
                {result.runtimeMs} ms
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
