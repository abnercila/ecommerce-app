package com.abnercila.ecommerce_app.repository;

import com.abnercila.ecommerce_app.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Buscar productos por categoría
    List<Product> findByCategory(String category);
    
    // Buscar productos por nombre (case insensitive)
    List<Product> findByNameContainingIgnoreCase(String name);
    
    // Obtener todas las categorías distintas
    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL ORDER BY p.category")
    List<String> findDistinctCategories();
    
    // Buscar productos con stock bajo
    List<Product> findByStockLessThan(int stock);
    
    // Buscar productos agotados
    List<Product> findByStock(int stock);
    
    // Buscar productos disponibles (stock > 0)
    List<Product> findByStockGreaterThan(int stock);
    
    // Buscar productos por categoría con stock disponible
    List<Product> findByCategoryAndStockGreaterThan(String category, int stock);
    
    // Buscar productos por nombre con stock disponible
    List<Product> findByNameContainingIgnoreCaseAndStockGreaterThan(String name, int stock);
}