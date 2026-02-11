package student;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.Iterator;
import java.util.Map;
import java.util.TreeMap;
import java.util.Vector;


import java.util.Set;
import java.util.Arrays;
import java.util.Collections;

//the graph representing everything
public class TeamChoose {

	// Data members
	
	// TODO: add data members (class variables)
	Map <Integer, PastPlayDeets> playerGraph;
	private Iterator<Map.Entry<Integer, PastPlayDeets>> gIt;
	
	// Provided functions
	
	public Vector<DataRow> readWeightedFromFile(String fInName) throws IOException {
		// Reads list of past player interactions from a file, one per line 
		BufferedReader fIn = new BufferedReader(
							 new FileReader(fInName));
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
				listOfDataRows.add(new DataRow(x,y,w));
			}
		}
		fIn.close();
		
		return listOfDataRows;
	}


	// TODO: complete functions below
	
	// PASS
	
	public TeamChoose() {
		// Constructor
		this.playerGraph = new TreeMap<Integer, PastPlayDeets>();
		// TODO
	}

	public void setPlayerGraph(Vector<DataRow> dataList) { //done and marked
		// PRE: -
		// POST: Has initialised appropriate data members with
		//           the graph defined by dataList
		for(DataRow listVal: dataList) {
			Integer player1 = listVal.getFirst();
			Integer player2 = listVal.getSecond();
			Double score = listVal.getScore();
			
			playerGraph.putIfAbsent(player1, new PastPlayDeets());
			playerGraph.putIfAbsent(player2, new PastPlayDeets());
			
			playerGraph.get(player1).insertPlayerScore(player2, score);
			playerGraph.get(player2).insertPlayerScore(player1, score);
		}
		// TODO
	}
	
	public PastPlayDeets getPlayerDetails(Integer p1) { //done and marked
		// PRE: p1 is a valid player ID
		// POST: Returns the past player details for player p1
		// TODO
		if(playerGraph.containsKey(p1)) {
			PastPlayDeets returnValue = playerGraph.get(p1);
			return returnValue;
		}
		return null;
	}
	
	public Integer hasPlayedWithLowestID(Integer p1) { //done and marked
		// PRE: p1 is a valid player ID
		// POST: Returns, out of all the players p1 has previously played with,
		//           the player with the lowest ID
		// TODO
		if(playerGraph.containsKey(p1)) {
			PastPlayDeets playerDetails = getPlayerDetails(p1);
			return playerDetails.hasPlayedWithLowestID(); 
		}		
		return null;
	}
	
	public Team hasPlayedWithAll(Integer p1) { //done and marked
		// PRE: p1 is a valid player ID
		// POST: Returns all of the players p1 has played with, as a Team
		// TODO
		if(playerGraph.containsKey(p1)) {
			Team allPlayerTeam = new Team();
			PastPlayDeets playerDetails = getPlayerDetails(p1);
			Set<Integer> allPlayerIds = playerDetails.listPastPlayers();
			allPlayerTeam.addAll(allPlayerIds);
			return allPlayerTeam;
		}		
		return null;
	}
	
	public Double scoreBetween(Integer p1, Integer p2) { //done and marked
		// PRE: p1 and p2 are valid player IDs
		// POST: Returns score from past plays between p1 and p2
		
		// TODO
		if(playerGraph.containsKey(p1) && playerGraph.containsKey(p2)) {
			PastPlayDeets p1Deets = getPlayerDetails(p1);
			
			return p1Deets.getPlayerScore(p2);

		}
		return null;
	}
	
	public Double singlePlayerTeamScore(Integer p1) { //done and marked
		// PRE: p1 is a valid player ID
		// POST: Returns the score of p1 being on a team by himself/herself

		// TODO
		if(playerGraph.containsKey(p1)) {
			PastPlayDeets p1Deets = getPlayerDetails(p1);
			return p1Deets.getPlayerScoreTota();
		}
		return null;
	}

	public Team otherTeam(Team pTeam) { //done and marked
		// PRE: -
		// POST: Returns as a team all players not in pTeam
		Team returnTeam = new Team();
		Set<Integer> playIDSet = null;
		playIDSet = playerGraph.keySet();
		
		for(Integer teamVal: playIDSet) {
			if(!pTeam.contains(teamVal)) {
				returnTeam.add(teamVal);
			}
		}
		return returnTeam;

		// TODO
	}
	
	public Double multiPlayerTeamScore(Team pTeam) { //done and marked
		// PRE: -
		// POST: Returns the score of pTeam comprising one team 
		//           and the remaining players comprising the other team

		// TODO
		Team mainTeam = pTeam;
		Team otherTeam = otherTeam(pTeam);
		Double score = 0.0;
		
		for(Integer otherTeamVal: otherTeam) {
			for(Integer mainTeamVal: mainTeam) {
			score += scoreBetween(mainTeamVal, otherTeamVal);
			}
		}
		
		
		return score;
	}

	public Integer lowestIDOnTeam(Team pTeam) {
		// PRE: pTeam contains one or more valid player IDs
		// POST: Returns the lowest numbered player ID on pTeam
		
		// TODO
		Integer returnVal = Collections.min(pTeam);
		return returnVal;
	}
	
	public Team allPlayerTeam() {
		// PRE: -
		// POST: Returns all players as a single team
		Team finalTeam = new Team();
		Set teamSet = playerGraph.keySet();
		finalTeam.addAll(teamSet);
		// TODO
		
		return finalTeam;
	}
	
	public Team testWithLowestID(Team pTeam) { //done and tested
		// PRE: -
		// POST: Returns the team (i.e., either pTeam or the other player team) that has the lowest numbered player
		Team otherTeam = otherTeam(pTeam);
		Team mainTeam = pTeam;
		
		if(Collections.min(otherTeam) < Collections.min(mainTeam)) {
			return otherTeam;
		} else {
			return mainTeam;
		}
		
		// TODO
	}
	
	
	public Boolean isBetter(Team pTeam, Integer p1) {
		// PRE: pTeam contains one or more valid player IDs; p1 is a valid player ID
		// POST: If p1 is in pTeam, returns true if score of pTeam would be higher without p1,
		//                                  false otherwise;
		//       otherwise (i.e., p1 is not in pTeam),
		//                          returns true if score of pTeam would be higher with p1
		//                                  false otherwise;

		// TODO

		
		if(pTeam != null) {
			if(pTeam.size() >= 1 || playerGraph.containsKey(p1)) {
				Team teamDup = new Team();
				teamDup.addAll(pTeam);
				Double originalScore = multiPlayerTeamScore(teamDup);

				if(teamDup.contains(p1)) {
					teamDup.remove(p1);
				} else {
					teamDup.add(p1);
				}
				Double scoreRetry = multiPlayerTeamScore(teamDup);
				if(scoreRetry >= originalScore) {
					return true;
				} else {
					return false;
				}
			}
		}
		
		return null;
	}
	
	public Integer firstSingleAddedImprovement(Team pTeam) { //done and marked
		// PRE: -
		// POST: If pTeam can be improved by adding any single player p1 not in pTeam,
		// return the first (lowest ID) p1 that leads an improvement
		// otherwise (i.e., if pTeam cannot be improved by adding any players),
		// return null

		// TODO
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

	public Integer firstSingleRemovedImprovement(Team pTeam) {
		// PRE: pTeam contains one or more valid player IDs
		// POST: If pTeam can be improved by removing any single player p1 in pTeam,
		//                return the first p1 that leads to an improvement
		//       otherwise (i.e., if pTeam cannot be improved by removing any players),
		//                return null
		
		// TODO
		Iterator<Integer> teamIt = pTeam.iterator();
		
		while (teamIt.hasNext()) {
			Integer teamVal = teamIt.next();
			
				if (isBetter(pTeam, teamVal)) {
					return teamVal;
				}
		
	}
		return null;
	}

	// CREDIT / DISTINCTION
	

	public Team localSearchFirst(Team initTeam) { //done and marked
		// PRE: -
		// POST: Returns the team defined according to the localSearch pseudocode,
		//       starting from team initTeam as T_1
		//       choosing p_i, p_j to be the first (lowest ID) players 
		//       that improve the score
		
		// TODO
		Team startingTeam = initTeam;		
		
		
		boolean flag = false;
		do{
			Integer firstAddBestId = firstSingleAddedImprovement(startingTeam);
			Integer firstRemBestId = firstSingleRemovedImprovement(startingTeam);
			if((firstAddBestId==null) && (firstRemBestId==null)) {
				flag = true;
			}
			if(firstAddBestId != null) {
				startingTeam.add(firstAddBestId);
			}
			if(firstRemBestId != null) {
				startingTeam.remove(firstRemBestId);
			}
			
			
		} while(flag);
		
		return startingTeam;
	}

	public Integer bestSingleAddedImprovement(Team pTeam) { // done and marked
		// PRE: pTeam contains one or more valid player IDs
		// POST: If pTeam can be improved by adding any single player p1 not in pTeam,
		//                return the p1 that leads to the largest improvement (with the smallest p1 in case of ties)
		//       otherwise (i.e., if pTeam cannot be improved by adding any players),
		//                return null
		
		// TODO
		Integer bestPlayer = null;
		if (pTeam != null && pTeam.size() >= 1) {
			Double initScore = multiPlayerTeamScore(pTeam);
			Double bestImprovement = 0.0;
			for(Integer player: allPlayerTeam()) {
				if(!pTeam.contains(player)) {
					Team teamDupe = new Team();
					teamDupe.addAll(pTeam);
					teamDupe.add(player);
					Double newScore = multiPlayerTeamScore(teamDupe);
					Double improvement = newScore - initScore;
						if(improvement > bestImprovement) {
							bestImprovement = improvement;
							bestPlayer = player;
						}
						else if(improvement == bestImprovement && player < bestPlayer) {
							bestPlayer = player;
						}
				}
			}
		}
		return bestPlayer;
	}

	public Integer bestSingleRemovedImprovement(Team pTeam) { //done and marked
		// PRE: pTeam contains one or more valid player IDs
		// POST: If pTeam can be improved by removing any single player p1 in pTeam,
		//                return the p1 that leads to the largest improvement (with the smallest p1 in case of ties)
		//       otherwise (i.e., if pTeam cannot be improved by removing any players),
		//                return null
		
		// TODO
		
		Integer bestPlayer = null;
		if (pTeam != null && pTeam.size() >= 1) {
			Double initScore = multiPlayerTeamScore(pTeam);
			Double bestImprovement = 0.0;
			for(Integer player: pTeam) {
					Team teamDupe = new Team();
					teamDupe.addAll(pTeam);
					teamDupe.remove(player);
					Double newScore = multiPlayerTeamScore(teamDupe);
					Double improvement = newScore - initScore;
						if(improvement > bestImprovement) {
							bestImprovement = improvement;
							bestPlayer = player;
						}
						else if(improvement == bestImprovement && player < bestPlayer) {
							bestPlayer = player;
						}
				
			}
		}
		return bestPlayer;
	}


	public Team localSearchBest(Team initTeam) {
		// PRE: -
		// POST: Returns the team defined according to the localSearch pseudocode,
		//       starting from team initTeam as T_1
		//       choosing p_i, p_j to be the best players 
		//       that improve the score

		// TODO
		
		Team currentTeam = initTeam;
		Integer flag = 0;
		while(flag==0){
			Integer playerToAdd = bestSingleAddedImprovement(currentTeam);
			Integer playerToRemove = bestSingleRemovedImprovement(currentTeam);

			if (playerToAdd == null && playerToRemove == null) {
				flag = 1;
			}

			if (playerToAdd != null) {
				currentTeam.add(playerToAdd);
			}

			if (playerToRemove != null) {
				currentTeam.remove(playerToRemove);
			}
		} 

		return currentTeam;
	}
	
	// (HIGH) DISTINCTION

	public Team guaranteedBestTeam() {
		// PRE: -
		// POST: Returns the team containing player 0
		//       that results in the best possible score
		
		// TODO
		
		Team pTeam = new Team();
		pTeam.add(0);

		while(true){
			Integer nextBestPlayer = bestSingleAddedImprovement(pTeam);
			if(nextBestPlayer==null) break;
			pTeam.add(nextBestPlayer);
		}
		return pTeam;
	}
	
	public Boolean optimalLocalSearchBest(Team t) {
		// PRE: -
		// POST: If localSearchBest() applied to Team t gives the same team split as guaranteedBestTeam(),
		//          return true
		//       otherwise return false
		
		// TODO
		Team localRes = localSearchBest(t);
		Team localResOther = otherTeam(localRes);
		Team bestTeamRes = guaranteedBestTeam();
		Team besTeamResOther = otherTeam(bestTeamRes);
		if(localRes.equals(bestTeamRes) && localResOther.equals(besTeamResOther)) {
			return true;
		} else{
			return false;
		}
		
		
	}
	
	
	public static void main(String[] args) {

		TeamChoose allTeams = new TeamChoose();
		Vector<DataRow> listOfDataRows;
		
		try {
			Team s;
			listOfDataRows = allTeams.readWeightedFromFile("C:/Users/henry/eclipse-workspace-2010-round-2/FPSMatch2022Framework/Assignment-2-sample-data.txt");
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
		
	}

}
