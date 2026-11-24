package com.nutrivida.nutricionistas.repository;
import com.nutrivida.nutricionistas.model.Nutricionista;
import org.springframework.data.jpa.repository.JpaRepository;
public interface NutricionistaRepository extends JpaRepository<Nutricionista,Long> { java.util.Optional<Nutricionista> findByUsuarioId(Long id); }
