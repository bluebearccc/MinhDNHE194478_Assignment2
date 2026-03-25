package com.bluebear.minhdnhe194478_assigment2_be.controller;

import com.bluebear.minhdnhe194478_assigment2_be.dto.LoginRequest;
import com.bluebear.minhdnhe194478_assigment2_be.dto.LoginResponse;
import com.bluebear.minhdnhe194478_assigment2_be.dto.RegisterRequest;
import com.bluebear.minhdnhe194478_assigment2_be.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
}
