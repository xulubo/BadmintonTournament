package ai.loobo.badminton.api.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Response {
    public static final Response SUCCESS = Response.builder().status("success").build();
    private String status;
}
