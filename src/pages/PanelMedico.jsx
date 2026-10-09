import React, { useState } from 'react';

export default function PanelMedico() {
    // Estado de la agenda de hoy
    const [estadoAtencion, setEstadoAtencion] = useState('Por Atender');

    // Formulario de ficha clínica
    const [selectPaciente, setSelectPaciente] = useState('Camila Silva');
    const [peso, setPeso] = useState('');
    const [talla, setTalla] = useState('');
    const [cintura, setCintura] = useState('');
    const [indicaciones, setIndicaciones] = useState('');

    // Filtro de búsqueda
    const [filtroBuscar, setFiltroBuscar] = useState('');

    // Lista de pacientes en historial
    const [pacientesHistorial, setPacientesHistorial] = useState([
        {
            nombre: 'Camila Silva',
            fecha: '15/09/2026',
            imc: '25.1',
            medico: 'Dra. María González',
            peso: '72.5 kg',
            cintura: '82 cm',
            dieta: '3 comidas principales, priorizar proteínas, reducir carbohidratos refinados. Tomar 2 litros de agua diarios.',
            rut: '18.765.432-1',
            tel: '+56 9 9123 4567',
            correo: 'camila.silva@gmail.com'
        }
    ]);

    // Datos del modal
    const [modalInfo, setModalInfo] = useState(null);

    // Cálculo dinámico de IMC en tiempo real
    const pesoNum = parseFloat(peso) || 0;
    const tallaNum = parseFloat(talla) || 0;
    const imcCalculado = (pesoNum > 0 && tallaNum > 0) 
        ? (pesoNum / ((tallaNum / 100) ** 2)).toFixed(1) 
        : '0.0';

    // Lógica equivalente a iniciarAtencion()
    const handleIniciarAtencion = () => {
        setEstadoAtencion('Atendiendo');
    };

    // Lógica equivalente a agregarEvaluacionMedico()
    const handleGuardarFicha = (e) => {
        e.preventDefault();
        const nuevaFicha = {
            nombre: selectPaciente,
            fecha: new Date().toLocaleDateString('es-CL'),
            imc: imcCalculado,
            medico: 'Dra. María González',
            peso: `${peso} kg`,
            cintura: cintura ? `${cintura} cm` : '82 cm',
            dieta: indicaciones || '3 comidas principales, priorizar proteínas.',
            rut: '18.765.432-1',
            tel: '+56 9 9123 4567',
            correo: 'camila.silva@gmail.com'
        };

        setPacientesHistorial([...pacientesHistorial, nuevaFicha]);
        setPeso('');
        setTalla('');
        setCintura('');
        setIndicaciones('');
        alert(`Mediciones guardadas exitosamente en la ficha digital de ${selectPaciente}.`);
    };

    return (
        <main className="container my-5">
            <div className="row">
                {/* Columna Izquierda */}
                <div className="col-md-5 mb-4">
                    <div className="card-custom p-4 mb-4">
                        <h4>Mi Agenda de Hoy (Pacientes Asignados)</h4>
                        <div className="table-responsive">
                            <table className="table table-sm align-middle">
                                <thead>
                                    <tr>
                                        <th>Hora</th>
                                        <th>Paciente</th>
                                        <th>Motivo</th>
                                        <th>Estado</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>10:00 hrs</td>
                                        <td>Camila Silva</td>
                                        <td>Control Mensual</td>
                                        <td>
                                            <span className={`badge ${estadoAtencion === 'Atendiendo' ? 'bg-primary' : 'bg-warning text-dark'}`}>
                                                {estadoAtencion}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                className={`btn btn-sm ${estadoAtencion === 'Atendiendo' ? 'btn-secondary disabled' : 'btn-success'}`}
                                                onClick={handleIniciarAtencion}
                                            >
                                                {estadoAtencion === 'Atendiendo' ? 'En Proceso' : 'Iniciar Atención'}
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="card-custom p-4">
                        <h4>Registrar Ficha Clínica</h4>
                        <form onSubmit={handleGuardarFicha}>
                            <div className="mb-3">
                                <label className="form-label">Paciente Asignado</label>
                                <select 
                                    className="form-select" 
                                    value={selectPaciente} 
                                    onChange={(e) => setSelectPaciente(e.target.value)} 
                                    required
                                >
                                    <option value="Camila Silva">Camila Silva</option>
                                    <option value="Juan Pérez">Juan Pérez</option>
                                    <option value="María Tapia">María Tapia</option>
                                </select>
                            </div>

                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Peso (kg)</label>
                                    <input 
                                        type="number" 
                                        step="0.1" 
                                        className="form-control" 
                                        value={peso} 
                                        onChange={(e) => setPeso(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Talla (cm)</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        value={talla} 
                                        onChange={(e) => setTalla(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Cintura (cm)</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        value={cintura} 
                                        onChange={(e) => setCintura(e.target.value)} 
                                    />
                                </div>
                            </div>

                            <p className="text-muted small mb-3">
                                IMC Calculado: {' '}
                                <strong className={parseFloat(imcCalculado) > 25 ? 'text-danger fw-bold' : 'text-success fw-bold'}>
                                    {imcCalculado}
                                </strong>
                            </p>

                            <div className="mb-3">
                                <label className="form-label">Plan Alimenticio / Indicaciones</label>
                                <textarea 
                                    className="form-control" 
                                    rows="3" 
                                    placeholder="3 comidas principales, proteínas altas..."
                                    value={indicaciones}
                                    onChange={(e) => setIndicaciones(e.target.value)}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-nutri w-100">Guardar Ficha</button>
                        </form>
                    </div>
                </div>

                {/* Columna Derecha */}
                <div className="col-md-7">
                    <div className="card-custom p-4 mb-4">
                        <h4>Historial de Mis Pacientes</h4>
                        <input 
                            type="text" 
                            className="form-control mb-3" 
                            placeholder="Buscar ficha de paciente en la clínica..." 
                            value={filtroBuscar}
                            onChange={(e) => setFiltroBuscar(e.target.value)}
                        />
                        
                        <div className="table-responsive">
                            <table className="table table-striped align-middle">
                                <thead className="table-success">
                                    <tr>
                                        <th>Paciente</th>
                                        <th>Último Control</th>
                                        <th>IMC</th>
                                        <th>Atendido por</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pacientesHistorial
                                        .filter(p => p.nombre.toLowerCase().includes(filtroBuscar.toLowerCase()))
                                        .map((p, index) => (
                                            <tr key={index}>
                                                <td>{p.nombre}</td>
                                                <td>{p.fecha}</td>
                                                <td>{p.imc}</td>
                                                <td><span className="badge bg-secondary">{p.medico}</span></td>
                                                <td>
                                                    <button 
                                                        className="btn btn-sm btn-outline-info"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#modalHistorialPaciente"
                                                        onClick={() => setModalInfo(p)}
                                                    >
                                                        Historial
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="card-custom p-4">
                        <h4 className="mb-3">Lista General de Pacientes</h4>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Nombre</th>
                                        <th>RUT</th>
                                        <th>Contacto</th>
                                        <th>Nutricionista Asignado</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Camila Silva</td>
                                        <td>18.765.432-1</td>
                                        <td>+56 9 9123 4567<br/><small className="text-muted">camila.silva@gmail.com</small></td>
                                        <td>Dra. María González</td>
                                        <td><span className="badge bg-success">Activo</span></td>
                                    </tr>
                                    <tr>
                                        <td>Juan Pérez</td>
                                        <td>15.432.109-8</td>
                                        <td>+56 9 8765 4321<br/><small className="text-muted">juan.perez@gmail.com</small></td>
                                        <td>Dr. Carlos Rojas</td>
                                        <td><span className="badge bg-success">Activo</span></td>
                                    </tr>
                                    <tr>
                                        <td>María Tapia</td>
                                        <td>19.876.543-2</td>
                                        <td>+56 9 7654 3210<br/><small className="text-muted">mtapia@gmail.com</small></td>
                                        <td>Dra. Andrea Silva</td>
                                        <td><span className="badge bg-success">Activo</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Historial */}
            <div className="modal fade" id="modalHistorialPaciente" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-nutri text-white">
                            <h5 className="modal-title">Ficha Clínica: {modalInfo?.nombre}</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <h6 className="text-nutri border-bottom pb-2 fw-bold">Datos Personales Básicos</h6>
                            <ul className="list-unstyled mb-3 small">
                                <li><strong>RUT:</strong> {modalInfo?.rut}</li>
                                <li><strong>Teléfono:</strong> {modalInfo?.tel}</li>
                                <li><strong>Correo:</strong> {modalInfo?.correo}</li>
                            </ul>

                            <h6 className="text-nutri border-bottom pb-2 fw-bold">Últimas Mediciones</h6>
                            <div className="row text-center mb-3">
                                <div className="col-4">
                                    <div className="p-2 bg-light rounded border">
                                        <small className="text-muted d-block">Peso</small>
                                        <strong>{modalInfo?.peso}</strong>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="p-2 bg-light rounded border">
                                        <small className="text-muted d-block">IMC</small>
                                        <strong>{modalInfo?.imc}</strong>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="p-2 bg-light rounded border">
                                        <small className="text-muted d-block">Cintura</small>
                                        <strong>{modalInfo?.cintura}</strong>
                                    </div>
                                </div>
                            </div>

                            <h6 className="text-nutri border-bottom pb-2 fw-bold">Plan Alimenticio / Dieta Asignada</h6>
                            <p className="small bg-light p-3 rounded border">{modalInfo?.dieta}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}