# Balanced Teams Matchmaking (Work in Progress)

A Java-based matchmaking and team-balancing project exploring graph-based modelling and local search optimisation techniques.

This repository is an early-stage implementation and is actively evolving. The current focus is on building and validating the core algorithms before adding interfaces or extensions.

---

## Project Overview

In many team-based games or collaborative systems, players perform differently depending on who they play with.  
This project models those historical interactions and attempts to split players into two teams such that the overall match is as balanced as possible.

Players are represented as nodes in a graph, and weighted edges represent how well two players have previously performed together. The algorithm aims to place players with strong past synergy on opposing teams.

---

## Current Focus

At this stage, the project focuses on:

- Representing player relationships using graph-like data structures
- Defining a clear scoring function for evaluating team splits
- Implementing and testing local search–based optimisation strategies
- Ensuring correctness through unit tests

The structure and algorithms are subject to change as the project is refined.

---

## Implemented Components

### Core Data Structures
- **`DataRow`**  
  Represents a single pairing record between two players and their associated score.

- **`PastPlayDeets`**  
  Stores historical pairing data for a given player and provides access to pairing scores and metadata.

- **`Team`**  
  Represents a team of players, implemented as a sorted set of player IDs.

### Algorithm Logic
- **`TeamChoose`**  
  Contains the main matchmaking logic, including:
  - Team scoring functions
  - Player add/remove evaluation
  - Local search–based team optimisation strategies

### Testing
- **`SampleTests`**  
  Unit tests used to validate correctness of the scoring logic and team optimisation behaviour.

---

## Algorithmic Approach (Initial)

- Players form vertices in a weighted, undirected graph
- Edge weights represent historical performance synergy
- A team split is scored by summing all edge weights that cross between the two teams
- Local search techniques are used to iteratively improve an initial team assignment

---

## Input Format

Player pairing data is represented as weighted pairs:

