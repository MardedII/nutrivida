import React from 'react';
import { Navigate } from 'react-router-dom';
import { redireccionRuta } from '../utils/navegacion';

export default function ProtectedRoute({ ruta, usuario, children }) {
    const destino = redireccionRuta(ruta, usuario);
    return destino ? <Navigate to={destino} replace /> : children;
}
