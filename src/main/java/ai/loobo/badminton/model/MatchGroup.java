package ai.loobo.badminton.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import javax.persistence.*;
import java.util.Set;

@EqualsAndHashCode(of = "matchGroupId")
@ToString(exclude = {"matchGroupTeams", "tournament", "parentMatchGroup", "subGroups"})
@Entity
@Table(name = "match_group")
@Data // Lombok annotation to generate getters, setters, toString, equals, and hashCode
@NoArgsConstructor // Lombok to generate the default constructor
@AllArgsConstructor // Lombok to generate the all-args constructor
public class MatchGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "match_group_id")
    private Integer matchGroupId;

    @Column(name = "group_name", nullable = false)
    private String groupName;

    @OneToMany(mappedBy = "matchGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<MatchGroupTeam> matchGroupTeams;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_match_group_id")
    private MatchGroup parentMatchGroup;

    @Column(name = "order_number", nullable = false)
    private int orderNumber;

    @OneToMany(mappedBy = "parentMatchGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<MatchGroup> subGroups;

    @Transient
    private Integer tournamentId;
}

