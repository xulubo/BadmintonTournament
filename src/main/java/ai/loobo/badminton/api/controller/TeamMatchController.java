package ai.loobo.badminton.api.controller;

import ai.loobo.badminton.api.model.Response;
import ai.loobo.badminton.model.*;
import ai.loobo.badminton.repository.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/{teamMatchId}")
    public TeamMatch get(
            @PathVariable int teamMatchId
    ) {
        return teamMatchRepository.findById(teamMatchId).get();
    }

    @Transactional
    @PostMapping
    public Response create(
            @RequestBody MatchData matchData
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

    @Data
    public static class MatchData {
        private int tournamentId;
        private int matchNumber;
        private String matchType;
        private int[] teamIds;
    }
}
