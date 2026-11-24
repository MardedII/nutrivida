import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Inicio from '../src/pages/Inicio';
import Agendar from '../src/pages/Agendar';
import Login from '../src/pages/Login';
import Registro from '../src/pages/Registro';
import PanelPaciente from '../src/pages/PanelPaciente';
import PanelMedico from '../src/pages/PanelMedico';
import Map from '../src/component/Map';
import { validarRut, validarLogin, validarRegistro } from '../src/utils/validaciones';

const registroValido = {
  nombre: 'Camila Silva',
  rut: '12.345.678-5',
  correo: 'camila@gmail.com',
  telefono: '+56 9 1234 5678',
  fechaNac: '1990-01-01',
  genero: 'Femenino',
  clave: '123456',
  rol: 'paciente',
  aceptoTerminos: true
};

function validarDatosRegistro(datos) {
  return validarRegistro(
    datos.nombre, datos.rut, datos.correo, datos.telefono,
    datos.fechaNac, datos.genero, datos.clave, datos.rol,
    datos.aceptoTerminos
  );
}

function renderLoginConRutas() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/panel-paciente" element={<div>Panel paciente de prueba</div>} />
        <Route path="/panel-medico" element={<div>Panel médico de prueba</div>} />
        <Route path="/panel-admin" element={<div>Panel administrador de prueba</div>} />
      </Routes>
    </MemoryRouter>
  );
}

