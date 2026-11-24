# Integración de NutriVida React con cinco microservicios

## Cambios realizados
- Se conservaron las pantallas, CSS, imágenes, navegación y pruebas originales.
- Se creó `src/services/api.js` con funciones REST para los cinco servicios (GET, GET por ID, POST, PUT y DELETE), mensajes de error HTTP y URLs configurables por `.env`.
- Se creó `src/pages/BackendCRUD.jsx` para administrar registros reales de pacientes, nutricionistas, citas, fichas clínicas y usuarios; convierte números y fechas al formato esperado por Spring Boot.
- Se añadió la ruta `/backend` y un enlace en el menú.
- El panel lee H2 mediante las APIs, no desde localStorage.

## Límites importantes
- **NO se modificó el login, registro ni los paneles antiguos**: siguen utilizando los datos de demostración en `src/utils/auth.js`. No son un sistema de autenticación real.
- `ms-usuarios` no implementa contraseñas ni JWT. Por eso no se ha simulado una integración de login inexistente.
- `ms-citas` no comprueba todavía que los IDs de pacientes/nutricionistas existan en otros microservicios.
- No usar `/backend` en producción ni con datos reales: no tiene protección de acceso. El backend también requiere Spring Security/JWT.
- No se agregaron dependencias: se utiliza `fetch` nativo, evitando alterar el lockfile del proyecto.

## Ejecutar
1. Iniciar los cinco microservicios Spring Boot (`mvnw.cmd spring-boot:run`) en sus carpetas; puertos 8081 a 8085.
2. En la carpeta del frontend ejecutar `npm install` y `npm start`.
3. Abrir `http://localhost:3000/backend` y seleccionar un servicio.
4. Probar crear, listar, editar, eliminar; verificar en Swagger o H2.
5. Si cambia un puerto, copiar `.env.example` a `.env` y modificar la URL; reiniciar React.

## Para completar la integración de los paneles originales
- Implementar endpoints de login/registro seguro con BCrypt y JWT en `ms-usuarios`.
- Agregar `rut`, fecha de nacimiento y género en el modelo que corresponda; no guardar contraseñas en `ms-pacientes`.
- Añadir horarios/ausencias y permisos en el backend; relacionar los IDs de usuario, paciente y nutricionista.
- Adaptar `Login.jsx`, `Registro.jsx`, `Agendar.jsx`, `PanelPaciente.jsx`, `PanelMedico.jsx`, `PanelAdmin.jsx` a la API con los nuevos endpoints.
- Proteger los endpoints y rutas, y retirar el almacenamiento de contraseñas en localStorage.
