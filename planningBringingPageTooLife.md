# Plan: Fill Empty Pages with Guides, Status & Explainers

## Context
The four functional pages (Graph Builder, Dashboard, Compare, Visualise) look empty and dead before the user interacts. They also lack explanation — even technical users struggle to understand what's happening. Need to make pages feel populated and accessible to non-technical visitors.

## Additions per page

### All pages: Graph Status Banner (Dashboard, Compare, Visualise only)
A banner at the top showing either:
- "No graph loaded yet — go to Graph Builder to create one" (with link) when no graph exists
- "Graph loaded: 7 players, 12 edges" when a graph is loaded

Implementation: `GET /api/graph` on mount (Visualise already does this). Create a small reusable `GraphStatus` component.

**File**: `matchmaking-ui/src/components/GraphStatus.tsx` (new)

### All pages: Collapsible "How does this work?" accordion
Each page gets a collapsible section with plain English guide + algorithm explainer cards + tips. Collapsed by default for repeat users, expandable for newcomers.

Simple `<details>/<summary>` HTML element styled with theme classes — no library needed.

**Files**: Each page file modified to add the accordion.

---

### Graph Builder page
**Accordion content:**
- **What is this?** "This page creates a network of players with compatibility scores. Think of it like a social network — each connection between two players has a number showing how well they play together. The higher the number, the better the pairing."
- **How to use:** "Pick how many players you want, hit Generate Random, then click Load Graph to send it to the matchmaking engine."
- **Tip:** "Start with 7 players to see results instantly. Above 20 players, the exhaustive algorithm will take noticeably longer."

**File**: `matchmaking-ui/src/pages/GraphBuilder.tsx`

### Dashboard page
**Accordion content:**
- **What is this?** "This page runs a single matchmaking algorithm to split your players into two balanced teams. The goal is to put players with high synergy on opposite teams, creating the most competitive match possible."
- **Algorithm explainer cards** (3 cards):
  - *Local Search (First)*: "Tries swapping one player at a time. Takes the first swap that improves the score. Fast but may miss the best answer."
  - *Local Search (Best)*: "Also swaps one player at a time, but checks every possible swap and picks the best one each round. Slower but smarter."
  - *Guaranteed Best (Exhaustive)*: "Checks every possible team combination to find the absolute best split. Perfect results, but gets very slow with more than ~20 players."
- **Tip:** "The 'Initial Team' field lets you choose which players start on Team 1. Try different starting teams with Local Search to see how the starting point affects the result."

**File**: `matchmaking-ui/src/pages/Dashboard.tsx`

### Compare page
**Accordion content:**
- **What is this?** "This page runs all three algorithms on the same graph and shows you how they compare. You'll see which one found the best team split (Most Accurate) and which one was quickest (Fastest)."
- **Why do scores differ?** "Local Search algorithms take shortcuts — they're fast but can get stuck on a 'good enough' answer. The Exhaustive algorithm checks everything and always finds the best answer, but takes much longer."
- **Tip:** "This is the best page to demonstrate the trade-off between speed and accuracy."

**File**: `matchmaking-ui/src/pages/Compare.tsx`

### Visualise page
**Accordion content:**
- **What is this?** "This page replays how an algorithm builds its team split, move by move. Blue nodes are Team 1, red nodes are Team 2. Watch as players get swapped between teams to improve the overall match balance."
- **Reading the graph:** "Lines between players represent how well they've played together. The algorithm tries to put strongly-connected players on opposite teams. Gold highlighted lines show the connections affected by the current move."
- **Tip:** "Click any row in the step history table to jump to that step. The Exhaustive algorithm only shows 2 steps (start → end) because it doesn't make incremental moves."

**File**: `matchmaking-ui/src/pages/Visualise.tsx`

---

## Implementation order
1. Create `GraphStatus.tsx` component
2. Add accordion + guide to Graph Builder
3. Add accordion + guide + status banner to Dashboard
4. Add accordion + guide + status banner to Compare
5. Add accordion + guide + status banner to Visualise
6. Add accordion CSS to `index.css` if needed

## Verification
- Visit each page — accordion visible, collapsed by default, expands on click
- Dashboard/Compare/Visualise show "No graph loaded" banner before loading a graph
- Load a graph → banner updates to show player/edge count
- Guides are readable by a non-technical person
