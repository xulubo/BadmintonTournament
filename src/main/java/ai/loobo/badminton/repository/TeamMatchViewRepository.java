package ai.loobo.badminton.repository;

import ai.loobo.badminton.model.TeamMatchView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Repository
public interface TeamMatchViewRepository extends JpaRepository<TeamMatchView, Long> {

    List<TeamMatchView> findByTeamName(String teamName);

    List<TeamMatchView> findByMatchNumber(Integer matchNumber);

    List<TeamMatchView> findByPlayerName(String playerName);

    List<TeamMatchView> findByPlayerId(Integer playerId);

    List<TeamMatchView> findByMatchIdIn(Set<Integer> playedMatchIds);
}
