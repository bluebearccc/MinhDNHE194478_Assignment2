package com.bluebear.minhdnhe194478_assigment2_be.service;

import com.bluebear.minhdnhe194478_assigment2_be.dto.TagDTO;
import com.bluebear.minhdnhe194478_assigment2_be.entity.Tag;
import com.bluebear.minhdnhe194478_assigment2_be.exception.ResourceNotFoundException;
import com.bluebear.minhdnhe194478_assigment2_be.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    private TagDTO toDTO(Tag tag) {
        return TagDTO.builder()
                .tagId(tag.getTagId())
                .tagName(tag.getTagName())
                .note(tag.getNote())
                .build();
    }

    public List<TagDTO> getAll() {
        return tagRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public TagDTO getById(Integer id) {
        return toDTO(tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag", id)));
    }

    public List<TagDTO> search(String name) {
        return tagRepository.findByTagNameContainingIgnoreCase(name)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }
}
