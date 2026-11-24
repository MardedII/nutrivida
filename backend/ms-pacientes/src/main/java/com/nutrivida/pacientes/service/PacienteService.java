package com.nutrivida.pacientes.service;
import com.nutrivida.pacientes.model.Paciente;
import com.nutrivida.pacientes.repository.PacienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;
import com.nutrivida.pacientes.client.PerfilClient;
@Service
public class PacienteService {
 private final PacienteRepository repo;
 private final PerfilClient perfiles;
 public PacienteService(PacienteRepository repo, PerfilClient perfiles) {this.repo=repo;this.perfiles=perfiles;}
 public List<Paciente> listar() {return repo.findAll();}
 public Paciente buscar(Long id) {return repo.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Registro no encontrado"));}
 public Paciente crear(Paciente dato) {validar(dato,null);dato.setId(null);return repo.save(dato);}
 public Paciente actualizar(Long id,Paciente dato) {buscar(id);validar(dato,id);dato.setId(id);return repo.save(dato);}
 public Paciente sincronizar(Long id,Paciente dato) {
 if(!java.util.Objects.equals(id,dato.getUsuarioId())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"UsuarioId no coincide");
 dato.setId(repo.findByUsuarioId(id).map(Paciente::getId).orElse(null)); return repo.saveAndFlush(dato);
 }
 public Paciente verificarActivo(Long id) {var p=buscar(id);var u=perfiles.verificar("usuarios",p.getUsuarioId());p.setActivo(Boolean.TRUE.equals(p.getActivo())&&Boolean.TRUE.equals(u.activo()) && "paciente".equalsIgnoreCase(u.rol()));return p;}
 public void eliminar(Long id) {buscar(id);repo.deleteById(id);}
 private void validar(Paciente dato,Long id) {
if(dato.getUsuarioId()!=null) {var u=perfiles.verificar("usuarios",dato.getUsuarioId());
 if(!"paciente".equalsIgnoreCase(u.rol()) || !dato.getCorreo().equalsIgnoreCase(u.correo())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Cuenta no corresponde al perfil");
 }
}
}
