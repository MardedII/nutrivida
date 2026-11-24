package com.nutrivida.pacientes.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
@Entity
@Table(name="pacientes")
public class Paciente {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @NotBlank private String nombre;
 @Email @NotBlank private String correo;
 @NotBlank private String telefono;
 private Boolean activo;
 public Long getId() {return id;}
 public void setId(Long id) {this.id=id;}
 public String getNombre() { return nombre; }
 public void setNombre(String value) { this.nombre=value; }
 public String getCorreo() { return correo; }
 public void setCorreo(String value) { this.correo=value; }
 public String getTelefono() { return telefono; }
 public void setTelefono(String value) { this.telefono=value; }
 public Boolean getActivo() { return activo; }
 public void setActivo(Boolean value) { this.activo=value; }
 @NotNull @Column(unique=true,nullable=false) private Long usuarioId;
 public Long getUsuarioId() {return usuarioId;}
 public void setUsuarioId(Long value) {this.usuarioId=value;}
 private String rut;
 public String getRut() {return rut;}
 public void setRut(String value) {this.rut=value;}
 private java.time.LocalDate fechaNac;
 public java.time.LocalDate getFechaNac() {return fechaNac;}
 public void setFechaNac(java.time.LocalDate value) {this.fechaNac=value;}
 private String genero;
 public String getGenero() {return genero;}
 public void setGenero(String value) {this.genero=value;}
}
