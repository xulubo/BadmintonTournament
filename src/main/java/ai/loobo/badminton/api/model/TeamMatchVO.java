package ai.loobo.badminton.api.model;

import ai.loobo.badminton.model.TeamMatchTeam;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TeamMatchVO {
    // teamMatchId
    private int id;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime matchDateTime;

    // used to update team wins in this team match
    private List<TeamMatchTeam> teams;
}
