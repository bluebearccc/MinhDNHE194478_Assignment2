package com.bluebear.minhdnhe194478_assigment2_be.repository;

import com.bluebear.minhdnhe194478_assigment2_be.entity.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, Integer> {

    List<NewsArticle> findByNewsStatus(Boolean newsStatus);

    List<NewsArticle> findByCreatedBy_AccountId(Integer accountId);

    List<NewsArticle> findByNewsTitleContainingIgnoreCaseAndNewsStatus(String title, Boolean newsStatus);

    List<NewsArticle> findByNewsTitleContainingIgnoreCase(String title);

    @Query("SELECT COUNT(n) > 0 FROM NewsArticle n WHERE n.createdBy.accountId = :accountId")
    boolean existsByCreatedBy_AccountId(@Param("accountId") Integer accountId);
}
