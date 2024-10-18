package ai.loobo.badminton.model;

import lombok.*;
import javax.persistence.*;
import java.util.Set;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_match_group_id")
    private MatchGroup parentMatchGroup;

    @Column(name = "order_number", nullable = false)
    private int orderNumber;

    @OneToMany(mappedBy = "parentMatchGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<MatchGroup> subGroups;
}

