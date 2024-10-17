package ai.loobo.badminton.api.controller;

import ai.loobo.badminton.api.model.Response;
import ai.loobo.badminton.model.Team;
import ai.loobo.badminton.model.Player;
import ai.loobo.badminton.repository.TeamRepository;
import ai.loobo.badminton.repository.PlayerRepository;
import ai.loobo.badminton.repository.TournamentRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/api/team")
public class TeamController {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @PostMapping
    public ResponseEntity<Response> createTeam(
            @RequestBody TeamVO team
    ) {
        teamRepository.save(Team
                .builder()
                        .name(team.getTeamName())
                        .tournament(tournamentRepository.findById(team.getTournamentId()).get())
                .build()
        );

        return ResponseEntity.ok(Response.builder().status("SUCCESS").build());
    }

    @GetMapping("/{teamId}")
    public Team getTeam(
            @PathVariable int teamId
    ) {
        return teamRepository.findById(teamId).get();
    }

    @GetMapping("/{teamId}/player")
    public ResponseEntity<Collection<Player>> getPlayerList(
            @PathVariable int teamId
    ) {
        return ResponseEntity
                .ok(teamRepository.findById(teamId).get().getPlayers());
    }

    @Data
    public static class TeamVO {
        private String teamName;
        private Integer tournamentId;
    }
}
