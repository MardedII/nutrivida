import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-nutri sticky-top">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
                    <i className="bi bi-heart-pulse-fill fs-3"></i> NutriVida
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-lg-center">
                        <li className="nav-item"><Link className="nav-link" to="/"><i className="bi bi-house-door-fill me-1"></i> Inicio</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/agendar"><i className="bi bi-calendar-plus-fill me-1"></i> Agendamiento</Link></li>
                        <li className="nav-item"><Link className="btn btn-outline-light ms-lg-2 my-1 my-lg-0" to="/login">Iniciar Sesión</Link></li>
                        <li className="nav-item"><Link className="btn btn-light text-success ms-lg-2" to="/registro">Registrarse</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}