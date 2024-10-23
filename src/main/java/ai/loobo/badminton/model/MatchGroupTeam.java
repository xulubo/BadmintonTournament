package ai.loobo.badminton.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import javax.persistence.*;

@EqualsAndHashCode(of = "matchGroupTeamId")
@ToString(exclude = {"team", "matchGroup"})
@Entity
@Table(name = "match_group_team")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchGroupTeam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "match_group_team_id")
    private Integer matchGroupTeamId;

    @Column(name = "order_number")
    private Integer orderNumber;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_group_id", nullable = false)
    private MatchGroup matchGroup;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    public String getTeamCode() {
        return matchGroup.getGroupName() + orderNumber;
    }
}

