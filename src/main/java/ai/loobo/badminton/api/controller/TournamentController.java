package ai.loobo.badminton.api.controller;

import ai.loobo.badminton.model.Team;
import ai.loobo.badminton.model.Tournament;
import ai.loobo.badminton.repository.TournamentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/tournament")
public class TournamentController {

    @Autowired
    private TournamentRepository tournamentRepository;

    @GetMapping("")
    public ResponseEntity<List<Tournament>> list() {
        var tournaments = tournamentRepository.findAll();
        return ResponseEntity.ok(tournaments);
    }

    @GetMapping("/{tournamentId}/team")
    public ResponseEntity<Set<Team>> getAllTeams(
            @PathVariable Integer tournamentId
    ) {
        Set<Team> teams = tournamentRepository
                .findById(tournamentId)
                .get()
                .getTeams();
        return ResponseEntity.ok(teams);
    }
}
