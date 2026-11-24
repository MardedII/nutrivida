package com.nutrivida.nutricionistas.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
@Entity
@Table(name="nutricionistas")
public class Nutricionista {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @NotBlank private String nombre;
 @NotBlank private String especialidad;
 @Email @NotBlank private String correo;
 private Boolean activo;
 public Long getId() {return id;}
 public void setId(Long id) {this.id=id;}
 public String getNombre() { return nombre; }
 public void setNombre(String value) { this.nombre=value; }
 public String getEspecialidad() { return especialidad; }
 public void setEspecialidad(String value) { this.especialidad=value; }
 public String getCorreo() { return correo; }
 public void setCorreo(String value) { this.correo=value; }
 public Boolean getActivo() { return activo; }
 public void setActivo(Boolean value) { this.activo=value; }
 @NotNull @Column(unique=true,nullable=false) private Long usuarioId;
 public Long getUsuarioId() {return usuarioId;}
 public void setUsuarioId(Long value) {this.usuarioId=value;}
 private String rut;
 public String getRut() {return rut;}
 public void setRut(String value) {this.rut=value;}
 private String telefono;
 public String getTelefono() {return telefono;}
 public void setTelefono(String value) {this.telefono=value;}
 private String imagen;
 public String getImagen() {return imagen;}
 public void setImagen(String value) {this.imagen=value;}
}
