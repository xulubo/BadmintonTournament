package ai.loobo.badminton.model;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.persistence.*;
import java.util.Set;

@Builder
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

    @Column(name = "match_number", nullable = false)
    private Integer matchNumber;

    @Column(name = "type")
    private String type;

    @ManyToOne
    @JoinColumn(name = "team_match_id")
    private TeamMatch teamMatch;
    @OneToMany(mappedBy = "match")
    private Set<GameScore> gameScores;

    @OneToMany(mappedBy = "match")
    private Set<MatchPlayers> matchPlayers;
}
