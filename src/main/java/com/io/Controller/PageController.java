package com.io.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/login")
    public String loginPage() {
        return "login"; // loads templates/login.html
    }
    
    @GetMapping("/user/dashboard")
    public String userDashboard() {
        return "forward:/static/user/dashboard.html";
    }
    
    @GetMapping("/admin/dashboard")
    public String adminDashboard() {
        return "forward:/static/admin/dashboard.html";
    }
}