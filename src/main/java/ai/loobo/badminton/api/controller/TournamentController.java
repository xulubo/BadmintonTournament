package ai.loobo.badminton.api.controller;

import ai.loobo.badminton.api.model.TeamRankingScores;
import ai.loobo.badminton.api.service.MatchService;
import ai.loobo.badminton.model.MatchGroup;
import ai.loobo.badminton.model.Team;
import ai.loobo.badminton.model.TeamMatch;
import ai.loobo.badminton.model.Tournament;
import ai.loobo.badminton.repository.MatchGroupRepository;
import ai.loobo.badminton.repository.TeamMatchRepository;
import ai.loobo.badminton.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/tournament")
@RequiredArgsConstructor
public class TournamentController {
    private final TournamentRepository tournamentRepository;
    private final TeamMatchRepository teamMatchRepository;
    private final MatchGroupRepository matchGroupRepository;
    private final MatchService matchService;

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

    @GetMapping("/{tournamentId}/standing")
    public Collection<TeamRankingScores> getAllTeamScores(
            @PathVariable Integer tournamentId
    ) {
        return matchService.getStanding(tournamentId);
    }
}
