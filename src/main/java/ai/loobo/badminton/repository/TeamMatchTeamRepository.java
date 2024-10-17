package ai.loobo.badminton.repository;

import ai.loobo.badminton.model.TeamMatch;
import ai.loobo.badminton.model.TeamMatchTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamMatchTeamRepository extends JpaRepository<TeamMatchTeam, Integer> {
}
