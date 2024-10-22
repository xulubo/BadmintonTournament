package ai.loobo.badminton.repository;

import ai.loobo.badminton.model.Player;
import ai.loobo.badminton.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Integer> {
    Optional<Player> findByDisplayNameAndTeam(String name, Team team);
    List<Player> findByTeam(Team team);
}
