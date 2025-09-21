package com.abnercila.ecommerce_app.service;

import com.abnercila.ecommerce_app.dto.ProductReviewSummary;
import com.abnercila.ecommerce_app.dto.ReviewRequest;
import com.abnercila.ecommerce_app.dto.ReviewResponse;
import com.abnercila.ecommerce_app.model.Product;
import com.abnercila.ecommerce_app.model.Review;
import com.abnercila.ecommerce_app.model.User;
import com.abnercila.ecommerce_app.repository.ProductRepository;
import com.abnercila.ecommerce_app.repository.ReviewRepository;
import com.abnercila.ecommerce_app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    
    /**
     * Crear una nueva reseña
     */
    public ReviewResponse createReview(Long userId, ReviewRequest request) {
        // Verificar que el usuario existe
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Verificar que el producto existe
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        // Verificar que el usuario no haya reseñado ya este producto
        Optional<Review> existingReview = reviewRepository.findByUserIdAndProductId(userId, request.getProductId());
        if (existingReview.isPresent()) {
            throw new RuntimeException("Ya has reseñado este producto");
        }
        
        // Crear la reseña
        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        // TODO: Verificar si es una compra verificada consultando el historial de pedidos
        review.setIsVerifiedPurchase(false);
        
        Review savedReview = reviewRepository.save(review);
        return convertToResponse(savedReview);
    }
    
    /**
     * Actualizar una reseña existente
     */
    public ReviewResponse updateReview(Long reviewId, Long userId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));
        
        // Verificar que el usuario es el dueño de la reseña
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("No tienes permisos para editar esta reseña");
        }
        
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        
        Review savedReview = reviewRepository.save(review);
        return convertToResponse(savedReview);
    }
    
    /**
     * Eliminar una reseña
     */
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));
        
        // Verificar que el usuario es el dueño de la reseña
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("No tienes permisos para eliminar esta reseña");
        }
        
        reviewRepository.delete(review);
    }
    
    /**
     * Obtener reseñas de un producto
     */
    @Transactional(readOnly = true)
    public List<ReviewResponse> getProductReviews(Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        return reviews.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener reseñas de un producto con paginación
     */
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getProductReviews(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable);
        return reviews.map(this::convertToResponse);
    }
    
    /**
     * Obtener resumen de reseñas de un producto
     */
    @Transactional(readOnly = true)
    public ProductReviewSummary getProductReviewSummary(Long productId) {
        Double averageRating = reviewRepository.findAverageRatingByProductId(productId);
        Long totalReviews = reviewRepository.countByProductId(productId);
        
        ProductReviewSummary summary = new ProductReviewSummary(productId, averageRating, totalReviews);
        
        // Obtener distribución de ratings
        List<Object[]> ratingCounts = reviewRepository.countReviewsByRatingForProduct(productId);
        Map<Integer, Long> distribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            distribution.put(i, 0L);
        }
        for (Object[] row : ratingCounts) {
            Integer rating = (Integer) row[0];
            Long count = (Long) row[1];
            distribution.put(rating, count);
        }
        summary.setRatingDistribution(distribution);
        
        // Obtener reseñas recientes
        List<Review> recentReviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .limit(3)
                .collect(Collectors.toList());
        summary.setRecentReviews(
                recentReviews.stream()
                        .map(this::convertToResponse)
                        .collect(Collectors.toList())
        );
        
        return summary;
    }
    
    /**
     * Obtener reseñas de un usuario
     */
    @Transactional(readOnly = true)
    public List<ReviewResponse> getUserReviews(Long userId) {
        List<Review> reviews = reviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return reviews.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Convertir Review a ReviewResponse
     */
    private ReviewResponse convertToResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setUserName(review.getUser().getName());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setIsVerifiedPurchase(review.getIsVerifiedPurchase());
        response.setCreatedAt(review.getCreatedAt());
        return response;
    }
}
