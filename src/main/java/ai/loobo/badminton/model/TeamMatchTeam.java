package ai.loobo.badminton.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

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

    @ManyToOne
    @JoinColumn(name = "team_match_id")
    private TeamMatch teamMatch;
}
