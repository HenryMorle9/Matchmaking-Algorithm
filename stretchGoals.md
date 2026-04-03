### Phase 4 — Stretch Goals

#### 4A. Smarter Algorithms

**Branch and Bound** — smarter exhaustive search than `guaranteedBestTeam`. At each recursive step, compute an upper bound on the best achievable score from the current partial assignment. Prune if upper bound ≤ best score found so far. Can reduce 2^n to near-polynomial on structured graphs.
- New method: `guaranteedBestTeamBnB()` in `TeamChoose.java`
- Upper bound: sum all unassigned edge weights (O(e), loose but fast)
- Adds a new line to the Phase 3D benchmark chart

**Score Caching** — `multiPlayerTeamScore()` is called repeatedly on similar states. A `HashMap<String, Double>` keyed on canonical team string avoids recomputation. Straightforward addition to `TeamChoose`.

**Heuristics** (scale to large graphs, no optimality guarantee):
- *Greedy* — assign players one at a time, always maximising current cross-team score. O(n²), fast baseline.
- *Simulated Annealing* — like `localSearchFirst` but occasionally accepts worse moves with probability `e^(ΔScore/temperature)`. Escapes local optima.
- *Genetic Algorithm* — population of team splits, recombine and mutate the best each generation. Parallelisable, strong portfolio piece.

All three are new methods in `TeamChoose.java` and slot into the existing `/api/matchmaking/run` endpoint as additional algorithm options.

**Bitmasking** — represent teams as a single `int`/`long` bitmask instead of `TreeSet<Integer>`. Bitwise ops (`&`, `|`, `^`, `~`) replace set operations — significantly faster, especially in B&B and genetic algorithms. Internal optimisation only; `Team` (TreeSet) stays as the public API/display type.

#### 4B. Real-Time Progress for Exhaustive Search

Add real-time progress updates to the UI when the exhaustive search is running. Requires switching from a simple HTTP request/response to a streaming approach (Server-Sent Events or WebSockets). The Java algorithm would need to report progress (e.g., percentage of subsets explored) as it runs, and the frontend would display a real progress bar instead of a pulsing animation. Involves backend + frontend changes.

**Options**: SSE (simplest), WebSockets (more complex, two-way), or polling (easiest but least responsive).

#### 4C. Machine Learning (mega-stretch)

Use ML to predict a good initial team for local search, replacing an arbitrary starting point with one likely close to optimal.

**Approach**:
- Generate synthetic dataset: random graphs + optimal splits from `guaranteedBestTeam`
- Train a model to predict, given graph structure, which players belong together
- At inference: model predicts initial team → feed to `localSearchBest` → faster convergence, better result

**Tech options**:
- *Python microservice* (recommended): PyTorch/scikit-learn + FastAPI. Spring Boot calls it before running local search.
- *Graph Neural Network* (ambitious): PyTorch Geometric. Learns structural graph patterns directly.
- *Java-native*: Weka or Deeplearning4j. Stays in Java but heavier to configure.