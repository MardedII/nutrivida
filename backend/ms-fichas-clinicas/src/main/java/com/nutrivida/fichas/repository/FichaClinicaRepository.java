package com.nutrivida.fichas.repository;
import com.nutrivida.fichas.model.FichaClinica;
import org.springframework.data.jpa.repository.JpaRepository;
public interface FichaClinicaRepository extends JpaRepository<FichaClinica,Long> {
 java.util.List<FichaClinica> findByPacienteId(Long id);
 java.util.List<FichaClinica> findByNutricionistaId(Long id);
}
