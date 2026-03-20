package com.matchmaking.algorithms;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.Collections;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.Vector;

/**
 * Builds a weighted player graph and searches for team splits with the highest
 * cross-team score.
 *
 * The graph is undirected:
 * each player points to the players they have teamed with before, together with
 * the score earned by that pairing.
 *
 * A team split is scored by summing every edge that crosses from the chosen team
 * to the complementary team.
 */
public class TeamChoose {

    private Map<Integer, PastPlayDeets> playerGraph;
    private Team bestTeamFound;
    private Double bestTeamScore;

    /**
     * Reads the weighted graph input file and converts each line into DataRow
     * objects that can be used to build the player graph.
     */
    public Vector<DataRow> readWeightedFromFile(String fInName) throws IOException {
        BufferedReader fIn = new BufferedReader(new FileReader(fInName));
        String s;
        Vector<DataRow> listOfDataRows = new Vector<DataRow>();
        Integer x, y;
        Double w;

        while ((s = fIn.readLine()) != null) {
            java.util.StringTokenizer line = new java.util.StringTokenizer(s);
            while (line.hasMoreTokens()) {
                x = Integer.parseInt(line.nextToken());
                y = Integer.parseInt(line.nextToken());
                w = Double.parseDouble(line.nextToken());
                System.out.println("x: " + x + " y: " + y + " w: " + w);
                listOfDataRows.add(new DataRow(x, y, w));
            }
        }
        fIn.close();

        return listOfDataRows;
    }

    /**
     * Creates an empty matchmaking graph.
     */
    public TeamChoose() {
        this.playerGraph = new TreeMap<Integer, PastPlayDeets>();
    }

    /**
     * Builds the undirected player graph from the input rows.
     * Each row is stored in both directions so score lookups work from either
     * player's point of view.
     */
    public void setPlayerGraph(Vector<DataRow> dataList) {
        playerGraph.clear();
        for (DataRow listVal : dataList) {
            Integer player1 = listVal.getFirst();
            Integer player2 = listVal.getSecond();
            Double score = listVal.getScore();

            playerGraph.putIfAbsent(player1, new PastPlayDeets());
            playerGraph.putIfAbsent(player2, new PastPlayDeets());

            playerGraph.get(player1).insertPlayerScore(player2, score);
            playerGraph.get(player2).insertPlayerScore(player1, score);
        }
    }

    /**
     * Returns the stored history for a player.
     */
    public PastPlayDeets getPlayerDetails(Integer p1) {
        if (playerGraph.containsKey(p1)) {
            PastPlayDeets returnValue = playerGraph.get(p1);
            return returnValue;
        }
        return null;
    }

    /**
     * Returns the smallest player ID that p1 has previously played with.
     */
    public Integer hasPlayedWithLowestID(Integer p1) {
        if (playerGraph.containsKey(p1)) {
            PastPlayDeets playerDetails = getPlayerDetails(p1);
            return playerDetails.hasPlayedWithLowestID();
        }
        return null;
    }

    /**
     * Returns every player that p1 has already played with as a Team object.
     */
    public Team hasPlayedWithAll(Integer p1) {
        if (playerGraph.containsKey(p1)) {
            Team allPlayerTeam = new Team();
            PastPlayDeets playerDetails = getPlayerDetails(p1);
            Set<Integer> allPlayerIds = playerDetails.listPastPlayers();
            allPlayerTeam.addAll(allPlayerIds);
            return allPlayerTeam;
        }
        return null;
    }

    /**
     * Returns the stored score between two players.
     * Missing edges are treated as score 0.0.
     */
    public Double scoreBetween(Integer p1, Integer p2) {
        if (!playerGraph.containsKey(p1) || !playerGraph.containsKey(p2)) {
            return 0.0;
        }
        return playerGraph.get(p1).getPlayerScore(p2);
    }

    /**
     * Returns the split score when p1 is isolated on one team and all other
     * players are on the opposite team.
     */
    public Double singlePlayerTeamScore(Integer p1) {
        if (playerGraph.containsKey(p1)) {
            PastPlayDeets p1Deets = getPlayerDetails(p1);
            return p1Deets.getPlayerScoreTota();
        }
        return null;
    }

    /**
     * Returns the complementary team containing every player not in pTeam.
     */
    public Team otherTeam(Team pTeam) {
        Team returnTeam = new Team();
        Set<Integer> playIDSet = playerGraph.keySet();

        for (Integer teamVal : playIDSet) {
            if (!pTeam.contains(teamVal)) {
                returnTeam.add(teamVal);
            }
        }
        return returnTeam;
    }

