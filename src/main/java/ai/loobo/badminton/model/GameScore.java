package ai.loobo.badminton.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;

@EqualsAndHashCode(exclude = {"match","team"})
@Builder
@Entity
@Table(name = "game_score", schema = "tournament")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameScore {

    @EmbeddedId
    private GameScoreId id;

    @JsonIgnore
    @MapsId("matchId")
    @ManyToOne
    @JoinColumn(name = "match_id")
    private Match match;

    @JsonIgnore
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
