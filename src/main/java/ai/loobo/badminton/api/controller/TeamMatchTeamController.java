package ai.loobo.badminton.api.controller;

import ai.loobo.badminton.model.Team;
import ai.loobo.badminton.repository.TeamMatchTeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/team_match_team")
public class TeamMatchTeamController {
    private final TeamMatchTeamRepository teamMatchTeamRepository;

    @GetMapping("/{teamMatchTeamId}")
    public Team getTeamDetails(
            @PathVariable Integer teamMatchTeamId
    ) {
        return teamMatchTeamRepository
                .findById(teamMatchTeamId)
                .get()
                .getTeam();
    }
}
