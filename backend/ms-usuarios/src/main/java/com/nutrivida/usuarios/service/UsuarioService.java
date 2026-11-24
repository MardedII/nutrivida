package com.nutrivida.usuarios.service;
import com.nutrivida.usuarios.model.Usuario;
import com.nutrivida.usuarios.dto.*;
import com.nutrivida.usuarios.repository.UsuarioRepository;
import com.nutrivida.usuarios.client.PerfilClient;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.*;
import java.time.*;
import java.nio.charset.StandardCharsets;
@Service public class UsuarioService {
 private final UsuarioRepository repo; private final PerfilClient perfiles; private final BCryptPasswordEncoder encoder=new BCryptPasswordEncoder();
 public UsuarioService(UsuarioRepository repo,PerfilClient perfiles){this.repo=repo;this.perfiles=perfiles;}
 public List<UsuarioResponse> listar(){return repo.findAll().stream().map(UsuarioResponse::de).toList();}
 public Usuario buscar(Long id){return repo.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Usuario no encontrado"));}
 public UsuarioResponse autenticar(String correo,String clave){var u=repo.findByCorreo(normalizarCorreo(correo)).orElse(null);if(u==null||!Boolean.TRUE.equals(u.getActivo())||u.getPasswordHash()==null||clave==null||clave.getBytes(StandardCharsets.UTF_8).length>72||!encoder.matches(clave,u.getPasswordHash())||(!"admin".equals(u.getRol())&&u.getPerfilId()==null))throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Credenciales inválidas o cuenta inactiva");return UsuarioResponse.de(u);}
 private static String normalizarCorreo(String s){return s==null?"":s.trim().toLowerCase(Locale.ROOT);}
 private static void exigir(boolean ok,String msg){if(!ok)throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);}
 private static boolean texto(String s){return s!=null&&!s.isBlank();}
 public static boolean rutValido(String r){if(r==null||!r.matches("[0-9]{7,8}[0-9K]"))return false;int suma=0,m=2;for(int i=r.length()-2;i>=0;i--){suma+=(r.charAt(i)-'0')*m;m=m==7?2:m+1;}int dv=11-suma%11;return r.charAt(r.length()-1)==(dv==11?'0':dv==10?'K':(char)('0'+dv));}
 private void datos(Usuario u,UsuarioRequest d,boolean nuevo,boolean publico){
  String rol=publico?"paciente":d.rol()==null?"":d.rol().toLowerCase(Locale.ROOT);exigir(Set.of("admin","paciente","nutricionista").contains(rol),"Rol inválido");
  if(!nuevo)exigir(rol.equals(u.getRol()),"No se permite cambiar el rol de una cuenta existente");
  String correo=normalizarCorreo(d.correo());String rut=d.rut()==null?"":d.rut().replaceAll("[.\\s-]","").toUpperCase(Locale.ROOT);String tel=d.telefono()==null?"":d.telefono().replaceAll("[+()\\s-]","");if(tel.startsWith("56"))tel=tel.substring(2);
  exigir(texto(d.nombre())&&d.nombre().trim().length()>=3&&d.nombre().length()<=150,"Nombre inválido");exigir(rutValido(rut),"RUT inválido");exigir(correo.matches("[^@\\s]+@[^@\\s]+\\.[^@\\s]+")&&correo.length()<=254,"Correo inválido");exigir(tel.matches("9[0-9]{8}"),"Teléfono chileno inválido");
  if(repo.findByCorreo(correo).filter(x->!Objects.equals(x.getId(),u.getId())).isPresent()||repo.findByRut(rut).filter(x->!Objects.equals(x.getId(),u.getId())).isPresent())throw new ResponseStatusException(HttpStatus.CONFLICT,"Correo o RUT ya registrado");
  if(publico)exigir(Boolean.TRUE.equals(d.aceptoTerminos()),"Debes aceptar los términos");
  if(rol.equals("paciente")){exigir(d.fechaNac()!=null&&!d.fechaNac().isAfter(LocalDate.now(ZoneId.of("America/Santiago")).minusYears(14)),"Edad mínima: 14 años");exigir(d.genero()!=null&&Set.of("Femenino","Masculino","Otro").contains(d.genero()),"Género inválido");}
  if(rol.equals("nutricionista")){exigir(texto(d.especialidad())&&d.especialidad().length()<=150,"Especialidad obligatoria");exigir(!texto(d.imagen())||d.imagen().matches("/img/[A-Za-z0-9_.-]+"),"La imagen debe ser una ruta local /img/archivo");}
  if(nuevo||texto(d.clave())){exigir(d.clave()!=null&&d.clave().length()>=8&&d.clave().getBytes(StandardCharsets.UTF_8).length<=72,"Contraseña de 8 a 72 bytes");exigir(Objects.equals(d.clave(),d.confirmarClave()),"Las contraseñas no coinciden");u.setPasswordHash(encoder.encode(d.clave()));u.setVersionSesion(UUID.randomUUID().toString());}
  u.setNombre(d.nombre().trim());u.setRut(rut);u.setCorreo(correo);u.setTelefono("+56 "+tel);u.setRol(rol);u.setFechaNac(d.fechaNac());u.setGenero(d.genero());u.setEspecialidad(d.especialidad());u.setImagen(d.imagen());u.setFechaActualizacion(Instant.now());
 }
 public synchronized UsuarioResponse crear(UsuarioRequest d,boolean publico){var u=new Usuario();datos(u,d,true,publico);u.setFechaCreacion(Instant.now());u.setActivo(false);u=repo.saveAndFlush(u); // persist pending account before remote call
  try{u.setActivo(true);u.setPerfilId(perfiles.sincronizar(u));return UsuarioResponse.de(repo.saveAndFlush(u));}catch(RuntimeException e){u.setActivo(false);repo.saveAndFlush(u);throw e;}
 }
 public synchronized UsuarioResponse actualizar(Long id,UsuarioRequest d,Long actor){var u=buscar(id);datos(u,d,false,false);boolean activo=d.activo()==null?Boolean.TRUE.equals(u.getActivo()):d.activo();exigir(!id.equals(actor)||activo,"No puedes desactivar tu propia cuenta");if(!Objects.equals(activo,u.getActivo()))u.setVersionSesion(UUID.randomUUID().toString());u.setActivo(activo);if(!activo)repo.saveAndFlush(u);Long perfil=perfiles.sincronizar(u);if(!Objects.equals(perfil,u.getPerfilId()))u.setVersionSesion(UUID.randomUUID().toString());u.setPerfilId(perfil);return UsuarioResponse.de(repo.saveAndFlush(u));}
 public synchronized void desactivar(Long id,Long actor){var u=buscar(id);exigir(!id.equals(actor),"No puedes desactivar tu propia cuenta");u.setActivo(false);u.setVersionSesion(UUID.randomUUID().toString());repo.saveAndFlush(u);perfiles.sincronizar(u);}
}