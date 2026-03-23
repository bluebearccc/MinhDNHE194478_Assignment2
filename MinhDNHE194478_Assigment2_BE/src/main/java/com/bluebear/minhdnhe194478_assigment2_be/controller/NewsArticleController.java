package com.bluebear.minhdnhe194478_assigment2_be.controller;

import com.bluebear.minhdnhe194478_assigment2_be.dto.NewsArticleDTO;
import com.bluebear.minhdnhe194478_assigment2_be.dto.NewsArticleRequest;
import com.bluebear.minhdnhe194478_assigment2_be.repository.SystemAccountRepository;
import com.bluebear.minhdnhe194478_assigment2_be.service.NewsArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff/news")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STAFF')")
public class NewsArticleController {

    private final NewsArticleService newsArticleService;
    private final SystemAccountRepository accountRepository;

    @GetMapping
    public ResponseEntity<List<NewsArticleDTO>> getAll(
            @RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(newsArticleService.search(search));
        }
        return ResponseEntity.ok(newsArticleService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsArticleDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(newsArticleService.getById(id));
    }

    @PostMapping
    public ResponseEntity<NewsArticleDTO> create(
            @Valid @RequestBody NewsArticleRequest request,
            Authentication authentication) {
        Integer accountId = resolveAccountId(authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(newsArticleService.create(request, accountId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsArticleDTO> update(
            @PathVariable Integer id,
            @Valid @RequestBody NewsArticleRequest request,
            Authentication authentication) {
        Integer accountId = resolveAccountId(authentication);
        return ResponseEntity.ok(newsArticleService.update(id, request, accountId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        newsArticleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private Integer resolveAccountId(Authentication authentication) {
        String email = authentication.getName();
        return accountRepository.findByAccountEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated account not found"))
                .getAccountId();
    }
}