    /**
     * Calculates the split score for pTeam against its complementary team.
     * Only edges crossing between the two teams contribute to the score.
     */
    public Double multiPlayerTeamScore(Team pTeam) {
        Team mainTeam = pTeam;
        Team otherTeam = otherTeam(pTeam);
        Double score = 0.0;

        for (Integer otherTeamVal : otherTeam) {
            for (Integer mainTeamVal : mainTeam) {
                score += scoreBetween(mainTeamVal, otherTeamVal);
            }
        }

        return score;
    }

    /**
     * Returns the smallest player ID on a non-empty team.
     */
    public Integer lowestIDOnTeam(Team pTeam) {
        Integer returnVal = Collections.min(pTeam);
        return returnVal;
    }

    /**
     * Returns a team containing every player in the graph.
     */
    public Team allPlayerTeam() {
        Team finalTeam = new Team();
        Set<Integer> teamSet = playerGraph.keySet();
        finalTeam.addAll(teamSet);

        return finalTeam;
    }

    /**
     * Chooses the canonical representation of a split by returning whichever side
     * contains the lowest player ID.
     * This lets equivalent splits be compared consistently.
     */
    public Team testWithLowestID(Team pTeam) {
        Team otherTeam = otherTeam(pTeam);
        Team mainTeam = pTeam;

        if (mainTeam.isEmpty()) {
            return otherTeam;
        }
        if (otherTeam.isEmpty()) {
            return mainTeam;
        }

        if (Collections.min(otherTeam) < Collections.min(mainTeam)) {
            return otherTeam;
        }
        return mainTeam;
    }

    /**
     * Tests whether toggling player p1 improves the current split score.
     * If p1 is already on the team, the method tries removing p1.
     * Otherwise it tries adding p1.
     */
    public Boolean isBetter(Team pTeam, Integer p1) {
        Team modified = new Team();
        modified.addAll(pTeam);

        Double originalScore = multiPlayerTeamScore(pTeam);

        if (modified.contains(p1)) {
            modified.remove(p1);
        } else {
            modified.add(p1);
        }

        Double newScore = multiPlayerTeamScore(modified);

        return newScore > originalScore;
    }

    /**
     * Returns the lowest player ID that improves the split when added to pTeam.
     * If no single addition improves the score, the result is null.
     */
    public Integer firstSingleAddedImprovement(Team pTeam) {
        Team allTeam = allPlayerTeam();
        Iterator<Integer> teamIt = allTeam.iterator();
        while (teamIt.hasNext()) {
            Integer teamVal = teamIt.next();

            if (!pTeam.contains(teamVal)) {
                if (isBetter(pTeam, teamVal)) {
                    return teamVal;
                }
            }
        }

        return null;
    }

    /**
     * Returns the lowest player ID that improves the split when removed from
     * pTeam. If no single removal improves the score, the result is null.
     */
    public Integer firstSingleRemovedImprovement(Team pTeam) {
        Iterator<Integer> teamIt = pTeam.iterator();

        while (teamIt.hasNext()) {
            Integer teamVal = teamIt.next();

            if (isBetter(pTeam, teamVal)) {
                return teamVal;
            }

        }
        return null;
    }

    /**
     * Repeatedly applies the first improving add/remove move until no further
     * single-player improvement exists.
     */
    public Team localSearchFirst(Team initTeam) {
        Team currentTeam = new Team();
        currentTeam.addAll(initTeam);

        boolean improved;

        do {
            improved = false;

            Integer playerToAdd = firstSingleAddedImprovement(currentTeam);
            if (playerToAdd != null) {
                currentTeam.add(playerToAdd);
                improved = true;
            }

            Integer playerToRemove = firstSingleRemovedImprovement(currentTeam);
            if (playerToRemove != null) {
                currentTeam.remove(playerToRemove);
                improved = true;
            }

        } while (improved);

        return currentTeam;
    }

    /**
     * Returns the player whose addition gives the largest score increase.
     * Ties are broken by the smaller player ID.
     */
    public Integer bestSingleAddedImprovement(Team pTeam) {
        Integer bestPlayer = null;
        Double bestImprovement = 0.0;
        Double currentScore = multiPlayerTeamScore(pTeam);

        for (Integer player : allPlayerTeam()) {
            if (!pTeam.contains(player)) {
                Team testTeam = new Team();
                testTeam.addAll(pTeam);
                testTeam.add(player);

                Double improvement = multiPlayerTeamScore(testTeam) - currentScore;

                if (improvement > bestImprovement) {
                    bestImprovement = improvement;
                    bestPlayer = player;
                } else if (improvement > 0.0 && improvement.equals(bestImprovement)
                        && (bestPlayer == null || player < bestPlayer)) {
                    bestPlayer = player;
                }
            }
        }

        return bestPlayer;
    }

