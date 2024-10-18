package ai.loobo.badminton.api.controller;

import ai.loobo.badminton.api.model.Response;
import ai.loobo.badminton.model.MatchGroup;
import ai.loobo.badminton.model.MatchGroupTeam;
import ai.loobo.badminton.model.Team;
import ai.loobo.badminton.repository.MatchGroupRepository;
import ai.loobo.badminton.repository.MatchGroupTeamRepository;
import ai.loobo.badminton.repository.TeamRepository;
import ai.loobo.badminton.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/match-group")
@RequiredArgsConstructor
public class MatchGroupController {

    private final MatchGroupRepository matchGroupRepository;
    private final TournamentRepository tournamentRepository;
    private final MatchGroupTeamRepository matchGroupTeamRepository;
    private final TeamRepository teamRepository;

    @GetMapping
    public List<MatchGroup> getAllMatchGroups() {
        return matchGroupRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatchGroup> getMatchGroupById(@PathVariable Integer id) {
        Optional<MatchGroup> matchGroup = matchGroupRepository.findById(id);
        return matchGroup.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public MatchGroup createMatchGroup(@RequestBody MatchGroup matchGroup) {
        matchGroup.setTournament(tournamentRepository.findById(matchGroup.getTournamentId()).get());
        return matchGroupRepository.save(matchGroup);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MatchGroup> updateMatchGroup(@PathVariable Integer id, @RequestBody MatchGroup matchGroupDetails) {
        Optional<MatchGroup> matchGroup = matchGroupRepository.findById(id);
        if (matchGroup.isPresent()) {
            MatchGroup updatedMatchGroup = matchGroup.get();
            updatedMatchGroup.setGroupName(matchGroupDetails.getGroupName());
            updatedMatchGroup.setTournament(matchGroupDetails.getTournament());
            updatedMatchGroup.setParentMatchGroup(matchGroupDetails.getParentMatchGroup());
            updatedMatchGroup.setOrderNumber(matchGroupDetails.getOrderNumber());
            updatedMatchGroup.setSubGroups(matchGroupDetails.getSubGroups());
            return ResponseEntity.ok(matchGroupRepository.save(updatedMatchGroup));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMatchGroup(@PathVariable Integer id) {
        Optional<MatchGroup> matchGroup = matchGroupRepository.findById(id);
        if (matchGroup.isPresent()) {
            matchGroupRepository.delete(matchGroup.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/sub-group")
    public ResponseEntity<MatchGroup> addSubGroup(@PathVariable Integer id, @RequestBody MatchGroup subGroup) {
        Optional<MatchGroup> matchGroup = matchGroupRepository.findById(id);
        if (matchGroup.isPresent()) {
            MatchGroup parentMatchGroup = matchGroup.get();
            subGroup.setTournament(parentMatchGroup.getTournament());
            subGroup.setParentMatchGroup(parentMatchGroup);
            return ResponseEntity.ok(matchGroupRepository.save(subGroup));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/teams")
    public ResponseEntity<Collection<Team>> getTeams(@PathVariable Integer id) {
        Optional<MatchGroup> matchGroup = matchGroupRepository.findById(id);
        if (matchGroup.isPresent()) {
            return ResponseEntity
                    .ok(matchGroup.get().getMatchGroupTeams().stream()
                    .map(MatchGroupTeam::getTeam)
                    .collect(Collectors.toList())
            );
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/team/{teamId}")
    public ResponseEntity<Response> addTeam(@PathVariable Integer id, @PathVariable Integer teamId) {
        Optional<MatchGroup> matchGroup = matchGroupRepository.findById(id);
        if (matchGroup.isPresent()) {
            var matchGroupTeam = new MatchGroupTeam();
            matchGroupTeam.setMatchGroup(matchGroup.get());
            matchGroupTeam.setTeam(teamRepository.findById(teamId).get());
            matchGroupTeamRepository.save(matchGroupTeam);
            return ResponseEntity.ok(Response.SUCCESS);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
