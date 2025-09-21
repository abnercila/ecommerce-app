package com.abnercila.ecommerce_app.controller;

import com.abnercila.ecommerce_app.dto.CheckoutRequest;
import com.abnercila.ecommerce_app.dto.OrderResponse;
import com.abnercila.ecommerce_app.model.User;
import com.abnercila.ecommerce_app.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Validated
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {
    
    private final OrderService orderService;
    
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(
            @Valid @RequestBody CheckoutRequest checkoutRequest,
            @AuthenticationPrincipal User user) {
        
        try {
            log.info("Procesando checkout para usuario: {}", user.getEmail());
            
            OrderResponse order = orderService.createOrder(checkoutRequest, user);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Orden creada exitosamente",
                "order", order
            ));
            
        } catch (RuntimeException e) {
            log.error("Error en checkout: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        } catch (Exception e) {
            log.error("Error interno en checkout", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Error interno del servidor"
            ));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getUserOrders(@AuthenticationPrincipal User user) {
        try {
            List<OrderResponse> orders = orderService.getUserOrders(user);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            log.error("Error al obtener órdenes del usuario", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getUserOrdersFormatted(@AuthenticationPrincipal User user) {
        try {
            List<OrderResponse> orders = orderService.getUserOrders(user);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "orders", orders
            ));
        } catch (Exception e) {
            log.error("Error al obtener órdenes del usuario", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Error al obtener las órdenes"
            ));
        }
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal User user) {
        
        try {
            OrderResponse order = orderService.getOrder(orderId, user);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error al obtener orden", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal User user) {
        
        try {
            // TODO: Implementar cancelación de orden
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Orden cancelada exitosamente"
            ));
        } catch (Exception e) {
            log.error("Error al cancelar orden", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Error al cancelar la orden"
            ));
        }
    }
}
