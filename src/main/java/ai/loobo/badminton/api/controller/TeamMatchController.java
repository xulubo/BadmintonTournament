package ai.loobo.badminton.api.controller;

import ai.loobo.badminton.api.model.MatchResult;
import ai.loobo.badminton.api.model.Response;
import ai.loobo.badminton.api.model.TeamMatchVO;
import ai.loobo.badminton.api.service.MatchService;
import ai.loobo.badminton.model.TeamMatch;
import ai.loobo.badminton.model.TeamMatchTeam;
import ai.loobo.badminton.repository.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Collection;

@RestController
@RequestMapping("/api/team_match")
@RequiredArgsConstructor
public class TeamMatchController {
    private final TeamMatchRepository teamMatchRepository;
    private final GameScoreRepository gameScoreRepository;
    private final TeamRepository teamRepository;
    private final TeamMatchTeamRepository teamMatchTeamRepository;
    private final MatchRepository matchRepository;
    private final MatchPlayersRepository matchPlayersRepository;
    private final PlayerRepository playerRepository;
    private final TournamentRepository tournamentRepository;
    private final MatchService matchService;
    private final MatchGroupRepository matchGroupRepository;

    @GetMapping("/{teamMatchId}")
    public TeamMatch get(
            @PathVariable int teamMatchId
    ) {
        return teamMatchRepository.findById(teamMatchId).get();
    }

    @Transactional
    @PostMapping
    public Response createTeamMatch(
            @RequestBody TeamMatchData matchData
    ) {
        var teamMatch = TeamMatch.builder()
                .tournament(tournamentRepository.findById(matchData.tournamentId).get())
                .matchGroup(matchGroupRepository.findById(matchData.matchGroupId).get())
                .matchDateTime(LocalDateTime.of(matchData.matchDate, matchData.matchTime))
                .build();
        teamMatchRepository.save(teamMatch);

        for(var teamId: matchData.teamIds) {
            var team = teamRepository.findById(teamId).get();
            var teamMatchTeam = TeamMatchTeam
                    .builder()
                    .teamMatch(teamMatch)
                    .team(team)
                    .build();
            teamMatchTeamRepository.save(teamMatchTeam);
        }


        return Response.builder().status("SUCCESS").build();
    }

    /**
     * Update matchTime and teamWins
     *
     * @param teamMatchId
     * @param teamMatchVO
     * @return
     */
    @PutMapping("/{teamMatchId}")
    public Response updateTeamMatch(
            @PathVariable int teamMatchId,
            @RequestBody TeamMatchVO teamMatchVO
    ) {
        var teamMatch = teamMatchRepository.findById(teamMatchId).get();

        teamMatch.setMatchDateTime(teamMatchVO.getMatchDateTime());

        if (teamMatchVO.getTeams() != null) {
            for(var teamMatchTeamVo: teamMatchVO.getTeams()) {
                var teamMatchTeam = teamMatch.getTeams()
                        .stream()
                        .filter(t->t.getId() == teamMatchTeamVo.getId())
                        .findFirst()
                        .get();
                teamMatchTeam.setTotalWins(teamMatchTeamVo.getTotalWins());
            }
        }

        teamMatchRepository.save(teamMatch);

        return Response.builder().status("SUCCESS").build();
    }

    @DeleteMapping("/{teamMatchId}")
    public Response deleteTeamMatch(
            @PathVariable int teamMatchId
    ) {
        teamMatchRepository.deleteById(teamMatchId);

        return Response.builder().status("SUCCESS").build();
    }

    @GetMapping("/{teamMatchId}/result")
    public Collection<MatchResult> getMatchResults(
            @PathVariable int teamMatchId
    ) {
        return matchService.getMatchResults(teamMatchId);
    }

    // should be replaced by TeamMatchVO
    @Data
    public static class TeamMatchData {
        private int tournamentId;
        private int[] teamIds;
        private int matchGroupId;
        private LocalDate matchDate;
        private LocalTime matchTime;
    }
}
