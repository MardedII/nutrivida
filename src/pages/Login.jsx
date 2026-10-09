import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validarLogin } from '../utils/validaciones';

export default function Login() {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [rol, setRol] = useState('paciente');

    const handleLogin = (e) => {
        e.preventDefault();
        if (!validarLogin(correo, clave)) return;

        if (rol === 'paciente') navigate('/panel-paciente');
        else if (rol === 'medico') navigate('/panel-medico');
        else if (rol === 'admin') navigate('/panel-admin');
    };

    return (
        <main className="container my-5">
            <div className="card card-custom p-4 mx-auto" style={{ maxWidth: '480px' }}>
                <div className="text-center mb-4">
                    <i className="bi bi-person-circle fs-1 text-success"></i>
                    <h3 className="fw-bold mt-2">Inicio de Sesión</h3>
                    <p className="text-muted small">Seleccione su perfil de acceso</p>
                </div>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Seleccionar Perfil / Rol</label>
                        <select className="form-select" value={rol} onChange={e => setRol(e.target.value)} required>
                            <option value="paciente">Paciente / Cliente</option>
                            <option value="medico">Nutricionista / Médico</option>
                            <option value="admin">Administrador del Sistema</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Correo Electrónico</label>
                        <input type="email" className="form-control" placeholder="correo@nutrivida.cl" value={correo} onChange={e => setCorreo(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input type="password" className="form-control" placeholder="••••••••" value={clave} onChange={e => setClave(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-nutri w-100 py-2 mt-2">
                        <i className="bi bi-box-arrow-in-right me-1"></i> Ingresar al Sistema
                    </button>
                </form>
            </div>
        </main>
    );
}