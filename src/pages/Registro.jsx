
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import {
    validarRegistro,
    validarRut,
    validarTelefono,
    formatearRut,
    formatearTelefono
} from '../utils/validaciones';

import { registrarPaciente } from '../utils/auth';

export default function Registro() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombre: '',
        rut: '',
        correo: '',
        telefono: '',
        fechaNac: '',
        genero: '',
        clave: '',
        confirmarClave: '',
        aceptoTerminos: false
    });

    const [mostrarClave, setMostrarClave] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    const handleSubmitRegistro = (e) => {
        e.preventDefault();

        setMensaje('');
        setError('');

        // Validar contraseñas
        if (form.clave !== form.confirmarClave) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        // Validar RUT chileno
        if (!validarRut(form.rut)) {
            setError('El RUT ingresado no es válido. Verifica el número y el dígito verificador.');
            return;
        }

        // Validar teléfono chileno
        if (!validarTelefono(form.telefono)) {
            setError('El teléfono ingresado no es válido. Utiliza un celular chileno, por ejemplo: +56 9 1234 5678.');
            return;
        }

        // Validaciones generales del registro
        const valido = validarRegistro(
            form.nombre,
            form.rut,
            form.correo,
            form.telefono,
            form.fechaNac,
            form.genero,
            form.clave,
            'paciente',
            form.aceptoTerminos
        );

        if (!valido) return;

        // Guardar datos con formatos normalizados
        const datosRegistro = {
            ...form,
            rut: formatearRut(form.rut),
            telefono: formatearTelefono(form.telefono),
            correo: form.correo.trim().toLowerCase(),
            nombre: form.nombre.trim()
        };

        const resultado = registrarPaciente(datosRegistro);

        if (!resultado.ok) {
            setError(resultado.mensaje);
            return;
        }

        setMensaje('¡Cuenta creada correctamente! Ahora puedes iniciar sesión.');

        setTimeout(() => {
            navigate('/login');
        }, 1500);
    };

    const actualizarCampo = (e) => {
        const { name, value, type, checked } = e.target;

        let valorFinal = type === 'checkbox' ? checked : value;

        // Formato automático del RUT chileno
        if (name === 'rut') {
            valorFinal = formatearRut(value);
        }

        // Formato automático del teléfono chileno
        if (name === 'telefono') {
            valorFinal = formatearTelefono(value);
        }

        setForm(prev => ({
            ...prev,
            [name]: valorFinal
        }));
    };

    return (
        <main className="container my-5">
            <div
                className="row card-custom g-0 overflow-hidden shadow-lg mx-auto"
                style={{ maxWidth: '950px' }}
            >
                <div className="col-lg-5 d-none d-lg-block">
                    <img
                        src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=700&q=80"
                        className="h-100 w-100"
                        style={{ objectFit: 'cover' }}
                        alt="Alimentación saludable"
                    />
                </div>

                <div className="col-lg-7 p-4 p-md-5 bg-white">
                    <div className="text-center mb-4">
                        <h3 className="fw-bold text-nutri">
                            Registro de Paciente
                        </h3>

                        <p className="text-muted small">
                            Crea tu cuenta para acceder a los servicios de NutriVida.
                        </p>
                    </div>

                    {mensaje && (
                        <div className="alert alert-success">
                            <i className="bi bi-check-circle me-2"></i>
                            {mensaje}
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger">
                            <i className="bi bi-exclamation-circle me-2"></i>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmitRegistro}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Nombre Completo
                                </label>

                                <input
                                    type="text"
                                    name="nombre"
                                    className="form-control"
                                    placeholder="Ej. Camila Silva"
                                    value={form.nombre}
                                    onChange={actualizarCampo}
                                    minLength="3"
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    RUT
                                </label>

                                <input
                                    type="text"
                                    name="rut"
                                    className="form-control"
                                    placeholder="12.345.678-9"
                                    value={form.rut}
                                    onChange={actualizarCampo}
                                    maxLength="12"
                                    autoComplete="off"
                                    required
                                />

                                <small className="text-muted">
                                    Ingresa tu RUT con dígito verificador.
                                </small>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Correo Electrónico
                                </label>

                                <input
                                    type="email"
                                    name="correo"
                                    className="form-control"
                                    placeholder="correo@ejemplo.com"
                                    value={form.correo}
                                    onChange={actualizarCampo}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Teléfono
                                </label>

                                <input
                                    type="tel"
                                    name="telefono"
                                    className="form-control"
                                    placeholder="+56 9 1234 5678"
                                    value={form.telefono}
                                    onChange={actualizarCampo}
                                    maxLength="16"
                                    autoComplete="tel"
                                    required
                                />

                                <small className="text-muted">
                                    Formato chileno: +56 9 1234 5678.
                                </small>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Fecha de Nacimiento
                                </label>

                                <input
                                    type="date"
                                    name="fechaNac"
                                    className="form-control"
                                    value={form.fechaNac}
                                    onChange={actualizarCampo}
                                    max={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Género
                                </label>

                                <select
                                    name="genero"
                                    className="form-select"
                                    value={form.genero}
                                    onChange={actualizarCampo}
                                    required
                                >
                                    <option value="">
                                        Seleccione género...
                                    </option>

                                    <option value="Femenino">Femenino</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Otro">Otro / Prefiero no decir</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Contraseña
                            </label>

                            <div className="input-group">
                                <input
                                    type={mostrarClave ? 'text' : 'password'}
                                    name="clave"
                                    className="form-control"
                                    placeholder="Mínimo 6 caracteres"
                                    value={form.clave}
                                    onChange={actualizarCampo}
                                    minLength="6"
                                    autoComplete="new-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setMostrarClave(!mostrarClave)}
                                >
                                    <i className={
                                        mostrarClave
                                            ? 'bi bi-eye-slash'
                                            : 'bi bi-eye'
                                    }></i>
                                </button>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Confirmar Contraseña
                            </label>

                            <input
                                type="password"
                                name="confirmarClave"
                                className="form-control"
                                placeholder="Repita su contraseña"
                                value={form.confirmarClave}
                                onChange={actualizarCampo}
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <div className="alert alert-info py-2">
                            <i className="bi bi-info-circle me-2"></i>
                            Las cuentas creadas mediante este formulario
                            corresponden al perfil Paciente.
                        </div>

                        <div className="form-check mb-4">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="regTerminos"
                                name="aceptoTerminos"
                                checked={form.aceptoTerminos}
                                onChange={actualizarCampo}
                                required
                            />

                            <label
                                className="form-check-label small text-secondary"
                                htmlFor="regTerminos"
                            >
                                Acepto los términos de servicio y las
                                políticas de privacidad de NutriVida.
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-nutri w-100 py-2"
                        >
                            <i className="bi bi-person-plus me-1"></i>
                            Crear Cuenta
                        </button>
                    </form>

                    <div className="text-center mt-3">
                        <small className="text-muted">
                            ¿Ya tienes cuenta?
                            {' '}
                            <Link
                                to="/login"
                                className="text-success fw-bold"
                            >
                                Inicia Sesión
                            </Link>
                        </small>
                    </div>
                </div>
            </div>
        </main>
    );
}
