import React, { useState } from 'react';

export default function PanelPaciente() {
    const [asistenciaConfirmada, setAsistenciaConfirmada] = useState(false);

    // Formulario de agendamiento
    const [nutricionista, setNutricionista] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');

    // Citas agendadas
    const [citas, setCitas] = useState([
        { id: 1, fechaHora: 'Mañana 10:00', profesional: 'Dra. M. González', estado: 'Confirmada' }
    ]);

    // Modal de reagendamiento
    const [citaEnModificacionId, setCitaEnModificacionId] = useState(null);
    const [modFecha, setModFecha] = useState('');
    const [modHora, setModHora] = useState('');

    // Lógica equivalente a confirmarAsistencia()
    const handleConfirmarAsistencia = () => {
        alert('¡Asistencia confirmada exitosamente! Te esperamos en la clínica.');
        setAsistenciaConfirmada(true);
    };

    // Lógica equivalente a agregarAgendamientoPaciente()
    const handleAgendarCita = (e) => {
        e.preventDefault();
        const nuevaCita = {
            id: Date.now(),
            fechaHora: `${fecha} ${hora}`,
            profesional: nutricionista,
            estado: 'Confirmada'
        };
        setCitas([...citas, nuevaCita]);
        setNutricionista('');
        setFecha('');
        setHora('');
        alert('¡Cita agendada exitosamente! Se ha activado el recordatorio automático.');
    };

    // Lógica equivalente a cancelarCita()
    const handleCancelarCita = (id) => {
        if (window.confirm('¿Está seguro que desea cancelar esta cita?')) {
            setCitas(citas.filter(c => c.id !== id));
        }
    };

    // Lógica equivalente a confirmarReagendamiento()
    const handleConfirmarReagendamiento = () => {
        if (!modFecha || !modHora) {
            alert('Por favor selecciona una fecha y hora válidas.');
            return;
        }

        setCitas(citas.map(c => 
            c.id === citaEnModificacionId 
                ? { ...c, fechaHora: `${modFecha} ${modHora}`, estado: 'En espera de reagendamiento' } 
                : c
        ));

        alert(`Solicitud enviada. Tu cita ha sido modificada para el ${modFecha} a las ${modHora} hrs y se encuentra "En espera de reagendamiento".`);
        setModFecha('');
        setModHora('');
    };

    return (
        <main className="container my-4">
            <div className="alert alert-info d-flex flex-column flex-md-row justify-content-between align-items-center shadow-sm">
                <div>
                    <strong>¡Recordatorio automático!</strong> Tienes una cita programada para mañana a las 10:00 hrs con la Dra. María González. Se ha enviado un mensaje de confirmación a tu teléfono.
                </div>
                {!asistenciaConfirmada && (
                    <button className="btn btn-sm btn-success mt-2 mt-md-0 ms-md-3" onClick={handleConfirmarAsistencia}>
                        Confirmar Asistencia
                    </button>
                )}
            </div>

            <h4 className="mb-3">Nutricionistas Disponibles</h4>
            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <div className="card-custom p-3 text-center h-100">
                        <img src="/img/1nutri.jpg" alt="Dra. María González" className="img-nutri-card mb-2 mx-auto d-block" />
                        <h6>Dra. María González</h6>
                        <small className="text-muted">Pérdida de Peso</small>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card-custom p-3 text-center h-100">
                        <img src="/img/2nutri.png" alt="Dr. Carlos Rojas" className="img-nutri-card mb-2 mx-auto d-block" />
                        <h6>Dr. Carlos Rojas</h6>
                        <small className="text-muted">Salud Metabólica</small>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card-custom p-3 text-center h-100">
                        <img src="/img/3nutri.png" alt="Dra. Andrea Silva" className="img-nutri-card mb-2 mx-auto d-block" />
                        <h6>Dra. Andrea Silva</h6>
                        <small className="text-muted">Nutrición Deportiva</small>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card-custom p-3 text-center h-100">
                        <img src="/img/nutri4.jpg" alt="Dr. Felipe Morales" className="img-nutri-card mb-2 mx-auto d-block" />
                        <h6>Dr. Felipe Morales</h6>
                        <small className="text-muted">Alimentación Vegana</small>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card-custom p-4 mb-4">
                        <h4>Agendar Nueva Cita</h4>
                        <form onSubmit={handleAgendarCita}>
                            <div className="mb-3">
                                <label className="form-label">Seleccionar Especialista</label>
                                <select 
                                    className="form-select" 
                                    value={nutricionista} 
                                    onChange={(e) => setNutricionista(e.target.value)} 
                                    required
                                >
                                    <option value="">Elija profesional...</option>
                                    <option>Dra. María González</option>
                                    <option>Dr. Carlos Rojas</option>
                                    <option>Dra. Andrea Silva</option>
                                    <option>Dr. Felipe Morales</option>
                                </select>
                            </div>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label className="form-label">Fecha</label>
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        value={fecha} 
                                        onChange={(e) => setFecha(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <label className="form-label">Hora</label>
                                    <input 
                                        type="time" 
                                        className="form-control" 
                                        value={hora} 
                                        onChange={(e) => setHora(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-nutri w-100">Confirmar Cita</button>
                        </form>
                    </div>

                    <div className="card-custom p-4">
                        <h4 className="mb-3">Mis Citas Agendadas</h4>
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th>Fecha / Estado</th>
                                    <th>Profesional</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {citas.map((c) => (
                                    <tr key={c.id}>
                                        <td>
                                            {c.fechaHora}<br />
                                            {c.estado === 'En espera de reagendamiento' && (
                                                <span className="badge bg-warning text-dark mt-1">En espera de reagendamiento</span>
                                            )}
                                        </td>
                                        <td>{c.profesional}</td>
                                        <td>
                                            {asistenciaConfirmada ? (
                                                <span className="badge bg-success">Asistencia Confirmada</span>
                                            ) : (
                                                <>
                                                    <button 
                                                        className="btn btn-sm btn-outline-primary me-1"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#modalModificarCita"
                                                        onClick={() => setCitaEnModificacionId(c.id)}
                                                    >
                                                        Modificar
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleCancelarCita(c.id)}
                                                    >
                                                        Cancelar
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card-custom p-4 h-100">
                        <h4 className="mb-3">Mi Historial y Plan Alimenticio</h4>
                        <div className="mb-4 p-3 bg-light rounded border">
                            <h5 className="text-nutri">Plan Alimenticio Actual</h5>
                            <p className="mb-1"><strong>Objetivo:</strong> Reducción de grasa corporal.</p>
                            <p className="small text-muted">Indicaciones: 3 comidas principales, priorizar proteínas, reducir carbohidratos refinados. Tomar 2 litros de agua diarios.</p>
                            <button className="btn btn-sm btn-outline-success mt-2">Descargar Dieta PDF</button>
                        </div>

                        <div className="mb-4">
                            <h6 className="text-muted">Progreso hacia tu meta (65 kg)</h6>
                            <div className="progress" style={{ height: '22px' }}>
                                <div className="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: '70%' }}>
                                    Faltan 7.5 kg
                                </div>
                            </div>
                        </div>

                        <h5>Evolución de Mis Mediciones</h5>
                        <div className="table-responsive">
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Fecha de Control</th>
                                        <th>Peso (kg)</th>
                                        <th>IMC</th>
                                        <th>Cintura (cm)</th>
                                        <th>Avance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>15/09/2026</td>
                                        <td>72.5</td>
                                        <td>25.1</td>
                                        <td>82</td>
                                        <td className="text-success fw-bold">-1.5 kg</td>
                                    </tr>
                                    <tr>
                                        <td>15/08/2026</td>
                                        <td>74.0</td>
                                        <td>25.6</td>
                                        <td>84</td>
                                        <td>Inicio</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Reagendar */}
            <div className="modal fade" id="modalModificarCita" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-warning">
                            <h5 className="modal-title text-dark">Modificar Cita</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Nueva Fecha</label>
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        value={modFecha} 
                                        onChange={(e) => setModFecha(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Nueva Hora</label>
                                    <input 
                                        type="time" 
                                        className="form-control" 
                                        value={modHora} 
                                        onChange={(e) => setModHora(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleConfirmarReagendamiento}>
                                Confirmar Cambio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}