package com.bluebear.minhdnhe194478_assigment2_be.service;

import com.bluebear.minhdnhe194478_assigment2_be.dto.CategoryDTO;
import com.bluebear.minhdnhe194478_assigment2_be.dto.CategoryRequest;
import com.bluebear.minhdnhe194478_assigment2_be.entity.Category;
import com.bluebear.minhdnhe194478_assigment2_be.exception.BusinessException;
import com.bluebear.minhdnhe194478_assigment2_be.exception.ResourceNotFoundException;
import com.bluebear.minhdnhe194478_assigment2_be.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;


    public CategoryDTO toDTO(Category c) {
        return CategoryDTO.builder()
                .categoryId(c.getCategoryId())
                .categoryName(c.getCategoryName())
                .categoryDescription(c.getCategoryDescription())
                // parentCategory is a self-referencing ManyToOne — expose ID and Name only
                .parentCategoryId(c.getParentCategory() != null ? c.getParentCategory().getCategoryId() : null)
                .parentCategoryName(c.getParentCategory() != null ? c.getParentCategory().getCategoryName() : null)
                .isActive(c.getIsActive())
                .build();
    }


    public List<CategoryDTO> getAll() {
        return categoryRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<CategoryDTO> getActive() {
        return categoryRepository.findByIsActive(true)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public CategoryDTO getById(Integer id) {
        return toDTO(categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id)));
    }

    public List<CategoryDTO> search(String name) {
        return categoryRepository.findByCategoryNameContainingIgnoreCase(name)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public CategoryDTO create(CategoryRequest request) {
        Category parentCategory = null;
        if (request.getParentCategoryId() != null) {
            parentCategory = categoryRepository.findById(request.getParentCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent Category", request.getParentCategoryId()));
        }

        Category category = Category.builder()
                .categoryName(request.getCategoryName())
                .categoryDescription(request.getCategoryDescription())
                .parentCategory(parentCategory)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();
        return toDTO(categoryRepository.save(category));
    }

    public CategoryDTO update(Integer id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id));

        Category parentCategory = null;
        if (request.getParentCategoryId() != null) {
            parentCategory = categoryRepository.findById(request.getParentCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent Category", request.getParentCategoryId()));
        }

        category.setCategoryName(request.getCategoryName());
        category.setCategoryDescription(request.getCategoryDescription());
        category.setParentCategory(parentCategory);
        category.setIsActive(request.getIsActive());

        return toDTO(categoryRepository.save(category));
    }

    public void delete(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id));

        if (categoryRepository.existsNewsArticlesByCategoryId(id)) {
            throw new BusinessException(
                    "Cannot delete category '" + category.getCategoryName() +
                    "' because it has existing news articles.");
        }

        categoryRepository.delete(category);
    }
}
