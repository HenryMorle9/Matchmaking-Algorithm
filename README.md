# FPS Matchmaking Algorithm

A full-stack team-balancing system that uses graph theory and combinatorial optimisation to split players into fair, competitive teams based on their historical play data.

Players are modelled as nodes in a weighted undirected graph. Edge weights represent how well two players have performed together in the past. The system finds the team split that maximises cross-team synergy — placing players who work well together on **opposing** sides for a balanced match.

---

## How It Works

### The Scoring Function

A team split is evaluated by summing every edge weight that crosses between the two teams:

```
g(T1, T2) = Σ f(pi, pj)  for all pi ∈ T1, pj ∈ T2
```

The higher the score, the more balanced the match — players with strong past synergy are competing against each other rather than playing together.

### Example

Given this player graph:

```
0 1 2.0     →  f(0,1) = 2.0
0 2 1.0     →  f(0,2) = 1.0
0 4 4.0     →  f(0,4) = 4.0
1 2 3.0     →  ...
1 6 5.0
2 3 2.0
2 5 1.0
2 6 2.0
3 5 3.0
4 5 1.0
```

The optimal split is **T1 = {0, 2, 5, 6}** vs **T2 = {1, 3, 4}** with a score of **20**.

---

## Algorithms

Three strategies are implemented, covering the full spectrum from fast heuristic to guaranteed optimal:

| Algorithm | Strategy | Time Complexity | Finds Optimal? |
|-----------|----------|-----------------|----------------|
| `localSearchFirst` | Iteratively applies the **first** move that improves the score | O(n²) per iteration | No — local optimum |
| `localSearchBest` | Iteratively applies the **best** move that improves the score | O(n²) per iteration | Often — better local optimum |
| `guaranteedBestTeam` | Exhaustive backtracking over all 2ⁿ splits | O(2ⁿ) | Yes — always |

Both local search variants use add/remove moves: at each step, a single player is either added to or removed from the current team if it improves the cross-team score.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Core algorithms | Java 17 |
| REST API | Spring Boot |
| Frontend | React + TypeScript (Vite) |
| Graph visualisation | React Flow / vis-network |
| Charts | Recharts |
| Build | Maven (multi-module) |
| Tests | JUnit 4 |

---

## Project Roadmap

### Phase 1 — Spring Boot REST API
- [ ] Multi-module Maven setup
- [ ] `POST /api/graph` — load player graph from JSON
- [ ] `GET /api/graph` — return graph state (nodes + edges)
- [ ] `POST /api/matchmaking/run` — run a single algorithm
- [ ] `POST /api/matchmaking/compare` — run all algorithms, return results + runtimes
- [ ] `POST /api/matchmaking/steps` — return intermediate states for animation

### Phase 2 — React + TypeScript Frontend
- [ ] Graph Builder — input player pairs manually or paste raw data
- [ ] Matchmaking Dashboard — run algorithms, view team splits with scores
- [ ] Inline "How It Works" guide on the dashboard
- [ ] Algorithm Comparison page — side-by-side table of all three algorithms

### Phase 3 — Algorithm Showcase
- [ ] **Comparison panel** — highlight best result, score deltas, optimality detection
- [ ] **Step-by-step visualisation** — animated graph where nodes switch teams as the algorithm runs (play/pause/step controls)
- [ ] **Performance benchmarking** — runtime charts across increasing player counts, showing exponential vs polynomial complexity

### Phase 4 — Stretch Goals
- [ ] **Branch and Bound** — smarter exhaustive search with early pruning; faster than brute-force without sacrificing optimality
- [ ] **Score caching** — memoisation for repeated `multiPlayerTeamScore` calls during search
- [ ] **Greedy heuristic** — assign players one at a time, always maximising current score
- [ ] **Simulated Annealing** — escapes local optima by occasionally accepting worse moves
- [ ] **Genetic Algorithm** — population-based search, naturally parallelisable
- [ ] **Bitmasking** — represent teams as integer bitmasks for faster set operations
- [ ] **Machine-Learning-guided initial team** *(mega-stretch)* — train a model on optimal splits to predict a warm start for local search

---

## Core Data Structures

```
Map<Integer, PastPlayDeets>       — player graph (TreeMap, sorted by ID)
  └── Map<Integer, Double>        — adjacency list per player (TreeMap)

Team extends TreeSet<Integer>     — auto-sorted player ID set
```

The graph is stored bidirectionally: each edge `(p1, p2, score)` is inserted from both players' perspectives so score lookups work in O(log n) from either side.

---

## Input Format

```
<player_id> <player_id> <score>
0 1 2.0
0 2 1.0
1 2 3.0
```

One pairing per line. Player IDs are zero-indexed integers. Scores are real-valued.

---

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+ *(for the frontend, once Phase 2 is underway)*

### Run the core algorithms (current state)

```bash
cd Matchmaking-Algorithm
mvn test
```

### Run the full stack *(once Phase 1 & 2 are complete)*

```bash
# Backend
cd matchmaking-api
mvn spring-boot:run

# Frontend (separate terminal)
cd matchmaking-ui
npm install
npm run dev
```

---

## Project Structure

```
Matchmaking-Algorithm-Project/
├── Matchmaking-Algorithm/         # Java core — graph model + all algorithms
│   └── student/
│       ├── DataRow.java           # Input row: (p1, p2, score)
│       ├── PastPlayDeets.java     # Per-player adjacency list + history
│       ├── Team.java              # Team as a sorted set of player IDs
│       ├── TeamChoose.java        # All algorithm logic
│       └── SampleTests.java       # JUnit test suite
├── matchmaking-api/               # Spring Boot REST API (Phase 1)
└── matchmaking-ui/                # React + TypeScript frontend (Phase 2)
```
