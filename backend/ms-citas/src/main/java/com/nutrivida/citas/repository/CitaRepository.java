package com.nutrivida.citas.repository;

import com.nutrivida.citas.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CitaRepository extends JpaRepository<Cita,Long> {
    java.util.List<Cita> findByPacienteId(Long id);
    java.util.List<Cita> findByNutricionistaId(Long id);
    @org.springframework.data.jpa.repository.Query("select count(c) from Cita c where (c.nutricionistaId=:nutri or c.pacienteId=:paciente) and upper(c.estado) not in ('CANCELADA','COMPLETADA','INASISTENCIA') and c.inicio < :fin and c.fin > :inicio and (:id is null or c.id <> :id)")
    long conflictos(@org.springframework.data.repository.query.Param("nutri") Long nutri,@org.springframework.data.repository.query.Param("paciente") Long paciente,@org.springframework.data.repository.query.Param("inicio") java.time.LocalDateTime inicio,@org.springframework.data.repository.query.Param("fin") java.time.LocalDateTime fin,@org.springframework.data.repository.query.Param("id") Long id);
}
