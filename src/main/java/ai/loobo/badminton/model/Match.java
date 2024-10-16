package ai.loobo.badminton.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.util.Set;

@EqualsAndHashCode(exclude = "team_match")
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

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "team_match_id")
    private TeamMatch teamMatch;

    @OneToMany(mappedBy = "match")
    private Set<GameScore> gameScores;

    @OneToMany(mappedBy = "match")
    private Set<MatchPlayers> matchPlayers;
}
