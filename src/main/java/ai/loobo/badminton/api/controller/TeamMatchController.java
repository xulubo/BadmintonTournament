package ai.loobo.badminton.api.controller;

import ai.loobo.badminton.api.model.MatchResult;
import ai.loobo.badminton.api.model.Response;
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
        var teamMatch = teamMatchRepository.findById(teamMatchId).get();
        var allMatches = matchRepository.findAllByTeamMatch(teamMatch);
        var matchResults = new ArrayList<MatchResult>();

        for(var match: allMatches) {
            var teamResults = teamMatch
                    .getTeams()
                    .stream()
                    .map(team-> MatchResult.TeamResult.builder()
                            .teamId(team.getTeam().getId())
                            .build()
                    )
                    .collect(Collectors.toList());

            for(var teamResult: teamResults) {
                teamResult.setPlayers(
                        allMatches.stream()
                                .flatMap(m->m.getMatchPlayers().stream())
                                .filter(p->p.getTeam().getId() == teamResult.getTeamId())
                                .filter(p->p.getMatch().getId() == match.getId())
                                .map(p->p.getPlayer())
                                .sorted(Comparator.comparing(Player::getGender))
                                .collect(Collectors.toList())
                );

                teamResult.setScores(
                        allMatches.stream()
                                .flatMap(m->m.getGameScores().stream())
                                .filter(s->s.getTeam().getId() == teamResult.getTeamId())
                                .filter(s->s.getMatch().getId() == match.getId())
                                .sorted(Comparator.comparing(GameScore::getGameNumber))
                                .collect(Collectors.toList())
                );
            }

            var matchResult = MatchResult.builder()
                    .teamMatchId(teamMatchId)
                    .matchType(match.getType())
                    .matchNumber(match.getMatchNumber())
                    .teamResults(teamResults)
                    .build();

            matchResults.add(matchResult);
        }


        return matchResults.stream().sorted(Comparator.comparing(MatchResult::getMatchNumber)).collect(Collectors.toList());
    }

    @Data
    public static class TeamMatchData {
        private int tournamentId;
        private int[] teamIds;
    }
}
