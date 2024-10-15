package ai.loobo.badminton.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.persistence.*;

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
}
