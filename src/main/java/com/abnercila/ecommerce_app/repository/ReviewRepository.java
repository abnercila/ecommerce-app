package com.abnercila.ecommerce_app.repository;

import com.abnercila.ecommerce_app.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    // Encontrar reseñas por producto
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);
    
    // Encontrar reseñas por producto con paginación
    Page<Review> findByProductIdOrderByCreatedAtDesc(Long productId, Pageable pageable);
    
    // Encontrar reseñas por usuario
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Verificar si un usuario ya reseñó un producto
    Optional<Review> findByUserIdAndProductId(Long userId, Long productId);
    
    // Calcular promedio de rating por producto
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double findAverageRatingByProductId(@Param("productId") Long productId);
    
    // Contar reseñas por producto
    Long countByProductId(Long productId);
    
    // Encontrar reseñas por rating específico
    List<Review> findByProductIdAndRating(Long productId, Integer rating);
    
    // Encontrar reseñas verificadas
    List<Review> findByProductIdAndIsVerifiedPurchaseTrue(Long productId);
    
    // Encontrar últimas reseñas
    @Query("SELECT r FROM Review r ORDER BY r.createdAt DESC")
    List<Review> findLatestReviews(Pageable pageable);
    
    // Contar reseñas por rating para un producto
    @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.product.id = :productId GROUP BY r.rating")
    List<Object[]> countReviewsByRatingForProduct(@Param("productId") Long productId);
}
