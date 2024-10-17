package ai.loobo.badminton.api.controller;

import ai.loobo.badminton.api.model.MatchResult;
import ai.loobo.badminton.api.model.Response;
import ai.loobo.badminton.api.service.MatchService;
import ai.loobo.badminton.model.*;
import ai.loobo.badminton.repository.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/team_match")
@RequiredArgsConstructor
public class TeamMatchController {
    private final TeamMatchRepository teamMatchRepository;
    private final GameScoreRepository gameScoreRepository;
    private final TeamRepository teamRepository;
    private final TeamMatchTeamRepository teamMatchTeamRepository;
    private final MatchRepository matchRepository;
    private final MatchPlayersRepository matchPlayersRepository;
    private final PlayerRepository playerRepository;
    private final TournamentRepository tournamentRepository;
    private final MatchService matchService;

    @GetMapping("/{teamMatchId}")
    public TeamMatch get(
            @PathVariable int teamMatchId
    ) {
        return teamMatchRepository.findById(teamMatchId).get();
    }

    @Transactional
    @PostMapping
    public Response create(
            @RequestBody TeamMatchData matchData
    ) {
        var teamMatch = TeamMatch.builder()
                .tournament(tournamentRepository.findById(matchData.tournamentId).get())
                .build();
        teamMatchRepository.save(teamMatch);

        for(var teamId: matchData.teamIds) {
            var team = teamRepository.findById(teamId).get();
            var teamMatchTeam = TeamMatchTeam
                    .builder()
                    .teamMatch(teamMatch)
                    .team(team)
                    .build();
            teamMatchTeamRepository.save(teamMatchTeam);
        }


        return Response.builder().status("SUCCESS").build();
    }

    @DeleteMapping("/{teamMatchId}")
    public Response deleteTeamMatch(
            @PathVariable int teamMatchId
    ) {
        teamMatchRepository.deleteById(teamMatchId);

        return Response.builder().status("SUCCESS").build();
    }

    @GetMapping("/{teamMatchId}/result")
    public Collection<MatchResult> getMatchResults(
            @PathVariable int teamMatchId
    ) {
        return matchService.getMatchResults(teamMatchId);
    }

    @Data
    public static class TeamMatchData {
        private int tournamentId;
        private int[] teamIds;
    }
}
