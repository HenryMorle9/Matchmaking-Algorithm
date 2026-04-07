# MatchMatrix

MatchMatrix is a full-stack portfolio project for exploring graph-based team balancing in FPS-style matchmaking.

It is built as a multi-module system with a Java algorithm core, a Spring Boot API, and a React frontend. The result is an interactive app where you can generate a player graph, run different matchmaking strategies, compare their output, and replay how the algorithm reached its decision.

## Overview

The project models players as nodes in a weighted undirected graph.

- Each player is a node
- Each edge stores a historical synergy score between two players
- The algorithm tries to split players into two teams so high-synergy pairings are placed on opposite sides

That means the app is not trying to group the best teammates together. It is trying to create the most balanced matchup by separating players who historically perform well together.

## How the Matchmaking Algorithm Works

### The problem

Split `n` players into two teams `T1` and `T2` to maximise the goodness score:

```text
g(T1, T2) = sum of f(pi, pj) for all pi in T1, pj in T2
```

Where `f(pi, pj)` is the pairing score for two players based on how well they have historically performed together.

### Data model

- **Graph**: weighted undirected graph where players are nodes and historical synergy is stored as edge weight
- **Stored as**: `TreeMap<Integer, PastPlayDeets>` mapping player ID to adjacency data
- **Adjacency list**: `TreeMap<Integer, Double>` inside `PastPlayDeets`
- **Team representation**: `TreeSet<Integer>` for auto-sorted, canonical player ordering

### Core Java classes

These live in `matchmaking-algorithms/`.

| Class | Purpose |
|---|---|
| `DataRow` | Input row `(p1, p2, score)` used when parsing graph data |
| `PastPlayDeets` | Stores one player's full pairing history |
| `Team` | Extends `TreeSet<Integer>` to represent a team in canonical sorted order |
| `TeamChoose` | Core algorithm class containing scoring, search, and helper methods |

### Key methods in `TeamChoose`

| Method | What it does |
|---|---|
| `setPlayerGraph(dataList)` | Builds the undirected graph from a list of `DataRow` values |
| `multiPlayerTeamScore(pTeam)` | Main scoring function that sums all cross-team edges |
| `otherTeam(pTeam)` | Returns all players not in the given team |
| `allPlayerTeam()` | Returns every player in the graph |
| `testWithLowestID(pTeam)` | Forces the canonical side that contains player `0` |
| `localSearchFirst(initTeam)` | Repeatedly applies the first improving move |
| `localSearchBest(initTeam)` | Repeatedly applies the best improving move |
| `guaranteedBestTeam()` | Exhaustive backtracking search over all subsets |
| `localSearchFirstWithSteps(initTeam)` | First-improvement search with full step history |
| `localSearchBestWithSteps(initTeam)` | Best-improvement search with full step history |

### Algorithm comparison

| Algorithm | Strategy | Complexity | Optimal? |
|---|---|---:|---|
| `localSearchFirst` | Takes the first improving move each iteration | `O(n²)` per iteration | No |
| `localSearchBest` | Evaluates all improving moves and takes the best | `O(n²)` per iteration | No |
| `guaranteedBestTeam` | Exhaustive backtracking over all subsets | `O(2^n)` | Yes |

### Exhaustive search cost

`guaranteedBestTeam()` explores **all `2^n` subsets**, not only fixed-size combinations.

- `7` players → `128` subsets
- `20` players → `1,048,576` subsets
- `30` players → `1,073,741,824` subsets

On my local machine, exhaustive search benchmarks at roughly `200,000` subset evaluations per second. That calibration is what powers the estimate shown in the Graph Builder UI.

### Canonical form

A split is always represented by the side containing the lowest player ID, which is normally player `0`.

This is enforced by `testWithLowestID()`. If an algorithm ends with player `0` on the opposite side, the result is swapped before being returned. That is why player `0` always appears in the displayed team output. It is intentional and keeps comparisons between algorithms consistent.

### Verification reference

Sample input:

```text
0 1 2.0 / 0 2 1.0 / 0 4 4.0 / 1 2 3.0 / 1 6 5.0 / 2 3 2.0 / 2 5 1.0 / 2 6 2.0 / 3 5 3.0 / 4 5 1.0
```

Expected best team containing player `0`:

```text
{0, 2, 5, 6}
```

Expected best score:

```text
20.0
```

Reference outcomes:

```text
localSearchFirst({1,3,5})  -> {0, 1, 5}, score 18
localSearchBest({0,5})     -> {0, 2, 5, 6}, score 20
guaranteedBestTeam()       -> {0, 2, 5, 6}, score 20
```

## What the App Does

### 1. Landing Page

Introduces the project, shows a sample graph, and explains the overall workflow from graph creation to step-by-step replay.

### 2. Graph Builder

Create a graph and inspect its cost before loading it into the backend.

- Random graph generation
- Edge list preview
- Exhaustive-search performance estimate
- One-click graph load into the API

### 3. Dashboard

Run one algorithm at a time and inspect the result in detail.

- Algorithm selection
- Optional starting team input
- Score and runtime output
- Result split shown as Team 1 and Team 2
- Request cancellation for long-running runs

### 4. Compare

Run all strategies on the same graph to compare quality and speed.

- Side-by-side algorithm comparison
- Best score highlighting
- Fastest runtime highlighting

