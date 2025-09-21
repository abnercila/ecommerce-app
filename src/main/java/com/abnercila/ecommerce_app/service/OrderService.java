package com.abnercila.ecommerce_app.service;

import com.abnercila.ecommerce_app.dto.CheckoutRequest;
import com.abnercila.ecommerce_app.dto.OrderResponse;
import com.abnercila.ecommerce_app.model.*;
import com.abnercila.ecommerce_app.repository.OrderRepository;
import com.abnercila.ecommerce_app.repository.OrderItemRepository;
import com.abnercila.ecommerce_app.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    
    @Transactional
    public OrderResponse createOrder(CheckoutRequest checkoutRequest, User user) {
        log.info("Creando orden para usuario: {}", user.getEmail());
        
        // Validar productos y stock
        validateCartItems(checkoutRequest.getCartItems());
        
        // Crear la orden
        Order order = new Order();
        order.setUser(user);
        order.setStatus(Order.OrderStatus.PENDING);
        
        // Calcular totales
        BigDecimal subtotal = calculateSubtotal(checkoutRequest.getCartItems());
        BigDecimal shippingCost = calculateShippingCost(checkoutRequest.getShippingInfo());
        BigDecimal taxAmount = calculateTaxAmount(subtotal);
        BigDecimal totalAmount = subtotal.add(shippingCost).add(taxAmount);
        
        order.setSubtotal(subtotal);
        order.setShippingCost(shippingCost);
        order.setTaxAmount(taxAmount);
        order.setTotalAmount(totalAmount);
        
        // Información de envío
        CheckoutRequest.ShippingInfoDto shipping = checkoutRequest.getShippingInfo();
        order.setShippingName(shipping.getName());
        order.setShippingEmail(shipping.getEmail());
        order.setShippingPhone(shipping.getPhone());
        order.setShippingAddress(shipping.getAddress());
        order.setShippingCity(shipping.getCity());
        order.setShippingState(shipping.getState());
        order.setShippingPostalCode(shipping.getPostalCode());
        order.setShippingCountry(shipping.getCountry());
        
        // Información de pago
        CheckoutRequest.PaymentInfoDto payment = checkoutRequest.getPaymentInfo();
        order.setPaymentMethod(Order.PaymentMethod.valueOf(payment.getPaymentMethod()));
        order.setPaymentStatus(Order.PaymentStatus.PENDING);
        
        // Estimado de entrega (7-10 días)
        order.setEstimatedDelivery(LocalDateTime.now().plusDays(8));
        
        // Notas
        order.setNotes(checkoutRequest.getNotes());
        
        // Guardar orden
        order = orderRepository.save(order);
        
        // Crear items de la orden
        List<OrderItem> orderItems = createOrderItems(order, checkoutRequest.getCartItems());
        order.setOrderItems(orderItems);
        
        // Actualizar stock de productos
        updateProductStock(checkoutRequest.getCartItems());
        
        // Simular procesamiento de pago
        boolean paymentSuccess = processPayment(payment);
        if (paymentSuccess) {
            order.setPaymentStatus(Order.PaymentStatus.PAID);
            order.setStatus(Order.OrderStatus.CONFIRMED);
            order.setPaymentTransactionId("TXN-" + System.currentTimeMillis());
        } else {
            order.setPaymentStatus(Order.PaymentStatus.FAILED);
            order.setStatus(Order.OrderStatus.CANCELLED);
        }
        
        order = orderRepository.save(order);
        
        log.info("Orden creada exitosamente: {}", order.getOrderNumber());
        
        return convertToOrderResponse(order);
    }
    
    public List<OrderResponse> getUserOrders(User user) {
        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
        return orders.stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }
    
    public OrderResponse getOrder(Long orderId, User user) {
        Order order = orderRepository.findByUserAndId(user, orderId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
        return convertToOrderResponse(order);
    }
    
    private void validateCartItems(List<CheckoutRequest.CartItemDto> cartItems) {
        for (CheckoutRequest.CartItemDto item : cartItems) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getProductId()));
            
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + product.getName());
            }
        }
    }
    
    private BigDecimal calculateSubtotal(List<CheckoutRequest.CartItemDto> cartItems) {
        return cartItems.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    private BigDecimal calculateShippingCost(CheckoutRequest.ShippingInfoDto shippingInfo) {
        // Lógica simple de envío
        return new BigDecimal("99.00"); // Envío estándar
    }
    
    private BigDecimal calculateTaxAmount(BigDecimal subtotal) {
        // IVA del 16%
        return subtotal.multiply(new BigDecimal("0.16"));
    }
    
    private List<OrderItem> createOrderItems(Order order, List<CheckoutRequest.CartItemDto> cartItems) {
        List<OrderItem> orderItems = new ArrayList<>();
        
        for (CheckoutRequest.CartItemDto cartItem : cartItems) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(cartItem.getPrice());
            orderItem.setProductName(product.getName());
            orderItem.setProductImageUrl(product.getImageUrl());
            
            orderItems.add(orderItemRepository.save(orderItem));
        }
        
        return orderItems;
    }
    
    private void updateProductStock(List<CheckoutRequest.CartItemDto> cartItems) {
        for (CheckoutRequest.CartItemDto item : cartItems) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
            
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }
    }
    
    private boolean processPayment(CheckoutRequest.PaymentInfoDto paymentInfo) {
        // Simulación de procesamiento de pago
        log.info("Procesando pago con método: {}", paymentInfo.getPaymentMethod());
        
        // 95% de éxito en pagos (para testing)
        return Math.random() > 0.05;
    }
    
    private OrderResponse convertToOrderResponse(Order order) {
        List<OrderResponse.OrderItemDto> itemDtos = order.getOrderItems().stream()
                .map(item -> OrderResponse.OrderItemDto.builder()
                        .productId(item.getProduct().getId())
                        .productName(item.getProductName())
                        .productImageUrl(item.getProductImageUrl())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .totalPrice(item.getTotalPrice())
                        .build())
                .collect(Collectors.toList());
        
        OrderResponse.ShippingInfo shippingInfo = OrderResponse.ShippingInfo.builder()
                .name(order.getShippingName())
                .email(order.getShippingEmail())
                .phone(order.getShippingPhone())
                .address(order.getShippingAddress())
                .city(order.getShippingCity())
                .state(order.getShippingState())
                .postalCode(order.getShippingPostalCode())
                .country(order.getShippingCountry())
                .build();
        
        OrderResponse.PaymentInfo paymentInfo = OrderResponse.PaymentInfo.builder()
                .paymentMethod(order.getPaymentMethod().toString())
                .paymentStatus(order.getPaymentStatus().toString())
                .transactionId(order.getPaymentTransactionId())
                .build();
        
        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus().toString())
                .totalAmount(order.getTotalAmount())
                .subtotal(order.getSubtotal())
                .shippingCost(order.getShippingCost())
                .taxAmount(order.getTaxAmount())
                .createdAt(order.getCreatedAt())
                .estimatedDelivery(order.getEstimatedDelivery())
                .shippingInfo(shippingInfo)
                .paymentInfo(paymentInfo)
                .items(itemDtos)
                .notes(order.getNotes())
                .build();
    }
}
