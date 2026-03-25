package com.bluebear.minhdnhe194478_assigment2_be.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class NewsArticleRequest {

    @Size(max = 400, message = "News title must not exceed 400 characters")
    private String newsTitle;

    @NotBlank(message = "Headline is required")
    @Size(max = 150, message = "Headline must not exceed 150 characters")
    private String headline;

    @Size(max = 4000, message = "Content must not exceed 4000 characters")
    private String newsContent;

    @Size(max = 400, message = "News source must not exceed 400 characters")
    private String newsSource;

    @NotNull(message = "Category is required")
    private Integer categoryId;

    private Boolean newsStatus = true;

    private List<Integer> tagIds = new ArrayList<>();
    
    private List<String> tagNames = new ArrayList<>();
}
