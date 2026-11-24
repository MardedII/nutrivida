package com.nutrivida.citas.controller;

import com.nutrivida.citas.model.Cita;
import com.nutrivida.citas.service.CitaService;
import com.nutrivida.citas.service.CitaService.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.*;
import java.time.LocalDate;

@RestController @RequestMapping("/api/citas") @SecurityRequirement(name="bearerAuth") public class CitaController {
    private final CitaService service;public CitaController(CitaService service){this.service=service;}
    private Actor actor(Jwt j){Object p=j.getClaims().get("perfilId");return new Actor(j.getClaimAsString("rol"),p instanceof Number n?n.longValue():null);}
    private void permiso(boolean b)
    {if(!b)throw new ResponseStatusException(HttpStatus.FORBIDDEN,"No autorizado");}
    @GetMapping 
    public List<Cita> listar(@AuthenticationPrincipal Jwt j)
    {var a=actor(j);return switch(a.rol())
        {case "admin"->service.listar();case "paciente"->service.porPaciente(a.perfilId());case "nutricionista"->service.porNutricionista(a.perfilId());default->throw new ResponseStatusException(HttpStatus.FORBIDDEN);};}
    @GetMapping("/{id}") 
    public Cita buscar(@PathVariable Long id,@AuthenticationPrincipal Jwt j)
    {var c=service.buscar(id);service.acceso(c,actor(j));return c;}
    @PostMapping 
    @ResponseStatus(HttpStatus.CREATED) 
    public Cita crear(@RequestBody Solicitud d,@AuthenticationPrincipal Jwt j)
    {return service.crear(d,actor(j));}
    @PatchMapping("/{id}/accion") 
    public Cita cambiar(@PathVariable Long id,@RequestBody Accion d,@AuthenticationPrincipal Jwt j)
    {return service.cambiar(id,d,actor(j));}
    @GetMapping("/paciente/{id}") 
    public List<Cita> porPaciente(@PathVariable Long id,@AuthenticationPrincipal Jwt j)
    {var a=actor(j);permiso("admin".equals(a.rol())||("paciente".equals(a.rol())&&Objects.equals(id,a.perfilId())));return service.porPaciente(id);}
    @GetMapping("/nutricionista/{id}") 
    public List<Cita> porNutricionista(@PathVariable Long id,@AuthenticationPrincipal Jwt j)
    {var a=actor(j);
        permiso("admin".equals(a.rol())||("nutricionista".equals(a.rol())&&Objects.equals(id,a.perfilId())));
        return service.porNutricionista(id);}
    @GetMapping("/ocupados") 
    public List<String> ocupados(@RequestParam Long nutricionistaId,@RequestParam @org.springframework.format.annotation.DateTimeFormat(iso=org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate fecha,@AuthenticationPrincipal Jwt j){return service.ocupados(nutricionistaId,fecha,actor(j));}
}
