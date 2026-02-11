package student;

public class DataRow {

	private Integer firstPlayer;
	private Integer secondPlayer;
	private Double score;

	public DataRow(Integer f, Integer s, Double w) {
		firstPlayer = f;
		secondPlayer = s;
		score = w;
	}

	public Integer getFirst() {
		return firstPlayer;
	}

	public Integer getSecond() {
		return secondPlayer;
	}

	public void setFirst(int f) {
		firstPlayer = f;
	}

	public void setSecond(int s) {
		secondPlayer = s;
	}

	public Double getScore() {
		return score;
	}

	public void setScore (Double w) {
		score = w;
	}

	public String toString() {
		return firstPlayer + "-" + secondPlayer + "(" + score + ")";
	}

}
