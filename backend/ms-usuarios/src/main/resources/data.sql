-- NutriVida: datos FICTICIOS del frontend original. Solo perfil demo.
-- IDs reservados para la demo; no se actualizan filas existentes.
-- No ejecutar estos archivos en una base real ni en produccion.

-- El administrador se crea con AdminInicial y ADMIN_PASSWORD (no con clave fija).
-- Las contrasenas originales de prueba se almacenan exclusivamente como hash BCrypt.

INSERT INTO usuarios (id, nombre, rut, correo, telefono, rol, activo, password_hash, version_sesion, perfil_id, fecha_nac, genero, especialidad, imagen, fecha_creacion, fecha_actualizacion)
SELECT 910002, 'Dra. María González', '123456785', 'm.gonzalez@nutrivida.cl', '+56 912345678', 'NUTRICIONISTA', TRUE, '$2y$10$ZI8s0VOOuNvERDL285VxMO.DEraCm8Hens.dcfXsxmEZptuI2TIJS', '4c6ba286-67c7-42a6-92dc-679fa2f736bb', 920002, NULL, NULL, 'Pérdida de Peso', '/img/1nutri.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE id = 910002);

INSERT INTO usuarios (id, nombre, rut, correo, telefono, rol, activo, password_hash, version_sesion, perfil_id, fecha_nac, genero, especialidad, imagen, fecha_creacion, fecha_actualizacion)
SELECT 910003, 'Camila Silva', '187654327', 'camila.silva@gmail.com', '+56 991234567', 'PACIENTE', TRUE, '$2y$10$N5MmpPPS9vb3cEBDBE82PusTbg1KDDfwb5pAFMEOCqMvpFO7gvHQe', 'b86dca06-43bc-44a0-b5da-c17174aec817', 920003, DATE '1998-05-12', 'Femenino', NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE id = 910003);

INSERT INTO usuarios (id, nombre, rut, correo, telefono, rol, activo, password_hash, version_sesion, perfil_id, fecha_nac, genero, especialidad, imagen, fecha_creacion, fecha_actualizacion)
SELECT 910101, 'Dr. Carlos Rojas', '154321098', 'c.rojas@nutrivida.cl', '+56 987654321', 'NUTRICIONISTA', TRUE, '$2y$10$6LGTPZcAG3PS2hjCVsStEOPo8XA6M79yeMewjNz9GQXJa6XdrgVEu', '2fdc4408-e97b-4016-8599-e43a82011b99', 920101, NULL, NULL, 'Salud Metabólica', '/img/2nutri.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE id = 910101);

INSERT INTO usuarios (id, nombre, rut, correo, telefono, rol, activo, password_hash, version_sesion, perfil_id, fecha_nac, genero, especialidad, imagen, fecha_creacion, fecha_actualizacion)
SELECT 910102, 'Dra. Andrea Silva', '198765430', 'a.silva@nutrivida.cl', '+56 976543210', 'NUTRICIONISTA', TRUE, '$2y$10$tgXnTX3rrVgQ/LDRTAM5quok6cCcTUpjfDi5Tcb1QD.nPZDye98ui', '14363875-9703-4407-b399-69d310c3f40b', 920102, NULL, NULL, 'Nutrición Deportiva', '/img/3nutri.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE id = 910102);

INSERT INTO usuarios (id, nombre, rut, correo, telefono, rol, activo, password_hash, version_sesion, perfil_id, fecha_nac, genero, especialidad, imagen, fecha_creacion, fecha_actualizacion)
SELECT 910103, 'Dr. Felipe Morales', '167890121', 'f.morales@nutrivida.cl', '+56 965432109', 'NUTRICIONISTA', TRUE, '$2y$10$EQUcqvTQh.KEf1cjuy708Ov7DFWWhdgPX0bL3d0MVPQ.yekyeX/iC', '114c225e-b17a-417c-ba00-4434128c6cd4', 920103, NULL, NULL, 'Alimentación Vegana', '/img/nutri4.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE id = 910103);

