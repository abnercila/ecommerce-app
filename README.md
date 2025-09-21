# Ecommerce App - TechStore

Un moderno ecommerce desarrollado con React (frontend) y Spring Boot (backend).

## 🚀 Características

### Frontend (React + Vite)
- ✅ **Interfaz moderna** con tema oscuro
- ✅ **Responsive design** para todos los dispositivos
- ✅ **Autenticación completa** (login/registro)
- ✅ **Sistema de carrito** funcional
- ✅ **Búsqueda y filtrado** de productos por categoría
- ✅ **Checkout completo** con 4 pasos
- ✅ **Historial de órdenes** para usuarios
- ✅ **Modales informativos** (Acerca de, Contacto)
- ✅ **Gestión de estado** con Context API

### Backend (Spring Boot + H2)
- ✅ **API REST** completa
- ✅ **Autenticación JWT** segura
- ✅ **Base de datos H2** en memoria
- ✅ **Sistema de órdenes** robusto
- ✅ **Gestión de usuarios** y productos
- ✅ **CORS configurado** para desarrollo
- ✅ **Validación** de datos
- ✅ **Manejo de errores** consistente

## 🛠️ Tecnologías

### Frontend
- React 18
- Vite
- Lucide React (iconos)
- CSS3 (diseño responsivo)
- Context API (gestión de estado)
- Fetch API (comunicación con backend)

### Backend
- Spring Boot 3.5.6
- Spring Security 6
- Spring Data JPA
- H2 Database
- JWT Authentication
- Lombok
- Maven

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 16+
- Java 17+
- Maven 3.6+

### Backend
```bash
# Navegar al directorio raíz
cd ecommerce-app

# Ejecutar el backend
mvn spring-boot:run
```
El backend estará disponible en: `http://localhost:8081`

### Frontend
```bash
# Navegar al directorio frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```
El frontend estará disponible en: `http://localhost:5173`

## 📁 Estructura del Proyecto

```
ecommerce-app/
├── src/main/java/              # Código fuente del backend
│   └── com/abnercila/ecommerce_app/
│       ├── config/             # Configuraciones de seguridad
│       ├── controller/         # Controladores REST
│       ├── dto/                # Data Transfer Objects
│       ├── model/              # Entidades JPA
│       ├── repository/         # Repositorios JPA
│       └── service/            # Lógica de negocio
├── frontend/
│   └── src/
│       ├── components/         # Componentes React
│       ├── services/           # Servicios de API
│       ├── assets/             # Recursos estáticos
│       └── styles/             # Archivos CSS
└── data/                       # Datos de prueba
```

## 🔧 Configuración

### Variables de Entorno (Backend)
El backend usa configuración por defecto en `application.properties`:
- Puerto: 8081
- Base de datos: H2 en memoria
- JWT Secret: configurado automáticamente

### Configuración del Frontend
- Puerto de desarrollo: 5173
- URL del backend: http://localhost:8081

## 📊 Funcionalidades Principales

### 🛒 Sistema de Carrito
- Agregar/quitar productos
- Actualizar cantidades
- Cálculo automático de totales
- Persistencia durante la sesión

### 🔐 Autenticación
- Registro de nuevos usuarios
- Login con email/password
- JWT tokens para autenticación
- Protección de rutas sensibles

### 💳 Sistema de Checkout
1. **Información de envío**: Formulario completo con validación
2. **Método de pago**: Soporte para tarjetas y PayPal
3. **Revisión de orden**: Resumen completo antes de confirmar
4. **Confirmación**: Número de orden y detalles de entrega

### 📦 Gestión de Órdenes
- Historial completo de compras
- Estados de órdenes (Pendiente, Confirmada, Enviada, etc.)
- Detalles de productos y totales
- Información de envío

### 🔍 Búsqueda y Filtrado
- Búsqueda por nombre de producto
- Filtrado por categorías
- Interfaz intuitiva y responsive

## 🎨 Diseño

### Tema Oscuro
- Paleta de colores moderna
- Contrastes optimizados para legibilidad
- Gradientes y efectos visuales atractivos

### Responsive Design
- Diseño móvil-first
- Breakpoints optimizados
- Interfaz adaptable a todas las pantallas

## 🔒 Seguridad

- Autenticación JWT
- Validación de entrada en frontend y backend
- Protección CORS configurada
- Sanitización de datos

## 📈 Próximas Mejoras

- [ ] Integración con pasarelas de pago reales
- [ ] Sistema de reviews y ratings
- [ ] Notificaciones push
- [ ] Panel de administración
- [ ] Optimización SEO
- [ ] Tests unitarios y de integración

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Abner Cila**
- GitHub: [@abnercila](https://github.com/abnercila)
- Email: abner.cila@example.com

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!
