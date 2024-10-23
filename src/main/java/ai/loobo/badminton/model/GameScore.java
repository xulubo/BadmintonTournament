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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "game_score_id")
    private Integer id;

    @Column(name = "game_number")
    private Integer gameNumber;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "match_id")
    private Match match;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "team_match_team_id")
    private TeamMatchTeam teamMatchTeam;

    @Column(name = "team_score", nullable = false)
    private Integer teamScore;

    public static GameScore create(Match match, TeamMatchTeam teamMatchTeam, int score) {
        return GameScore.builder()
                .teamScore(score)
                .match(match)
                .teamMatchTeam(teamMatchTeam)
                .team(teamMatchTeam.getTeam())
                .build();
    }
}
