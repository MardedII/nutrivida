import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { validarRegistro } from '../utils/validaciones';

export default function Registro() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombre: '',
        rut: '',
        correo: '',
        telefono: '',
        fechaNac: '',
        genero: '',
        clave: '',
        rol: 'paciente',
        aceptoTerminos: false
    });

    const handleSubmitRegistro = (e) => {
        e.preventDefault();
        
        if (!validarRegistro(
            form.nombre, 
            form.rut, 
            form.correo, 
            form.telefono, 
            form.fechaNac, 
            form.genero, 
            form.clave, 
            form.rol, 
            form.aceptoTerminos
        )) return;

        alert(`¡Registro exitoso para ${form.nombre}! Ya puede iniciar sesión.`);
        navigate('/login');
    };

    return (
        <main className="container my-5">
            <div className="row card-custom g-0 overflow-hidden shadow-lg mx-auto" style={{ maxWidth: '950px' }}>
                <div className="col-lg-5 d-none d-lg-block">
                    <img 
                        src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=700&q=80" 
                        className="h-100 w-100" 
                        style={{ objectFit: 'cover' }} 
                        alt="Nutrición Saludable" 
                    />
                </div>

                <div className="col-lg-7 p-4 p-md-5 bg-white">
                    <div className="text-center mb-4">
                        <h3 className="fw-bold text-nutri">Registro de Usuario</h3>
                        <p className="text-muted small">Cree su cuenta para acceder a agendamientos y fichas médicas</p>
                    </div>

                    <form onSubmit={handleSubmitRegistro}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Nombre Completo</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Ej. Camila Silva" 
                                    value={form.nombre}
                                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                    required 
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">RUT / Documento</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Ej. 12.345.678-9" 
                                    value={form.rut}
                                    onChange={(e) => setForm({ ...form, rut: e.target.value })}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    placeholder="correo@ejemplo.com" 
                                    value={form.correo}
                                    onChange={(e) => setForm({ ...form, correo: e.target.value })}
                                    required 
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Teléfono</label>
                                <input 
                                    type="tel" 
                                    className="form-control" 
                                    placeholder="+56 9 1234 5678" 
                                    value={form.telefono}
                                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Fecha de Nacimiento</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    value={form.fechaNac}
                                    onChange={(e) => setForm({ ...form, fechaNac: e.target.value })}
                                    required 
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Género</label>
                                <select 
                                    className="form-select" 
                                    value={form.genero}
                                    onChange={(e) => setForm({ ...form, genero: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Seleccione género...</option>
                                    <option value="Femenino">Femenino</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Otro">Otro / Prefiero no decir</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Contraseña</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    placeholder="Mínimo 6 caracteres" 
                                    value={form.clave}
                                    onChange={(e) => setForm({ ...form, clave: e.target.value })}
                                    required 
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Perfil de Usuario</label>
                                <select 
                                    className="form-select" 
                                    value={form.rol}
                                    onChange={(e) => setForm({ ...form, rol: e.target.value })}
                                    required
                                >
                                    <option value="paciente">Paciente</option>
                                    <option value="medico">Nutricionista</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-check mb-4 mt-2">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="regTerminos" 
                                checked={form.aceptoTerminos}
                                onChange={(e) => setForm({ ...form, aceptoTerminos: e.target.checked })}
                                required 
                            />
                            <label className="form-check-label small text-secondary" htmlFor="regTerminos">
                                He leído y acepto los <a href="#terms" className="text-success fw-bold">Términos de Servicio</a> y las <a href="#privacy" className="text-success fw-bold">Políticas de Salud</a> de la Clínica NutriVida.
                            </label>
                        </div>

                        <button type="submit" className="btn btn-nutri w-100 py-2">
                            <i className="bi bi-check-circle me-1"></i> Crear Cuenta
                        </button>
                    </form>

                    <div className="text-center mt-3">
                        <small className="text-muted">¿Ya tiene cuenta? <Link to="/login" className="text-success fw-bold">Inicie Sesión aquí</Link></small>
                    </div>
                </div>
            </div>
        </main>
    );
}