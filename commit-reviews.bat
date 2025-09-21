@echo off
cd /d "c:\Users\abner\Documents\Portafolio\ecommerce-app"
echo Cambiando al directorio del proyecto...
echo.

echo Agregando todos los archivos...
git add .
echo.

echo Estado del repositorio:
git status
echo.

echo Haciendo commit del sistema de reseñas...
git commit -m "feat: Sistema completo de reseñas y calificaciones backend

- Review entity con validaciones y timestamps
- ReviewRepository con consultas optimizadas
- ReviewService con lógica de negocio completa
- ReviewController con endpoints REST
- DTOs: ReviewRequest, ReviewResponse, ProductReviewSummary
- Integración con Product y User entities
- Endpoints CRUD completos con validaciones
- Sistema de paginación para reseñas
- Cálculo automático de promedios y estadísticas
- Seeding de reseñas de ejemplo en DataLoader
- Validaciones de permisos y duplicados"
echo.

echo Enviando cambios al repositorio remoto...
git push origin main
echo.

echo ¡Commit completado!
pause
