package com.matchmaking.algorithms;

import java.util.Iterator;
import java.util.TreeSet;

/**
 * Represents one team as a sorted set of player IDs.
 * Extending TreeSet keeps the team ordered automatically, which makes
 * lowest-ID comparisons and readable output easy.
 */
public class Team extends TreeSet<Integer> {

    /**
     * Creates an empty team.
     */
    public Team() {
        super();
    }

    /**
     * Prints the team using the custom string format.
     */
    public void print() {
        System.out.println(this.toString());
    }

    /**
     * Formats the team as a list of player IDs joined by "--".
     */
    public String toString() {
        String retval = new String();
        Iterator<Integer> p = this.iterator();
        if (p.hasNext()) {
            retval += p.next();
        }
        while (p.hasNext()) {
            retval += "--" + p.next();
        }
        return retval;
    }
}
