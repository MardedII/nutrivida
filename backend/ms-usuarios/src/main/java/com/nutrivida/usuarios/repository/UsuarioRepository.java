package com.nutrivida.usuarios.repository;
import com.nutrivida.usuarios.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
public interface UsuarioRepository extends JpaRepository<Usuario,Long> { java.util.Optional<Usuario> findByCorreo(String correo); java.util.Optional<Usuario> findByRut(String rut); }
