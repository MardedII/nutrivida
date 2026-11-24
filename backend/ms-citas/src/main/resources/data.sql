-- NutriVida: datos FICTICIOS del frontend original. Solo perfil demo.
-- IDs reservados para la demo; no se actualizan filas existentes.
-- No ejecutar estos archivos en una base real ni en produccion.

-- Cita historica de demostracion basada en la ficha original (15/09/2026).
INSERT INTO citas (id, paciente_id, nutricionista_id, paciente, correo_paciente, nutricionista, inicio, fin, estado, motivo, asistencia_confirmada, fecha_solicitud, fecha_creacion)
SELECT 930001, 920003, 920002, 'Camila Silva', 'camila.silva@gmail.com', 'Dra. María González', TIMESTAMP '2026-09-15 10:00:00', TIMESTAMP '2026-09-15 10:45:00', 'Completada', 'Control Mensual', TRUE, TIMESTAMP WITH TIME ZONE '2026-09-14 10:00:00-03:00', TIMESTAMP WITH TIME ZONE '2026-09-14 10:00:00-03:00'
WHERE NOT EXISTS (SELECT 1 FROM citas WHERE id = 930001);

-- Cita nueva ficticia para probar el flujo. Se calcula el siguiente dia habil solo al insertar.
INSERT INTO citas (id, paciente_id, nutricionista_id, paciente, correo_paciente, nutricionista, inicio, fin, estado, motivo, asistencia_confirmada, fecha_solicitud, fecha_creacion)
SELECT 930002, 920003, 920002, 'Camila Silva', 'camila.silva@gmail.com', 'Dra. María González', DATEADD('HOUR', 10, CAST(DATEADD('DAY', CASE EXTRACT(ISO_DAY_OF_WEEK FROM CURRENT_DATE) WHEN 5 THEN 3 WHEN 6 THEN 2 ELSE 1 END, CURRENT_DATE) AS TIMESTAMP)), DATEADD('MINUTE', 45, DATEADD('HOUR', 10, CAST(DATEADD('DAY', CASE EXTRACT(ISO_DAY_OF_WEEK FROM CURRENT_DATE) WHEN 5 THEN 3 WHEN 6 THEN 2 ELSE 1 END, CURRENT_DATE) AS TIMESTAMP))), 'Pendiente', 'Control nutricional de prueba', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM citas WHERE id = 930002);
