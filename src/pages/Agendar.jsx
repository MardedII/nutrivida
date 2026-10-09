import { useState } from 'react';

export default function Agendar() {
    const [citas, setCitas] = useState([
        { id: 1, paciente: 'Juan Pérez', nutricionista: 'Dra. María González', fechaHora: '2026-10-05 10:00', estado: 'Confirmada' }
    ]);
    const [form, setForm] = useState({ nombre: '', nutricionista: '', motivo: '', fecha: '', hora: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        const nuevaCita = {
            id: Date.now(),
            paciente: form.nombre,
            nutricionista: form.nutricionista,
            fechaHora: `${form.fecha} ${form.hora}`,
            estado: 'Confirmada'
        };
        setCitas([...citas, nuevaCita]);
        setForm({ nombre: '', nutricionista: '', motivo: '', fecha: '', hora: '' });
        alert('¡Cita agendada exitosamente!');
    };

    const cancelarCita = (id) => {
    if (window.confirm('¿Está seguro que desea cancelar esta cita?')) {
        setCitas(citas.filter(c => c.id !== id));
    }
};

    return (
        <main className="container my-5">
            <div className="row">
                <div className="col-lg-5 mb-4">
                    <div className="card card-custom p-4">
                        <h4 className="card-title text-nutri mb-3"><i className="bi bi-calendar-event me-2"></i>Solicitar Nueva Cita</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Nombre Completo del Paciente</label>
                                <input type="text" className="form-control" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Seleccionar Nutricionista</label>
                                <select className="form-select" value={form.nutricionista} onChange={e => setForm({...form, nutricionista: e.target.value})} required>
                                    <option value="" disabled>Elija un profesional...</option>
                                    <option value="Dra. María González">Dra. María González (Pérdida de Peso)</option>
                                    <option value="Dr. Carlos Rojas">Dr. Carlos Rojas (Control Metabólico)</option>
                                    <option value="Dra. Andrea Silva">Dra. Andrea Silva (Nutrición Deportiva)</option>
                                    <option value="Dr. Felipe Morales">Dr. Felipe Morales (Alimentación Vegana)</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Motivo de la Consulta</label>
                                <textarea className="form-control" rows="2" value={form.motivo} onChange={e => setForm({...form, motivo: e.target.value})} required></textarea>
                            </div>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label className="form-label">Fecha</label>
                                    <input type="date" className="form-control" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} required />
                                </div>
                                <div className="col-6 mb-3">
                                    <label className="form-label">Hora</label>
                                    <input type="time" className="form-control" value={form.hora} onChange={e => setForm({...form, hora: e.target.value})} required />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-success w-100 mt-2">
                                <i className="bi bi-check-circle me-1"></i> Confirmar Solicitud
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-lg-7">
                    <div className="card card-custom p-4">
                        <h4 className="card-title text-nutri mb-3"><i className="bi bi-clock-history me-2"></i>Gestión de Citas Agendadas</h4>
                        <div className="alert alert-info d-flex align-items-center" role="alert">
                            <i className="bi bi-bell-fill fs-4 me-3"></i>
                            <div><strong>Recordatorio Automático:</strong> Recibirá una notificación 24 horas antes de su cita.</div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Paciente</th>
                                        <th>Nutricionista</th>
                                        <th>Fecha / Hora</th>
                                        <th>Estado</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {citas.map(c => (
                                        <tr key={c.id}>
                                            <td>{c.paciente}</td>
                                            <td>{c.nutricionista}</td>
                                            <td>{c.fechaHora}</td>
                                            <td><span className="badge bg-warning text-dark status-badge">{c.estado}</span></td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => cancelarCita(c.id)}>
                                                    <i className="bi bi-x-circle"></i> Cancelar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}