package ai.loobo.badminton.repository;

import ai.loobo.badminton.model.MatchGroup;
import ai.loobo.badminton.model.MatchGroupTeam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchGroupTeamRepository extends JpaRepository<MatchGroupTeam, Long> {
    List<MatchGroupTeam> findAllByMatchGroupOrderByOrderNumber(MatchGroup matchGroup);
}

