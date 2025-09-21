package com.abnercila.ecommerce_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    
    private Long id;
    private String userName;
    private Integer rating;
    private String comment;
    private Boolean isVerifiedPurchase;
    private LocalDateTime createdAt;
    
    // DTO para el usuario (sin información sensible)
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDto {
        private Long id;
        private String name;
    }
}
