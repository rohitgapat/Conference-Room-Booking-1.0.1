package com.io.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
@Controller
public class PageController {

	  @GetMapping("/login")
	    public String loginPage() {
	        return "login"; // loads templates/login.html
	    }
}
