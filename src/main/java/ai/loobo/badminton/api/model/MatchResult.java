package ai.loobo.badminton.api.model;

import ai.loobo.badminton.model.GameScore;
import ai.loobo.badminton.model.Player;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * A match between two teams contains several single matches,
 * each match contains at most 3 games
 *
 * This is the result of a single match, it contains
 *
 * 1. game players of each team
 * 2. scores of each game
 *
 */
@Builder
@Data
public class MatchResult {
    private Integer teamMatchId;
    private Integer matchId;
    private Integer matchNumber;
    private String matchType;
    private String comment;

    @JsonProperty("teamMatchTeams")
    private List<TeamResult> teamResults;

    /**
     * Represent each team's game results in a single match between two teams
     */
    @Builder
    @Data
    public static class TeamResult {
        @JsonProperty("id")
        private int teamMatchTeamId;

        private int teamId;

        private String teamName;

        private int totalWins;

        // players attending the game, must have 2 elements
        private List<Player> players;

        // scores of each single game
        // the list index uses for the game sequence number
        // must have at least 2 elements
        private List<GameScore> scores;
    }

    public boolean containsPlayer(int playerId) {
        return teamResults
                .stream()
                .anyMatch(
                        t->t.getPlayers().stream().anyMatch(p->p.getId() == playerId)
                );
    }
}
