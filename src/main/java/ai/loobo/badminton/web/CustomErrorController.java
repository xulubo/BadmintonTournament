package ai.loobo.badminton.web;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

//@Controller
public class CustomErrorController implements ErrorController {

    // Handle 404 error and forward to index.html
    @RequestMapping("/error")
    public String handleError(HttpServletRequest request) {
        int statusCode = (Integer) request.getAttribute("javax.servlet.error.status_code");

        if (statusCode == 404) {
            return "forward:/index.html"; // Forward to index.html on 404 errors
        }

        // You can handle other status codes if needed
        return "error"; // Return a generic error page for other errors
    }


}

