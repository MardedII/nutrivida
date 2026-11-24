package com.nutrivida.usuarios.dto;
import java.time.LocalDate;
public record UsuarioRequest(String nombre,String rut,String correo,String telefono,String rol,String clave,String confirmarClave,Boolean activo,LocalDate fechaNac,String genero,String especialidad,String imagen,Boolean aceptoTerminos) {}