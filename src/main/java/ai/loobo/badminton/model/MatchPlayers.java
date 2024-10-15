package ai.loobo.badminton.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "match_players", schema = "tournament")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchPlayers {

    @EmbeddedId
    private MatchPlayersId id;

    @MapsId("matchId")
    @ManyToOne
    @JoinColumn(name = "match_id")
    private Match match;

    @MapsId("teamId")
    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @MapsId("playerId")
    @ManyToOne
    @JoinColumn(name = "player_id")
    private Player player;

    public MatchPlayers(Match match, Team team, Player player) {
        this.id = new MatchPlayersId(match.getId(), team.getId(), player.getId());
        this.match = match;
        this.team = team;
        this.player = player;
    }
}
