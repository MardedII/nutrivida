import React from 'react';
import { Navigate } from 'react-router-dom';
import { obtenerSesion } from '../utils/auth';

export default function ProtectedRoute({ roles, children }) {
    const usuario = obtenerSesion();

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    if (!roles.includes(usuario.rol)) {
        switch (usuario.rol) {
            case 'admin':
                return <Navigate to="/panel-admin" replace />;

            case 'nutricionista':
                return <Navigate to="/panel-medico" replace />;

            case 'paciente':
                return <Navigate to="/panel-paciente" replace />;

            default:
                return <Navigate to="/login" replace />;
        }
    }

    return children;
}