package com.nutrivida.usuarios.dto;
import com.nutrivida.usuarios.model.Usuario;
import java.time.*;
public record UsuarioResponse(Long id,String nombre,String rut,String correo,String telefono,String rol,Boolean activo,Long perfilId,LocalDate fechaNac,String genero,String especialidad,String imagen,Instant fechaCreacion,Instant fechaActualizacion){
 public static UsuarioResponse de(Usuario u){return new UsuarioResponse(u.getId(),u.getNombre(),u.getRut(),u.getCorreo(),u.getTelefono(),u.getRol(),u.getActivo(),u.getPerfilId(),u.getFechaNac(),u.getGenero(),u.getEspecialidad(),u.getImagen(),u.getFechaCreacion(),u.getFechaActualizacion());}
}