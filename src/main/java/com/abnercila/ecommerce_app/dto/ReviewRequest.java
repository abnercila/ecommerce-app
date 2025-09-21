package com.abnercila.ecommerce_app.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {
    
    @NotNull(message = "El ID del producto es requerido")
    private Long productId;
    
    @NotNull(message = "El rating es requerido")
    @Min(value = 1, message = "El rating mínimo es 1")
    @Max(value = 5, message = "El rating máximo es 5")
    private Integer rating;
    
    @Size(max = 1000, message = "El comentario no puede exceder 1000 caracteres")
    private String comment;
}
