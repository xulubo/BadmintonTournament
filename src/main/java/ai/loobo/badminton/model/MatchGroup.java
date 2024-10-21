package ai.loobo.badminton.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import javax.persistence.*;
import java.util.Set;

@EqualsAndHashCode(of = "matchGroupId")
@ToString(exclude = {"matchGroupTeams", "tournament", "parentMatchGroup", "subGroups"})
@Entity
@Table(name = "match_group")
@Data
@NoArgsConstructor
@AllArgsConstructor
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

    @OrderBy("matchDateTime ASC, id ASC")
    @OneToMany(mappedBy = "matchGroup")
    private Set<TeamMatch> teamMatches;

    @Transient
    private Integer tournamentId;
}

