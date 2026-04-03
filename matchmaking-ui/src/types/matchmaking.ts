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
  opposingTeam: number[];
  score: number;
  runtimeMs: number;
}

export interface Step {
  stepNumber: number;
  team: number[];
  opposingTeam: number[];
  score: number;
  action: string;
}

export interface StepsResult {
  algorithm: string;
  steps: Step[];
  runtimeMs: number;
}
