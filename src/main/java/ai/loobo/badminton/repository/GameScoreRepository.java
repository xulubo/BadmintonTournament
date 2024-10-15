package ai.loobo.badminton.repository;

import ai.loobo.badminton.model.GameScore;
import ai.loobo.badminton.model.GameScoreId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameScoreRepository extends JpaRepository<GameScore, GameScoreId> {
}
