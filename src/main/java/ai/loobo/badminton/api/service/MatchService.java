package ai.loobo.badminton.api.service;

import ai.loobo.badminton.model.*;
import ai.loobo.badminton.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
public class MatchService {

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

    @Transactional
    public void insertMatchData(
            int matchNumber,
            Integer team1Id, Integer team1Player1Id, Integer team1Player2Id, Integer team1Score,
                                Integer team2Id, Integer team2Player1Id, Integer team2Player2Id, Integer team2Score) {
        // Get teams
        Team team1 = teamRepository.findById(team1Id)
            .orElseThrow(() -> new RuntimeException("Team not found with id: " + team1Id));
        Team team2 = teamRepository.findById(team2Id)
            .orElseThrow(() -> new RuntimeException("Team not found with id: " + team2Id));

        // Get players
        Player team1Player1 = playerRepository.findById(team1Player1Id)
            .orElseThrow(() -> new RuntimeException("Player not found with id: " + team1Player1Id));
        Player team1Player2 = playerRepository.findById(team1Player2Id)
            .orElseThrow(() -> new RuntimeException("Player not found with id: " + team1Player2Id));
        Player team2Player1 = playerRepository.findById(team2Player1Id)
            .orElseThrow(() -> new RuntimeException("Player not found with id: " + team2Player1Id));
        Player team2Player2 = playerRepository.findById(team2Player2Id)
            .orElseThrow(() -> new RuntimeException("Player not found with id: " + team2Player2Id));

        // Create a new match
        Match match = new Match();
        match.setMatchNumber(matchNumber);
        match = matchRepository.save(match);

        // Insert match players
        List<MatchPlayers> matchPlayersList = Arrays.asList(
            new MatchPlayers(match, team1, team1Player1),
            new MatchPlayers(match, team1, team1Player2),
            new MatchPlayers(match, team2, team2Player1),
            new MatchPlayers(match, team2, team2Player2)
        );
        matchPlayersRepository.saveAll(matchPlayersList);

        // Insert game scores
        List<GameScore> gameScores = Arrays.asList(
            new GameScore(new GameScoreId(match.getId(), team1.getId()), match, team1, team1Score),
            new GameScore(new GameScoreId(match.getId(), team2.getId()), match, team2, team2Score)
        );
        gameScoreRepository.saveAll(gameScores);
    }
}
