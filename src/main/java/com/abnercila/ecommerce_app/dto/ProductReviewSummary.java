package com.abnercila.ecommerce_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductReviewSummary {
    
    private Long productId;
    private Double averageRating;
    private Long totalReviews;
    private Map<Integer, Long> ratingDistribution; // rating -> count
    private List<ReviewResponse> recentReviews;
    
    public ProductReviewSummary(Long productId, Double averageRating, Long totalReviews) {
        this.productId = productId;
        this.averageRating = averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : 0.0;
        this.totalReviews = totalReviews != null ? totalReviews : 0L;
    }
}
