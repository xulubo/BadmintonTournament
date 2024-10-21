package ai.loobo.badminton.api.model;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Used for team ranking
 *
 */
@Data
@AllArgsConstructor
public class TeamRankingScores {
    private String teamName;

    // total wins against opponent team
    private int teamWins;

    private int teamLosses;

    private int teamTies;

    // total wins of all single matches
    private int matchWins;
}
