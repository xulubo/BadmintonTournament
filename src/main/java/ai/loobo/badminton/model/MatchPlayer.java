package ai.loobo.badminton.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;

@EqualsAndHashCode(exclude = {"match", "team", "player"})
@Builder
@Entity
@Table(name = "match_players", schema = "tournament")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchPlayer {

    @EmbeddedId
    private MatchPlayersId id;

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

    @MapsId("playerId")
    @ManyToOne
    @JoinColumn(name = "player_id")
    private Player player;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "team_match_team_id")
    private TeamMatchTeam teamMatchTeam;

    public MatchPlayer(Match match, TeamMatchTeam teamMatchTeam, Player player) {
        this.id = new MatchPlayersId(match.getId(), teamMatchTeam.getTeam().getId(), player.getId());
        this.match = match;
        this.teamMatchTeam = teamMatchTeam;
        this.team = teamMatchTeam.getTeam();
        this.player = player;
    }
}
