package ai.loobo.badminton.model;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.io.Serializable;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchPlayersId implements Serializable {
    private Integer matchId;
    private Integer teamId;
    private Integer playerId;
}
