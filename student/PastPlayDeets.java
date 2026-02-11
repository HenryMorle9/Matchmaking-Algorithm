package student;

import java.util.TreeMap;
import java.util.Collections;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
//the nodes of the graph
public class PastPlayDeets {

	// Represents info for an individual player about past games

	// TODO: fill in data members (class variables)
	Map <Integer, Double> playersScores;
	Boolean marked;
	
	
	
	// TODO: complete functions below
	
	public PastPlayDeets() {
		// Constructor
		this.playersScores = new TreeMap<Integer, Double>();
		this.marked = false;
		// TODO		
	}
	public void setMarked() {
		marked = true;
	}
	public void setUnmarked() {
		marked = false;
	}
	
	public void insertPlayerScore(Integer p, Double w) {
		// PRE: -
		// POST: Stores pairing score w between current player and p
		playersScores.put(p, w);
		// TODO
	}
	
	public Double getPlayerScore(Integer p) {
		// PRE: -
		// POST: If current player has played with p,
		//          return pairing score
		//       otherwise
		//          return 0
		Double result = 0.0;
		if(playersScores.containsKey(p)) {
		result = playersScores.get(p);
		}
		// TODO
		
		return result;
	}
	
	public Double getPlayerScoreTota() {
		// PRE: -
		// POST: Returns the total of all pairing scores
		//          between current player and any other player
		
		// TODO
		Double sum = 0.0;
		
		for(Map.Entry<Integer, Double> neighbourPlayer:playersScores.entrySet()) {
			sum += neighbourPlayer.getValue();

		}
		return sum;
	}
	
	public Set<Integer> listPastPlayers() {
		// PRE: -
		// POST: Returns as a set all players that current player has played with
		Set<Integer> returnVal;
		returnVal = playersScores.keySet();
		// TODO
		
		return returnVal;
	}
	
	public Integer hasPlayedWithLowestID() {
		// PRE: -
		// POST: Returns, out of all the players that current player has previously played with,
		//           the player with the lowest ID
		//      returns null if there are no such players
		Set<Integer> allPastPlayers = listPastPlayers();
		if(allPastPlayers == null) return null;
		if(allPastPlayers.size() <=0) return null;
		Integer lowestVal = Collections.min(allPastPlayers);
		
		
		
		// TODO
		
		return lowestVal;
	}

}
