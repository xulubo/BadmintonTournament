package ai.loobo.badminton.api.controller;

import ai.loobo.badminton.api.model.MatchResult;
import ai.loobo.badminton.api.model.Response;
import ai.loobo.badminton.model.GameScore;
import ai.loobo.badminton.model.Match;
import ai.loobo.badminton.model.MatchPlayer;
import ai.loobo.badminton.repository.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/match")
@RequiredArgsConstructor
public class MatchController {
    private final TeamMatchRepository teamMatchRepository;
    private final GameScoreRepository gameScoreRepository;
    private final TeamMatchTeamRepository teamMatchTeamRepository;
    private final MatchRepository matchRepository;
    private final MatchPlayersRepository matchPlayersRepository;
    private final PlayerRepository playerRepository;

    @Transactional
    @PostMapping
    public Response create(
            @RequestBody MatchResult matchResult
    ) {
        var teamMatch = teamMatchRepository.findById(matchResult.getTeamMatchId()).get();

        var match = matchRepository.save(
                Match.builder()
                        .teamMatch(teamMatch)
                        .matchNumber(matchResult.getMatchNumber())
                        .type(matchResult.getMatchType())
                        .build()
        );

        for(var teamData: matchResult.getTeamResults()) {
            var teamMatchTeam = teamMatchTeamRepository.findById(teamData.getTeamMatchTeamId()).get();

            for(var playerId: teamData.getPlayers()
                    .stream().map(p->p.getId()).collect(Collectors.toList())
            ) {
                var player = playerRepository.findById(playerId).get();
                var matchPlayer = new MatchPlayer(match,teamMatchTeam, player);
                matchPlayersRepository.save(
                        matchPlayer
                );
            }

            int i=1;
            for(var score: teamData.getScores().stream()
                    .map(s->s.getTeamScore()).collect(Collectors.toList())
            ) {
                if (score == null) continue;

                var gameScore = GameScore.create(match,teamMatchTeam, score);
                gameScore.setGameNumber(i++);
                gameScoreRepository.save(
                        gameScore
                );
            }
        }


        return Response.builder().status("SUCCESS").build();
    }

    @Transactional
    @PutMapping("/{matchId}")
    public Response update(
            @PathVariable Integer matchId,
            @RequestBody MatchEditVO matchEditVO
    ) {
        var match = matchRepository.findById(matchId).get();
        match.setComment(matchEditVO.getComment());
        match.setType(matchEditVO.getMatchType());
        matchRepository.save(match);

        return Response.SUCCESS;
    }

    @Transactional
    @DeleteMapping("/{matchId}")
    public Response deleteMatch(
            @PathVariable Integer matchId
    ) {
        matchRepository.deleteById(matchId);

        return Response.builder().status("SUCCESS").build();
    }

    @Data
    public static class MatchEditVO {
        private Integer matchId;
        private String matchType;
        private String comment;
    }
}
