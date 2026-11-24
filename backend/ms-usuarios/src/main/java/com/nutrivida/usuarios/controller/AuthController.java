package com.nutrivida.usuarios.controller;
import com.nutrivida.usuarios.dto.*;
import com.nutrivida.usuarios.service.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
@RestController @RequestMapping("/api/auth") public class AuthController {
 private final UsuarioService service;private final JwtService jwt;
 public AuthController(UsuarioService service,JwtService jwt){this.service=service;this.jwt=jwt;}
 public record Login(String correo,String clave){} public record Sesion(String token,UsuarioResponse usuario){}
 @PostMapping("/login") public Sesion login(@RequestBody Login d){var u=service.autenticar(d.correo(),d.clave());return new Sesion(jwt.emitir(service.buscar(u.id())),u);}
 @PostMapping("/registro") @ResponseStatus(HttpStatus.CREATED) public UsuarioResponse registro(@RequestBody UsuarioRequest d){return service.crear(d,true);}
 @GetMapping("/me") public UsuarioResponse me(@AuthenticationPrincipal Jwt principal){return UsuarioResponse.de(service.buscar(Long.valueOf(principal.getSubject())));}
}