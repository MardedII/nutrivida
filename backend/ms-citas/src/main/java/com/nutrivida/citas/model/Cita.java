package com.nutrivida.citas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.*;

@Entity
@Table(name="citas")
public class Cita {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @NotNull 
    private Long pacienteId;
    @NotNull 
    private Long nutricionistaId;
    @NotNull 
    private LocalDateTime inicio;
    @NotNull 
    private LocalDateTime fin;
    @NotBlank 
    private String estado;
    @Column(length=500) 
    private String motivo;
    public Long getId() 
        {return id;}
    public void setId(Long id) 
        {this.id=id;}
    public Long getPacienteId() 
        { return pacienteId; }
    public void setPacienteId(Long value) 
        { this.pacienteId=value; }
    public Long getNutricionistaId() 
        { return nutricionistaId; }
    public void setNutricionistaId(Long value) 
        { this.nutricionistaId=value; }
    public LocalDateTime getInicio() 
    { return inicio; }
    public void setInicio(LocalDateTime value) 
    { this.inicio=value; }
    public LocalDateTime getFin() { return fin; }
    public void setFin(LocalDateTime value) 
    { this.fin=value; }
    public String getEstado() { return estado; }
    public void setEstado(String value) 
    { this.estado=value; }
    public String getMotivo() { return motivo; }
    public void setMotivo(String value) 
    { this.motivo=value; }
    private Boolean asistenciaConfirmada;
    public Boolean getAsistenciaConfirmada() 
    {return asistenciaConfirmada;}
    public void setAsistenciaConfirmada(Boolean value) 
    {this.asistenciaConfirmada=value;}
    private Instant fechaSolicitud;
    public Instant getFechaSolicitud() 
    {return fechaSolicitud;}
    public void setFechaSolicitud(Instant value) 
    {this.fechaSolicitud=value;}
    private Instant fechaCreacion;
    public Instant getFechaCreacion() 
    {return fechaCreacion;}
    public void setFechaCreacion(Instant value) {this.fechaCreacion=value;}
    
    @Column 
    private String paciente;
    @Column 
    private String correoPaciente;
    @Column 
    private String nutricionista;
    @Embedded 
    private Propuesta propuestaReprogramacion;
    @Embeddable 
    public static class Propuesta {
    @Column(name="propuesta_fecha") 
    public LocalDate fecha;
    @Column(name="propuesta_hora") 
    public LocalTime hora;
    }
    public Propuesta getPropuestaReprogramacion(){return propuestaReprogramacion;}
    public void setPropuestaReprogramacion(Propuesta v){propuestaReprogramacion=v;}
    public String getPaciente(){return paciente;} public void setPaciente(String v){paciente=v;}
    public String getCorreoPaciente(){return correoPaciente;} public void setCorreoPaciente(String v){correoPaciente=v;}
    public String getNutricionista(){return nutricionista;} public void setNutricionista(String v){nutricionista=v;}
    @com.fasterxml.jackson.annotation.JsonProperty(access=com.fasterxml.jackson.annotation.JsonProperty.Access.READ_ONLY) public LocalDate getFecha(){return inicio==null?null:inicio.toLocalDate();}
    @com.fasterxml.jackson.annotation.JsonProperty(access=com.fasterxml.jackson.annotation.JsonProperty.Access.READ_ONLY) public LocalTime getHora(){return inicio==null?null:inicio.toLocalTime();}
}
