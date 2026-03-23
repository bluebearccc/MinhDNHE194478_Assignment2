package com.bluebear.minhdnhe194478_assigment2_be.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "Tag")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TagID")
    private Integer tagId;

    @Size(max = 50, message = "Tag name must not exceed 50 characters")
    @Column(name = "TagName", length = 50)
    private String tagName;

    @Size(max = 400, message = "Note must not exceed 400 characters")
    @Column(name = "Note", length = 400)
    private String note;
}
