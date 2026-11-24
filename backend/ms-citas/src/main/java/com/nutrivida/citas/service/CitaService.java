package com.nutrivida.citas.service;

import com.nutrivida.citas.model.Cita;
import com.nutrivida.citas.repository.CitaRepository;
import com.nutrivida.citas.client.PerfilClient;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.time.*;
import java.util.*;

@Service public class CitaService {
    private final CitaRepository repo;
    private final PerfilClient perfiles;
    private static final ZoneId ZONA=ZoneId.of("America/Santiago");

    public CitaService(CitaRepository repo,PerfilClient perfiles)
    {this.repo=repo;this.perfiles=perfiles;}

    public List<Cita> listar(){return repo.findAll();}
    
    public Cita buscar(Long id){return repo.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Cita no encontrada"));}
    public List<Cita> porPaciente(Long id){return repo.findByPacienteId(id);}
    public List<Cita> porNutricionista(Long id){return repo.findByNutricionistaId(id);}
    public record Solicitud(Long nutricionistaId,LocalDateTime inicio,String motivo){}
    public record Accion(String accion,LocalDateTime inicio){}
    public record Actor(String rol,Long perfilId){}
    private static void exigir(boolean ok,String mensaje){if(!ok)throw new ResponseStatusException(HttpStatus.BAD_REQUEST,mensaje);}
    private static void permitido(boolean ok){if(!ok)throw new ResponseStatusException(HttpStatus.FORBIDDEN,"No tienes permiso para esta operación");}
    public void acceso(Cita c,Actor a){permitido("admin".equals(a.rol())||("paciente".equals(a.rol())&&Objects.equals(a.perfilId(),c.getPacienteId()))||("nutricionista".equals(a.rol())&&Objects.equals(a.perfilId(),c.getNutricionistaId())));}
    private boolean futura(Cita c){return c.getInicio().isAfter(LocalDateTime.now(ZONA));}
    private boolean activa(Cita c){return Set.of("Pendiente","Confirmada","Reprogramación solicitada").contains(c.getEstado());}
    public static void validarHorario(LocalDateTime inicio){exigir(inicio!=null,"Fecha y hora obligatorias");exigir(inicio.isAfter(LocalDateTime.now(ZONA)),"La cita debe ser futura");exigir(inicio.getDayOfWeek()!=DayOfWeek.SATURDAY&&inicio.getDayOfWeek()!=DayOfWeek.SUNDAY,"Atención de lunes a viernes");exigir(inicio.getHour()>=9&&inicio.getHour()<=17&&inicio.getMinute()==0&&inicio.getSecond()==0&&inicio.getNano()==0,"Horario válido: 09:00 a 17:00, horas completas");}
    private void comprobarHorario(Cita c,LocalDateTime inicio){validarHorario(inicio);perfiles.verificar("pacientes",c.getPacienteId());perfiles.verificar("nutricionistas",c.getNutricionistaId());if(repo.conflictos(c.getNutricionistaId(),c.getPacienteId(),inicio,inicio.plusMinutes(45),c.getId())>0)throw new ResponseStatusException(HttpStatus.CONFLICT,"El profesional o paciente ya tiene una cita en ese horario");}
    // El monitor abarca la consulta y saveAndFlush (transacción del repositorio). Una instancia local.
    public synchronized Cita crear(Solicitud d,Actor a){permitido("paciente".equals(a.rol())&&a.perfilId()!=null);exigir(d.nutricionistaId()!=null&&d.nutricionistaId()>0,"Selecciona un nutricionista válido");exigir(d.motivo()!=null&&!d.motivo().isBlank()&&d.motivo().length()<=500,"Motivo obligatorio (máximo 500 caracteres)");var c=new Cita();c.setPacienteId(a.perfilId());c.setNutricionistaId(d.nutricionistaId());comprobarHorario(c,d.inicio());var paciente=perfiles.verificar("pacientes",c.getPacienteId());var nutri=perfiles.verificar("nutricionistas",c.getNutricionistaId());c.setPaciente(paciente.nombre());c.setCorreoPaciente(paciente.correo());c.setNutricionista(nutri.nombre());c.setInicio(d.inicio());c.setFin(d.inicio().plusMinutes(45));c.setMotivo(d.motivo().trim());c.setEstado("Pendiente");c.setAsistenciaConfirmada(false);c.setFechaSolicitud(Instant.now());c.setFechaCreacion(Instant.now());return repo.saveAndFlush(c);}
    public synchronized Cita cambiar(Long id,Accion d,Actor a){var c=buscar(id);acceso(c,a);boolean paciente="paciente".equals(a.rol()),admin="admin".equals(a.rol()),nutri="nutricionista".equals(a.rol());exigir(d.accion()!=null,"Acción obligatoria");switch(d.accion()){
    case "cancelar" -> {permitido(paciente||admin);exigir(activa(c),"La cita ya terminó");c.setEstado("Cancelada");c.setPropuestaReprogramacion(null);c.setAsistenciaConfirmada(false);}
    case "confirmar" -> {permitido(admin||nutri);exigir("Pendiente".equals(c.getEstado())&&futura(c),"Solo se confirman citas pendientes futuras");comprobarHorario(c,c.getInicio());c.setEstado("Confirmada");}
    case "asistencia" -> {permitido(paciente);exigir("Confirmada".equals(c.getEstado())&&futura(c),"La cita debe estar confirmada y ser futura");c.setAsistenciaConfirmada(true);}
    case "reprogramar" -> {permitido(paciente);exigir(Set.of("Pendiente","Confirmada").contains(c.getEstado())&&futura(c),"La cita no admite reprogramación");comprobarHorario(c,d.inicio());var propuesta=new Cita.Propuesta();propuesta.fecha=d.inicio().toLocalDate();propuesta.hora=d.inicio().toLocalTime();c.setPropuestaReprogramacion(propuesta);c.setEstado("Reprogramación solicitada");c.setAsistenciaConfirmada(false);}
    case "aprobarReprogramacion" -> {permitido(admin);exigir("Reprogramación solicitada".equals(c.getEstado())&&c.getPropuestaReprogramacion()!=null,"No existe propuesta");var p=c.getPropuestaReprogramacion();var inicio=LocalDateTime.of(p.fecha,p.hora);comprobarHorario(c,inicio);c.setInicio(inicio);c.setFin(inicio.plusMinutes(45));c.setPropuestaReprogramacion(null);c.setEstado("Confirmada");}
    case "completar","inasistencia" -> {permitido(admin||nutri);exigir("Confirmada".equals(c.getEstado())&&!futura(c),"La cita debe estar confirmada y haber comenzado");c.setEstado("completar".equals(d.accion())?"Completada":"Inasistencia");}
    default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Acción desconocida");}
    return repo.saveAndFlush(c);}
    public List<String> ocupados(Long nutri,LocalDate fecha,Actor a){permitido("paciente".equals(a.rol())&&a.perfilId()!=null);exigir(nutri!=null&&nutri>0&&fecha!=null,"Selecciona fecha y nutricionista");var horas=new ArrayList<String>();for(int h=9;h<=17;h++){var ini=fecha.atTime(h,0);if(repo.conflictos(nutri,a.perfilId(),ini,ini.plusMinutes(45),null)>0)horas.add(String.format("%02d:00",h));}return horas;}
    public boolean asignado(Long nutri,Long paciente){return repo.findByNutricionistaId(nutri).stream().anyMatch(c->Objects.equals(c.getPacienteId(),paciente)&&Set.of("Confirmada","Completada").contains(c.getEstado()));}
}
