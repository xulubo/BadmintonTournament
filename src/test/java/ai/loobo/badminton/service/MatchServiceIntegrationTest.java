package ai.loobo.badminton.service;

import ai.loobo.badminton.api.service.MatchService;
import ai.loobo.badminton.model.*;
import ai.loobo.badminton.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
//@Transactional
public class MatchServiceIntegrationTest {

    @Autowired
    private MatchService matchService;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private MatchPlayersRepository matchPlayersRepository;

    @Autowired
    private GameScoreRepository gameScoreRepository;

    private Team team1;
    private Team team2;
    private Player player1;
    private Player player2;
    private Player player3;
    private Player player4;

    @BeforeEach
    void setUp() {
        // Create and save teams
        team1 = new Team();
        team1.setName("Team A");
        team1 = teamRepository.save(team1);

        team2 = new Team();
        team2.setName("Team B");
        team2 = teamRepository.save(team2);

        // Create and save players
        player1 = new Player();
        player1.setName("Player 1");
        player1.setTeam(team1);
        player1 = playerRepository.save(player1);

        player2 = new Player();
        player2.setName("Player 2");
        player2.setTeam(team1);
        player2 = playerRepository.save(player2);

        player3 = new Player();
        player3.setName("Player 3");
        player3.setTeam(team2);
        player3 = playerRepository.save(player3);

        player4 = new Player();
        player4.setName("Player 4");
        player4.setTeam(team2);
        player4 = playerRepository.save(player4);
    }

    @Test
    void testInsertMatchData() {
        // Arrange
        Integer team1Score = 21;
        Integer team2Score = 19;

        // Act
        matchService.insertMatchData(
                1,
            team1.getId(), player1.getId(), player2.getId(), team1Score,
            team2.getId(), player3.getId(), player4.getId(), team2Score
        );

        // Assert
        List<Match> matches = matchRepository.findAll();
        assertEquals(1, matches.size());

        Match match = matches.get(0);

        List<MatchPlayers> matchPlayers = matchPlayersRepository.findAll();
        assertEquals(4, matchPlayers.size());

        List<GameScore> gameScores = gameScoreRepository.findAll();
        assertEquals(2, gameScores.size());

        // Verify match players
        assertTrue(matchPlayers.stream().anyMatch(mp -> mp.getMatch().equals(match) && mp.getTeam().equals(team1) && mp.getPlayer().equals(player1)));
        assertTrue(matchPlayers.stream().anyMatch(mp -> mp.getMatch().equals(match) && mp.getTeam().equals(team1) && mp.getPlayer().equals(player2)));
        assertTrue(matchPlayers.stream().anyMatch(mp -> mp.getMatch().equals(match) && mp.getTeam().equals(team2) && mp.getPlayer().equals(player3)));
        assertTrue(matchPlayers.stream().anyMatch(mp -> mp.getMatch().equals(match) && mp.getTeam().equals(team2) && mp.getPlayer().equals(player4)));

        // Verify game scores
        assertTrue(gameScores.stream().anyMatch(gs -> gs.getMatch().equals(match) && gs.getTeam().equals(team1) && gs.getTeamScore().equals(team1Score)));
        assertTrue(gameScores.stream().anyMatch(gs -> gs.getMatch().equals(match) && gs.getTeam().equals(team2) && gs.getTeamScore().equals(team2Score)));
    }
}
