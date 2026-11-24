package com.nutrivida.fichas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.*;
import java.math.BigDecimal;

@Entity
@Table(name="fichas")
public class FichaClinica {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @NotNull private Long pacienteId;
 @NotNull private Long nutricionistaId;
 @NotNull private LocalDate fecha;
 private BigDecimal pesoKg;
 private BigDecimal tallaCm;
 private String observaciones;
 private String planAlimenticio;
 public Long getId() {return id;}
 public void setId(Long id) {this.id=id;}
 public Long getPacienteId() { return pacienteId; }
 public void setPacienteId(Long value) { this.pacienteId=value; }
 public Long getNutricionistaId() { return nutricionistaId; }
 public void setNutricionistaId(Long value) { this.nutricionistaId=value; }
 public LocalDate getFecha() { return fecha; }
 public void setFecha(LocalDate value) { this.fecha=value; }
 public BigDecimal getPesoKg() { return pesoKg; }
 public void setPesoKg(BigDecimal value) { this.pesoKg=value; }
 public BigDecimal getTallaCm() { return tallaCm; }
 public void setTallaCm(BigDecimal value) { this.tallaCm=value; }
 public String getObservaciones() { return observaciones; }
 public void setObservaciones(String value) { this.observaciones=value; }
 public String getPlanAlimenticio() { return planAlimenticio; }
 public void setPlanAlimenticio(String value) { this.planAlimenticio=value; }
 private BigDecimal cinturaCm;
 public BigDecimal getCinturaCm() {return cinturaCm;}
 public void setCinturaCm(BigDecimal value) {this.cinturaCm=value;}
 public BigDecimal getImc(){
  if(pesoKg==null || tallaCm==null || tallaCm.signum()<=0)return null;
  return pesoKg.multiply(BigDecimal.valueOf(10000)).divide(tallaCm.multiply(tallaCm),1,java.math.RoundingMode.HALF_UP);
 }
}
