package com.matchmaking.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import com.matchmaking.api.dto.GraphInputDto;
import com.matchmaking.api.service.MatchmakingService;

import jakarta.validation.Valid;

/**
 * Handles loading and retrieving the player graph.
 *
 * POST /api/graph  — load a new graph (replaces any existing one)
 * GET  /api/graph  — return the currently loaded graph
 */
@RestController
@RequestMapping("/api/graph")
public class GraphController {

    private final MatchmakingService matchmakingService;

    // Constructor injection — Spring sees the single constructor and auto-injects
    // the MatchmakingService bean. No @Autowired needed when there's one constructor.
    public GraphController(MatchmakingService matchmakingService) {
        this.matchmakingService = matchmakingService;
    }

    @PostMapping
    public ResponseEntity<String> loadGraph(@Valid @RequestBody GraphInputDto input) {
        matchmakingService.loadGraph(input);
        return ResponseEntity.ok("Graph loaded with " + input.getEdges().size() + " edges");
    }

    @GetMapping
    public ResponseEntity<GraphInputDto> getGraph() {
        if (!matchmakingService.isGraphLoaded()) {
            return ResponseEntity.ok(new GraphInputDto(List.of()));
        }
        return ResponseEntity.ok(matchmakingService.getGraph());
    }
}
