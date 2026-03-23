package com.bluebear.minhdnhe194478_assigment2_be.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "Category")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryID")
    private Integer categoryId;

    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Category name must not exceed 100 characters")
    @Column(name = "CategoryName", length = 100, nullable = false)
    private String categoryName;

    @NotBlank(message = "Category description is required")
    @Size(max = 250, message = "Description must not exceed 250 characters")
    @Column(name = "CategoryDesciption", length = 250, nullable = false)
    private String categoryDescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ParentCategoryID")
    private Category parentCategory;

    @Column(name = "IsActive")
    private Boolean isActive;
}