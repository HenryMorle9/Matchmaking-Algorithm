package com.matchmaking.algorithms;

/**
 * Stores one weighted interaction from the input file.
 * Each row represents two player IDs and the score attached to that pairing.
 */
public class DataRow {

    private Integer firstPlayer;
    private Integer secondPlayer;
    private Double score;

    /**
     * Creates a single input row for two players and their pairing score.
     */
    public DataRow(Integer f, Integer s, Double w) {
        firstPlayer = f;
        secondPlayer = s;
        score = w;
    }

    /**
     * Returns the first player ID in the row.
     */
    public Integer getFirst() {
        return firstPlayer;
    }

    /**
     * Returns the second player ID in the row.
     */
    public Integer getSecond() {
        return secondPlayer;
    }

    /**
     * Updates the first player ID.
     */
    public void setFirst(int f) {
        firstPlayer = f;
    }

    /**
     * Updates the second player ID.
     */
    public void setSecond(int s) {
        secondPlayer = s;
    }

    /**
     * Returns the score attached to this pairing.
     */
    public Double getScore() {
        return score;
    }

    /**
     * Updates the score attached to this pairing.
     */
    public void setScore(Double w) {
        score = w;
    }

    /**
     * Formats the row as player-player(score) for debugging and printing.
     */
    public String toString() {
        return firstPlayer + "-" + secondPlayer + "(" + score + ")";
    }
}
