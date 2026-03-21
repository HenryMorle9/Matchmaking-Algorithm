import type { GraphRequest, MatchmakingRequest, MatchmakingResult } from "../types/matchmaking";

const BASE_URL = "/api";

export async function loadGraph(request: GraphRequest): Promise<string> {
  const res = await fetch(`${BASE_URL}/graph`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return res.text();
}

export async function runAlgorithm(request: MatchmakingRequest, signal?: AbortSignal): Promise<MatchmakingResult> {
  const res = await fetch(`${BASE_URL}/matchmaking/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });
  return res.json();
}

export async function compareAlgorithms(request: MatchmakingRequest, signal?: AbortSignal): Promise<MatchmakingResult[]> {
  const res = await fetch(`${BASE_URL}/matchmaking/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });
  const data = await res.json();
  return data.results;
}
