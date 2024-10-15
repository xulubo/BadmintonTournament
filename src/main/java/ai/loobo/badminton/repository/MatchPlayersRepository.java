package ai.loobo.badminton.repository;

import ai.loobo.badminton.model.MatchPlayers;
import ai.loobo.badminton.model.MatchPlayersId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchPlayersRepository extends JpaRepository<MatchPlayers, MatchPlayersId> {
}
