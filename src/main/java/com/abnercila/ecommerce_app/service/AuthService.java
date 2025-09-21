package com.abnercila.ecommerce_app.service;

import com.abnercila.ecommerce_app.dto.AuthResponse;
import com.abnercila.ecommerce_app.dto.LoginRequest;
import com.abnercila.ecommerce_app.dto.RegisterRequest;
import com.abnercila.ecommerce_app.model.User;
import com.abnercila.ecommerce_app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    public AuthResponse register(RegisterRequest request) {
        try {
            // Verificar si el usuario ya existe
            if (userRepository.existsByEmail(request.getEmail())) {
                return new AuthResponse("El email ya está registrado", false);
            }
            
            // Crear nuevo usuario
            User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword())
            );
            
            // Guardar usuario
            User savedUser = userRepository.save(user);
            log.info("Usuario registrado exitosamente: {}", savedUser.getEmail());
            
            // Generar token JWT
            String jwtToken = jwtService.generateToken(savedUser);
            
            // Actualizar último login
            savedUser.setLastLogin(LocalDateTime.now());
            userRepository.save(savedUser);
            
            return new AuthResponse(
                jwtToken,
                AuthResponse.UserDto.fromUser(savedUser),
                "Usuario registrado exitosamente"
            );
            
        } catch (Exception e) {
            log.error("Error en el registro: {}", e.getMessage());
            return new AuthResponse("Error interno del servidor", false);
        }
    }
    
    public AuthResponse login(LoginRequest request) {
        try {
            // Autenticar usuario
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
                )
            );
            
            // Obtener usuario autenticado
            User user = (User) authentication.getPrincipal();
            
            // Generar token JWT
            String jwtToken = jwtService.generateToken(user);
            
            // Actualizar último login
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            
            log.info("Usuario autenticado exitosamente: {}", user.getEmail());
            
            return new AuthResponse(
                jwtToken,
                AuthResponse.UserDto.fromUser(user),
                "Inicio de sesión exitoso"
            );
            
        } catch (AuthenticationException e) {
            log.error("Error de autenticación para usuario: {} - {}", request.getEmail(), e.getMessage());
            return new AuthResponse("Credenciales inválidas", false);
        } catch (Exception e) {
            log.error("Error en el login: {}", e.getMessage());
            return new AuthResponse("Error interno del servidor", false);
        }
    }
    
    public AuthResponse refreshToken(String token) {
        try {
            String username = jwtService.extractUsername(token);
            User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            if (jwtService.isTokenValid(token, user)) {
                String newToken = jwtService.generateToken(user);
                
                return new AuthResponse(
                    newToken,
                    AuthResponse.UserDto.fromUser(user),
                    "Token renovado exitosamente"
                );
            } else {
                return new AuthResponse("Token inválido", false);
            }
            
        } catch (Exception e) {
            log.error("Error renovando token: {}", e.getMessage());
            return new AuthResponse("Error renovando token", false);
        }
    }
    
    public AuthResponse validateToken(String token) {
        try {
            if (jwtService.validateToken(token)) {
                String username = jwtService.extractUsername(token);
                User user = userRepository.findActiveUserByEmail(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
                
                return new AuthResponse(
                    token,
                    AuthResponse.UserDto.fromUser(user),
                    "Token válido"
                );
            } else {
                return new AuthResponse("Token inválido", false);
            }
            
        } catch (Exception e) {
            log.error("Error validando token: {}", e.getMessage());
            return new AuthResponse("Token inválido", false);
        }
    }
}
