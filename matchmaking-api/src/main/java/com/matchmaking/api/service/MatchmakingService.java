package com.matchmaking.api.service;

import com.matchmaking.algorithms.DataRow;
import com.matchmaking.algorithms.Team;
import com.matchmaking.algorithms.TeamChoose;
import com.matchmaking.api.dto.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

/**
 * Business logic layer that bridges the REST API and the core algorithm.
 *
 * Holds a single TeamChoose instance in memory. The graph is loaded once via
 * loadGraph() and then reused across algorithm runs until replaced.
 */
@Service
public class MatchmakingService {

    private final TeamChoose teamChoose = new TeamChoose();
    private List<EdgeDto> currentEdges = new ArrayList<>();
    private boolean graphLoaded = false;

    /**
     * Converts the DTO edge list into DataRow objects and builds the player graph.
     */
    public void loadGraph(GraphInputDto input) {
        Vector<DataRow> dataRows = new Vector<>();
        for (EdgeDto edge : input.getEdges()) {
            dataRows.add(new DataRow(edge.getP1(), edge.getP2(), edge.getScore()));
        }
        teamChoose.setPlayerGraph(dataRows);
        currentEdges = new ArrayList<>(input.getEdges());
        graphLoaded = true;
    }

    /**
     * Returns the edges currently loaded in the graph.
     */
    public GraphInputDto getGraph() {
        return new GraphInputDto(currentEdges);
    }

    public boolean isGraphLoaded() {
        return graphLoaded;
    }

    /**
     * Runs a single algorithm and returns the result with timing.
     */
    public TeamResultDto runAlgorithm(RunRequestDto request) {
        Team initTeam = toTeam(request.getInitialTeam());

        long start = System.currentTimeMillis();
        Team resultTeam = dispatchAlgorithm(request.getAlgorithm(), initTeam);
        long elapsed = System.currentTimeMillis() - start;

        return buildResult(request.getAlgorithm(), resultTeam, elapsed);
    }

    /**
     * Runs all three algorithms and returns their results for comparison.
     */
    public CompareResultDto compareAll(List<Integer> initialTeam) {
        List<TeamResultDto> results = new ArrayList<>();
        for (String algo : List.of("localSearchFirst", "localSearchBest", "guaranteedBestTeam")) {
            RunRequestDto req = new RunRequestDto();
            req.setAlgorithm(algo);
            req.setInitialTeam(initialTeam);
            results.add(runAlgorithm(req));
        }
        return new CompareResultDto(results);
    }

    /**
     * Runs a local search algorithm and returns every intermediate team state.
     */
    public StepsResultDto runWithSteps(RunRequestDto request) {
        Team initTeam = toTeam(request.getInitialTeam());

        long start = System.currentTimeMillis();
        List<List<Integer>> rawSteps;

        switch (request.getAlgorithm()) {
            case "localSearchFirst":
                rawSteps = teamChoose.localSearchFirstWithSteps(initTeam);
                break;
            case "localSearchBest":
                rawSteps = teamChoose.localSearchBestWithSteps(initTeam);
                break;
            case "guaranteedBestTeam": {
                Team result = teamChoose.guaranteedBestTeam();
                rawSteps = new ArrayList<>();
                rawSteps.add(new ArrayList<>());
                rawSteps.add(new ArrayList<>(result));
                break;
            }
            default:
                throw new IllegalArgumentException("Unknown algorithm: " + request.getAlgorithm());
        }

        long elapsed = System.currentTimeMillis() - start;

        List<StepDto> steps = new ArrayList<>();
        List<Integer> previousTeam = null;

        for (int i = 0; i < rawSteps.size(); i++) {
            List<Integer> teamIds = rawSteps.get(i);
            Team team = toTeam(teamIds);
            Team opposing = teamChoose.otherTeam(team);
            double score = teamChoose.multiPlayerTeamScore(team);

            String action = (i == 0) ? "Initial team" : describeMove(previousTeam, teamIds);
            steps.add(new StepDto(
                    i,
                    new ArrayList<>(team),
                    new ArrayList<>(opposing),
                    score,
                    action
            ));
            previousTeam = teamIds;
        }

        return new StepsResultDto(request.getAlgorithm(), steps, elapsed);
    }

    private Team dispatchAlgorithm(String algorithm, Team initTeam) {
        switch (algorithm) {
            case "localSearchFirst":  return teamChoose.localSearchFirst(initTeam);
            case "localSearchBest":   return teamChoose.localSearchBest(initTeam);
            case "guaranteedBestTeam": return teamChoose.guaranteedBestTeam();
            default: throw new IllegalArgumentException("Unknown algorithm: " + algorithm);
        }
    }

    private TeamResultDto buildResult(String algorithm, Team team, long elapsedMs) {
        Team canonical = teamChoose.testWithLowestID(team);
        Team opposing = teamChoose.otherTeam(canonical);
        double score = teamChoose.multiPlayerTeamScore(canonical);
        return new TeamResultDto(algorithm, new ArrayList<>(canonical), new ArrayList<>(opposing), score, elapsedMs);
    }

    /**
     * Describes what changed between two consecutive team states.
     */
    private String describeMove(List<Integer> before, List<Integer> after) {
        List<Integer> added = new ArrayList<>();
        List<Integer> removed = new ArrayList<>();
        for (Integer p : after) {
            if (!before.contains(p)) added.add(p);
        }
        for (Integer p : before) {
            if (!after.contains(p)) removed.add(p);
        }
        if (added.size() == 1 && removed.isEmpty()) return "Added player " + added.get(0);
        if (removed.size() == 1 && added.isEmpty()) return "Removed player " + removed.get(0);
        if (!added.isEmpty()) return "Optimal team found";
        return "No change";
    }

    /**
     * Converts a list of player IDs into a Team object.
     */
    private Team toTeam(List<Integer> playerIds) {
        Team team = new Team();
        team.addAll(playerIds);
        return team;
    }
}
