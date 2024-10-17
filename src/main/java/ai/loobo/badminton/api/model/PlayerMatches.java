package ai.loobo.badminton.api.model;

import ai.loobo.badminton.model.Player;
import lombok.Builder;
import lombok.Data;

import java.util.Collection;

@Builder
@Data
public class PlayerMatches {
    private Player player;
    private Collection<MatchResult> matches;
}
