package com.nutrivida.nutricionistas.controller;
import com.nutrivida.nutricionistas.model.Nutricionista;
import com.nutrivida.nutricionistas.service.NutricionistaService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import java.util.List;
@RestController
@RequestMapping("/api/nutricionistas")
public class NutricionistaController {
 private final NutricionistaService service;
 public NutricionistaController(NutricionistaService service) {this.service=service;}
 @GetMapping public List<Nutricionista> listar() {return service.listar();}
 @GetMapping("/{id}") public Nutricionista buscar(@PathVariable Long id) {return service.verificarActivo(id);}
 @PostMapping public ResponseEntity<Nutricionista> crear(@Valid @RequestBody Nutricionista dato) {return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(dato));}
 @PutMapping("/{id}") public Nutricionista actualizar(@PathVariable Long id,@Valid @RequestBody Nutricionista dato) {return service.actualizar(id,dato);}
 @DeleteMapping("/{id}") public ResponseEntity<Void> eliminar(@PathVariable Long id) {service.eliminar(id);return ResponseEntity.noContent().build();}
 @PutMapping("/usuario/{id}") public Nutricionista sincronizar(@PathVariable Long id,@Valid @RequestBody Nutricionista dato) {return service.sincronizar(id,dato);}
 public record Catalogo(Long id,String nombre,String especialidad,String imagen){}
 @GetMapping("/catalogo") public List<Catalogo> catalogo(){return service.listar().stream().filter(n->Boolean.TRUE.equals(n.getActivo())).map(n->service.verificarActivo(n.getId())).filter(n->Boolean.TRUE.equals(n.getActivo())).map(n->new Catalogo(n.getId(),n.getNombre(),n.getEspecialidad(),n.getImagen())).toList();}
}
