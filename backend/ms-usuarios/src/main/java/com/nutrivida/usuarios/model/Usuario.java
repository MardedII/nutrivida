package com.nutrivida.usuarios.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
@Entity
@Table(name="usuarios")
public class Usuario {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(unique=true,nullable=false) @Email @NotBlank private String correo;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private Rol rol;
 private Boolean activo;
 public Long getId() {return id;}
 public void setId(Long id) {this.id=id;}
 public String getCorreo() { return correo; }
 public void setCorreo(String value) { this.correo=value; }
 public String getRol() { return rol==null?null:rol.name().toLowerCase(java.util.Locale.ROOT); }
 public void setRol(String value) { this.rol=Rol.valueOf(value.toUpperCase(java.util.Locale.ROOT)); }
 public Boolean getActivo() { return activo; }
 public void setActivo(Boolean value) { this.activo=value; }
 private String nombre;
 public String getNombre() {return nombre;}
 public void setNombre(String value) {this.nombre=value;}
 @Column(unique=true,nullable=false) private String rut;
 public String getRut() {return rut;}
 public void setRut(String value) {this.rut=value;}
 private String telefono;
 public String getTelefono() {return telefono;}
 public void setTelefono(String value) {this.telefono=value;}
 @com.fasterxml.jackson.annotation.JsonIgnore private String passwordHash;
 private String versionSesion;
 private Long perfilId;
 private java.time.LocalDate fechaNac;
 private String genero;
 private String especialidad;
 private String imagen;
 private java.time.Instant fechaCreacion;
 private java.time.Instant fechaActualizacion;
 public String getPasswordHash(){return passwordHash;} public void setPasswordHash(String v){passwordHash=v;}
 public String getVersionSesion(){return versionSesion;} public void setVersionSesion(String v){versionSesion=v;}
 public Long getPerfilId(){return perfilId;} public void setPerfilId(Long v){perfilId=v;}
 public java.time.LocalDate getFechaNac(){return fechaNac;} public void setFechaNac(java.time.LocalDate v){fechaNac=v;}
 public String getGenero(){return genero;} public void setGenero(String v){genero=v;}
 public String getEspecialidad(){return especialidad;} public void setEspecialidad(String v){especialidad=v;}
 public String getImagen(){return imagen;} public void setImagen(String v){imagen=v;}
 public java.time.Instant getFechaCreacion(){return fechaCreacion;} public void setFechaCreacion(java.time.Instant v){fechaCreacion=v;}
 public java.time.Instant getFechaActualizacion(){return fechaActualizacion;} public void setFechaActualizacion(java.time.Instant v){fechaActualizacion=v;}
}
