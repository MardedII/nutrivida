
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import {
    validarRegistro,
    validarRut,
    validarTelefono,
    validarContrasenas,
    formatearRut,
    formatearTelefono
} from '../utils/validaciones';

import {
    registrarPaciente,
    obtenerUsuarios
} from '../utils/auth';

const formularioInicial = {
    nombre: '',
    rut: '',
    correo: '',
    telefono: '',
    fechaNac: '',
    genero: '',
    clave: '',
    confirmarClave: '',
    aceptoTerminos: false
};

export default function Registro() {

    const navigate = useNavigate();

    const [form, setForm] = useState({ ...formularioInicial });

    const [mostrarClave, setMostrarClave] = useState(false);
    const [mostrarConfirmarClave, setMostrarConfirmarClave] = useState(false);

    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [guardando, setGuardando] = useState(false);

    // ==========================================
    // COMPROBACIÓN DE CONTRASEÑAS
    // ==========================================

    const confirmarClaveIngresada = form.confirmarClave.length > 0;

    const contrasenasCoinciden =
        confirmarClaveIngresada &&
        form.clave === form.confirmarClave;

    const contrasenasDiferentes =
        confirmarClaveIngresada &&
        form.clave !== form.confirmarClave;

    // ==========================================
    // ACTUALIZAR CAMPOS
    // ==========================================

    const actualizarCampo = e => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        let valorFinal = type === 'checkbox' ? checked : value;

        if (name === 'rut') {
            valorFinal = formatearRut(value);
        }

        if (name === 'telefono') {
            valorFinal = formatearTelefono(value);
        }

        setForm(prev => ({
            ...prev,
            [name]: valorFinal
        }));

        if (error) {
            setError('');
        }
    };

    // ==========================================
    // REGISTRAR NUEVO PACIENTE
    // ==========================================

    const handleSubmitRegistro = e => {
        e.preventDefault();

        if (guardando) return;

        setMensaje('');
        setError('');

        // Validación de contraseñas obligatoria
        const resultadoClave = validarContrasenas(
            form.clave,
            form.confirmarClave
        );

        if (!resultadoClave.valido) {
            setError(resultadoClave.mensaje);
            return;
        }

        if (!validarRut(form.rut)) {
            setError(
                'El RUT ingresado no es válido. Verifica el número y el dígito verificador.'
            );
            return;
        }

        if (!validarTelefono(form.telefono)) {
            setError(
                'El teléfono ingresado no es válido. Utiliza un celular chileno.'
            );
            return;
        }

        // Revisión general de todos los campos
        const valido = validarRegistro(
            form.nombre,
            form.rut,
            form.correo,
            form.telefono,
            form.fechaNac,
            form.genero,
            form.clave,
            'paciente',
            form.aceptoTerminos,
            form.confirmarClave
        );

        if (!valido) return;

        // Preparación de datos
        const datosRegistro = {
            nombre: form.nombre.trim(),
            rut: formatearRut(form.rut),
            correo: form.correo.trim().toLowerCase(),
            telefono: formatearTelefono(form.telefono),
            fechaNac: form.fechaNac,
            genero: form.genero,
            clave: form.clave,
            rol: 'paciente',
            activo: true
        };

        setGuardando(true);

        try {
            // Guardar mediante auth.js
            const resultado = registrarPaciente(datosRegistro);

            if (!resultado || !resultado.ok) {
                setError(
                    resultado?.mensaje ||
                    'No fue posible registrar al paciente.'
                );
                setGuardando(false);
                return;
            }

            // Confirmar que el usuario está realmente guardado
            const usuariosGuardados = obtenerUsuarios();

            const pacienteExiste = usuariosGuardados.some(
                usuario =>
                    usuario.correo.toLowerCase() === datosRegistro.correo &&
                    usuario.rut.replace(/[.\-\s]/g, '').toUpperCase() ===
                        datosRegistro.rut.replace(/[.\-\s]/g, '').toUpperCase() &&
                    usuario.rol === 'paciente'
            );

            if (!pacienteExiste) {
                setError(
                    'No se pudo verificar el registro del paciente. Revisa los datos guardados.'
                );
                setGuardando(false);
                return;
            }

            setMensaje(
                '¡Cuenta creada correctamente! Ya puedes iniciar sesión.'
            );

            setForm({ ...formularioInicial });

            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 1500);

        } catch (err) {
            console.error('Error al registrar paciente:', err);

            setError(
                'Ocurrió un error al guardar el paciente. Inténtalo nuevamente.'
            );

            setGuardando(false);
        }
    };

    // ==========================================
    // INTERFAZ DE REGISTRO
    // ==========================================

    return (
        <main className="container my-5">

            <div
                className="row card-custom g-0 overflow-hidden shadow-lg mx-auto"
                style={{ maxWidth: '950px' }}
            >

                {/* IMAGEN LATERAL */}

                <div className="col-lg-5 d-none d-lg-block">
                    <img
                        src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=700&q=80"
                        className="h-100 w-100"
                        style={{ objectFit: 'cover' }}
                        alt="Alimentación saludable"
                    />
                </div>

                {/* FORMULARIO */}

                <div className="col-lg-7 p-4 p-md-5 bg-white">

                    <div className="text-center mb-4">

                        <h3 className="fw-bold text-nutri">
                            Registro de Paciente
                        </h3>

                        <p className="text-muted small">
                            Crea tu cuenta para acceder a los servicios de NutriVida.
                        </p>
                    </div>

                    {/* MENSAJES */}

                    {mensaje && (
                        <div className="alert alert-success" role="alert">
                            <i className="bi bi-check-circle me-2"></i>
                            {mensaje}
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            <i className="bi bi-exclamation-circle me-2"></i>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmitRegistro}>

                        {/* NOMBRE Y RUT */}

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
                                    disabled={guardando}
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
                                    disabled={guardando}
                                />

                                <small className="text-muted">
                                    Ingresa tu RUT con dígito verificador.
                                </small>
                            </div>
                        </div>

                        {/* CORREO Y TELÉFONO */}

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
                                    autoComplete="email"
                                    required
                                    disabled={guardando}
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
                                    disabled={guardando}
                                />

                                <small className="text-muted">
                                    Formato chileno: +56 9 1234 5678.
                                </small>
                            </div>
                        </div>

                        {/* FECHA NACIMIENTO Y GÉNERO */}

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
                                    max={new Date().toLocaleDateString('en-CA')}
                                    required
                                    disabled={guardando}
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
                                    disabled={guardando}
                                >
                                    <option value="">
                                        Seleccione género...
                                    </option>

                                    <option value="Femenino">
                                        Femenino
                                    </option>

                                    <option value="Masculino">
                                        Masculino
                                    </option>

                                    <option value="Otro">
                                        Otro / Prefiero no decir
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* CONTRASEÑA */}

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
                                    disabled={guardando}
                                />

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setMostrarClave(!mostrarClave)}
                                    aria-label={
                                        mostrarClave
                                            ? 'Ocultar contraseña'
                                            : 'Mostrar contraseña'
                                    }
                                >
                                    <i className={
                                        mostrarClave
                                            ? 'bi bi-eye-slash'
                                            : 'bi bi-eye'
                                    }></i>
                                </button>
                            </div>
                        </div>

                        {/* CONFIRMAR CONTRASEÑA */}

                        <div className="mb-3">

                            <label className="form-label">
                                Confirmar Contraseña
                            </label>

                            <div className="input-group">

                                <input
                                    type={mostrarConfirmarClave ? 'text' : 'password'}
                                    name="confirmarClave"
                                    className={`form-control ${
                                        contrasenasDiferentes
                                            ? 'is-invalid'
                                            : contrasenasCoinciden
                                                ? 'is-valid'
                                                : ''
                                    }`}
                                    placeholder="Repita su contraseña"
                                    value={form.confirmarClave}
                                    onChange={actualizarCampo}
                                    autoComplete="new-password"
                                    required
                                    disabled={guardando}
                                />

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() =>
                                        setMostrarConfirmarClave(!mostrarConfirmarClave)
                                    }
                                    aria-label="Mostrar u ocultar confirmación"
                                >
                                    <i className={
                                        mostrarConfirmarClave
                                            ? 'bi bi-eye-slash'
                                            : 'bi bi-eye'
                                    }></i>
                                </button>
                            </div>

                            {contrasenasDiferentes && (
                                <small className="text-danger d-block mt-1">
                                    <i className="bi bi-x-circle me-1"></i>
                                    Las contraseñas no coinciden.
                                </small>
                            )}

                            {contrasenasCoinciden && (
                                <small className="text-success d-block mt-1">
                                    <i className="bi bi-check-circle me-1"></i>
                                    Las contraseñas coinciden.
                                </small>
                            )}
                        </div>

                        {/* INFORMACIÓN DE CUENTA */}

                        <div className="alert alert-info py-2">

                            <i className="bi bi-info-circle me-2"></i>

                            Las cuentas creadas mediante este formulario
                            corresponden al perfil Paciente.
                        </div>

                        {/* TÉRMINOS */}

                        <div className="form-check mb-4">

                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="regTerminos"
                                name="aceptoTerminos"
                                checked={form.aceptoTerminos}
                                onChange={actualizarCampo}
                                required
                                disabled={guardando}
                            />

                            <label
                                className="form-check-label small text-secondary"
                                htmlFor="regTerminos"
                            >
                                Acepto los términos de servicio y las
                                políticas de privacidad de NutriVida.
                            </label>
                        </div>

                        {/* BOTÓN CREAR CUENTA */}

                        <button
                            type="submit"
                            className="btn btn-nutri w-100 py-2"
                            disabled={
                                guardando ||
                                (confirmarClaveIngresada && !contrasenasCoinciden)
                            }
                        >
                            {guardando ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Procesando registro...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-person-plus me-1"></i>
                                    Crear Cuenta
                                </>
                            )}
                        </button>
                    </form>

                    {/* ENLACE LOGIN */}

                    <div className="text-center mt-3">

                        <small className="text-muted">
                            ¿Ya tienes cuenta?{' '}

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
