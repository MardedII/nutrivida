package com.nutrivida.usuarios.controller;
import com.nutrivida.usuarios.dto.*;
import com.nutrivida.usuarios.service.UsuarioService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.List;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
@RestController @RequestMapping("/api/usuarios") @SecurityRequirement(name="bearerAuth") public class UsuarioController {
 private final UsuarioService service; public UsuarioController(UsuarioService service){this.service=service;}
 @GetMapping public List<UsuarioResponse> listar(){return service.listar();}
 @GetMapping("/{id}") public UsuarioResponse buscar(@PathVariable Long id){return UsuarioResponse.de(service.buscar(id));}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public UsuarioResponse crear(@RequestBody UsuarioRequest d){return service.crear(d,false);}
 @PutMapping("/{id}") public UsuarioResponse actualizar(@PathVariable Long id,@RequestBody UsuarioRequest d,@AuthenticationPrincipal Jwt j){return service.actualizar(id,d,Long.valueOf(j.getSubject()));}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void eliminar(@PathVariable Long id,@AuthenticationPrincipal Jwt j){service.desactivar(id,Long.valueOf(j.getSubject()));}
}