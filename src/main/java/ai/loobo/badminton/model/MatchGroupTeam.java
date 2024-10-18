package ai.loobo.badminton.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import javax.persistence.*;

@EqualsAndHashCode(of = "matchGroupTeamId")
@ToString(exclude = {"team", "matchGroup"})
@Entity
@Table(name = "match_group_team")
@Data // Lombok annotation to generate getters, setters, toString, equals, and hashCode
@NoArgsConstructor // Lombok to generate the default constructor
@AllArgsConstructor // Lombok to generate the all-args constructor
public class MatchGroupTeam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "match_group_team_id")
    private Integer matchGroupTeamId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_group_id", nullable = false)
    private MatchGroup matchGroup;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Transient
    private Integer matchGroupId;

    @Transient
    private Integer teamId;
}

