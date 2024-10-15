package ai.loobo.badminton.api.controller;

import ai.loobo.badminton.model.Player;
import ai.loobo.badminton.model.Team;
import ai.loobo.badminton.repository.PlayerRepository;
import ai.loobo.badminton.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tournament/{tournamentId}/team/{teamId}/player")
@RequiredArgsConstructor
public class PlayerController {
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;

    @GetMapping("")
    public ResponseEntity<List<Player>> getPlayersByTeamId(@PathVariable Integer teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + teamId));

        List<Player> players = playerRepository.findByTeam(team);
        return ResponseEntity.ok(players);
    }
}
