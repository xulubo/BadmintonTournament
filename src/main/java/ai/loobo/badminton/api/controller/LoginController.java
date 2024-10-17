package ai.loobo.badminton.api.controller;

import lombok.Builder;
import lombok.Data;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    @PostMapping
    public LoginResponse login(
            @RequestBody LoginRequest loginRequest
    ) {
        var role = loginRequest.getPassword()
                .equals("8Mondeo123!") ? "ADMIN" : "USER";
        return LoginResponse.builder()
                .id(1)
                .role(role)
                .username(loginRequest.username)
                .token("12345")
                .build();
    }


    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    /**
     * {
     *   "id": 1,
     *   "username": "user_username",
     *   "role": "ADMIN",
     *   "token": "jwt_token_here"
     * }
     */
    @Builder
    @Data
    public static class LoginResponse {
        private int id;
        private String username;
        private String role;
        private String token;
    }
}
