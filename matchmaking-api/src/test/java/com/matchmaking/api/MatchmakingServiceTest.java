package com.matchmaking.api;

import com.matchmaking.api.dto.*;
import com.matchmaking.api.service.MatchmakingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Verifies the service layer against the known sample data.
 */
@DisplayName("Service Layer")
class MatchmakingServiceTest {

    private MatchmakingService service;

    @BeforeEach
    void setUp() {
        service = new MatchmakingService();

        GraphInputDto graph = new GraphInputDto(List.of(
                new EdgeDto(0, 1, 2.0),
                new EdgeDto(0, 2, 1.0),
                new EdgeDto(0, 4, 4.0),
                new EdgeDto(1, 2, 3.0),
                new EdgeDto(1, 6, 5.0),
                new EdgeDto(2, 3, 2.0),
                new EdgeDto(2, 5, 1.0),
                new EdgeDto(2, 6, 2.0),
                new EdgeDto(3, 5, 3.0),
                new EdgeDto(4, 5, 1.0)
        ));
        service.loadGraph(graph);
    }

    @Test
    @DisplayName("Guaranteed Best finds optimal score 20")
    void guaranteedBestTeam_findsOptimalSplit() {
        RunRequestDto req = new RunRequestDto();
        req.setAlgorithm("guaranteedBestTeam");
        req.setInitialTeam(List.of());

        TeamResultDto result = service.runAlgorithm(req);

        assertEquals(List.of(0, 2, 5, 6), result.getTeam());
        assertEquals(20.0, result.getScore());
    }

    @Test
    @DisplayName("Local Search Best from {0,5} finds optimal")
    void localSearchBest_fromGoodStart_findsOptimal() {
        RunRequestDto req = new RunRequestDto();
        req.setAlgorithm("localSearchBest");
        req.setInitialTeam(List.of(0, 5));

        TeamResultDto result = service.runAlgorithm(req);

        assertEquals(List.of(0, 2, 5, 6), result.getTeam());
        assertEquals(20.0, result.getScore());
    }

    @Test
    @DisplayName("Local Search First from {1,3,5} finds local optimum 18")
    void localSearchFirst_fromDifferentStart_findsLocalOptimum() {
        RunRequestDto req = new RunRequestDto();
        req.setAlgorithm("localSearchFirst");
        req.setInitialTeam(List.of(1, 3, 5));

        TeamResultDto result = service.runAlgorithm(req);

        assertEquals(List.of(0, 1, 5), result.getTeam());
        assertEquals(18.0, result.getScore());
    }

    @Test
    @DisplayName("Compare returns all 3 algorithm results")
    void compareAll_returnsThreeResults() {
        CompareResultDto result = service.compareAll(List.of(0, 5));

        assertEquals(3, result.getResults().size());
        assertEquals("localSearchFirst", result.getResults().get(0).getAlgorithm());
        assertEquals("localSearchBest", result.getResults().get(1).getAlgorithm());
        assertEquals("guaranteedBestTeam", result.getResults().get(2).getAlgorithm());
    }

    // === Step-by-step tests ===

    @Test
    @DisplayName("Steps for Local Search First returns correct first and last step")
    void stepsLocalSearchFirst_returnsCorrectSteps() {
        RunRequestDto req = new RunRequestDto();
        req.setAlgorithm("localSearchFirst");
        req.setInitialTeam(List.of(1, 3, 5));

        StepsResultDto result = service.runWithSteps(req);

        assertEquals("localSearchFirst", result.getAlgorithm());
        assertTrue(result.getSteps().size() > 1);
        assertEquals("Initial team", result.getSteps().get(0).getAction());
        // Final step should reach score 18
        StepDto lastStep = result.getSteps().get(result.getSteps().size() - 1);
        assertEquals(18.0, lastStep.getScore());
    }

    @Test
    @DisplayName("Steps for Local Search Best reaches optimal score 20")
    void stepsLocalSearchBest_reachesOptimal() {
        RunRequestDto req = new RunRequestDto();
        req.setAlgorithm("localSearchBest");
        req.setInitialTeam(List.of(0, 5));

        StepsResultDto result = service.runWithSteps(req);

        assertEquals("localSearchBest", result.getAlgorithm());
        assertTrue(result.getSteps().size() > 1);
        StepDto lastStep = result.getSteps().get(result.getSteps().size() - 1);
        assertEquals(20.0, lastStep.getScore());
        assertEquals(List.of(0, 2, 5, 6), lastStep.getTeam());
    }

    @Test
    @DisplayName("Steps for Guaranteed Best returns 2 steps with optimal result")
    void stepsGuaranteedBest_returnsTwoSteps() {
        RunRequestDto req = new RunRequestDto();
        req.setAlgorithm("guaranteedBestTeam");
        req.setInitialTeam(List.of());

        StepsResultDto result = service.runWithSteps(req);

        assertEquals("guaranteedBestTeam", result.getAlgorithm());
        assertEquals(2, result.getSteps().size());
        assertEquals("Initial team", result.getSteps().get(0).getAction());
        assertEquals("Optimal team found", result.getSteps().get(1).getAction());
        assertEquals(20.0, result.getSteps().get(1).getScore());
    }

    @Test
    @DisplayName("Guaranteed Best initial step keeps Team 1 empty and Team 2 populated")
    void stepsGuaranteedBest_initialStepShowsComplementaryTeam() {
        RunRequestDto req = new RunRequestDto();
        req.setAlgorithm("guaranteedBestTeam");
        req.setInitialTeam(List.of());

        StepsResultDto result = service.runWithSteps(req);

        StepDto initialStep = result.getSteps().get(0);
        assertTrue(initialStep.getTeam().isEmpty());
        assertEquals(7, initialStep.getOpposingTeam().size());
    }

    @Test
    @DisplayName("Steps scores never decrease")
    void stepsScores_neverDecrease() {
        RunRequestDto req = new RunRequestDto();
        req.setAlgorithm("localSearchBest");
        req.setInitialTeam(List.of(0, 5));

        StepsResultDto result = service.runWithSteps(req);

        for (int i = 1; i < result.getSteps().size(); i++) {
            assertTrue(
                result.getSteps().get(i).getScore() >= result.getSteps().get(i - 1).getScore(),
                "Score should never decrease between steps"
            );
        }
    }
}
