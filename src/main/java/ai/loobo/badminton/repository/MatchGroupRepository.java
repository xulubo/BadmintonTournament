package ai.loobo.badminton.repository;

import ai.loobo.badminton.model.MatchGroup;
import ai.loobo.badminton.model.TeamMatch;
import ai.loobo.badminton.model.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface MatchGroupRepository extends JpaRepository<MatchGroup, Integer> {
    Collection<MatchGroup> findAllByTournament(Tournament tournament);
    // Custom query methods can be added here if needed
}

