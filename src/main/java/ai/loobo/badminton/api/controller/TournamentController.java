package ai.loobo.badminton.api.controller;

import ai.loobo.badminton.api.model.Response;
import ai.loobo.badminton.api.model.TeamRankingScores;
import ai.loobo.badminton.api.service.MatchService;
import ai.loobo.badminton.model.MatchGroup;
import ai.loobo.badminton.model.Team;
import ai.loobo.badminton.model.TeamMatch;
import ai.loobo.badminton.model.Tournament;
import ai.loobo.badminton.repository.MatchGroupRepository;
import ai.loobo.badminton.repository.TeamMatchRepository;
import ai.loobo.badminton.repository.TeamRepository;
import ai.loobo.badminton.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tournament")
@RequiredArgsConstructor
public class TournamentController {
    private final TournamentRepository tournamentRepository;
    private final TeamMatchRepository teamMatchRepository;
    private final MatchGroupRepository matchGroupRepository;
    private final MatchService matchService;
    private final TeamRepository teamRepository;

    @GetMapping("")
    public ResponseEntity<List<Tournament>> getAllTournaments() {
        var tournaments = tournamentRepository.findAll();
        return ResponseEntity.ok(tournaments);
    }

    @GetMapping("/{tournamentId}")
    public Tournament getTournament(
            @PathVariable Integer tournamentId
    ) {
        return tournamentRepository.findById(tournamentId).get();
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

    @PostMapping("/{tournamentId}/team")
    public ResponseEntity<Response> addTeam(
            @PathVariable Integer tournamentId,
            @RequestBody TeamController.TeamVO team
            ) {
        teamRepository.save(Team
                .builder()
                .name(team.getName())
                .tournament(tournamentRepository.findById(tournamentId).get())
                .build()
        );
        return ResponseEntity.ok(Response.builder().status("SUCCESS").build());
    }

    @GetMapping("/{tournamentId}/match-groups")
    public Collection<MatchGroup> getMatchGroups(
            @PathVariable Integer tournamentId
    ) {
        var tournament = tournamentRepository.findById(tournamentId).get()
                ;

        return matchGroupRepository.findAllByTournament(tournament);
    }

    @GetMapping("/{tournamentId}/team_match")
    public Collection<TeamMatch> getAllTeamMatches(
            @PathVariable Integer tournamentId
    ) {
        var tournament = tournamentRepository.findById(tournamentId).get()
                ;

        return teamMatchRepository.findAllByTournament(tournament);
    }

    @GetMapping("/{tournamentId}/upcoming-matches")
    public Collection<TeamMatch> getUpcomingTeamMatches(
            @PathVariable Integer tournamentId
    ) {
        var tournament = tournamentRepository.findById(tournamentId).get()
                ;

        return teamMatchRepository.findAllByTournament(tournament)
                .stream()
                .filter(m->m.getMatchDateTime().isAfter(LocalDateTime.now().minusDays(-1)))
                .collect(Collectors.toList());

    }

    @GetMapping("/{tournamentId}/standing")
    public Collection<TeamRankingScores> getAllTeamScores(
            @PathVariable Integer tournamentId
    ) {
        return matchService.getStanding(tournamentId);
    }
}
