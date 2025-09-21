package com.abnercila.ecommerce_app.repository;

import com.abnercila.ecommerce_app.model.Order;
import com.abnercila.ecommerce_app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    
    Optional<Order> findByOrderNumber(String orderNumber);
    
    List<Order> findByUserAndStatusOrderByCreatedAtDesc(User user, Order.OrderStatus status);
    
    @Query("SELECT o FROM Order o WHERE o.user = :user AND o.id = :orderId")
    Optional<Order> findByUserAndId(@Param("user") User user, @Param("orderId") Long orderId);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.user = :user")
    Long countOrdersByUser(@Param("user") User user);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.user = :user AND o.status != 'CANCELLED'")
    Optional<java.math.BigDecimal> getTotalSpentByUser(@Param("user") User user);
}
