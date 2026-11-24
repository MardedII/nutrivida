-- NutriVida: datos FICTICIOS del frontend original. Solo perfil demo.
-- IDs reservados para la demo; no se actualizan filas existentes.
-- No ejecutar estos archivos en una base real ni en produccion.

-- Fecha de nacimiento y genero son valores de demostracion, no estaban en la cuenta original.
INSERT INTO pacientes (id, usuario_id, nombre, rut, correo, telefono, activo, fecha_nac, genero)
SELECT 920003, 910003, 'Camila Silva', '187654327', 'camila.silva@gmail.com', '+56 991234567', TRUE, DATE '1998-05-12', 'Femenino'
WHERE NOT EXISTS (SELECT 1 FROM pacientes WHERE id = 920003);
