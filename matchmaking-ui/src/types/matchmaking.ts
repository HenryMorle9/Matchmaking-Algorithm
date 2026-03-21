// Mirrors the JSON your Spring Boot API expects and returns

export interface Edge {
  p1: number;
  p2: number;
  score: number;
}

export interface GraphRequest {
  edges: Edge[];
}

export interface MatchmakingRequest {
  algorithm: string;
  initialTeam: number[];
}

export interface MatchmakingResult {
  algorithm: string;
  team: number[];
  score: number;
  runtimeMs: number;
}
