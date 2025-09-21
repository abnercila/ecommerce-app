package com.abnercila.ecommerce_app.controller;

import com.abnercila.ecommerce_app.dto.ProductReviewSummary;
import com.abnercila.ecommerce_app.dto.ReviewRequest;
import com.abnercila.ecommerce_app.dto.ReviewResponse;
import com.abnercila.ecommerce_app.model.User;
import com.abnercila.ecommerce_app.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {
    
    private final ReviewService reviewService;
    
    /**
     * Crear una nueva reseña
     */
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal User user) {
        try {
            ReviewResponse review = reviewService.createReview(user.getId(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Actualizar una reseña
     */
    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal User user) {
        try {
            ReviewResponse review = reviewService.updateReview(reviewId, user.getId(), request);
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Eliminar una reseña
     */
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal User user) {
        try {
            reviewService.deleteReview(reviewId, user.getId());
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener reseñas de un producto
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getProductReviews(@PathVariable Long productId) {
        List<ReviewResponse> reviews = reviewService.getProductReviews(productId);
        return ResponseEntity.ok(reviews);
    }
    
    /**
     * Obtener reseñas de un producto con paginación
     */
    @GetMapping("/product/{productId}/paginated")
    public ResponseEntity<Page<ReviewResponse>> getProductReviewsPaginated(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ReviewResponse> reviews = reviewService.getProductReviews(productId, page, size);
        return ResponseEntity.ok(reviews);
    }
    
    /**
     * Obtener resumen de reseñas de un producto
     */
    @GetMapping("/product/{productId}/summary")
    public ResponseEntity<ProductReviewSummary> getProductReviewSummary(@PathVariable Long productId) {
        ProductReviewSummary summary = reviewService.getProductReviewSummary(productId);
        return ResponseEntity.ok(summary);
    }
    
    /**
     * Obtener reseñas de un usuario
     */
    @GetMapping("/user")
    public ResponseEntity<List<ReviewResponse>> getUserReviews(@AuthenticationPrincipal User user) {
        List<ReviewResponse> reviews = reviewService.getUserReviews(user.getId());
        return ResponseEntity.ok(reviews);
    }
    
    /**
     * Obtener reseñas de un usuario específico (solo para admins)
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponse>> getUserReviews(
            @PathVariable Long userId,
            @AuthenticationPrincipal User user) {
        // Solo admins pueden ver reseñas de otros usuarios
        if (!user.getRole().name().equals("ADMIN") && !user.getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<ReviewResponse> reviews = reviewService.getUserReviews(userId);
        return ResponseEntity.ok(reviews);
    }
}
