package com.nutrivida.usuarios.controller;
import com.nutrivida.usuarios.service.UsuarioService;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/internal/usuarios") public class InternalController {
 private final UsuarioService service;public InternalController(UsuarioService service){this.service=service;}
 public record Cuenta(Long id,String nombre,String correo,String rol,Boolean activo,String versionSesion){}
 @GetMapping("/{id}") public Cuenta buscar(@PathVariable Long id){var u=service.buscar(id);return new Cuenta(u.getId(),u.getNombre(),u.getCorreo(),u.getRol(),u.getActivo(),u.getVersionSesion());}
}