package com.nutrivida.pacientes.repository;
import com.nutrivida.pacientes.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PacienteRepository extends JpaRepository<Paciente,Long> { java.util.Optional<Paciente> findByUsuarioId(Long id); }
