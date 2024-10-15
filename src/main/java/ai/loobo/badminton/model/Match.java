package ai.loobo.badminton.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "match", schema = "tournament")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "match_id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "team_match_id")
    private TeamMatch teamMatch;

    @Column(name = "match_number", nullable = false)
    private Integer matchNumber;

    @OneToMany(mappedBy = "match")
    private Set<GameScore> gameScores;

    @OneToMany(mappedBy = "match")
    private Set<MatchPlayers> matchPlayers;

    public Match(TeamMatch teamMatch, Integer matchNumber) {
        this.teamMatch = teamMatch;
        this.matchNumber = matchNumber;
    }
}
