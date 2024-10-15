package ai.loobo.badminton.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchPlayersId implements Serializable {
    private Integer matchId;
    private Integer teamId;
    private Integer playerId;
}
