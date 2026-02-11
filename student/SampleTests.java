package student;

import static org.junit.Assert.*;

import java.io.IOException;
import java.util.Vector;
import java.util.Set;
import java.util.TreeSet;
import java.util.HashSet;
import java.util.Arrays;

import org.junit.Test;

public class SampleTests {

	String PATH = "C:/Users/henry/eclipse-workspace-2010-round-2/FPSMatch2022Framework/";  
		// REPLACE WITH YOUR OWN DIRECTORY PATH
		// (in Windows might be something like "C:/User/...")
	String SAMPLEFILE = PATH + "Assignment-2-sample-data.txt";
	
	@Test
	public void testPastPlayA() {
		PastPlayDeets somePlayerHist = new PastPlayDeets();
		
		somePlayerHist.insertPlayerScore(2, 3.5);
		somePlayerHist.insertPlayerScore(3, 4.0);
		
		assertEquals(Double.valueOf(3.5), somePlayerHist.getPlayerScore(2));
	}

	@Test
	public void testPastPlayB() {
		PastPlayDeets somePlayerHist = new PastPlayDeets();
		
		somePlayerHist.insertPlayerScore(2, 3.5);
		somePlayerHist.insertPlayerScore(3, 4.0);
		
		assertEquals(Double.valueOf(7.5), somePlayerHist.getPlayerScoreTota());
	}
	
	@Test
	public void testPastPlayC() {
		PastPlayDeets somePlayerHist = new PastPlayDeets();
		Set<Integer> s = new TreeSet<Integer>(Arrays.asList(2, 3));
		
		somePlayerHist.insertPlayerScore(2, 3.5);
		somePlayerHist.insertPlayerScore(3, 4.0);
		
		assertEquals(s, somePlayerHist.listPastPlayers());
	}

	@Test
	public void testPastPlayD() {
		PastPlayDeets somePlayerHist = new PastPlayDeets();
		
		somePlayerHist.insertPlayerScore(2, 3.5);
		somePlayerHist.insertPlayerScore(3, 4.0);
		
		assertEquals(Integer.valueOf(2), somePlayerHist.hasPlayedWithLowestID());
	}

