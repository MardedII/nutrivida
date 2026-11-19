import React from 'react';

import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom';

import './App.css';

import Navbar from './component/navbar';
import Footer from './component/Footer';
import ProtectedRoute from './component/ProtectedRoute';

import Inicio from './pages/Inicio';
import Agendar from './pages/Agendar';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Registro from './pages/Registro';

import PanelAdmin from './pages/PanelAdmin';
import PanelMedico from './pages/PanelMedico';
import PanelPaciente from './pages/PanelPaciente';

function App() {
    return (
        <Router>
            <Navbar />

            <Routes>
                {/* Páginas públicas */}
                <Route path="/" element={<Inicio />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />

                {/* Agendamiento: pacientes autenticados */}
                <Route
                    path="/agendar"
                    element={
                        <ProtectedRoute roles={['paciente']}>
                            <Agendar />
                        </ProtectedRoute>
                    }
                />

                {/* Administrador */}
                <Route
                    path="/panel-admin"
                    element={
                        <ProtectedRoute roles={['admin']}>
                            <PanelAdmin />
                        </ProtectedRoute>
                    }
                />

                {/* Nutricionista */}
                <Route
                    path="/panel-medico"
                    element={
                        <ProtectedRoute roles={['nutricionista']}>
                            <PanelMedico />
                        </ProtectedRoute>
                    }
                />

                {/* Paciente */}
                <Route
                    path="/panel-paciente"
                    element={
                        <ProtectedRoute roles={['paciente']}>
                            <PanelPaciente />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={<Inicio />}
                />
            </Routes>

            <Footer />
        </Router>
    );
}

export default App;