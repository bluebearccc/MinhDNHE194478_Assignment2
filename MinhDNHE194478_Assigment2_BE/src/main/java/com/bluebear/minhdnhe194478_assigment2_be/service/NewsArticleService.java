package com.bluebear.minhdnhe194478_assigment2_be.service;

import com.bluebear.minhdnhe194478_assigment2_be.dto.*;
import com.bluebear.minhdnhe194478_assigment2_be.entity.Category;
import com.bluebear.minhdnhe194478_assigment2_be.entity.NewsArticle;
import com.bluebear.minhdnhe194478_assigment2_be.entity.SystemAccount;
import com.bluebear.minhdnhe194478_assigment2_be.entity.Tag;
import com.bluebear.minhdnhe194478_assigment2_be.exception.ResourceNotFoundException;
import com.bluebear.minhdnhe194478_assigment2_be.repository.CategoryRepository;
import com.bluebear.minhdnhe194478_assigment2_be.repository.NewsArticleRepository;
import com.bluebear.minhdnhe194478_assigment2_be.repository.SystemAccountRepository;
import com.bluebear.minhdnhe194478_assigment2_be.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NewsArticleService {

    private final NewsArticleRepository newsArticleRepository;
    private final CategoryRepository categoryRepository;
    private final SystemAccountRepository accountRepository;
    private final TagRepository tagRepository;


    public NewsArticleDTO toDTO(NewsArticle article) {
        AccountDTO createdByDTO = null;
        if (article.getCreatedBy() != null) {
            createdByDTO = AccountDTO.builder()
                    .accountId(article.getCreatedBy().getAccountId())
                    .accountName(article.getCreatedBy().getAccountName())
                    .accountEmail(article.getCreatedBy().getAccountEmail())
                    .accountRole(article.getCreatedBy().getAccountRole())
                    .build();
        }

        CategoryDTO categoryDTO = null;
        if (article.getCategory() != null) {
            Category cat = article.getCategory();
            categoryDTO = CategoryDTO.builder()
                    .categoryId(cat.getCategoryId())
                    .categoryName(cat.getCategoryName())
                    .categoryDescription(cat.getCategoryDescription())
                    .parentCategoryId(cat.getParentCategory() != null ? cat.getParentCategory().getCategoryId() : null)
                    .parentCategoryName(cat.getParentCategory() != null ? cat.getParentCategory().getCategoryName() : null)
                    .isActive(cat.getIsActive())
                    .build();
        }

        List<TagDTO> tagDTOs = article.getTags() == null ? List.of() :
                article.getTags().stream()
                        .map(t -> TagDTO.builder()
                                .tagId(t.getTagId())
                                .tagName(t.getTagName())
                                .note(t.getNote())
                                .build())
                        .collect(Collectors.toList());

        return NewsArticleDTO.builder()
                .newsArticleId(article.getNewsArticleId())
                .newsTitle(article.getNewsTitle())
                .headline(article.getHeadline())
                .createdDate(article.getCreatedDate())
                .newsContent(article.getNewsContent())
                .newsSource(article.getNewsSource())
                .category(categoryDTO)
                .newsStatus(article.getNewsStatus())
                .createdBy(createdByDTO)
                .updatedById(article.getUpdatedById())
                .modifiedDate(article.getModifiedDate())
                .tags(tagDTOs)
                .build();
    }


    public List<NewsArticleDTO> getActiveNews() {
        return newsArticleRepository.findByNewsStatus(true)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<NewsArticleDTO> searchActiveNews(String title) {
        return newsArticleRepository.findByNewsTitleContainingIgnoreCaseAndNewsStatus(title, true)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }


    public List<NewsArticleDTO> getAll() {
        return newsArticleRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<NewsArticleDTO> search(String title) {
        return newsArticleRepository.findByNewsTitleContainingIgnoreCase(title)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public NewsArticleDTO getById(Integer id) {
        return toDTO(newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("NewsArticle", id)));
    }

    public List<NewsArticleDTO> getByCreatedBy(Integer accountId) {
        return newsArticleRepository.findByCreatedBy_AccountId(accountId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public NewsArticleDTO create(NewsArticleRequest request, Integer createdByAccountId) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));

        SystemAccount createdBy = accountRepository.findById(createdByAccountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account", createdByAccountId));

        List<Tag> tags = tagRepository.findAllById(request.getTagIds());

        NewsArticle article = NewsArticle.builder()
                .newsTitle(request.getNewsTitle())
                .headline(request.getHeadline())
                .newsContent(request.getNewsContent())
                .newsSource(request.getNewsSource())
                .category(category)
                .newsStatus(request.getNewsStatus() != null ? request.getNewsStatus() : true)
                .createdBy(createdBy)
                .updatedById(createdByAccountId)
                .createdDate(LocalDateTime.now())
                .modifiedDate(LocalDateTime.now())
                .tags(tags)
                .build();

        return toDTO(newsArticleRepository.save(article));
    }

    @Transactional
    public NewsArticleDTO update(Integer id, NewsArticleRequest request, Integer updatedByAccountId) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("NewsArticle", id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));

        List<Tag> tags = tagRepository.findAllById(request.getTagIds());

        article.setNewsTitle(request.getNewsTitle());
        article.setHeadline(request.getHeadline());
        article.setNewsContent(request.getNewsContent());
        article.setNewsSource(request.getNewsSource());
        article.setCategory(category);
        article.setNewsStatus(request.getNewsStatus());
        article.setUpdatedById(updatedByAccountId);
        article.setModifiedDate(LocalDateTime.now());
        article.setTags(tags);

        return toDTO(newsArticleRepository.save(article));
    }

    @Transactional
    public void delete(Integer id) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("NewsArticle", id));
        newsArticleRepository.delete(article);
    }
}
