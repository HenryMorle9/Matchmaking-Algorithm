package com.matchmaking.algorithms;

import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

/**
 * Stores the history for one player in the graph.
 * The map key is another player ID and the value is the score for that pairing.
 */
public class PastPlayDeets {

    private Map<Integer, Double> playersScores;
    private Boolean marked;

    /**
     * Creates an empty history for a player.
     */
    public PastPlayDeets() {
        this.playersScores = new TreeMap<Integer, Double>();
        this.marked = false;
    }

    /**
     * Marks this player record.
     * The current assignment logic does not rely on this flag, but it can help
     * if graph traversal is added later.
     */
    public void setMarked() {
        marked = true;
    }

    /**
     * Clears the traversal mark on this player record.
     */
    public void setUnmarked() {
        marked = false;
    }

    /**
     * Records the score between the current player and another player.
     */
    public void insertPlayerScore(Integer p, Double w) {
        playersScores.put(p, w);
    }

    /**
     * Returns the score between the current player and player p.
     * If the players have not played together before, the score is 0.0.
     */
    public Double getPlayerScore(Integer p) {
        Double result = 0.0;
        if (playersScores.containsKey(p)) {
            result = playersScores.get(p);
        }

        return result;
    }

    /**
     * Adds together every stored pairing score for the current player.
     */
    public Double getPlayerScoreTota() {
        Double sum = 0.0;

        for (Map.Entry<Integer, Double> neighbourPlayer : playersScores.entrySet()) {
            sum += neighbourPlayer.getValue();
        }
        return sum;
    }

    /**
     * Returns the set of players the current player has already played with.
     */
    public Set<Integer> listPastPlayers() {
        Set<Integer> returnVal;
        returnVal = playersScores.keySet();

        return returnVal;
    }

    /**
     * Returns the smallest player ID stored in this player's history.
     * If no history exists, the result is null.
     */
    public Integer hasPlayedWithLowestID() {
        Set<Integer> allPastPlayers = listPastPlayers();
        if (allPastPlayers == null) {
            return null;
        }
        if (allPastPlayers.size() <= 0) {
            return null;
        }
        Integer lowestVal = Collections.min(allPastPlayers);

        return lowestVal;
    }
}