	@Test
	public void testGetPlayerDetails() {
		TeamChoose allTeams = new TeamChoose();
		Vector<DataRow> listOfDataRows;
		
		try {
			listOfDataRows = allTeams.readWeightedFromFile(SAMPLEFILE);
			allTeams.setPlayerGraph(listOfDataRows);
			assertEquals(Double.valueOf(4.0), allTeams.getPlayerDetails(0).getPlayerScore(4));
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
	}

	@Test
	public void testHasPlayedWithLowestID() {
		TeamChoose allTeams = new TeamChoose();
		Vector<DataRow> listOfDataRows;
		
		try {
			listOfDataRows = allTeams.readWeightedFromFile(SAMPLEFILE);
			allTeams.setPlayerGraph(listOfDataRows);
			assertEquals(Integer.valueOf(1), allTeams.hasPlayedWithLowestID(0));
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
	}

	@Test
	public void testHasPlayedWithAll() {
		TeamChoose allTeams = new TeamChoose();
		Vector<DataRow> listOfDataRows;
		Team t = new Team();
		t.add(1);
		t.add(2);
		t.add(4);
		
		try {
			listOfDataRows = allTeams.readWeightedFromFile(SAMPLEFILE);
			allTeams.setPlayerGraph(listOfDataRows);
			assertEquals(t, allTeams.hasPlayedWithAll(0));
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
	}

	@Test
	public void testScoreBetween() {
		TeamChoose allTeams = new TeamChoose();
		Vector<DataRow> listOfDataRows;
		
		try {
			listOfDataRows = allTeams.readWeightedFromFile(SAMPLEFILE);
			allTeams.setPlayerGraph(listOfDataRows);
			assertEquals(Double.valueOf(4.0), allTeams.scoreBetween(0, 4));
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
	}


	@Test
	public void testSinglePlayerTeamScore() {
		TeamChoose allTeams = new TeamChoose();
		Vector<DataRow> listOfDataRows;
		
		try {
			listOfDataRows = allTeams.readWeightedFromFile(SAMPLEFILE);
			allTeams.setPlayerGraph(listOfDataRows);
			assertEquals(Double.valueOf(10.0), allTeams.singlePlayerTeamScore(1));
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
	}

	@Test
	public void testOtherTeam() {
		TeamChoose allTeams = new TeamChoose();
		Vector<DataRow> listOfDataRows;
		Team startT = new Team();
		startT.add(0);
		startT.add(3);
		Team answerT = new Team();
		answerT.add(1);
		answerT.add(2);
		answerT.add(4);
		answerT.add(5);
		answerT.add(6);
	
		try {
			listOfDataRows = allTeams.readWeightedFromFile(SAMPLEFILE);
			allTeams.setPlayerGraph(listOfDataRows);
			assertEquals(answerT, allTeams.otherTeam(startT));
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
	}

	@Test
	public void testMultiPlayerTeamScore() {
		TeamChoose allTeams = new TeamChoose();
		Vector<DataRow> listOfDataRows;
		Team t = new Team();
		t.add(1);
		t.add(3);
		t.add(5);
	
		try {
			listOfDataRows = allTeams.readWeightedFromFile(SAMPLEFILE);
			allTeams.setPlayerGraph(listOfDataRows);
			assertEquals(Double.valueOf(14.0), allTeams.multiPlayerTeamScore(t));
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
	}

	@Test
	public void testLowestIDOnTeam() {
		TeamChoose allTeams = new TeamChoose();
		Vector<DataRow> listOfDataRows;
		Team t = new Team();
		t.add(1);
		t.add(3);
		t.add(5);
		t.add(6);

		try {
			listOfDataRows = allTeams.readWeightedFromFile(SAMPLEFILE);
			allTeams.setPlayerGraph(listOfDataRows);
			assertEquals(Integer.valueOf(1), allTeams.lowestIDOnTeam(t));
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
	}

	@Test
	public void testAllPlayerTeam() {
		TeamChoose allTeams = new TeamChoose();
		Vector<DataRow> listOfDataRows;
		Team t = new Team();
		t.add(0);
		t.add(1);
		t.add(2);
		t.add(3);
		t.add(4);
		t.add(5);
		t.add(6);

		try {
			listOfDataRows = allTeams.readWeightedFromFile(SAMPLEFILE);
			allTeams.setPlayerGraph(listOfDataRows);
			assertEquals(t, allTeams.allPlayerTeam());
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
	}

	@Test
	public void testTeamT1() {
		TeamChoose allTeams = new TeamChoose();
		Vector<DataRow> listOfDataRows;
		Team startT = new Team();
		startT.add(0);
		startT.add(3);
		Team answerT = new Team();
		answerT.add(1);
		answerT.add(2);
		answerT.add(4);
		answerT.add(5);
		answerT.add(6);

		try {
			listOfDataRows = allTeams.readWeightedFromFile(SAMPLEFILE);
			allTeams.setPlayerGraph(listOfDataRows);
			assertEquals(startT, allTeams.testWithLowestID(answerT));
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
	}

	@Test
	public void testIsBetterA() {
		
		// Testing whether team of player 1, 3, 5 is better with 6
		
		TeamChoose allTeams = new TeamChoose();
		Vector<DataRow> listOfDataRows;
		Team t = new Team();
		t.add(1);
		t.add(3);
		t.add(5);

		try {
			listOfDataRows = allTeams.readWeightedFromFile(SAMPLEFILE);
			allTeams.setPlayerGraph(listOfDataRows);
			assertFalse(allTeams.isBetter(t, 6));
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
	}

	@Test
	public void testIsBetterB() {
		
		// Testing whether team of player 1, 3, 5, 6 is better without 6
		
		TeamChoose allTeams = new TeamChoose();
		Vector<DataRow> listOfDataRows;
		Team t = new Team();
		t.add(1);
		t.add(3);
		t.add(5);
		t.add(6);

		try {
			listOfDataRows = allTeams.readWeightedFromFile(SAMPLEFILE);
			allTeams.setPlayerGraph(listOfDataRows);
			assertTrue(allTeams.isBetter(t, 6));
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
	}

	@Test
	public void testFirstSingleAddedImprovement() {
		TeamChoose allTeams = new TeamChoose();
		Vector<DataRow> listOfDataRows;
		Team t = new Team();
		t.add(1);
		t.add(3);
		t.add(5);

		try {
			listOfDataRows = allTeams.readWeightedFromFile(SAMPLEFILE);
			allTeams.setPlayerGraph(listOfDataRows);
			assertEquals(Integer.valueOf(0), allTeams.firstSingleAddedImprovement(t));
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
	}

	@Test
	public void testFirstSingleRemovedImprovement() {
		TeamChoose allTeams = new TeamChoose();
		Vector<DataRow> listOfDataRows;
		Team t = new Team();
		t.add(1);
		t.add(3);
		t.add(5);

		try {
			listOfDataRows = allTeams.readWeightedFromFile(SAMPLEFILE);
			allTeams.setPlayerGraph(listOfDataRows);
			assertEquals(Integer.valueOf(3), allTeams.firstSingleRemovedImprovement(t));
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
	}

	@Test
	public void testLocalSearchFirst() {
		TeamChoose allTeams = new TeamChoose();
		Vector<DataRow> listOfDataRows;
		Team startT = new Team();
		startT.add(0);
		startT.add(5);
		Team answerT = new Team();
		answerT.add(0);
		answerT.add(1);
		answerT.add(5);

		try {
			listOfDataRows = allTeams.readWeightedFromFile(SAMPLEFILE);
			allTeams.setPlayerGraph(listOfDataRows);
			assertEquals(answerT, allTeams.localSearchFirst(startT));
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
	}

	@Test
	public void testBestSingleAddedImprovement() {
		TeamChoose allTeams = new TeamChoose();
		Vector<DataRow> listOfDataRows;
		Team t = new Team();
		t.add(3);
		t.add(5);

		try {
			listOfDataRows = allTeams.readWeightedFromFile(SAMPLEFILE);
			allTeams.setPlayerGraph(listOfDataRows);
			assertEquals(Integer.valueOf(1), allTeams.bestSingleAddedImprovement(t));
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
	}

	@Test
	public void testBestSingleRemovedImprovement() {
		TeamChoose allTeams = new TeamChoose();
		Vector<DataRow> listOfDataRows;
		Team t = new Team();
		t.add(1);
		t.add(3);
		t.add(5);
		t.add(6);

		try {
			listOfDataRows = allTeams.readWeightedFromFile(SAMPLEFILE);
			allTeams.setPlayerGraph(listOfDataRows);
			assertEquals(Integer.valueOf(6), allTeams.bestSingleRemovedImprovement(t));
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
	}

	@Test
	public void testLocalSearchBest() {
		TeamChoose allTeams = new TeamChoose();
		Vector<DataRow> listOfDataRows;
		Team startT = new Team();
		startT.add(0);
		startT.add(5);
		Team answerT = new Team();
		answerT.add(0);
		answerT.add(2);
		answerT.add(5);
		answerT.add(6);

		try {
			listOfDataRows = allTeams.readWeightedFromFile(SAMPLEFILE);
			allTeams.setPlayerGraph(listOfDataRows);
			assertEquals(answerT, allTeams.localSearchBest(startT));
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
	}

	@Test
	public void testGuaranteedBestTeam() {
		TeamChoose allTeams = new TeamChoose();
		Vector<DataRow> listOfDataRows;
		Team answerT = new Team();
		answerT.add(0);
		answerT.add(2);
		answerT.add(5);
		answerT.add(6);

		try {
			listOfDataRows = allTeams.readWeightedFromFile(SAMPLEFILE);
			allTeams.setPlayerGraph(listOfDataRows);
			assertEquals(answerT, allTeams.guaranteedBestTeam());
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
	}

	@Test
	public void testOptimalLocalSearchBestA() {
		TeamChoose allTeams = new TeamChoose();
		Team tester = new Team();
		tester.add(0);
		Vector<DataRow> listOfDataRows;

		try {
			listOfDataRows = allTeams.readWeightedFromFile(SAMPLEFILE);
			allTeams.setPlayerGraph(listOfDataRows);
//			assertTrue(allTeams.optimalLocalSearchBest(new Team()));
			assertTrue(allTeams.optimalLocalSearchBest(tester));
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
	}


}
