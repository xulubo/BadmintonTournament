package ai.loobo.badminton.repository;

import ai.loobo.badminton.model.TeamMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamMatchRepository extends JpaRepository<TeamMatch, Integer> {
}
