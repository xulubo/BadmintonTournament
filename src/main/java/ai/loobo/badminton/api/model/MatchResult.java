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
    private Integer matchNumber;
    private String matchType;

    @JsonProperty("teams")
    private List<TeamResult> teamResults;

    @Builder
    @Data
    public static class TeamResult {
        @JsonProperty("id")
        private int teamId;

        // players attending the game
        private List<Player> players;

        // scores of each single game
        // the list index uses for the game sequence number
        private List<GameScore> scores;
    }
}
