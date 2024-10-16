package ai.loobo.badminton.model;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.persistence.*;

@Builder
@Entity
@Table(name = "game_score", schema = "tournament")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameScore {

    @EmbeddedId
    private GameScoreId id;

    @MapsId("matchId")
    @ManyToOne
    @JoinColumn(name = "match_id")
    private Match match;

    @MapsId("teamId")
    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @Column(name = "team_score", nullable = false)
    private Integer teamScore;

    public static GameScore create(Match match, Team team, int score) {
        return GameScore.builder()
                .id(GameScoreId
                        .builder()
                        .matchId(match.getId())
                        .teamId(team.getId())
                        .build())
                .teamScore(score)
                .match(match)
                .team(team)
                .build();
    }
}
