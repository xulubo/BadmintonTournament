package ai.loobo.badminton.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.util.Set;

/**
 * Represent a team attending a particular team match.
 *
 * A single team match should contain two such entities with the same team_match_id
 *
 * teamMatch
 *      +-- teamMatchTeam1
 *                + -- team
 *      +-- teamMatchTeam2
 *                + -- team
 */
@EqualsAndHashCode(of = {"id"})
@Builder
@Entity
@Table(name = "team_match_team", schema = "tournament")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamMatchTeam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_match_team_id")
    private Integer id;

    @Column(name = "total_wins")
    private Integer totalWins;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "team_match_id")
    private TeamMatch teamMatch;

    @OneToMany(mappedBy = "teamMatchTeam")
    private Set<MatchPlayer> matchPlayers;
}
