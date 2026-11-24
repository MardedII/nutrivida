package com.nutrivida.fichas.controller;


import com.nutrivida.fichas.model.FichaClinica;
import com.nutrivida.fichas.service.FichaClinicaService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestClient;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import java.util.*;

@RestController @RequestMapping("/api/fichas-clinicas") @io.swagger.v3.oas.annotations.security.SecurityRequirement(name="bearerAuth") public class FichaClinicaController {
 private final FichaClinicaService service;private final RestClient citas;
 public FichaClinicaController(FichaClinicaService service,@Value("${servicios.citas.url}") String url,@Value("${app.internal.secret}") String key){this.service=service;var f=new SimpleClientHttpRequestFactory();f.setConnectTimeout(3000);f.setReadTimeout(5000);citas=RestClient.builder().requestFactory(f).baseUrl(url).defaultHeader("X-Internal-Key",key).build();}
 private Long perfil(Jwt j){var v=j.getClaims().get("perfilId");return v instanceof Number n?n.longValue():null;}
 private boolean nutri(Jwt j){return "nutricionista".equals(j.getClaimAsString("rol"));}
 private void permiso(boolean b){if(!b)throw new ResponseStatusException(HttpStatus.FORBIDDEN,"No autorizado");}
 private void acceso(FichaClinica f,Jwt j){permiso(Objects.equals(perfil(j),nutri(j)?f.getNutricionistaId():f.getPacienteId()));}
 private void escritura(FichaClinica f,Jwt j){permiso(nutri(j)&&Objects.equals(perfil(j),f.getNutricionistaId()));Boolean asignado;try{asignado=citas.get().uri("/internal/citas/asignacion/{n}/{p}",f.getNutricionistaId(),f.getPacienteId()).retrieve().body(Boolean.class);}catch(RuntimeException e){throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,"No se pudo verificar la asignación");}permiso(Boolean.TRUE.equals(asignado));}
 @GetMapping public List<FichaClinica> listar(@AuthenticationPrincipal Jwt j){return nutri(j)?service.porNutricionista(perfil(j)):service.porPaciente(perfil(j));}
 @GetMapping("/{id}") public FichaClinica buscar(@PathVariable Long id,@AuthenticationPrincipal Jwt j){var f=service.buscar(id);acceso(f,j);return f;}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public FichaClinica crear(@Valid @RequestBody FichaClinica f,@AuthenticationPrincipal Jwt j){escritura(f,j);return service.crear(f);}
 @PutMapping("/{id}") public FichaClinica actualizar(@PathVariable Long id,@Valid @RequestBody FichaClinica f,@AuthenticationPrincipal Jwt j){var old=service.buscar(id);acceso(old,j);permiso(Objects.equals(old.getPacienteId(),f.getPacienteId())&&Objects.equals(old.getNutricionistaId(),f.getNutricionistaId()));escritura(f,j);return service.actualizar(id,f);}
 @GetMapping("/paciente/{id}") public List<FichaClinica> porPaciente(@PathVariable Long id,@AuthenticationPrincipal Jwt j){permiso(!nutri(j)&&Objects.equals(id,perfil(j)));return service.porPaciente(id);}
 @GetMapping("/nutricionista/{id}") public List<FichaClinica> porNutricionista(@PathVariable Long id,@AuthenticationPrincipal Jwt j){permiso(nutri(j)&&Objects.equals(id,perfil(j)));return service.porNutricionista(id);}
}
