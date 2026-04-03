package com.matchmaking.api;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * API integration tests — tests the full HTTP request/response cycle.
 *
 * Uses MockMvc to simulate HTTP calls without starting a real server.
 * Tests are ordered because later tests depend on a graph being loaded first.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("API Endpoints")
class MatchmakingApiTest {

    @Autowired
    private MockMvc mockMvc;

    /** The sample graph JSON — same 10 edges from the assignment */
    private static final String SAMPLE_GRAPH_JSON = """
            {
              "edges": [
                {"p1": 0, "p2": 1, "score": 2.0},
                {"p1": 0, "p2": 2, "score": 1.0},
                {"p1": 0, "p2": 4, "score": 4.0},
                {"p1": 1, "p2": 2, "score": 3.0},
                {"p1": 1, "p2": 6, "score": 5.0},
                {"p1": 2, "p2": 3, "score": 2.0},
                {"p1": 2, "p2": 5, "score": 1.0},
                {"p1": 2, "p2": 6, "score": 2.0},
                {"p1": 3, "p2": 5, "score": 3.0},
                {"p1": 4, "p2": 5, "score": 1.0}
              ]
            }
            """;

    @Test
    @Order(1)
    @DisplayName("GET /graph before loading returns 200 with empty edges")
    void getGraph_beforeLoading_returnsEmptyEdges() throws Exception {
        mockMvc.perform(get("/api/graph"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.edges").isArray())
                .andExpect(jsonPath("$.edges.length()").value(0));
    }

    @Test
    @Order(2)
    @DisplayName("POST /graph loads 10 edges")
    void loadGraph_withValidData_returns200() throws Exception {
        mockMvc.perform(post("/api/graph")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(SAMPLE_GRAPH_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("Graph loaded with 10 edges"));
    }

    @Test
    @Order(3)
    @DisplayName("GET /graph after loading returns edges")
    void getGraph_afterLoading_returnsEdges() throws Exception {
        mockMvc.perform(get("/api/graph"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.edges").isArray())
                .andExpect(jsonPath("$.edges.length()").value(10));
    }

    @Test
    @Order(4)
    @DisplayName("Run without algorithm returns 400")
    void run_withMissingAlgorithm_returns400() throws Exception {
        mockMvc.perform(post("/api/matchmaking/run")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"initialTeam": [0, 5]}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(5)
    @DisplayName("Local Search First returns score 18")
    void run_localSearchFirst_returnsCorrectResult() throws Exception {
        mockMvc.perform(post("/api/matchmaking/run")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"algorithm": "localSearchFirst", "initialTeam": [1, 3, 5]}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.algorithm").value("localSearchFirst"))
                .andExpect(jsonPath("$.team").isArray())
                .andExpect(jsonPath("$.score").value(18.0));
    }

    @Test
    @Order(6)
    @DisplayName("Local Search Best returns score 20")
    void run_localSearchBest_returnsCorrectResult() throws Exception {
        mockMvc.perform(post("/api/matchmaking/run")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"algorithm": "localSearchBest", "initialTeam": [0, 5]}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.algorithm").value("localSearchBest"))
                .andExpect(jsonPath("$.score").value(20.0));
    }

    @Test
    @Order(7)
    @DisplayName("Guaranteed Best returns score 20")
    void run_guaranteedBestTeam_returnsOptimal() throws Exception {
        mockMvc.perform(post("/api/matchmaking/run")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"algorithm": "guaranteedBestTeam", "initialTeam": []}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.algorithm").value("guaranteedBestTeam"))
                .andExpect(jsonPath("$.score").value(20.0));
    }

    @Test
    @Order(8)
    @DisplayName("Steps for Local Search First returns steps with correct structure")
    void steps_localSearchFirst_returnsSteps() throws Exception {
        mockMvc.perform(post("/api/matchmaking/steps")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"algorithm": "localSearchFirst", "initialTeam": [1, 3, 5]}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.algorithm").value("localSearchFirst"))
                .andExpect(jsonPath("$.steps").isArray())
                .andExpect(jsonPath("$.steps[0].action").value("Initial team"))
                .andExpect(jsonPath("$.steps[0].stepNumber").value(0));
    }

    @Test
    @Order(9)
    @DisplayName("Steps for Guaranteed Best returns 2 steps")
    void steps_guaranteedBest_returnsTwoSteps() throws Exception {
        mockMvc.perform(post("/api/matchmaking/steps")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"algorithm": "guaranteedBestTeam", "initialTeam": []}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.algorithm").value("guaranteedBestTeam"))
                .andExpect(jsonPath("$.steps.length()").value(2))
                .andExpect(jsonPath("$.steps[1].score").value(20.0));
    }

    @Test
    @Order(10)
    @DisplayName("Compare returns all 3 algorithms")
    void compare_returnsAllThreeAlgorithms() throws Exception {
        mockMvc.perform(post("/api/matchmaking/compare")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"algorithm": "compare", "initialTeam": [0, 5]}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.results").isArray())
                .andExpect(jsonPath("$.results.length()").value(3))
                .andExpect(jsonPath("$.results[0].algorithm").value("localSearchFirst"))
                .andExpect(jsonPath("$.results[1].algorithm").value("localSearchBest"))
                .andExpect(jsonPath("$.results[2].algorithm").value("guaranteedBestTeam"))
                .andExpect(jsonPath("$.results[2].score").value(20.0));
    }
}
