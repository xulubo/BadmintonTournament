package ai.loobo.badminton.api.controller;

import ai.loobo.badminton.api.model.Response;
import ai.loobo.badminton.model.*;
import ai.loobo.badminton.repository.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/match")
@RequiredArgsConstructor
public class MatchController {
    private final TeamMatchRepository teamMatchRepository;
    private final GameScoreRepository gameScoreRepository;
    private final TeamRepository teamRepository;
    private final MatchRepository matchRepository;
    private final MatchPlayersRepository matchPlayersRepository;
    private final PlayerRepository playerRepository;

    @Transactional
    @PostMapping
    public Response create(
            @RequestBody MatchData matchData
    ) {
        var teamMatch = teamMatchRepository.findById(matchData.teamMatchId).get();

        var match = matchRepository.save(
                Match.builder()
                        .teamMatch(teamMatch)
                        .matchNumber(matchData.getMatchNumber())
                        .type(matchData.getMatchType())
                        .build()
        );

        for(var teamData: matchData.teams) {
            var team = teamRepository.findById(teamData.getTeamId()).get();

            for(var playerId: teamData.getPlayers()) {
                var player = playerRepository.findById(playerId).get();
                var matchPlayer = new MatchPlayers(match,team, player);
                matchPlayersRepository.save(
                        matchPlayer
                );
            }

            int i=1;
            for(var score: teamData.scores) {
                if (score == null) continue;

                var gameScore = GameScore.create(match,team, score);
                gameScore.setGameNumber(i++);
                gameScoreRepository.save(
                        gameScore
                );
            }
        }


        return Response.builder().status("SUCCESS").build();
    }

    @Data
    public static class TeamData {
        private Integer scores[];

        @JsonProperty("id")
        private int teamId;

        private int[] players;
    }

    @Data
    public static class MatchData {
        private int teamMatchId;
        private int matchNumber;
        private String matchType;
        private TeamData[] teams;
    }
}
