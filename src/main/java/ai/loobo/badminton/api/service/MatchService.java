package ai.loobo.badminton.api.service;

import ai.loobo.badminton.api.model.MatchResult;
import ai.loobo.badminton.api.model.PlayerMatches;
import ai.loobo.badminton.api.model.TeamScore;
import ai.loobo.badminton.model.*;
import ai.loobo.badminton.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchService {
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final MatchRepository matchRepository;
    private final MatchPlayersRepository matchPlayersRepository;
    private final GameScoreRepository gameScoreRepository;
    private final TeamMatchRepository teamMatchRepository;
    private final JdbcTemplate jdbcTemplate;
    private static String SQL_STANDING = "SELECT " +
            " t.team_name team_name, " +
            " sum(case when total_wins>2 then 1 else 0 end) team_wins, " +
            " sum(case when total_wins<2 then 1 else 0 end) team_losts, " +
            " sum(case when total_wins=2 then 1 else 0 end) team_ties, " +
            " sum(total_wins) match_wins " +
            " FROM tournament.team_match_team tmt " +
            " JOIN tournament.team t on tmt.team_id = t.team_id and t.tournament_id = ?" +
            " GROUP BY team_name " +
            " order by team_wins DESC, match_wins DESC";

    private static String SQL_GROUP_STANDING = "SELECT " +
            " t.team_name team_name, " +
            " sum(case when total_wins>2 then 1 else 0 end) team_wins, " +
            " sum(case when total_wins<2 then 1 else 0 end) team_losts, " +
            " sum(case when total_wins=2 then 1 else 0 end) team_ties, " +
            " sum(total_wins) match_wins " +
            " FROM " +
            " tournament.team_match tm " +
            " JOIN tournament.team_match_team tmt ON tm.team_match_id = tmt.team_match_id AND tm.match_group_id = ?" +
            " JOIN tournament.team t on tmt.team_id = t.team_id " +
            " GROUP BY team_name " +
            " order by team_wins DESC, match_wins DESC";

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

    public List<TeamScore> getStanding(int tournamentId) {
        return jdbcTemplate.query(SQL_STANDING, new Object[]{tournamentId}, (RowMapper<TeamScore>) (rs, rowNum) -> {
            String teamName = rs.getString("team_name");
            int teamWins = rs.getInt("team_wins");
            int teamLosts = rs.getInt("team_losts");
            int ties = rs.getInt("team_ties");
            int matchWins = rs.getInt("match_wins");

            return new TeamScore(teamName, teamWins, teamLosts, ties, matchWins);
        });
    }

    public List<TeamScore> getGroupStanding(int matchGroupId) {
        log.debug("SQL_GROUP_STANDING {}", SQL_GROUP_STANDING);
        return jdbcTemplate.query(SQL_GROUP_STANDING, new Object[]{matchGroupId}, (RowMapper<TeamScore>) (rs, rowNum) -> {
            String teamName = rs.getString("team_name");
            int teamWins = rs.getInt("team_wins");
            int teamLosts = rs.getInt("team_losts");
            int ties = rs.getInt("team_ties");
            int matchWins = rs.getInt("match_wins");

            return new TeamScore(teamName, teamWins, teamLosts, ties, matchWins);
        });
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
