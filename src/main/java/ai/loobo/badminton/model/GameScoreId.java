package ai.loobo.badminton.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameScoreId implements Serializable {
    private Integer matchId;
    private Integer teamId;
}
