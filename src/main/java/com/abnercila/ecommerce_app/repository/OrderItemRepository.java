package com.abnercila.ecommerce_app.repository;

import com.abnercila.ecommerce_app.model.OrderItem;
import com.abnercila.ecommerce_app.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    List<OrderItem> findByOrder(Order order);
}
