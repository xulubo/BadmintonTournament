package ai.loobo.badminton.repository;

import ai.loobo.badminton.model.MatchPlayer;
import ai.loobo.badminton.model.MatchPlayersId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchPlayersRepository extends JpaRepository<MatchPlayer, MatchPlayersId> {
}
