package ai.loobo.badminton.repository;

import ai.loobo.badminton.model.Match;
import ai.loobo.badminton.model.TeamMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Integer> {
    List<Match> findAllByTeamMatch(TeamMatch teamMatch);
}
