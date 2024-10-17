package ai.loobo.badminton.api.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TeamScore {
    private String teamName;

    // total wins against opponent team
    private int teamWins;

    // total wins of all single matches
    private int matchWins;
}
