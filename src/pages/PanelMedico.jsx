
import React, { useState, useEffect } from 'react';

import {
    obtenerSesion,
    obtenerPermisos,
    guardarPermisos,
    obtenerFaltas
} from '../utils/auth';

export default function PanelMedico() {

    // ==========================================
    // SESIÓN Y PERMISOS DEL NUTRICIONISTA
    // ==========================================

    const sesion = obtenerSesion();

    const [permisos, setPermisos] = useState(() => obtenerPermisos());
    const [faltas, setFaltas] = useState(() => obtenerFaltas());

    const [mostrarSolicitud, setMostrarSolicitud] = useState(false);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [justificativo, setJustificativo] = useState('');

    const [mensajePermiso, setMensajePermiso] = useState('');
    const [errorPermiso, setErrorPermiso] = useState('');

    useEffect(() => {
        const refrescar = () => {
            setPermisos(obtenerPermisos());
            setFaltas(obtenerFaltas());
        };

        window.addEventListener('focus', refrescar);
        window.addEventListener('storage', refrescar);

        return () => {
            window.removeEventListener('focus', refrescar);
            window.removeEventListener('storage', refrescar);
        };
    }, []);

    const misPermisos = permisos.filter(
        p => String(p.nutricionistaId) === String(sesion?.id)
    );

    const misFaltas = faltas.filter(
        f => String(f.nutricionistaId) === String(sesion?.id)
    );

    const formatearFecha = fecha => {
        if (!fecha) return '-';

        const partes = String(fecha).split('-');

        if (partes.length === 3) {
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }

        return fecha;
    };

    const solicitarPermiso = e => {
        e.preventDefault();

        setErrorPermiso('');
        setMensajePermiso('');

        if (!sesion || sesion.rol !== 'nutricionista') {
            setErrorPermiso(
                'Debes iniciar sesión como nutricionista para solicitar un permiso.'
            );
            return;
        }

        if (!fechaInicio || !fechaFin) {
            setErrorPermiso('Debes seleccionar las fechas del permiso.');
            return;
        }

        if (fechaFin < fechaInicio) {
            setErrorPermiso(
                'La fecha de término no puede ser anterior a la fecha de inicio.'
            );
            return;
        }

        if (!justificativo.trim()) {
            setErrorPermiso('Debes ingresar un justificativo.');
            return;
        }

        const permisosActuales = obtenerPermisos();

        const solicitudSolapada = permisosActuales.some(p =>
            String(p.nutricionistaId) === String(sesion.id) &&
            p.estado !== 'Rechazado' &&
            fechaInicio <= p.fechaFin &&
            fechaFin >= p.fechaInicio
        );

        if (solicitudSolapada) {
            setErrorPermiso(
                'Ya tienes una solicitud pendiente o aprobada para esas fechas.'
            );
            return;
        }

        const nuevaSolicitud = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            nutricionistaId: sesion.id,
            nombre: sesion.nombre,
            correo: sesion.correo,
            fechaInicio,
            fechaFin,
            justificativo: justificativo.trim(),
            estado: 'Pendiente',
            fechaSolicitud: new Date().toISOString()
        };

        const actualizados = [
            nuevaSolicitud,
            ...permisosActuales
        ];

        guardarPermisos(actualizados);
        setPermisos(actualizados);

        setFechaInicio('');
        setFechaFin('');
        setJustificativo('');
        setMostrarSolicitud(false);

        setMensajePermiso(
            'Tu solicitud de permiso fue enviada correctamente al administrador.'
        );
    };

    // ==========================================
    // FUNCIONALIDADES DE FICHA CLÍNICA
    // ==========================================

    const [estadoAtencion, setEstadoAtencion] = useState('Por Atender');

    const [selectPaciente, setSelectPaciente] = useState('Camila Silva');

    const [peso, setPeso] = useState('');
    const [talla, setTalla] = useState('');
    const [cintura, setCintura] = useState('');
    const [indicaciones, setIndicaciones] = useState('');

    const [filtroBuscar, setFiltroBuscar] = useState('');

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

    const [modalInfo, setModalInfo] = useState(null);

    const pesoNum = parseFloat(peso) || 0;
    const tallaNum = parseFloat(talla) || 0;

    const imcCalculado = pesoNum > 0 && tallaNum > 0
        ? (pesoNum / ((tallaNum / 100) ** 2)).toFixed(1)
        : '0.0';

    const handleIniciarAtencion = () => {
        setEstadoAtencion('Atendiendo');
    };

    const handleGuardarFicha = e => {
        e.preventDefault();

        if (pesoNum <= 0 || tallaNum <= 0) {
            alert('El peso y la talla deben ser mayores que cero.');
            return;
        }

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

        setPacientesHistorial(prev => [
            ...prev,
            nuevaFicha
        ]);

        setPeso('');
        setTalla('');
        setCintura('');
        setIndicaciones('');

        alert(
            `Mediciones guardadas exitosamente en la ficha digital de ${selectPaciente}.`
        );
    };

    // ==========================================
    // INTERFAZ
    // ==========================================

    return (
        <main className="container my-5">

            {/* =====================================
                MIS PERMISOS Y ASISTENCIA
            ===================================== */}

            <div className="card card-custom p-4 mb-4">

                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                    <div>
                        <h4 className="mb-1">
                            <i className="bi bi-calendar2-check me-2"></i>
                            Mis permisos y asistencia
                        </h4>

                        <p className="text-muted mb-0">
                            Solicita permisos y consulta tus faltas laborales.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {
                            setMostrarSolicitud(!mostrarSolicitud);
                            setErrorPermiso('');
                        }}
                    >
                        <i className="bi bi-file-earmark-plus me-2"></i>

                        {mostrarSolicitud
                            ? 'Cerrar formulario'
                            : 'Solicitar permiso'}
                    </button>
                </div>

                {mensajePermiso && (
                    <div className="alert alert-success">
                        {mensajePermiso}
                    </div>
                )}

                {errorPermiso && (
                    <div className="alert alert-danger">
                        {errorPermiso}
                    </div>
                )}

                {/* FORMULARIO SOLICITAR PERMISO */}

                {mostrarSolicitud && (
                    <form
                        className="border rounded p-3 mb-4"
                        onSubmit={solicitarPermiso}
                    >
                        <h5 className="mb-3">
                            Formulario de solicitud de permiso
                        </h5>

                        <div className="row">

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Nombre completo
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={sesion?.nombre || ''}
                                    disabled
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Correo electrónico
                                </label>

                                <input
                                    type="email"
                                    className="form-control"
                                    value={sesion?.correo || ''}
                                    disabled
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Fecha de inicio
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    value={fechaInicio}
                                    onChange={e => {
                                        const nuevaFecha = e.target.value;

                                        setFechaInicio(nuevaFecha);

                                        if (!fechaFin || fechaFin < nuevaFecha) {
                                            setFechaFin(nuevaFecha);
                                        }
                                    }}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Fecha de término
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    min={fechaInicio || undefined}
                                    value={fechaFin}
                                    onChange={e => setFechaFin(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label">
                                    Justificativo del permiso
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="4"
                                    maxLength="2000"
                                    placeholder="Explica el motivo de tu solicitud. Por ejemplo: trámite personal, consulta médica, situación familiar..."
                                    value={justificativo}
                                    onChange={e => setJustificativo(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="d-flex flex-wrap gap-2">
                            <button
                                type="submit"
                                className="btn btn-success"
                            >
                                <i className="bi bi-send me-2"></i>
                                Enviar solicitud
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setMostrarSolicitud(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}

                {/* HISTORIAL DE SOLICITUDES */}

                <h5 className="mb-3">
                    <i className="bi bi-clock-history me-2"></i>
                    Historial de mis solicitudes
                </h5>

                <div className="table-responsive mb-4">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Fecha inicio</th>
                                <th>Fecha término</th>
                                <th>Justificativo</th>
                                <th>Estado</th>
                            </tr>
                        </thead>

                        <tbody>
                            {misPermisos.map(p => (
                                <tr key={p.id}>
                                    <td>{formatearFecha(p.fechaInicio)}</td>
                                    <td>{formatearFecha(p.fechaFin)}</td>

                                    <td style={{ whiteSpace: 'pre-wrap' }}>
                                        {p.justificativo}
                                    </td>

                                    <td>
                                        <span className={`badge ${
                                            p.estado === 'Aprobado'
                                                ? 'bg-success'
                                                : p.estado === 'Rechazado'
                                                    ? 'bg-danger'
                                                    : 'bg-warning text-dark'
                                        }`}>
                                            {p.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            {misPermisos.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted py-3">
                                        Todavía no has solicitado permisos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* HISTORIAL DE FALTAS */}

                <h5 className="mb-3">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    Mis faltas laborales
                </h5>

                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Fecha</th>
                                <th>Tipo de falta</th>
                                <th>Observaciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {misFaltas.map(f => (
                                <tr key={f.id}>
                                    <td>{formatearFecha(f.fecha)}</td>

                                    <td>
                                        <span className={`badge ${
                                            f.tipo === 'Justificada'
                                                ? 'bg-info text-dark'
                                                : 'bg-danger'
                                        }`}>
                                            {f.tipo}
                                        </span>
                                    </td>

                                    <td>{f.motivo}</td>
                                </tr>
                            ))}

                            {misFaltas.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="text-center text-muted py-3">
                                        No tienes faltas laborales registradas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* =====================================
                AGENDA Y FICHAS CLÍNICAS
            ===================================== */}

            <div className="row">

                {/* COLUMNA IZQUIERDA */}

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
                                            <span className={`badge ${
                                                estadoAtencion === 'Atendiendo'
                                                    ? 'bg-primary'
                                                    : 'bg-warning text-dark'
                                            }`}>
                                                {estadoAtencion}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className={`btn btn-sm ${
                                                    estadoAtencion === 'Atendiendo'
                                                        ? 'btn-secondary'
                                                        : 'btn-success'
                                                }`}
                                                disabled={estadoAtencion === 'Atendiendo'}
                                                onClick={handleIniciarAtencion}
                                            >
                                                {estadoAtencion === 'Atendiendo'
                                                    ? 'En Proceso'
                                                    : 'Iniciar Atención'}
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* REGISTRAR FICHA CLÍNICA */}

                    <div className="card-custom p-4">
                        <h4>Registrar Ficha Clínica</h4>

                        <form onSubmit={handleGuardarFicha}>

                            <div className="mb-3">
                                <label className="form-label" htmlFor="ficha-paciente">
                                    Paciente Asignado
                                </label>

                                <select
                                    id="ficha-paciente"
                                    className="form-select"
                                    value={selectPaciente}
                                    onChange={e => setSelectPaciente(e.target.value)}
                                    required
                                >
                                    <option value="Camila Silva">Camila Silva</option>
                                    <option value="Juan Pérez">Juan Pérez</option>
                                    <option value="María Tapia">María Tapia</option>
                                </select>
                            </div>

                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label" htmlFor="ficha-peso">
                                        Peso (kg)
                                    </label>

                                    <input
                                        type="number"
                                        id="ficha-peso"
                                        min="0.1"
                                        step="0.1"
                                        className="form-control"
                                        value={peso}
                                        onChange={e => setPeso(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label" htmlFor="ficha-talla">
                                        Talla (cm)
                                    </label>

                                    <input
                                        type="number"
                                        id="ficha-talla"
                                        min="1"
                                        className="form-control"
                                        value={talla}
                                        onChange={e => setTalla(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label" htmlFor="ficha-cintura">
                                        Cintura (cm)
                                    </label>

                                    <input
                                        type="number"
                                        id="ficha-cintura"
                                        min="0"
                                        className="form-control"
                                        value={cintura}
                                        onChange={e => setCintura(e.target.value)}
                                    />
                                </div>
                            </div>

                            <p className="text-muted small mb-3">
                                IMC Calculado:{' '}

                                <strong className={
                                    parseFloat(imcCalculado) > 25
                                        ? 'text-danger fw-bold'
                                        : 'text-success fw-bold'
                                }>
                                    {imcCalculado}
                                </strong>
                            </p>

                            <div className="mb-3">
                                <label
                                    className="form-label"
                                    htmlFor="ficha-indicaciones"
                                >
                                    Plan Alimenticio / Indicaciones
                                </label>

                                <textarea
                                    id="ficha-indicaciones"
                                    className="form-control"
                                    rows="3"
                                    placeholder="3 comidas principales, proteínas altas..."
                                    value={indicaciones}
                                    onChange={e => setIndicaciones(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="btn btn-nutri w-100">
                                Guardar Ficha
                            </button>
                        </form>
                    </div>
                </div>

                {/* COLUMNA DERECHA */}

                <div className="col-md-7">

                    {/* HISTORIAL DE PACIENTES */}

                    <div className="card-custom p-4 mb-4">
                        <h4>Historial de Mis Pacientes</h4>

                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Buscar ficha de paciente en la clínica..."
                            value={filtroBuscar}
                            onChange={e => setFiltroBuscar(e.target.value)}
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
                                        .filter(p =>
                                            p.nombre.toLowerCase().includes(
                                                filtroBuscar.toLowerCase()
                                            )
                                        )
                                        .map((p, index) => (
                                            <tr key={index}>
                                                <td>{p.nombre}</td>
                                                <td>{p.fecha}</td>
                                                <td>{p.imc}</td>

                                                <td>
                                                    <span className="badge bg-secondary">
                                                        {p.medico}
                                                    </span>
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
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

                    {/* LISTA GENERAL DE PACIENTES */}

                    <div className="card-custom p-4">
                        <h4 className="mb-3">
                            Lista General de Pacientes
                        </h4>

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

                                        <td>
                                            +56 9 9123 4567
                                            <br />
                                            <small className="text-muted">
                                                camila.silva@gmail.com
                                            </small>
                                        </td>

                                        <td>Dra. María González</td>
                                        <td>
                                            <span className="badge bg-success">
                                                Activo
                                            </span>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>Juan Pérez</td>
                                        <td>15.432.109-8</td>

                                        <td>
                                            +56 9 8765 4321
                                            <br />
                                            <small className="text-muted">
                                                juan.perez@gmail.com
                                            </small>
                                        </td>

                                        <td>Dr. Carlos Rojas</td>
                                        <td>
                                            <span className="badge bg-success">
                                                Activo
                                            </span>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>María Tapia</td>
                                        <td>19.876.543-2</td>

                                        <td>
                                            +56 9 7654 3210
                                            <br />
                                            <small className="text-muted">
                                                mtapia@gmail.com
                                            </small>
                                        </td>

                                        <td>Dra. Andrea Silva</td>
                                        <td>
                                            <span className="badge bg-success">
                                                Activo
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* =====================================
                MODAL HISTORIAL DEL PACIENTE
            ===================================== */}

            <div
                className="modal fade"
                id="modalHistorialPaciente"
                tabIndex="-1"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header bg-nutri text-white">
                            <h5 className="modal-title">
                                Ficha Clínica: {modalInfo?.nombre}
                            </h5>

                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="modal"
                                aria-label="Cerrar"
                            />
                        </div>

                        <div className="modal-body">

                            <h6 className="text-nutri border-bottom pb-2 fw-bold">
                                Datos Personales Básicos
                            </h6>

                            <ul className="list-unstyled mb-3 small">
                                <li>
                                    <strong>RUT:</strong> {modalInfo?.rut}
                                </li>

                                <li>
                                    <strong>Teléfono:</strong> {modalInfo?.tel}
                                </li>

                                <li>
                                    <strong>Correo:</strong> {modalInfo?.correo}
                                </li>
                            </ul>

                            <h6 className="text-nutri border-bottom pb-2 fw-bold">
                                Últimas Mediciones
                            </h6>

                            <div className="row text-center mb-3">
                                <div className="col-4">
                                    <div className="p-2 bg-light rounded border">
                                        <small className="text-muted d-block">
                                            Peso
                                        </small>
                                        <strong>{modalInfo?.peso}</strong>
                                    </div>
                                </div>

                                <div className="col-4">
                                    <div className="p-2 bg-light rounded border">
                                        <small className="text-muted d-block">
                                            IMC
                                        </small>
                                        <strong>{modalInfo?.imc}</strong>
                                    </div>
                                </div>

                                <div className="col-4">
                                    <div className="p-2 bg-light rounded border">
                                        <small className="text-muted d-block">
                                            Cintura
                                        </small>
                                        <strong>{modalInfo?.cintura}</strong>
                                    </div>
                                </div>
                            </div>

                            <h6 className="text-nutri border-bottom pb-2 fw-bold">
                                Plan Alimenticio / Dieta Asignada
                            </h6>

                            <p className="small bg-light p-3 rounded border">
                                {modalInfo?.dieta}
                            </p>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                data-bs-dismiss="modal"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
