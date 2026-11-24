import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { validarLogin } from '../utils/validaciones';
import { iniciarSesion } from '../utils/auth';

export default function Login() {
    const navigate = useNavigate();

    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [mostrarClave, setMostrarClave] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!validarLogin(correo, clave)) return;

        let usuario;
        try { usuario = await iniciarSesion(correo, clave); } catch (e) { setError(e.message || "No se pudo iniciar sesión."); return; }

        if (!usuario) {
            setError(
                'Correo o contraseña incorrectos, o cuenta desactivada.'
            );
            return;
        }

        switch (usuario.rol) {
            case 'admin':
                navigate('/panel-admin', { replace: true });
                break;

            case 'nutricionista':
                navigate('/panel-medico', { replace: true });
                break;

            case 'paciente':
                navigate('/panel-paciente', { replace: true });
                break;

            default:
                setError('El perfil de usuario no es válido.');
        }
    };

    return (
        <main className="container my-5">
            <div
                className="card card-custom p-4 mx-auto shadow"
                style={{ maxWidth: '480px' }}
            >
                <div className="text-center mb-4">
                    <i className="bi bi-person-circle fs-1 text-success"></i>

                    <h3 className="fw-bold mt-2">
                        Inicio de Sesión
                    </h3>

                    <p className="text-muted small">
                        Accede a tu cuenta de NutriVida
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        <i className="bi bi-exclamation-circle me-2"></i>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label
                            className="form-label"
                            htmlFor="login-correo"
                        >
                            Correo Electrónico
                        </label>

                        <input
                            type="email"
                            id="login-correo"
                            className="form-control"
                            placeholder="correo@ejemplo.com"
                            value={correo}
                            onChange={e => setCorreo(e.target.value)}
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label
                            className="form-label"
                            htmlFor="login-clave"
                        >
                            Contraseña
                        </label>

                        <div className="input-group">
                            <input
                                type={mostrarClave ? 'text' : 'password'}
                                id="login-clave"
                                className="form-control"
                                placeholder="Ingrese su contraseña"
                                value={clave}
                                onChange={e => setClave(e.target.value)}
                                autoComplete="current-password"
                                required
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

                    <button
                        type="submit"
                        className="btn btn-nutri w-100 py-2 mt-2"
                    >
                        <i className="bi bi-box-arrow-in-right me-1"></i>
                        Ingresar al Sistema
                    </button>
                </form>

                <div className="text-center mt-4">
                    <small className="text-muted">
                        ¿Todavía no tienes cuenta?
                        {' '}
                        <Link
                            to="/registro"
                            className="text-success fw-bold"
                        >
                            Regístrate aquí
                        </Link>
                    </small>
                </div>
            </div>
        </main>
    );
}