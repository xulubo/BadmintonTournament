package ai.loobo.badminton.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import org.hibernate.annotations.Immutable;

import javax.persistence.*;

@Entity
@Immutable
@Table(name = "team_match_view")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamMatchView {
    @Id
    @Column(name = "team_match_id")
    private Integer teamMatchId;

    @Column(name = "team_id")
    private Integer teamId;

    @Column(name = "team_name")
    private String teamName;

    @Column(name = "match_id")
    private Integer matchId;

    @Column(name = "match_number")
    private Integer matchNumber;

    @Column(name = "game_number")
    private Integer gameNumber;

    @Column(name = "type")
    private String type;

    @Column(name = "team_score")
    private Integer teamScore;

    @Column(name = "player_id")
    private Integer playerId;

    @Column(name = "player_name")
    private String playerName;

    @Column(name = "gender")
    private Character gender;
}
