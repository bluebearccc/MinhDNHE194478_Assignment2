package com.bluebear.minhdnhe194478_assigment2_be.service;

import com.bluebear.minhdnhe194478_assigment2_be.dto.LoginRequest;
import com.bluebear.minhdnhe194478_assigment2_be.dto.LoginResponse;
import com.bluebear.minhdnhe194478_assigment2_be.dto.RegisterRequest;
import com.bluebear.minhdnhe194478_assigment2_be.entity.SystemAccount;
import com.bluebear.minhdnhe194478_assigment2_be.exception.BusinessException;
import com.bluebear.minhdnhe194478_assigment2_be.repository.SystemAccountRepository;
import com.bluebear.minhdnhe194478_assigment2_be.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final SystemAccountRepository accountRepository;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public LoginResponse login(LoginRequest request) {
        SystemAccount account = accountRepository.findByAccountEmail(request.getAccountEmail().trim())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!account.getAccountPassword().trim().equals(request.getAccountPassword().trim())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(account.getAccountEmail().trim());

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("accountId", account.getAccountId());
        extraClaims.put("accountName", account.getAccountName() != null ? account.getAccountName().trim() : null);
        extraClaims.put("role", account.getAccountRole());

        String token = jwtUtil.generateToken(userDetails, extraClaims);

        return LoginResponse.builder()
                .token(token)
                .accountId(account.getAccountId())
                .accountName(account.getAccountName() != null ? account.getAccountName().trim() : null)
                .accountEmail(account.getAccountEmail().trim())
                .accountRole(account.getAccountRole())
                .build();
    }

    public LoginResponse register(RegisterRequest request) {
        // Check if email already exists
        if (accountRepository.existsByAccountEmail(request.getAccountEmail())) {
            throw new BusinessException("Email already in use: " + request.getAccountEmail());
        }

        // Create new account with default role as Staff (2)
        SystemAccount newAccount = SystemAccount.builder()
                .accountName(request.getAccountName().trim())
                .accountEmail(request.getAccountEmail().trim())
                .accountPassword(request.getAccountPassword().trim())
                .accountRole(2) // Default role: Staff
                .build();

        SystemAccount savedAccount = accountRepository.save(newAccount);

        // Generate token for the new user
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedAccount.getAccountEmail().trim());

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("accountId", savedAccount.getAccountId());
        extraClaims.put("accountName", savedAccount.getAccountName() != null ? savedAccount.getAccountName().trim() : null);
        extraClaims.put("role", savedAccount.getAccountRole());

        String token = jwtUtil.generateToken(userDetails, extraClaims);

        return LoginResponse.builder()
                .token(token)
                .accountId(savedAccount.getAccountId())
                .accountName(savedAccount.getAccountName() != null ? savedAccount.getAccountName().trim() : null)
                .accountEmail(savedAccount.getAccountEmail().trim())
                .accountRole(savedAccount.getAccountRole())
                .build();
    }
}
