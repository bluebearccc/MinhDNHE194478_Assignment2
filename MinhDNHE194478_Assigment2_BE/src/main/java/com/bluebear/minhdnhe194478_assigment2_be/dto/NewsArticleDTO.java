package com.bluebear.minhdnhe194478_assigment2_be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsArticleDTO {
    private Integer newsArticleId;
    private String newsTitle;
    private String headline;
    private LocalDateTime createdDate;
    private String newsContent;
    private String newsSource;
    private CategoryDTO category;
    private Boolean newsStatus;
    private AccountDTO createdBy;
    private Integer updatedById;
    private LocalDateTime modifiedDate;
    private List<TagDTO> tags;
}
