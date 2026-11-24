-- NutriVida: datos FICTICIOS del frontend original. Solo perfil demo.
-- IDs reservados para la demo; no se actualizan filas existentes.
-- No ejecutar estos archivos en una base real ni en produccion.

-- Historial ficticio de Camila del PanelMedico original. Talla inferida de 72.5 kg e IMC 25.1.
INSERT INTO fichas (id, paciente_id, nutricionista_id, fecha, peso_kg, talla_cm, cintura_cm, observaciones, plan_alimenticio)
SELECT 940001, 920003, 920002, DATE '2026-09-15', 72.5, 170, 82, 'Control mensual de demostración', '3 comidas principales, priorizar proteínas, reducir carbohidratos refinados. Tomar 2 litros de agua diarios.'
WHERE NOT EXISTS (SELECT 1 FROM fichas WHERE id = 940001);
