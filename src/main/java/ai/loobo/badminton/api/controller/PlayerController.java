package ai.loobo.badminton.api.controller;

import ai.loobo.badminton.api.model.Response;
import ai.loobo.badminton.model.Player;
import ai.loobo.badminton.model.Team;
import ai.loobo.badminton.repository.PlayerRepository;
import ai.loobo.badminton.repository.TeamRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/player")
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

    @PostMapping("")
    public ResponseEntity<Response> createPlayer(
            @RequestBody PlayerVO playerVO
    ) {
        var player = Player.builder()
                .team(teamRepository.findById(playerVO.teamId).get())
                .name(playerVO.name)
                .gender(playerVO.gender)
                .build();

        playerRepository.save(player);

        return ResponseEntity.ok(Response.builder().status("SUCCESS").build());
    }

    @Data
    public static class PlayerVO {
        private String name;
        private Integer teamId;
        private char gender;
    }
}
