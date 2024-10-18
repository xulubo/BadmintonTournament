package ai.loobo.badminton.api.controller;

import ai.loobo.badminton.model.MatchGroup;
import ai.loobo.badminton.repository.MatchGroupRepository;
import ai.loobo.badminton.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/match-group")
@RequiredArgsConstructor
public class MatchGroupController {

    private final MatchGroupRepository matchGroupRepository;
    private final TournamentRepository tournamentRepository;

    @GetMapping
    public List<MatchGroup> getAllMatchGroups() {
        return matchGroupRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatchGroup> getMatchGroupById(@PathVariable Long id) {
        Optional<MatchGroup> matchGroup = matchGroupRepository.findById(id);
        return matchGroup.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public MatchGroup createMatchGroup(@RequestBody MatchGroup matchGroup) {
        matchGroup.setTournament(tournamentRepository.findById(matchGroup.getTournamentId()).get());
        return matchGroupRepository.save(matchGroup);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MatchGroup> updateMatchGroup(@PathVariable Long id, @RequestBody MatchGroup matchGroupDetails) {
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
    public ResponseEntity<Void> deleteMatchGroup(@PathVariable Long id) {
        Optional<MatchGroup> matchGroup = matchGroupRepository.findById(id);
        if (matchGroup.isPresent()) {
            matchGroupRepository.delete(matchGroup.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
