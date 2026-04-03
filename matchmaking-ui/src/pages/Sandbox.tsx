import { useState } from "react";
import GraphBuilderSection from "../components/sandbox/GraphBuilderSection";
import RunSection from "../components/sandbox/RunSection";
import CompareSection from "../components/sandbox/CompareSection";
import VisualiseSection from "../components/sandbox/VisualiseSection";

const ALGORITHMS = [
  { value: "localSearchFirst", label: "Local Search (First Improvement)" },
  { value: "localSearchBest", label: "Local Search (Best Improvement)" },
  { value: "guaranteedBestTeam", label: "Guaranteed Best Team (Exhaustive)" },
];

export default function Sandbox() {
  const [algorithm, setAlgorithm] = useState(ALGORITHMS[0].value);
  const [initialTeam, setInitialTeam] = useState("");

  return (
    <div className="theme-page space-y-8">
      <div>
        <h1 className="theme-title">Sandbox</h1>
        <p className="theme-subtitle mt-3">
          Build a graph, run algorithms, compare results, and visualise — all in one place.
        </p>
      </div>

      {/* Shared controls toolbar */}
      <div className="theme-panel-subtle rounded-xl px-5 py-4 flex gap-4 items-end flex-wrap">
        <div>
          <label className="theme-label block">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="theme-input mt-2 rounded-lg px-3 py-2 text-sm"
          >
            {ALGORITHMS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="theme-label block">Initial Team (optional)</label>
          <input
            type="text"
            value={initialTeam}
            onChange={(e) => setInitialTeam(e.target.value)}
            placeholder="e.g. 0, 5"
            className="theme-input theme-mono mt-2 w-40 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* 2-column grid layout */}
      <div className="grid grid-cols-2 gap-10">
        {/* Row 1: Graph Builder — full width */}
        <div className="col-span-2">
          <h2 className="theme-section-title mb-2">1. Graph Builder</h2>
          <p className="theme-note text-sm mb-4">
            Generate a random compatibility graph between players. Choose how many players, hit Generate, then Load Graph to send it to the API. All other sections below use this loaded graph.
          </p>
          <GraphBuilderSection />
        </div>

        {/* Row 2: Compare (left) + Dashboard (right) */}
        <div>
          <h2 className="theme-section-title mb-2">2. Algorithm Comparison</h2>
          <p className="theme-note text-sm mb-4">
            Runs all three algorithms on the loaded graph with the same initial team and shows results side by side. Use this to see which algorithm finds the best score and which is fastest.
          </p>
          <CompareSection initialTeam={initialTeam} />
        </div>
        <div>
          <h2 className="theme-section-title mb-2">3. Run Algorithm</h2>
          <p className="theme-note text-sm mb-4">
            Runs the single algorithm selected above against the loaded graph. Useful for testing one algorithm at a time. You can cancel long-running exhaustive searches.
          </p>
          <RunSection algorithm={algorithm} initialTeam={initialTeam} />
        </div>

        {/* Row 3: Visualise — full width */}
        <div className="col-span-2">
          <h2 className="theme-section-title mb-2">4. Step-by-Step Visualisation</h2>
          <p className="theme-note text-sm mb-4">
            Replays the selected algorithm step by step with an interactive graph. Watch how local search moves players between teams to improve the score. Use the playback controls or click any step in the history table.
          </p>
          <VisualiseSection algorithm={algorithm} initialTeam={initialTeam} />
        </div>
      </div>
    </div>
  );
}
