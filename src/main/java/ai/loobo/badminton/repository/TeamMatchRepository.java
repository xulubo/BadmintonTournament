package ai.loobo.badminton.repository;

import ai.loobo.badminton.model.TeamMatch;
import ai.loobo.badminton.model.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamMatchRepository extends JpaRepository<TeamMatch, Integer> {

    List<TeamMatch> findAllByTournament(Tournament tournament);
}
