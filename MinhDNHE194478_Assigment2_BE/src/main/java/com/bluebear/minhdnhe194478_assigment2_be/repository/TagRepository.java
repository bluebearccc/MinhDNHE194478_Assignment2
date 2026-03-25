package com.bluebear.minhdnhe194478_assigment2_be.repository;

import com.bluebear.minhdnhe194478_assigment2_be.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Integer> {

    List<Tag> findByTagNameContainingIgnoreCase(String tagName);
    
    Optional<Tag> findByTagNameIgnoreCase(String tagName);
}