    /**
     * Returns the player whose removal gives the largest score increase.
     * Ties are broken by the smaller player ID.
     */
    public Integer bestSingleRemovedImprovement(Team pTeam) {
        Integer bestPlayer = null;
        Double bestImprovement = 0.0;
        Double currentScore = multiPlayerTeamScore(pTeam);

        for (Integer player : pTeam) {
            Team testTeam = new Team();
            testTeam.addAll(pTeam);
            testTeam.remove(player);

            Double improvement = multiPlayerTeamScore(testTeam) - currentScore;

            if (improvement > bestImprovement) {
                bestImprovement = improvement;
                bestPlayer = player;
            } else if (improvement > 0.0 && improvement.equals(bestImprovement)
                    && (bestPlayer == null || player < bestPlayer)) {
                bestPlayer = player;
            }
        }

        return bestPlayer;
    }

    /**
     * Repeatedly applies the best improving add/remove move until the split
     * reaches a local optimum.
     */
    public Team localSearchBest(Team initTeam) {
        Team currentTeam = new Team();
        currentTeam.addAll(initTeam);

        boolean improved;

        do {
            improved = false;

            Integer playerToAdd = bestSingleAddedImprovement(currentTeam);
            if (playerToAdd != null) {
                currentTeam.add(playerToAdd);
                improved = true;
            }

            Integer playerToRemove = bestSingleRemovedImprovement(currentTeam);
            if (playerToRemove != null) {
                currentTeam.remove(playerToRemove);
                improved = true;
            }

        } while (improved);

        return currentTeam;
    }

    /**
     * Returns the smallest player ID in the graph.
     * This is used to keep one canonical side of every split.
     */
    private Integer lowestOverallPlayerID() {
        return Collections.min(playerGraph.keySet());
    }

    /**
     * Converts a split into its canonical side so equivalent splits compare equal.
     */
    private Team canonicalTeam(Team pTeam) {
        Team chosenTeam = testWithLowestID(pTeam);
        Team canonical = new Team();
        canonical.addAll(chosenTeam);
        return canonical;
    }

    /**
     * Recursively explores every possible team split.
     * The best canonical team found so far is stored in bestTeamFound.
     */
    private void searchBestTeam(Vector<Integer> players, int index, Team currentTeam) {
        if (index == players.size()) {
            Integer lowestPlayer = lowestOverallPlayerID();
            if (!currentTeam.contains(lowestPlayer)) {
                return;
            }

            Double score = multiPlayerTeamScore(currentTeam);

            if (bestTeamFound == null || score > bestTeamScore) {
                bestTeamScore = score;
                bestTeamFound = canonicalTeam(currentTeam);
            }
            return;
        }

        Integer player = players.get(index);

        currentTeam.add(player);
        searchBestTeam(players, index + 1, currentTeam);

        currentTeam.remove(player);
        searchBestTeam(players, index + 1, currentTeam);
    }

    /**
     * Exhaustively searches every split and returns the globally best team.
     */
    public Team guaranteedBestTeam() {
        Vector<Integer> players = new Vector<Integer>();
        players.addAll(allPlayerTeam());

        bestTeamFound = null;
        bestTeamScore = Double.NEGATIVE_INFINITY;

        Team currentTeam = new Team();
        searchBestTeam(players, 0, currentTeam);

        return bestTeamFound;
    }

    /**
     * Checks whether localSearchBest reaches the same canonical split as the
     * exhaustive guaranteed best search.
     */
    public Boolean optimalLocalSearchBest(Team t) {
        Team localResult = localSearchBest(t);
        Team localNormalized = canonicalTeam(localResult);

        Team bestResult = guaranteedBestTeam();

        return localNormalized.equals(bestResult);
    }

    /**
     * Simple manual entry point used during local testing.
     */
    public static void main(String[] args) {
        TeamChoose allTeams = new TeamChoose();
        Vector<DataRow> listOfDataRows;

        try {
            listOfDataRows = allTeams.readWeightedFromFile("C:/Users/henry/eclipse-workspace-2010-round-2/FPSMatch2022Framework/Assignment-2-sample-data.txt");
        } catch (IOException e) {
            System.out.println("in exception: " + e);
        }
    }
}
