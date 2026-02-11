package student;

import java.util.TreeSet;
import java.util.Iterator;

public class Team extends TreeSet<Integer> {
	
	// This just has the functionality of TreeSet.  
	//	You can find out what these functions are by the Java documentation, e.g. 
	//	https://docs.oracle.com/javase/8/docs/api/java/util/TreeSet.html
	// Includes e.g. add(), remove(), size(), etc
	// You can add other functions like print() if you wish.
	
	public Team() {
		super();
	}

	public void print() {
		System.out.println(this.toString());
	}
	
	public String toString() {
		// This is mainly to help with printing out,
		// and show how to add additional functions
		
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
