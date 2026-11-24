package com.nutrivida.nutricionistas.service;
import com.nutrivida.nutricionistas.model.Nutricionista;
import com.nutrivida.nutricionistas.repository.NutricionistaRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;
import com.nutrivida.nutricionistas.client.PerfilClient;
@Service
public class NutricionistaService {
 private final NutricionistaRepository repo;
 private final PerfilClient perfiles;
 public NutricionistaService(NutricionistaRepository repo, PerfilClient perfiles) {this.repo=repo;this.perfiles=perfiles;}
 public List<Nutricionista> listar() {return repo.findAll();}
 public Nutricionista buscar(Long id) {return repo.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Registro no encontrado"));}
 public Nutricionista crear(Nutricionista dato) {validar(dato,null);dato.setId(null);return repo.save(dato);}
 public Nutricionista actualizar(Long id,Nutricionista dato) {buscar(id);validar(dato,id);dato.setId(id);return repo.save(dato);}
 public Nutricionista sincronizar(Long id,Nutricionista dato) {
 if(!java.util.Objects.equals(id,dato.getUsuarioId())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"UsuarioId no coincide");
 dato.setId(repo.findByUsuarioId(id).map(Nutricionista::getId).orElse(null)); return repo.saveAndFlush(dato);
 }
 public Nutricionista verificarActivo(Long id) {var p=buscar(id);var u=perfiles.verificar("usuarios",p.getUsuarioId());p.setActivo(Boolean.TRUE.equals(p.getActivo())&&Boolean.TRUE.equals(u.activo()) && "nutricionista".equalsIgnoreCase(u.rol()));return p;}
 public void eliminar(Long id) {buscar(id);repo.deleteById(id);}
 private void validar(Nutricionista dato,Long id) {
if(dato.getUsuarioId()!=null) {var u=perfiles.verificar("usuarios",dato.getUsuarioId());
 if(!"nutricionista".equalsIgnoreCase(u.rol()) || !dato.getCorreo().equalsIgnoreCase(u.correo())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Cuenta no corresponde al perfil");
 }
}
}