function renderRegistroConRutaLogin() {
  return render(
    <MemoryRouter initialEntries={['/registro']}>
      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<div>Página de inicio de sesión de prueba</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('NutriVida - casos de prueba Jasmine/Karma TC-01 a TC-22', () => {
  beforeEach(() => {
    spyOn(window, 'alert').and.stub();
    spyOn(window, 'confirm').and.returnValue(true);
  });

  afterEach(() => {
    cleanup();
  });

  // TC-01
  it('TC-01: muestra el título principal de NutriVida', () => {
    render(<MemoryRouter><Inicio /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /clínica nutricional nutrivida/i })).toBeTruthy();
  });

  // TC-02
  it('TC-02: muestra un enlace para agendar cita', () => {
    render(<MemoryRouter><Inicio /></MemoryRouter>);
    expect(screen.getByRole('link', { name: /agendar cita/i })).toBeTruthy();
  });

  // TC-03
  it('TC-03: acepta un RUT válido', () => {
    expect(validarRut('12.345.678-5')).toBeTrue();
  });

  // TC-04
  it('TC-04: rechaza un RUT vacío', () => {
    expect(validarRut('')).toBeFalse();
  });

  // TC-05
  it('TC-05: rechaza un RUT con dígito verificador incorrecto', () => {
    expect(validarRut('12.345.678-9')).toBeFalse();
  });

  // TC-06
  it('TC-06: acepta correo y contraseña con formato válido', () => {
    expect(validarLogin('persona@nutrivida.cl', '123456')).toBeTrue();
  });

  // TC-07
  it('TC-07: rechaza correo vacío, correo inválido y contraseña corta', () => {
    expect(validarLogin('', '123456')).toBeFalse();
    expect(validarLogin('persona@a', '123456')).toBeFalse();
    expect(validarLogin('persona@gmail.com', '123')).toBeFalse();
    expect(window.alert).toHaveBeenCalled();
  });

  // TC-08
  it('TC-08: acepta un registro completo con datos válidos', () => {
    expect(validarDatosRegistro(registroValido)).toBeTrue();
  });

  // TC-09
  it('TC-09: rechaza un registro con RUT inválido', () => {
    expect(validarDatosRegistro({ ...registroValido, rut: '12.345.678-9' })).toBeFalse();
    expect(window.alert).toHaveBeenCalled();
  });

  // TC-10
  it('TC-10: rechaza un registro si no se aceptan los términos', () => {
    expect(validarDatosRegistro({ ...registroValido, aceptoTerminos: false })).toBeFalse();
    expect(window.alert).toHaveBeenCalled();
  });

  // TC-11
  it('TC-11: rechaza una fecha de nacimiento que no se puede interpretar', () => {
    expect(validarDatosRegistro({ ...registroValido, fechaNac: 'fecha-invalida' })).toBeFalse();
    expect(window.alert).toHaveBeenCalled();
  });

  // TC-12
  it('TC-12: navega desde Inicio a Agendamiento', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/agendar" element={<Agendar />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('link', { name: /agendar cita/i }));
    expect(screen.getByRole('heading', { name: /solicitar nueva cita/i })).toBeTruthy();
  });

  // TC-13
  it('TC-13: muestra la cita de demostración en el panel paciente', () => {
    render(<PanelPaciente />);
    expect(screen.getByText('Mañana 10:00')).toBeTruthy();
  });

  // TC-14
  it('TC-14: agrega una cita cuando se completa el formulario correctamente', () => {
    render(<Agendar />);
    fireEvent.change(screen.getByLabelText(/nombre completo del paciente/i), { target: { value: 'Camila Silva' } });
    fireEvent.change(screen.getByLabelText(/seleccionar nutricionista/i), { target: { value: 'Dra. María González' } });
    fireEvent.change(screen.getByLabelText(/motivo de la consulta/i), { target: { value: 'Control nutricional' } });
    const futuro = new Date();
    futuro.setDate(futuro.getDate() + 7);
    const fecha = `${futuro.getFullYear()}-${String(futuro.getMonth() + 1).padStart(2, '0')}-${String(futuro.getDate()).padStart(2, '0')}`;
    fireEvent.change(screen.getByLabelText(/^fecha$/i), { target: { value: fecha } });
    fireEvent.change(screen.getByLabelText(/^hora$/i), { target: { value: '10:30' } });
    fireEvent.click(screen.getByRole('button', { name: /confirmar solicitud/i }));
    expect(screen.getByText('Camila Silva')).toBeTruthy();
    expect(screen.getByText(`${fecha} 10:30`)).toBeTruthy();
    expect(window.alert).toHaveBeenCalledWith('¡Cita agendada exitosamente!');
  });

  // TC-15
  it('TC-15: marca como obligatorios los campos principales del formulario de cita', () => {
    render(<Agendar />);
    const nombre = screen.getByLabelText(/nombre completo del paciente/i);
    const profesional = screen.getByLabelText(/seleccionar nutricionista/i);
    const motivo = screen.getByLabelText(/motivo de la consulta/i);
    const fecha = screen.getByLabelText(/^fecha$/i);
    const hora = screen.getByLabelText(/^hora$/i);
    [nombre, profesional, motivo, fecha, hora].forEach((campo) => {
      expect(campo.required).toBeTrue();
    });
  });

  // TC-16
  it('TC-16: el campo fecha impide seleccionar una fecha anterior al día actual', () => {
    render(<Agendar />);
    const inputFecha = screen.getByLabelText(/^fecha$/i);
    const hoy = new Date();
    hoy.setDate(hoy.getDate() - 1);
    const ayer = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    expect(inputFecha.min).toBe(new Date().toISOString().split('T')[0]);
    fireEvent.change(inputFecha, { target: { value: ayer } });
    expect(inputFecha.validity.rangeUnderflow).toBeTrue();
  });

  // TC-17
  it('TC-17: calcula el IMC usando peso y talla positivos', () => {
    render(<PanelMedico />);
    fireEvent.change(screen.getByLabelText(/peso \(kg\)/i), { target: { value: '80' } });
    fireEvent.change(screen.getByLabelText(/talla \(cm\)/i), { target: { value: '180' } });
    expect(screen.getByText('24.7')).toBeTruthy();
  });

  // TC-18
  it('TC-18: rechaza guardar ficha si el peso o la talla son cero', () => {
    render(<PanelMedico />);
    fireEvent.change(screen.getByLabelText(/peso \(kg\)/i), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText(/talla \(cm\)/i), { target: { value: '0' } });
    const form = screen.getByRole('button', { name: /guardar ficha/i }).closest('form');
    fireEvent.submit(form);
    expect(window.alert).toHaveBeenCalledWith('El peso y la talla deben ser mayores que cero.');
  });

  // TC-19
  it('TC-19: renderiza el contenedor del mapa', () => {
    render(<Map />);
    expect(document.getElementById('map')).toBeTruthy();
  });

  // TC-20
  it('TC-20: permite elegir el rol paciente en el formulario de inicio de sesión', () => {
    renderLoginConRutas();
    expect(screen.getByRole('combobox', { name: /seleccionar perfil \/ rol/i }).value).toBe('paciente');
  });

  // TC-21
  it('TC-21: el botón Iniciar Atención cambia el estado de la agenda médica', () => {
    render(<PanelMedico />);
    fireEvent.click(screen.getByRole('button', { name: /iniciar atención/i }));
    expect(screen.getByText('Atendiendo')).toBeTruthy();
    expect(screen.getByRole('button', { name: /en proceso/i })).toBeTruthy();
  });

  // TC-22
  it('TC-22: el login dirige al panel elegido según el rol seleccionado', () => {
    renderLoginConRutas();
    fireEvent.change(screen.getByRole('combobox', { name: /seleccionar perfil \/ rol/i }), { target: { value: 'medico' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'persona@nutrivida.cl' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /ingresar al sistema/i }));
    expect(screen.getByText('Panel médico de prueba')).toBeTruthy();
  });
});
