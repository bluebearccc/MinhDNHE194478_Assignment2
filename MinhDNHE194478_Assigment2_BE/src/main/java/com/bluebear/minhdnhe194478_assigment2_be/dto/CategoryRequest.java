package com.bluebear.minhdnhe194478_assigment2_be.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Category name must not exceed 100 characters")
    private String categoryName;

    @NotBlank(message = "Category description is required")
    @Size(max = 250, message = "Description must not exceed 250 characters")
    private String categoryDescription;

    private Integer parentCategoryId;

    private Boolean isActive = true;
}
