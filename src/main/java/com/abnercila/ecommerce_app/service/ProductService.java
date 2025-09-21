package com.abnercila.ecommerce_app.service;

import com.abnercila.ecommerce_app.model.Product;
import com.abnercila.ecommerce_app.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
    
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }
    
    public List<Product> searchProducts(String searchTerm) {
        return productRepository.findByNameContainingIgnoreCase(searchTerm);
    }
    
    public List<String> getAllCategories() {
        return productRepository.findDistinctCategories();
    }
    
    /**
     * Reduce el stock de un producto
     * @param productId ID del producto
     * @param quantity Cantidad a reducir
     * @return true si se pudo reducir el stock, false si no hay suficiente stock
     */
    public boolean reduceStock(Long productId, int quantity) {
        Optional<Product> productOpt = productRepository.findById(productId);
        
        if (productOpt.isEmpty()) {
            log.error("Producto con ID {} no encontrado", productId);
            return false;
        }
        
        Product product = productOpt.get();
        
        if (product.getStock() < quantity) {
            log.warn("Stock insuficiente para producto {}. Stock actual: {}, Cantidad solicitada: {}", 
                    product.getName(), product.getStock(), quantity);
            return false;
        }
        
        product.setStock(product.getStock() - quantity);
        productRepository.save(product);
        
        log.info("Stock reducido para producto {}. Nuevo stock: {}", 
                product.getName(), product.getStock());
        
        return true;
    }
    
    /**
     * Aumenta el stock de un producto (para devoluciones)
     * @param productId ID del producto
     * @param quantity Cantidad a aumentar
     */
    public void increaseStock(Long productId, int quantity) {
        Optional<Product> productOpt = productRepository.findById(productId);
        
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setStock(product.getStock() + quantity);
            productRepository.save(product);
            
            log.info("Stock aumentado para producto {}. Nuevo stock: {}", 
                    product.getName(), product.getStock());
        } else {
            log.error("Producto con ID {} no encontrado para aumentar stock", productId);
        }
    }
    
    /**
     * Verifica si hay suficiente stock para una cantidad específica
     * @param productId ID del producto
     * @param quantity Cantidad a verificar
     * @return true si hay suficiente stock
     */
    public boolean hasEnoughStock(Long productId, int quantity) {
        Optional<Product> productOpt = productRepository.findById(productId);
        
        if (productOpt.isEmpty()) {
            return false;
        }
        
        return productOpt.get().getStock() >= quantity;
    }
    
    /**
     * Obtiene productos con stock bajo (menos de 10 unidades)
     * @return Lista de productos con stock bajo
     */
    public List<Product> getLowStockProducts() {
        return productRepository.findByStockLessThan(10);
    }
    
    /**
     * Obtiene productos agotados (stock = 0)
     * @return Lista de productos agotados
     */
    public List<Product> getOutOfStockProducts() {
        return productRepository.findByStock(0);
    }
    
    /**
     * Verifica el stock de múltiples productos de una vez
     * @param productQuantities Lista de pares productId-quantity
     * @return true si todos los productos tienen suficiente stock
     */
    public boolean validateStockForMultipleProducts(List<ProductStockCheck> productStockChecks) {
        for (ProductStockCheck check : productStockChecks) {
            if (!hasEnoughStock(check.getProductId(), check.getQuantity())) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Reduce el stock de múltiples productos de forma transaccional
     * @param productStockChecks Lista de productos y cantidades a reducir
     * @return true si se pudo reducir el stock de todos los productos
     */
    @Transactional
    public boolean reduceStockForMultipleProducts(List<ProductStockCheck> productStockChecks) {
        // Primero validamos que todos los productos tengan suficiente stock
        if (!validateStockForMultipleProducts(productStockChecks)) {
            log.error("No hay suficiente stock para algunos productos");
            return false;
        }
        
        // Si todos tienen suficiente stock, procedemos a reducir
        for (ProductStockCheck check : productStockChecks) {
            if (!reduceStock(check.getProductId(), check.getQuantity())) {
                // Si falla uno, la transacción se hace rollback automáticamente
                throw new RuntimeException("Error al reducir stock para producto " + check.getProductId());
            }
        }
        
        return true;
    }
    
    /**
     * Clase auxiliar para verificaciones de stock
     */
    public static class ProductStockCheck {
        private Long productId;
        private int quantity;
        
        public ProductStockCheck(Long productId, int quantity) {
            this.productId = productId;
            this.quantity = quantity;
        }
        
        public Long getProductId() {
            return productId;
        }
        
        public int getQuantity() {
            return quantity;
        }
    }
}
