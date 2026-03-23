package com.bluebear.minhdnhe194478_assigment2_be.repository;

import com.bluebear.minhdnhe194478_assigment2_be.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    List<Category> findByIsActive(Boolean isActive);

    List<Category> findByCategoryNameContainingIgnoreCase(String name);

    List<Category> findByParentCategory_CategoryId(Integer parentCategoryId);

    @Query("SELECT COUNT(n) > 0 FROM NewsArticle n WHERE n.category.categoryId = :categoryId")
    boolean existsNewsArticlesByCategoryId(@Param("categoryId") Integer categoryId);
}
