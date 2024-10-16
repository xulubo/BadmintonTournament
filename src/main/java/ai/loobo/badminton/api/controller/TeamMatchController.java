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

    @Transactional
    @PostMapping
    public Response create(
            @RequestBody MatchData matchData
    ) {
        var teamMatch = TeamMatch.builder()
                .tournament(tournamentRepository.findById(matchData.tournamentId).get())
                .build();
        teamMatchRepository.save(teamMatch);

//        var match = matchRepository.save(
//                Match.builder()
//                        .teamMatch(teamMatch)
//                        .matchNumber(matchData.getMatchNumber())
//                        .type(matchData.getMatchType())
//                        .build()
//        );

        for(var teamId: matchData.teamIds) {
            var team = teamRepository.findById(teamId).get();
            var teamMatchTeam = TeamMatchTeam
                    .builder()
                    .teamMatch(teamMatch)
                    .team(team)
                    .build();
            teamMatchTeamRepository.save(teamMatchTeam);

//            for(var playerId: teamData.getPlayers()) {
//                var player = playerRepository.findById(playerId).get();
//                matchPlayersRepository.save(
//                        new MatchPlayers(match,team, player)
//                );
//            }
//
//            for(var score: teamData.gameScores) {
//                gameScoreRepository.save(
//                        GameScore.create(match,team, score)
//                );
//            }
        }


        return Response.builder().status("SUCCESS").build();
    }

    @Data
    public static class TeamData {
        private int gameScores[];

        @JsonProperty("id")
        private int teamId;

        private int[] players;
    }

    @Data
    public static class MatchData {
        private int tournamentId;
        private int matchNumber;
        private String matchType;
        private int[] teamIds;
    }
}
