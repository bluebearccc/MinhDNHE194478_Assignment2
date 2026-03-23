package com.bluebear.minhdnhe194478_assigment2_be.controller;

import com.bluebear.minhdnhe194478_assigment2_be.dto.NewsArticleDTO;
import com.bluebear.minhdnhe194478_assigment2_be.service.NewsArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class PublicNewsController {

    private final NewsArticleService newsArticleService;

    @GetMapping
    public ResponseEntity<List<NewsArticleDTO>> getActiveNews(
            @RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(newsArticleService.searchActiveNews(search));
        }
        return ResponseEntity.ok(newsArticleService.getActiveNews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsArticleDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(newsArticleService.getById(id));
    }
}
