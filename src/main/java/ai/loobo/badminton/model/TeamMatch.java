package ai.loobo.badminton.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@EqualsAndHashCode(exclude = "tournament")
@ToString(exclude = "tournament")
@Builder
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

    @OneToMany(mappedBy = "teamMatch")
    private Set<TeamMatchTeam> teams;

    @JsonIgnore
    @OneToMany(mappedBy = "teamMatch")
    private Set<Match> matches;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;
}
