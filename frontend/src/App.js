import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './component/navbar';
import Footer from './component/Footer';
import ProtectedRoute from './component/ProtectedRoute';
import { obtenerSesion } from './utils/auth';
import { esPersonal } from './utils/navegacion';

import Inicio from './pages/Inicio';
import Agendar from './pages/Agendar';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Registro from './pages/Registro';
import PanelAdmin from './pages/PanelAdmin';
import PanelMedico from './pages/PanelMedico';
import PanelPaciente from './pages/PanelPaciente';

const paginas = [
    ['/', Inicio],
    ['/contacto', Contacto],
    ['/login', Login],
    ['/registro', Registro],
    ['/agendar', Agendar],
    ['/panel-admin', PanelAdmin],
    ['/panel-medico', PanelMedico],
    ['/panel-paciente', PanelPaciente]
];

function App() {
    const [usuario, setUsuario] = useState(obtenerSesion);

    useEffect(() => {
        const actualizar = () => setUsuario(obtenerSesion());
        window.addEventListener('nutrivida-sesion', actualizar);
        actualizar();
        return () => window.removeEventListener('nutrivida-sesion', actualizar);
    }, []);

    return (
        <Router>
            <Navbar usuario={usuario} />
            <Routes>
                {paginas.map(([ruta, Pagina]) => (
                    <Route key={ruta} path={ruta} element={
                        <ProtectedRoute ruta={ruta} usuario={usuario}>
                            <Pagina />
                        </ProtectedRoute>
                    } />
                ))}
                {/* No mostrar Home como ruta de respaldo de los usuarios autenticados. */}
                <Route path="*" element={
                    <ProtectedRoute ruta="*" usuario={usuario} />
                } />
            </Routes>
            {!esPersonal(usuario) && <Footer />}
        </Router>
    );
}

export default App;
