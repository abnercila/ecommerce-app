package com.abnercila.ecommerce_app.repository;

import com.abnercila.ecommerce_app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.enabled = true")
    Optional<User> findActiveUserByEmail(String email);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = com.abnercila.ecommerce_app.model.User$Role.ADMIN")
    long countAdmins();
}
