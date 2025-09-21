package com.abnercila.ecommerce_app.config;

import com.abnercila.ecommerce_app.model.Product;
import com.abnercila.ecommerce_app.model.Review;
import com.abnercila.ecommerce_app.model.User;
import com.abnercila.ecommerce_app.repository.ProductRepository;
import com.abnercila.ecommerce_app.repository.ReviewRepository;
import com.abnercila.ecommerce_app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        loadUsers();
        loadProducts();
        loadReviews();
    }

    private void loadUsers() {
        if (userRepository.count() == 0) {
            log.info("Cargando usuarios de ejemplo...");

            // Usuario admin
            User admin = new User(
                "Administrador",
                "admin@techstore.com",
                passwordEncoder.encode("admin123")
            );
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);

            // Usuario normal
            User user = new User(
                "Juan Pérez",
                "juan@email.com",
                passwordEncoder.encode("user123")
            );
            userRepository.save(user);

            // Usuario de prueba
            User testUser = new User(
                "María García",
                "maria@test.com",
                passwordEncoder.encode("test123")
            );
            userRepository.save(testUser);

            log.info("Usuarios cargados exitosamente");
        }
    }

    private void loadProducts() {
        if (productRepository.count() == 0) {
            log.info("Cargando productos de ejemplo...");

            // LAPTOPS
            productRepository.save(new Product(
                "MacBook Pro M3 14\"",
                "Laptop profesional con chip M3, 16GB RAM, 512GB SSD y pantalla Retina de 14 pulgadas",
                new BigDecimal("1999.99"),
                10,
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
                "laptops"
            ));

            productRepository.save(new Product(
                "Dell XPS 13 Plus",
                "Ultrabook premium con Intel Core i7, 16GB RAM, 1TB SSD y pantalla InfinityEdge",
                new BigDecimal("1599.99"),
                15,
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
                "laptops"
            ));

            productRepository.save(new Product(
                "ASUS ROG Strix G15",
                "Laptop gaming con AMD Ryzen 9, NVIDIA RTX 4070, 32GB RAM ideal para juegos",
                new BigDecimal("1899.99"),
                8,
                "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
                "laptops"
            ));

            // MONITORES
            productRepository.save(new Product(
                "Samsung Odyssey G7 32\"",
                "Monitor gaming curvo 4K 144Hz con HDR1000 y tecnología QLED",
                new BigDecimal("799.99"),
                12,
                "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
                "monitores"
            ));

            productRepository.save(new Product(
                "LG UltraWide 34\" 5K",
                "Monitor ultrawide para productividad con USB-C y calibración de color profesional",
                new BigDecimal("1299.99"),
                7,
                "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
                "monitores"
            ));

            // AUDÍFONOS
            productRepository.save(new Product(
                "AirPods Pro 2da Gen",
                "Audífonos inalámbricos con cancelación activa de ruido mejorada y audio espacial",
                new BigDecimal("249.99"),
                50,
                "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
                "audifonos"
            ));

            productRepository.save(new Product(
                "Sony WH-1000XM5",
                "Audífonos over-ear premium con la mejor cancelación de ruido y 30h de batería",
                new BigDecimal("349.99"),
                30,
                "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400",
                "audifonos"
            ));

            productRepository.save(new Product(
                "Bose QuietComfort Ultra",
                "Audífonos de diadema con cancelación de ruido inmersiva y sonido espacial",
                new BigDecimal("429.99"),
                20,
                "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
                "audifonos"
            ));

            // TELÉFONOS
            productRepository.save(new Product(
                "iPhone 15 Pro Max",
                "El iPhone más avanzado con chip A17 Pro, cámara de 48MP y titanio",
                new BigDecimal("1199.99"),
                25,
                "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
                "telefonos"
            ));

            productRepository.save(new Product(
                "Samsung Galaxy S24 Ultra",
                "Smartphone premium con S Pen, cámara de 200MP y pantalla Dynamic AMOLED 2X",
                new BigDecimal("1299.99"),
                18,
                "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
                "telefonos"
            ));

            // TABLETS
            productRepository.save(new Product(
                "iPad Pro 12.9\" M2",
                "Tablet profesional con chip M2, pantalla Liquid Retina XDR y soporte para Apple Pencil",
                new BigDecimal("1099.99"),
                15,
                "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
                "tablets"
            ));

            // ACCESORIOS
            productRepository.save(new Product(
                "Logitech MX Master 3S",
                "Mouse inalámbrico ergonómico para productividad con scroll electromagnético",
                new BigDecimal("99.99"),
                45,
                "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",
                "accesorios"
            ));

            productRepository.save(new Product(
                "Razer BlackWidow V4 Pro",
                "Teclado mecánico gaming con switches Green, RGB Chroma y control de comandos",
                new BigDecimal("229.99"),
                30,
                "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400",
                "accesorios"
            ));

            log.info("Productos cargados exitosamente");
        }
    }
    
    private void loadReviews() {
        if (reviewRepository.count() == 0) {
            log.info("Cargando reseñas de ejemplo...");
            
            // Obtener usuarios y productos para las reseñas
            Optional<User> user1 = userRepository.findByEmail("user@techstore.com");
            Optional<User> user2 = userRepository.findByEmail("admin@techstore.com");
            
            List<Product> products = productRepository.findAll();
            
            if (user1.isPresent() && user2.isPresent() && !products.isEmpty()) {
                // Reseñas para MacBook Pro M3
                Product macbook = products.stream()
                    .filter(p -> p.getName().contains("MacBook"))
                    .findFirst().orElse(null);
                    
                if (macbook != null) {
                    reviewRepository.save(new Review(
                        user1.get(),
                        macbook,
                        5,
                        "Excelente laptop para desarrollo. La batería dura todo el día y el rendimiento es increíble."
                    ));
                    
                    reviewRepository.save(new Review(
                        user2.get(),
                        macbook,
                        4,
                        "Muy buena calidad, aunque el precio es alto. Vale la pena para trabajo profesional."
                    ));
                }
                
                // Reseñas para iPhone 15 Pro Max
                Product iphone = products.stream()
                    .filter(p -> p.getName().contains("iPhone"))
                    .findFirst().orElse(null);
                    
                if (iphone != null) {
                    reviewRepository.save(new Review(
                        user1.get(),
                        iphone,
                        5,
                        "La cámara es espectacular, especialmente para video. El chip A17 Pro es muy rápido."
                    ));
                }
                
                // Reseñas para AirPods Pro
                Product airpods = products.stream()
                    .filter(p -> p.getName().contains("AirPods"))
                    .findFirst().orElse(null);
                    
                if (airpods != null) {
                    reviewRepository.save(new Review(
                        user2.get(),
                        airpods,
                        4,
                        "La cancelación de ruido funciona muy bien. Cómodos para uso prolongado."
                    ));
                }
                
                // Más reseñas para otros productos
                Product monitor = products.stream()
                    .filter(p -> p.getName().contains("Monitor"))
                    .findFirst().orElse(null);
                    
                if (monitor != null) {
                    reviewRepository.save(new Review(
                        user1.get(),
                        monitor,
                        3,
                        "Buena calidad de imagen pero el soporte podría ser mejor."
                    ));
                }
            }
            
            log.info("Reseñas cargadas exitosamente");
        }
    }
}
