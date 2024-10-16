package ai.loobo.badminton.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@EqualsAndHashCode(exclude = "teams")
@Entity
@Table(name = "tournament", schema = "tournament")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tournament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tournament_id")
    private Integer id;

    @Column(name = "tournament_name", nullable = false)
    private String name;

    @Column(name = "location")
    private String location;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "organizer")
    private String organizer;

    @Column(name = "prize")
    private String prize;

    @JsonIgnore
    @OneToMany(mappedBy = "tournament")
    private Set<Team> teams;
}
