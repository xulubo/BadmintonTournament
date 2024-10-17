package ai.loobo.badminton.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping(value = "/{path:^(?!api/).*$}")  // Matches all paths except those with a dot (e.g., .css, .js)
    public String redirect() {
        return "forward:/index.html"; // Forward to index.html
    }
}
