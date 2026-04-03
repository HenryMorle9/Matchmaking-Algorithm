# How the Matchmaking Algorithm Works

## The Problem

Split `n` players into two teams T1 and T2 to maximise the "goodness score":

```
g(T1, T2) = sum of f(pi, pj) for all pi in T1, pj in T2
```

Where `f(pi, pj)` is the pairing score — how well two players have historically performed together. Players with high synergy go on **opposite** teams so that matches are balanced.

## Data Model

- **Graph**: weighted undirected graph. Players = nodes. Historical synergy = edge weights.
- **Stored as**: `TreeMap<Integer, PastPlayDeets>` — player ID → their adjacency list
- **Adjacency list**: `TreeMap<Integer, Double>` inside `PastPlayDeets` — opponent ID → score
- **Team**: `TreeSet<Integer>` — auto-sorted set of player IDs (canonical ordering)

---

## Java Classes (in `matchmaking-algorithms/`)

### `DataRow`
Input row: `(Integer p1, Integer p2, Double score)`. Used when parsing the data file.
Key methods: `getFirst()`, `getSecond()`, `getScore()`.

### `PastPlayDeets`
Stores one player's full pairing history.
- `insertPlayerScore(p, w)` — add/update a pairing
- `getPlayerScore(p)` — get score with player p (0.0 if no history)
- `getPlayerScoreTota()` — sum of all pairing scores (note: typo is intentional, matches spec)
- `listPastPlayers()` — Set of all players this player has played with
- `hasPlayedWithLowestID()` — lowest ID player in history

### `Team`
Extends `TreeSet<Integer>`. Auto-sorted. `toString()` returns `"0--2--5--6"` format.

### `TeamChoose`
The core class. Key methods:

| Method | What it does |
|--------|-------------|
| `setPlayerGraph(dataList)` | Builds the undirected graph from DataRow list |
| `multiPlayerTeamScore(pTeam)` | **Main scoring function** — sums cross-team edges |
| `otherTeam(pTeam)` | Returns all players NOT in pTeam |
| `allPlayerTeam()` | Returns every player as a Team |
| `testWithLowestID(pTeam)` | Returns canonical side (the side containing player 0) |
| `isBetter(pTeam, p1)` | True if toggling p1 improves the score |
| `firstSingleAddedImprovement(pTeam)` | Lowest-ID player whose addition improves score |
| `firstSingleRemovedImprovement(pTeam)` | Lowest-ID player whose removal improves score |
| `bestSingleAddedImprovement(pTeam)` | Player whose addition gives the **largest** improvement |
| `bestSingleRemovedImprovement(pTeam)` | Player whose removal gives the **largest** improvement |
| `localSearchFirst(initTeam)` | Iteratively applies first improving add/remove move |
| `localSearchBest(initTeam)` | Iteratively applies best improving add/remove move |
| `guaranteedBestTeam()` | Exhaustive 2^n backtracking — globally optimal result |
| `optimalLocalSearchBest(t)` | True if localSearchBest from t matches the global optimum |
| `localSearchFirstWithSteps(initTeam)` | Like `localSearchFirst` but returns `List<List<Integer>>` of intermediate team states |
| `localSearchBestWithSteps(initTeam)` | Like `localSearchBest` but returns `List<List<Integer>>` of intermediate team states |

---

## Algorithm Comparison

| Algorithm | Strategy | Complexity | Optimal? |
|-----------|----------|------------|----------|
| `localSearchFirst` | First improving move each iteration | O(n²) per iter | No — local optimum |
| `localSearchBest` | Best improving move each iteration | O(n²) per iter | No — local optimum |
| `guaranteedBestTeam` | Exhaustive backtracking | O(2^n) | Yes — always |

### Exhaustive search complexity

`guaranteedBestTeam` uses `searchBestTeam()` which recurses over every player with include/exclude, generating **all 2^n subsets** — NOT C(n,k) fixed-size teams. This means:
- 7 players → 128 subsets → instant
- 20 players → 1,048,576 subsets → ~5 seconds (calibrated on Henry's M-series Mac)
- 30 players → 1,073,741,824 → impractical

Performance calibration: ~200,000 subset evaluations per second on local machine. This is used for the time estimate shown on the Graph Builder page.

---

## Canonical Form

A team split is always represented by the side containing the lowest player ID (player 0). `testWithLowestID()` enforces this. So if you run an algorithm and player 0 ends up in T2, the method swaps T1 and T2 before returning. This is why player 0 always appears in the result — it's not a bug, it's canonical ordering for consistent comparison between algorithms.

---

## Verification Reference

When testing, use the sample data to verify correctness:

```
Input: 0 1 2.0 / 0 2 1.0 / 0 4 4.0 / 1 2 3.0 / 1 6 5.0 / 2 3 2.0 / 2 5 1.0 / 2 6 2.0 / 3 5 3.0 / 4 5 1.0
Expected best team (containing player 0): {0, 2, 5, 6}
Expected score: 20.0

localSearchFirst({1,3,5})  → {0, 1, 5}, score 18
localSearchBest({0,5})     → {0, 2, 5, 6}, score 20
guaranteedBestTeam()       → {0, 2, 5, 6}, score 20
```
