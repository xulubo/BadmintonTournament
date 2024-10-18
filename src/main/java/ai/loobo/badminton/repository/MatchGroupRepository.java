package ai.loobo.badminton.repository;

import ai.loobo.badminton.model.MatchGroup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchGroupRepository extends JpaRepository<MatchGroup, Long> {
    // Custom query methods can be added here if needed
}

