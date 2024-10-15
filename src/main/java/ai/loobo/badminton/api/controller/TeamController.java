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

import java.util.List;

@RestController
@RequestMapping("/api/tournament/{tournamentId}/team")
public class TeamController {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TournamentRepository tournamentRepository;

    @GetMapping("")
    public ResponseEntity<List<Team>> getAllTeams() {
        List<Team> teams = teamRepository.findAll();
        return ResponseEntity.ok(teams);
    }

    @PostMapping
    public ResponseEntity<Response> createTeam(
            @PathVariable Integer tournamentId,
            @RequestBody TeamVO team
    ) {
        teamRepository.save(Team
                .builder()
                        .name(team.getTeamName())
                        .tournament(tournamentRepository.findById(tournamentId).get())
                .build()
        );

        return ResponseEntity.ok(Response.builder().status("SUCCESS").build());
    }



    @Data
    public static class TeamVO {
        private String teamName;
    }
}
