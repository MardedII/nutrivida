-- NutriVida: datos FICTICIOS del frontend original. Solo perfil demo.
-- IDs reservados para la demo; no se actualizan filas existentes.
-- No ejecutar estos archivos en una base real ni en produccion.

INSERT INTO nutricionistas (id, usuario_id, nombre, rut, correo, telefono, activo, especialidad, imagen)
SELECT 920002, 910002, 'Dra. María González', '123456785', 'm.gonzalez@nutrivida.cl', '+56 912345678', TRUE, 'Pérdida de Peso', '/img/1nutri.jpg'
WHERE NOT EXISTS (SELECT 1 FROM nutricionistas WHERE id = 920002);

INSERT INTO nutricionistas (id, usuario_id, nombre, rut, correo, telefono, activo, especialidad, imagen)
SELECT 920101, 910101, 'Dr. Carlos Rojas', '154321098', 'c.rojas@nutrivida.cl', '+56 987654321', TRUE, 'Salud Metabólica', '/img/2nutri.png'
WHERE NOT EXISTS (SELECT 1 FROM nutricionistas WHERE id = 920101);

INSERT INTO nutricionistas (id, usuario_id, nombre, rut, correo, telefono, activo, especialidad, imagen)
SELECT 920102, 910102, 'Dra. Andrea Silva', '198765430', 'a.silva@nutrivida.cl', '+56 976543210', TRUE, 'Nutrición Deportiva', '/img/3nutri.png'
WHERE NOT EXISTS (SELECT 1 FROM nutricionistas WHERE id = 920102);

INSERT INTO nutricionistas (id, usuario_id, nombre, rut, correo, telefono, activo, especialidad, imagen)
SELECT 920103, 910103, 'Dr. Felipe Morales', '167890121', 'f.morales@nutrivida.cl', '+56 965432109', TRUE, 'Alimentación Vegana', '/img/nutri4.jpg'
WHERE NOT EXISTS (SELECT 1 FROM nutricionistas WHERE id = 920103);

