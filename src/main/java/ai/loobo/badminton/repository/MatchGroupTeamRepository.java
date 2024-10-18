package ai.loobo.badminton.repository;

import ai.loobo.badminton.model.MatchGroupTeam;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchGroupTeamRepository extends JpaRepository<MatchGroupTeam, Long> {
    // Custom query methods can be added here if needed
}

