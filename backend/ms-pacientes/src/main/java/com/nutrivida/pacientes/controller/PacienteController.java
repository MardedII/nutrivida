package com.nutrivida.pacientes.controller;
import com.nutrivida.pacientes.model.Paciente;
import com.nutrivida.pacientes.service.PacienteService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import java.util.List;
@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {
 private final PacienteService service;
 public PacienteController(PacienteService service) {this.service=service;}
 @GetMapping public List<Paciente> listar() {return service.listar();}
 @GetMapping("/{id}") public Paciente buscar(@PathVariable Long id) {return service.verificarActivo(id);}
 @PostMapping public ResponseEntity<Paciente> crear(@Valid @RequestBody Paciente dato) {return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(dato));}
 @PutMapping("/{id}") public Paciente actualizar(@PathVariable Long id,@Valid @RequestBody Paciente dato) {return service.actualizar(id,dato);}
 @DeleteMapping("/{id}") public ResponseEntity<Void> eliminar(@PathVariable Long id) {service.eliminar(id);return ResponseEntity.noContent().build();}
 @PutMapping("/usuario/{id}") public Paciente sincronizar(@PathVariable Long id,@Valid @RequestBody Paciente dato) {return service.sincronizar(id,dato);}
}
