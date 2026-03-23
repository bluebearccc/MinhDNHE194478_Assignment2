package com.bluebear.minhdnhe194478_assigment2_be.controller;

import com.bluebear.minhdnhe194478_assigment2_be.dto.TagDTO;
import com.bluebear.minhdnhe194478_assigment2_be.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping
    public ResponseEntity<List<TagDTO>> getAll(
            @RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(tagService.search(search));
        }
        return ResponseEntity.ok(tagService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TagDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(tagService.getById(id));
    }
}
