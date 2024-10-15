package ai.loobo.badminton.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "player", schema = "tournament")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "player_id")
    private Integer id;

    @Column(name = "player_name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    // Getters and setters
}
