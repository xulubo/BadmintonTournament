package ai.loobo.badminton.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;

@EqualsAndHashCode(exclude = {"teamMatch"})
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

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "team_match_id")
    private TeamMatch teamMatch;
}
