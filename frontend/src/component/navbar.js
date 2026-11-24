import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { cerrarSesion } from '../utils/auth';
import { esPersonal, rolSesion, rutaPanel } from '../utils/navegacion';

export default function Navbar({ usuario }) {

    const navigate = useNavigate();
    const rol = rolSesion(usuario);
    const personal = esPersonal(usuario);

    const handleCerrarSesion = () => {
        cerrarSesion();
        navigate('/login', { replace: true });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-nutri sticky-top">

            <div className="container">

                <Link
                    className="navbar-brand d-flex align-items-center gap-2 fw-bold"
                    to={personal ? rutaPanel(usuario) : '/'}
                >
                    <i className="bi bi-heart-pulse-fill fs-3"></i>
                    NutriVida
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">

                    <ul className="navbar-nav ms-auto align-items-lg-center">

                        {!personal && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    Inicio
                                </Link>
                            </li>
                        )}

                        {!rol && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">
                                        Iniciar Sesión
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        className="btn btn-light text-success ms-lg-2"
                                        to="/registro"
                                    >
                                        Registrarse
                                    </Link>
                                </li>
                            </>
                        )}

                        {rol && (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link">
                                        <i className="bi bi-person-circle me-1"></i>
                                        {usuario.nombre}
                                    </span>
                                </li>

                                <li className="nav-item">
                                    {rol === 'admin' && (
                                        <Link className="nav-link" to="/panel-admin">
                                            Administración
                                        </Link>
                                    )}

                                    {rol === 'nutricionista' && (
                                        <Link className="nav-link" to="/panel-medico">
                                            Mi Panel
                                        </Link>
                                    )}

                                    {rol === 'paciente' && (
                                        <Link className="nav-link" to="/panel-paciente">
                                            Mi Panel
                                        </Link>
                                    )}
                                </li>

                                {rol === 'paciente' && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/agendar">
                                            Agendar Cita
                                        </Link>
                                    </li>
                                )}

                                <li className="nav-item">
                                    <button
                                        className="btn btn-outline-light ms-lg-2"
                                        onClick={handleCerrarSesion}
                                    >
                                        <i className="bi bi-box-arrow-right me-1"></i>
                                        Cerrar Sesión
                                    </button>
                                </li>
                            </>
                        )}

                    </ul>

                </div>
            </div>
        </nav>
    );
}