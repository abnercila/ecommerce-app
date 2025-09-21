package com.abnercila.ecommerce_app.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {
    
    @NotEmpty(message = "Los items del carrito no pueden estar vacíos")
    private List<CartItemDto> cartItems;
    
    @NotNull(message = "La información de envío es requerida")
    private ShippingInfoDto shippingInfo;
    
    @NotNull(message = "La información de pago es requerida")
    private PaymentInfoDto paymentInfo;
    
    private String notes;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemDto {
        @NotNull(message = "El ID del producto es requerido")
        private Long productId;
        
        @Min(value = 1, message = "La cantidad debe ser al menos 1")
        private Integer quantity;
        
        @NotNull(message = "El precio es requerido")
        @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
        private BigDecimal price;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShippingInfoDto {
        @NotBlank(message = "El nombre es requerido")
        @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
        private String name;
        
        @NotBlank(message = "El email es requerido")
        @Email(message = "Email inválido")
        private String email;
        
        @Pattern(regexp = "^[+]?[0-9\\-\\s()]{10,20}$", message = "Teléfono inválido")
        private String phone;
        
        @NotBlank(message = "La dirección es requerida")
        @Size(max = 200, message = "La dirección no puede exceder 200 caracteres")
        private String address;
        
        @NotBlank(message = "La ciudad es requerida")
        @Size(max = 50, message = "La ciudad no puede exceder 50 caracteres")
        private String city;
        
        @NotBlank(message = "El estado es requerido")
        @Size(max = 50, message = "El estado no puede exceder 50 caracteres")
        private String state;
        
        @NotBlank(message = "El código postal es requerido")
        @Pattern(regexp = "^[0-9]{5}(?:-[0-9]{4})?$", message = "Código postal inválido")
        private String postalCode;
        
        @NotBlank(message = "El país es requerido")
        @Size(max = 50, message = "El país no puede exceder 50 caracteres")
        private String country;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentInfoDto {
        @NotBlank(message = "El método de pago es requerido")
        private String paymentMethod; // CREDIT_CARD, DEBIT_CARD, PAYPAL, etc.
        
        // Para tarjetas de crédito/débito
        private String cardNumber;
        private String cardHolderName;
        private String expiryMonth;
        private String expiryYear;
        private String cvv;
        
        // Para otros métodos de pago
        private String paypalEmail;
        private String bankAccount;
        
        @NotNull(message = "El monto total es requerido")
        @DecimalMin(value = "0.0", inclusive = false, message = "El monto debe ser mayor a 0")
        private BigDecimal totalAmount;
    }
}
