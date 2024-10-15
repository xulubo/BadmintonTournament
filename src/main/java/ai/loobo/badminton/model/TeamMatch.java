package ai.loobo.badminton.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "team_match", schema = "tournament")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_match_id")
    private Integer id;

    @Column(name = "time")
    private LocalDateTime time;

    @ManyToOne
    @JoinColumn(name = "team_a_id")
    private Team teamA;

    @ManyToOne
    @JoinColumn(name = "team_b_id")
    private Team teamB;

    @OneToMany(mappedBy = "teamMatch")
    private Set<Match> matches;
}
