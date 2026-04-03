import { createContext, useContext, useState } from "react";
import type { Edge } from "../types/matchmaking";
import type { ReactNode } from "react";

interface GraphState {
  edges: Edge[];
  setEdges: (edges: Edge[]) => void;
  status: string;
  setStatus: (status: string) => void;
}

const GraphContext = createContext<GraphState | null>(null);

export function GraphProvider({ children }: { children: ReactNode }) {
  const [edges, setEdges] = useState<Edge[]>([]);
  const [status, setStatus] = useState("");

  return (
    <GraphContext.Provider value={{ edges, setEdges, status, setStatus }}>
      {children}
    </GraphContext.Provider>
  );
}

export function useGraph() {
  const ctx = useContext(GraphContext);
  if (!ctx) throw new Error("useGraph must be used within GraphProvider");
  return ctx;
}
