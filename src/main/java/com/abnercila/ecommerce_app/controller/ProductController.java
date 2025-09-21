package com.abnercila.ecommerce_app.controller;

import com.abnercila.ecommerce_app.model.Product;
import com.abnercila.ecommerce_app.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String query) {
        return productService.searchProducts(query);
    }

    @GetMapping("/category/{category}")
    public List<Product> getProductsByCategory(@PathVariable String category) {
        return productService.getProductsByCategory(category);
    }

    @GetMapping("/categories")
    public List<String> getCategories() {
        return productService.getAllCategories();
    }

    // Endpoints de inventario
    @GetMapping("/low-stock")
    public ResponseEntity<Map<String, Object>> getLowStockProducts() {
        List<Product> lowStockProducts = productService.getLowStockProducts();
        return ResponseEntity.ok(Map.of(
            "success", true,
            "products", lowStockProducts,
            "count", lowStockProducts.size()
        ));
    }

    @GetMapping("/out-of-stock")
    public ResponseEntity<Map<String, Object>> getOutOfStockProducts() {
        List<Product> outOfStockProducts = productService.getOutOfStockProducts();
        return ResponseEntity.ok(Map.of(
            "success", true,
            "products", outOfStockProducts,
            "count", outOfStockProducts.size()
        ));
    }

    @GetMapping("/{id}/stock")
    public ResponseEntity<Map<String, Object>> getProductStock(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        
        if (product.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Product p = product.get();
        return ResponseEntity.ok(Map.of(
            "productId", p.getId(),
            "productName", p.getName(),
            "stock", p.getStock(),
            "isAvailable", p.getStock() > 0,
            "isLowStock", p.getStock() < 10
        ));
    }

    @PostMapping("/{id}/check-stock")
    public ResponseEntity<Map<String, Object>> checkStock(
            @PathVariable Long id, 
            @RequestParam int quantity) {
        
        boolean hasStock = productService.hasEnoughStock(id, quantity);
        Optional<Product> product = productService.getProductById(id);
        
        if (product.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Product p = product.get();
        return ResponseEntity.ok(Map.of(
            "productId", id,
            "requestedQuantity", quantity,
            "availableStock", p.getStock(),
            "hasEnoughStock", hasStock,
            "message", hasStock ? "Stock disponible" : "Stock insuficiente"
        ));
    }
}