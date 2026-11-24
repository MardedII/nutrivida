package com.nutrivida.fichas.service;

import com.nutrivida.fichas.model.FichaClinica;
import com.nutrivida.fichas.repository.FichaClinicaRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;
import com.nutrivida.fichas.client.PerfilClient;
@Service
public class FichaClinicaService {
 private final FichaClinicaRepository repo;
 private final PerfilClient perfiles;
 public FichaClinicaService(FichaClinicaRepository repo, PerfilClient perfiles) {this.repo=repo;this.perfiles=perfiles;}
 public List<FichaClinica> listar() {return repo.findAll();}
 public FichaClinica buscar(Long id) {return repo.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Registro no encontrado"));}
 public FichaClinica crear(FichaClinica dato) {validar(dato,null);dato.setId(null);return repo.save(dato);}
 public FichaClinica actualizar(Long id,FichaClinica dato) {buscar(id);validar(dato,id);dato.setId(id);return repo.save(dato);}
 public void eliminar(Long id) {buscar(id);repo.deleteById(id);}
 private void validar(FichaClinica dato,Long id) {
var paciente=perfiles.verificar("pacientes",dato.getPacienteId());
 var nutri=perfiles.verificar("nutricionistas",dato.getNutricionistaId());
 if(dato.getPesoKg()!=null && dato.getPesoKg().signum()<=0 || dato.getTallaCm()!=null && dato.getTallaCm().signum()<=0 || dato.getCinturaCm()!=null && dato.getCinturaCm().signum()<=0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Mediciones deben ser positivas");

}
 public List<FichaClinica> porPaciente(Long id) {return repo.findByPacienteId(id);}
 public List<FichaClinica> porNutricionista(Long id) {return repo.findByNutricionistaId(id);}
}
