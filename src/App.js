import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './component/navbar';
import Footer from './component/Footer';
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
                <Route path="/" element={<Inicio />} />
                <Route path="/agendar" element={<Agendar />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/panel-admin" element={<PanelAdmin />} />
                <Route path="/panel-medico" element={<PanelMedico />} />
                <Route path="/panel-paciente" element={<PanelPaciente />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;