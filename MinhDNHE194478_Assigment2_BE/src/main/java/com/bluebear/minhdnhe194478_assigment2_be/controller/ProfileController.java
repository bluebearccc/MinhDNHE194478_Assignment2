package com.bluebear.minhdnhe194478_assigment2_be.controller;

import com.bluebear.minhdnhe194478_assigment2_be.dto.AccountDTO;
import com.bluebear.minhdnhe194478_assigment2_be.dto.AccountRequest;
import com.bluebear.minhdnhe194478_assigment2_be.dto.NewsArticleDTO;
import com.bluebear.minhdnhe194478_assigment2_be.entity.SystemAccount;
import com.bluebear.minhdnhe194478_assigment2_be.exception.ResourceNotFoundException;
import com.bluebear.minhdnhe194478_assigment2_be.repository.SystemAccountRepository;
import com.bluebear.minhdnhe194478_assigment2_be.service.NewsArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final SystemAccountRepository accountRepository;
    private final NewsArticleService newsArticleService;

    @GetMapping
    public ResponseEntity<AccountDTO> getProfile(Authentication authentication) {
        SystemAccount account = resolveAccount(authentication);
        return ResponseEntity.ok(AccountDTO.builder()
                .accountId(account.getAccountId())
                .accountName(account.getAccountName())
                .accountEmail(account.getAccountEmail())
                .accountRole(account.getAccountRole())
                .build());
    }

    @PutMapping
    public ResponseEntity<AccountDTO> updateProfile(
            @Valid @RequestBody AccountRequest request,
            Authentication authentication) {
        SystemAccount account = resolveAccount(authentication);

        account.setAccountName(request.getAccountName());
        account.setAccountEmail(request.getAccountEmail());
        account.setAccountPassword(request.getAccountPassword());

        SystemAccount saved = accountRepository.save(account);

        return ResponseEntity.ok(AccountDTO.builder()
                .accountId(saved.getAccountId())
                .accountName(saved.getAccountName())
                .accountEmail(saved.getAccountEmail())
                .accountRole(saved.getAccountRole())
                .build());
    }

    @GetMapping("/history")
    public ResponseEntity<List<NewsArticleDTO>> getHistory(Authentication authentication) {
        SystemAccount account = resolveAccount(authentication);
        return ResponseEntity.ok(newsArticleService.getByCreatedBy(account.getAccountId()));
    }

    private SystemAccount resolveAccount(Authentication authentication) {
        String email = authentication.getName();
        return accountRepository.findByAccountEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found for email: " + email));
    }
}
