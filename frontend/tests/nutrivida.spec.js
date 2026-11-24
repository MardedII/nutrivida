import { validarRut, validarLogin, validarRegistro } from '../src/utils/validaciones';
import { authApi, citasApi } from '../src/services/api';
import { iniciarSesion, obtenerSesion, cerrarSesion } from '../src/utils/auth';
import { normalizarCita, horarioValido } from '../src/utils/useDatos';
const respuesta=(datos,status=200)=>Promise.resolve(new Response(JSON.stringify(datos),{status,headers:{'Content-Type':'application/json'}}));
describe('NutriVida - usuarios y citas integradas',()=>{
 beforeEach(()=>{sessionStorage.clear();spyOn(window,'alert').and.stub();});
 afterEach(()=>{sessionStorage.clear();});
 it('valida RUT y contraseña',()=>{expect(validarRut('12.345.678-5')).toBeTrue();expect(validarRut('12.345.678-9')).toBeFalse();expect(validarLogin('demo@example.test','Prueba123!')).toBeTrue();expect(validarLogin('demo@example.test','123456')).toBeFalse();});
 it('inicia sesión con API y conserva ID de perfil sin guardar la contraseña',async()=>{spyOn(window,'fetch').and.callFake(()=>respuesta({token:'jwt-demo',usuario:{id:5,perfilId:2,rol:'nutricionista'}}));await iniciarSesion('n@example.test','Prueba123!');expect(obtenerSesion().perfilId).toBe(2);expect(sessionStorage.getItem('nutrivida_sesion_api')).not.toContain('Prueba123!');cerrarSesion();expect(obtenerSesion()).toBeNull();});
 it('envía JWT y no un pacienteId en la creación de citas',async()=>{sessionStorage.setItem('nutrivida_sesion_api',JSON.stringify({token:'jwt-demo',usuario:{perfilId:7}}));const mock=spyOn(window,'fetch').and.callFake(()=>respuesta({id:10}));await citasApi.crear({nutricionistaId:2,inicio:'2030-01-07T10:00:00',motivo:'Control'});const args=mock.calls.mostRecent().args;expect(args[1].headers.Authorization).toBe('Bearer jwt-demo');expect(JSON.parse(args[1].body).pacienteId).toBeUndefined();});
 it('muestra el error de horario ocupado del backend',async()=>{spyOn(window,'fetch').and.callFake(()=>respuesta({message:'Horario ocupado'},409));await expectAsync(citasApi.crear({})).toBeRejectedWithError('Horario ocupado');});
 it('normaliza fecha/hora y propuestas',()=>{const c=normalizarCita({inicio:'2030-01-07T10:00:00',propuestaReprogramacion:{fecha:'2030-01-08',hora:'11:00:00'}});expect(c.hora).toBe('10:00');expect(c.propuestaReprogramacion.hora).toBe('11:00');});
 it('rechaza horario pasado o fuera de horas completas',()=>{expect(horarioValido('2000-01-03','10:00')).toBeFalse();expect(horarioValido('2099-01-05','10:30')).toBeFalse();});
});