### 5. Visualise

Replay the search process step by step.

- SVG graph visualisation
- Playback controls
- Step history table
- Per-step team and score updates
- Special handling for exhaustive search, which only has start and end states

## Tech Stack

| Layer | Technology |
|---|---|
| Core algorithms | Java 17 |
| API | Spring Boot 3 |
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| Visualisation | Pure SVG + React |
| Build tooling | Maven + Vite |
| Testing | JUnit 5 + MockMvc |

## Project Structure

```text
MatchMatrix/
├── pom.xml
├── matchmaking-algorithms/
│   ├── pom.xml
│   └── src/main/java/com/matchmaking/algorithms/
│       ├── DataRow.java
│       ├── PastPlayDeets.java
│       ├── Team.java
│       └── TeamChoose.java
├── matchmaking-api/
│   ├── pom.xml
│   └── src/main/java/com/matchmaking/api/
│       ├── controller/
│       ├── dto/
│       └── service/
└── matchmaking-ui/
    ├── package.json
    └── src/
        ├── api/
        ├── components/
        ├── context/
        ├── pages/
        ├── types/
        └── utils/
```

## API Endpoints

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/graph` | Fetch the currently loaded graph |
| `POST` | `/api/graph` | Load a graph into the backend |
| `POST` | `/api/matchmaking/run` | Run a single algorithm |
| `POST` | `/api/matchmaking/compare` | Run all algorithms side by side |
| `POST` | `/api/matchmaking/steps` | Return step-by-step output for the visualiser |

## Running Locally

### Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+

### Backend

```bash
cd matchmaking-api
mvn spring-boot:run
```

Runs on `http://localhost:8080`.

### Frontend

```bash
cd matchmaking-ui
npm install
npm run dev
```

Runs on `http://localhost:5173`.

Vite proxies `/api` requests to the Spring Boot server on port `8080`.

## Running Tests

### Algorithm module

```bash
cd matchmaking-algorithms
mvn test
```

### API module

```bash
cd matchmaking-api
mvn test
```

### Single test class

```bash
cd matchmaking-api
mvn -Dtest=MatchmakingServiceTest test
```

## What I Learned

This project taught me a lot in both algorithms and product engineering.

- Learned graph-based reasoning in much more serious detail, especially weighted undirected graphs, adjacency structures, scoring functions, and exhaustive search trade-offs
- Strengthened my DSA skills through algorithm comparison, step tracing, and performance thinking
- Designed and consumed a custom request/response API with Spring Boot instead of keeping the project as pure local Java logic
- Learned Tailwind CSS while building a real interface, not just isolated components
- Expanded my full-stack skill set by connecting Java algorithms, REST endpoints, React state management, and interactive frontend visualisation in one project

## Why This Project Matters

This is not just an implementation of one algorithm. It is a portfolio project built to show:

- graph-based algorithm design
- heuristic vs exhaustive search trade-offs
- API design and DTO modelling
- full-stack integration between backend and frontend
- UI thinking around explanation, comparison, and visualisation

## Stretch Goals

### Phase 4A — Smarter Algorithms

#### Branch and Bound

A smarter exact algorithm than `guaranteedBestTeam()`. At each recursive step, compute an upper bound on the best achievable score from the current partial assignment and prune if that bound is already worse than the best score found so far.

- Planned method: `guaranteedBestTeamBnB()` in `TeamChoose.java`
- Initial upper bound idea: sum of all unassigned edge weights
- Would add another algorithm line to the benchmark view

#### Score caching

`multiPlayerTeamScore()` is recomputed repeatedly for similar states. A `HashMap<String, Double>` keyed by canonical team string could avoid duplicate scoring work.

#### Additional heuristics

- **Greedy**: build a split one player at a time by maximising current cross-team score
- **Simulated Annealing**: allow occasional worse moves to escape local optima
- **Genetic Algorithm**: evolve a population of team splits through mutation and recombination

These would plug into the existing API as additional algorithm choices.

#### Bitmasking

Represent teams internally as `int` or `long` bitmasks instead of `TreeSet<Integer>` for faster set operations, especially for branch-and-bound or genetic-style search.

### Phase 4B — Real-Time Progress for Exhaustive Search

Show true progress in the UI while exhaustive search is running rather than a pulsing loading bar.

Possible transport options:

- Server-Sent Events
- WebSockets
- Polling

This would require both backend progress reporting and frontend streaming updates.

### Phase 4C — Machine Learning

Use ML to predict a strong initial team for local search so the heuristic starts closer to a good solution.

Possible direction:

- Generate synthetic graphs and optimal results using `guaranteedBestTeam()`
- Train a model to predict a promising initial split
- Feed that prediction into `localSearchBest()` for faster convergence

Possible tech choices:

- Python microservice with FastAPI and PyTorch/scikit-learn
- Graph Neural Network with PyTorch Geometric
- Java-native tooling such as Weka or Deeplearning4j

## Current Status

Implemented:

- Java graph-based matchmaking algorithms
- Spring Boot REST API
- React frontend with graph generation, single-run dashboard, comparison view, and step replay
- Backend unit tests and API integration tests

Next major growth area:

- smarter algorithms
- real-time exhaustive-search progress
- deeper benchmarking and performance storytelling
