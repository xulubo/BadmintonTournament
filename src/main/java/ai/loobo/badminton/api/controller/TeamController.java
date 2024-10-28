package ai.loobo.badminton.api.controller;

import ai.loobo.badminton.api.model.MatchResult;
import ai.loobo.badminton.api.model.Response;
import ai.loobo.badminton.api.service.MatchService;
import ai.loobo.badminton.model.Team;
import ai.loobo.badminton.model.Player;
import ai.loobo.badminton.model.TeamMatch;
import ai.loobo.badminton.repository.TeamMatchRepository;
import ai.loobo.badminton.repository.TeamRepository;
import ai.loobo.badminton.repository.PlayerRepository;
import ai.loobo.badminton.repository.TournamentRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/team")
@RequiredArgsConstructor
public class TeamController {

    private final TeamRepository teamRepository;
    private final TournamentRepository tournamentRepository;
    private final PlayerRepository playerRepository;
    private final TeamMatchRepository teamMatchRepository;
    private final MatchService matchService;

    @PostMapping
    public ResponseEntity<Response> createTeam(
            @RequestBody TeamVO team
    ) {
        teamRepository.save(Team
                .builder()
                        .name(team.getName())
                        .tournament(tournamentRepository.findById(team.getTournamentId()).get())
                .build()
        );

        return ResponseEntity.ok(Response.builder().status("SUCCESS").build());
    }

    @GetMapping("/{teamId}")
    public Team getTeam(
            @PathVariable int teamId
    ) {
        return teamRepository.findById(teamId).get();
    }

    @PutMapping("/{teamId}")
    public Team updateTeam(
            @PathVariable Integer teamId,
            @RequestBody TeamVO teamVO
    ) {

        var team = teamRepository.findById(teamId).get();
        team.setName(teamVO.getName());
        team.setOrder(teamVO.getOrder());
        teamRepository.save(team);

        return teamRepository.findById(teamId).get();
    }


    @GetMapping("/{teamId}/player")
    public ResponseEntity<Collection<Player>> getPlayerList(
            @PathVariable int teamId
    ) {
        return ResponseEntity
                .ok(teamRepository.findById(teamId).get().getPlayers());
    }

    /**
     * Get all team matches the team specified by teamId has joined
     * @param teamId
     * @return
     */
    @GetMapping("/{teamId}/team-matches")
    public List<Collection<MatchResult>> getMatchList(
            @PathVariable int teamId
    ) {
        return matchService.getMatchResultsForTeam(teamId);
    }

    @Data
    public static class TeamVO {
        private String name;
        private int order;
        private Integer tournamentId;
    }
}
