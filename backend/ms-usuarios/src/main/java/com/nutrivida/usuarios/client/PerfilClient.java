package com.nutrivida.usuarios.client;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import com.nutrivida.usuarios.model.Usuario;
@Component public class PerfilClient {
 private final RestClient client; private final String pacientes,nutricionistas;
 public PerfilClient(@Value("${servicios.pacientes.url}") String p,@Value("${servicios.nutricionistas.url}") String n,@Value("${app.internal.secret}") String key){pacientes=p;nutricionistas=n;var f=new SimpleClientHttpRequestFactory();f.setConnectTimeout(3000);f.setReadTimeout(5000);client=RestClient.builder().requestFactory(f).defaultHeader("X-Internal-Key",key).build();}
 public record Perfil(Long id){}
 public Long sincronizar(Usuario u){
  if("admin".equals(u.getRol())) return null;
  boolean p="paciente".equals(u.getRol()); var data=new HashMap<String,Object>();
  data.put("usuarioId",u.getId());data.put("nombre",u.getNombre());data.put("rut",u.getRut());data.put("correo",u.getCorreo());data.put("telefono",u.getTelefono());data.put("activo",u.getActivo());
  if(p){data.put("fechaNac",u.getFechaNac());data.put("genero",u.getGenero());}else{data.put("especialidad",u.getEspecialidad());data.put("imagen",u.getImagen());}
  try{var perfil=client.put().uri((p?pacientes:nutricionistas)+"/api/"+(p?"pacientes":"nutricionistas")+"/usuario/{id}",u.getId()).body(data).retrieve().body(Perfil.class);if(perfil==null||perfil.id()==null)throw new IllegalStateException();return perfil.id();}
  catch(RuntimeException e){throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,"No se pudo sincronizar el perfil; cuenta pendiente o cambios no aplicados. Contacta al administrador.");}
 }
}