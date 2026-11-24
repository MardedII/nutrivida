package com.nutrivida.fichas.client;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import java.util.*;
@Component public class PerfilClient {
 private final Map<String,String> urls=new HashMap<>();
 private final RestClient client;
 public PerfilClient(@Value("${app.internal.secret}") String internal, @Value("${servicios.pacientes.url}") String pacientes, @Value("${servicios.nutricionistas.url}") String nutricionistas) {
  urls.put("pacientes",pacientes);
 urls.put("nutricionistas",nutricionistas);
 var factory=new SimpleClientHttpRequestFactory();
 factory.setConnectTimeout(3000); factory.setReadTimeout(5000);
 client=RestClient.builder().requestFactory(factory).defaultHeader("X-Internal-Key",internal).build();
 }
 public record Perfil(Long id,String nombre,String correo,String rol,Boolean activo) {}
 public Perfil verificar(String servicio,Long id) {
 if(id==null || id<=0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Identificador inválido: "+servicio);
 try {
 Perfil p=client.get().uri(urls.get(servicio)+"/api/"+servicio+"/{id}",id).retrieve().body(Perfil.class);
 if(p==null) throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,"Respuesta vacía: "+servicio);
 if(!Boolean.TRUE.equals(p.activo())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Perfil inactivo: "+servicio);
 return p;
 } catch(HttpClientErrorException.NotFound e) {throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"No existe el registro en "+servicio);}
 catch(RestClientException e) {throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,"Servicio no disponible: "+servicio);}
 }
}
