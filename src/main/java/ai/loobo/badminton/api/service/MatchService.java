package ai.loobo.badminton.api.service;

import ai.loobo.badminton.api.model.MatchResult;
import ai.loobo.badminton.api.model.PlayerMatches;
import ai.loobo.badminton.model.*;
import ai.loobo.badminton.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final MatchRepository matchRepository;
    private final MatchPlayersRepository matchPlayersRepository;
    private final GameScoreRepository gameScoreRepository;
    private final TeamMatchRepository teamMatchRepository;

    public Collection<MatchResult> getMatchResults(int teamMatchId) {
        var teamMatch = teamMatchRepository.findById(teamMatchId).get();
        return getMatchResults(teamMatch);
    }

    public PlayerMatches getMatchResultsByPlayerId(int playerId) {
        var player = playerRepository.findById(playerId).get();
        var matchResultList = teamMatchRepository.findAll()
                .stream()
                .flatMap(m->getMatchResults(m).stream())
                .filter(m->m.containsPlayer(playerId))
                .collect(Collectors.toList());
        return PlayerMatches.builder()
                .player(player)
                .matches(matchResultList)
                .build();
    }

    private Collection<MatchResult> getMatchResults(
            TeamMatch teamMatch
    ) {
        var allMatches = matchRepository.findAllByTeamMatch(teamMatch);
        var matchResults = new ArrayList<MatchResult>();

        for(var match: allMatches) {
            var teamResults = teamMatch
                    .getTeams()
                    .stream()
                    .map(team-> MatchResult.TeamResult.builder()
                            .teamName(team.getTeam().getName())
                            .teamId(team.getTeam().getId())
                            .totalWins(team.getTotalWins())
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
                    .teamMatchId(teamMatch.getId())
                    .matchId(match.getId())
                    .matchType(match.getType())
                    .matchNumber(match.getMatchNumber())
                    .teamResults(teamResults)
                    .build();

            matchResults.add(matchResult);
        }


        return matchResults.stream().sorted(Comparator.comparing(MatchResult::getMatchNumber)).collect(Collectors.toList());
    }
}
