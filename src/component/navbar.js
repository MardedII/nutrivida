import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
    obtenerSesion,
    cerrarSesion
} from '../utils/auth';

export default function Navbar() {

    const navigate = useNavigate();
    const [actualizacion, setActualizacion] = useState(false);

    const usuario = obtenerSesion();

    const handleCerrarSesion = () => {
        cerrarSesion();
        setActualizacion(!actualizacion);
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-nutri sticky-top">

            <div className="container">

                <Link
                    className="navbar-brand d-flex align-items-center gap-2 fw-bold"
                    to="/"
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

                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Inicio
                            </Link>
                        </li>

                        {!usuario && (
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

                        {usuario && (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link">
                                        <i className="bi bi-person-circle me-1"></i>
                                        {usuario.nombre}
                                    </span>
                                </li>

                                <li className="nav-item">
                                    {usuario.rol === 'admin' && (
                                        <Link className="nav-link" to="/panel-admin">
                                            Administración
                                        </Link>
                                    )}

                                    {usuario.rol === 'nutricionista' && (
                                        <Link className="nav-link" to="/panel-medico">
                                            Mi Panel
                                        </Link>
                                    )}

                                    {usuario.rol === 'paciente' && (
                                        <Link className="nav-link" to="/panel-paciente">
                                            Mi Panel
                                        </Link>
                                    )}
                                </li>

                                {usuario.rol === 'paciente' && (
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