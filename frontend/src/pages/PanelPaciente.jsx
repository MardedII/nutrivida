
import React, { useState } from 'react';

import { obtenerSesion } from '../utils/auth';
import { citasApi } from '../services/api';
import { useCitas,useCatalogo,useOcupados,HORARIOS,inicioCita,horarioValido,normalizarCita } from '../utils/useDatos';

const fechaLocal = () => {
    const hoy = new Date();

    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
};

const formatearFecha = fecha => {
    if (!fecha) return 'Sin fecha';

    const partes = String(fecha).split('-');

    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return fecha;
};

const obtenerFechaHora = cita => {
    if (!cita.fecha || !cita.hora) return null;

    const fecha = new Date(`${cita.fecha}T${cita.hora}:00`);

    if (Number.isNaN(fecha.getTime())) return null;

    return fecha;
};

const normalizarCorreo = correo =>
    String(correo || '').trim().toLowerCase();

// Comprueba que la cita pertenece al paciente autenticado.
const perteneceAlPaciente = (cita, usuario) => {
    if (!usuario) return false;

    // Preferimos comparar el ID del propietario.
    if (cita.pacienteId !== undefined && cita.pacienteId !== null) {
        return String(cita.pacienteId) === String(usuario.perfilId);
    }

    // Compatibilidad con citas antiguas que solo tienen correo.
    if (cita.correoPaciente) {
        return normalizarCorreo(cita.correoPaciente) ===
            normalizarCorreo(usuario.correo);
    }

    // No mostramos citas sin un propietario identificable.
    return false;
};

const claseEstado = estado => {
    switch (estado) {
        case 'Confirmada':
            return 'bg-success';

        case 'Pendiente':
            return 'bg-warning text-dark';

        case 'Completada':
            return 'bg-primary';

        case 'Inasistencia':
            return 'bg-danger';

        case 'Cancelada':
            return 'bg-secondary';

        case 'Reprogramación solicitada':
            return 'bg-info text-dark';

        default:
            return 'bg-secondary';
    }
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

export default function PanelPaciente() {

    const usuario = obtenerSesion();

    // ==========================================
    // ESTADOS DEL PACIENTE
    // ==========================================



    const [nutricionista, setNutricionista] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');

    const [citaEnModificacionId, setCitaEnModificacionId] = useState(null);
    const [modFecha, setModFecha] = useState('');
    const [modHora, setModHora] = useState('');

    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    // ==========================================
    // ACTUALIZAR INFORMACIÓN
    // ==========================================

    const [citas,setCitas]=useCitas(setError);
    const nutricionistasDisponibles=useCatalogo(setError);
    const ocupados=useOcupados(nutricionista,fecha,setError);
    const [guardando,setGuardando]=useState(false);

    // ==========================================
    // CITAS DEL PACIENTE ACTUAL
    // ==========================================

    const misCitas = citas
        .filter(cita => perteneceAlPaciente(cita, usuario))
        .sort((a, b) => {
            const fechaA = obtenerFechaHora(a);
            const fechaB = obtenerFechaHora(b);

            if (!fechaA || !fechaB) return 0;

            return fechaA.getTime() - fechaB.getTime();
        });

    const citasActivas = misCitas.filter(cita =>
        ['Pendiente', 'Confirmada', 'Reprogramación solicitada']
            .includes(cita.estado)
    );

    const citasFinalizadas = misCitas.filter(cita =>
        ['Completada', 'Cancelada', 'Inasistencia']
            .includes(cita.estado)
    );

    // ==========================================
    // RECORDATORIOS REALES
    // ==========================================

    const ahora = new Date();

    const citaProxima = citasActivas
        .filter(cita => {
            const fechaCita = obtenerFechaHora(cita);

            if (!fechaCita) return false;

            const diferenciaHoras =
                (fechaCita.getTime() - ahora.getTime()) /
                (1000 * 60 * 60);

            return diferenciaHoras >= 0 && diferenciaHoras <= 24;
        })
        .filter(cita => cita.estado === 'Confirmada')
        .find(cita => !cita.asistenciaConfirmada);

    // ==========================================
    // MENSAJES
    // ==========================================

    const mostrarExito = texto => {
        setMensaje(texto);
        setError('');
    };

    const mostrarError = texto => {
        setError(texto);
        setMensaje('');
    };

    // ==========================================
    // GUARDAR CAMBIOS DE CITAS
    // ==========================================

    const accion=async(id,tipo,inicio)=>{if(guardando)return false;setGuardando(true);try{const c=normalizarCita(await citasApi.accion(id,tipo,inicio));setCitas(prev=>prev.map(x=>x.id===id?c:x));return true;}catch(e){mostrarError(e.message);return false;}finally{setGuardando(false);}};
    const handleAgendarCita=async e=>{e.preventDefault();if(guardando)return;if(!nutricionista||!horarioValido(fecha,hora)){mostrarError('Selecciona profesional y horario futuro de lunes a viernes (09:00 a 17:00).');return;}setGuardando(true);try{const c=await citasApi.crear({nutricionistaId:Number(nutricionista),inicio:inicioCita(fecha,hora),motivo:'Consulta nutricional'});setCitas(prev=>[...prev.filter(x=>x.id!==c.id),normalizarCita(c)]);setNutricionista('');setFecha('');setHora('');mostrarExito('Solicitud de cita registrada correctamente.');}catch(e){mostrarError(e.message);}finally{setGuardando(false);}};
    const handleCancelarCita=async id=>{if(window.confirm('¿Deseas cancelar esta cita?')&&await accion(id,'cancelar'))mostrarExito('Cita cancelada.');};
    const handleConfirmarAsistencia=async id=>{if(await accion(id,'asistencia'))mostrarExito('Asistencia confirmada.');};
    const abrirReprogramacion=c=>{setCitaEnModificacionId(c.id);setModFecha(c.fecha);setModHora(c.hora);setError('');setMensaje('');};
    const cerrarReprogramacion=()=>{setCitaEnModificacionId(null);setModFecha('');setModHora('');};
    const handleConfirmarReagendamiento=async e=>{e.preventDefault();if(!horarioValido(modFecha,modHora)){mostrarError('Selecciona una fecha y horario válidos.');return;}if(await accion(citaEnModificacionId,'reprogramar',inicioCita(modFecha,modHora))){cerrarReprogramacion();mostrarExito('Solicitud de reprogramación enviada.');}};

    // ==========================================
    // VERIFICAR PERFIL
    // ==========================================

    if (!usuario || usuario.rol !== 'paciente') {
        return (
            <main className="container my-5">
                <div className="alert alert-danger">
                    Debes iniciar sesión con una cuenta de paciente
                    para acceder a este panel.
                </div>
            </main>
        );
    }

    // ==========================================
    // INTERFAZ DEL PACIENTE
    // ==========================================

    return (
        <main className="container my-4">

            {/* BIENVENIDA */}

            <div className="mb-4">
                <h3 className="fw-bold text-nutri">
                    Mi Panel de Paciente
                </h3>

                <p className="text-muted mb-0">
                    Bienvenido, <strong>{usuario.nombre}</strong>.
                    Aquí puedes gestionar tus citas y consultar
                    tu información nutricional.
                </p>
            </div>

            {/* MENSAJES */}

            {mensaje && (
                <div
                    className="alert alert-success alert-dismissible fade show"
                    role="alert"
                >
                    <i className="bi bi-check-circle me-2"></i>
                    {mensaje}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setMensaje('')}
                    />
                </div>
            )}

            {error && (
                <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                >
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError('')}
                    />
                </div>
            )}

            {/* =====================================
                RECORDATORIO AUTOMÁTICO
            ===================================== */}

            {citaProxima && (
                <div className="alert alert-info d-flex flex-column flex-md-row justify-content-between align-items-md-center shadow-sm">

                    <div>
                        <strong>
                            <i className="bi bi-bell me-2"></i>
                            ¡Recordatorio de cita!
                        </strong>

                        <p className="mb-0 mt-1">
                            Tienes una cita programada para el{' '}
                            <strong>
                                {formatearFecha(citaProxima.fecha)}
                            </strong>
                            {' '}a las{' '}
                            <strong>{citaProxima.hora} hrs</strong>
                            {' '}con{' '}
                            <strong>{citaProxima.nutricionista}</strong>.
                        </p>

                        <small>
                            Confirma tu asistencia desde este panel.
                        </small>
                    </div>

                    <button
                        type="button"
                        className="btn btn-sm btn-success mt-2 mt-md-0 ms-md-3"
                        onClick={() =>
                            handleConfirmarAsistencia(citaProxima.id)
                        }
                    >
                        Confirmar Asistencia
                    </button>
                </div>
            )}

            {/* =====================================
                NUTRICIONISTAS DISPONIBLES
            ===================================== */}

            <h4 className="mb-3">
                Nutricionistas Disponibles
            </h4>

            <div className="row mb-4">
                {nutricionistasDisponibles.map(profesional => (
                    <div
                        className="col-md-3 mb-3"
                        key={profesional.id}
                    >
                        <div className="card-custom p-3 text-center h-100">

                            <img
                                src={profesional.imagen || "/img/perfil-generico.svg"}
                                alt={profesional.nombre}
                                className="img-nutri-card mb-2 mx-auto d-block"
                            />

                            <h6>{profesional.nombre}</h6>

                            <small className="text-muted">
                                {profesional.especialidad}
                            </small>
                        </div>
                    </div>
                ))}
            </div>

            {/* =====================================
                CONTENIDO PRINCIPAL
            ===================================== */}

            <div className="row">

                {/* COLUMNA IZQUIERDA */}

                <div className="col-md-6 mb-4">

                    {/* AGENDAR CITA */}

                    <div className="card-custom p-4 mb-4">

                        <h4>Agendar Nueva Cita</h4>

                        <form onSubmit={handleAgendarCita}>

                            <div className="mb-3">

                                <label className="form-label">
                                    Seleccionar Especialista
                                </label>

                                <select
                                    className="form-select"
                                    value={nutricionista}
                                    onChange={e =>
                                        setNutricionista(e.target.value)
                                    }
                                    required
                                >
                                    <option value="">
                                        Elija profesional...
                                    </option>

                                    {nutricionistasDisponibles.map(n => (
                                        <option
                                            key={n.id}
                                            value={n.id}
                                        >
                                            {n.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="row">

                                <div className="col-6 mb-3">
                                    <label className="form-label">
                                        Fecha
                                    </label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        min={fechaLocal()}
                                        value={fecha}
                                        onChange={e =>
                                            setFecha(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="col-6 mb-3">

                                    <label className="form-label">
                                        Hora
                                    </label>

                                    <select className="form-select" value={hora} onChange={e=>setHora(e.target.value)} required><option value="">Selecciona horario</option>{HORARIOS.map(h=><option key={h} value={h} disabled={ocupados.includes(h)}>{h}</option>)}</select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-nutri w-100" disabled={guardando}
                            >
                                <i className="bi bi-calendar-plus me-2"></i>
                                Solicitar Cita
                            </button>
                        </form>
                    </div>

                    {/* =====================================
                        MIS CITAS AGENDADAS
                    ===================================== */}

                    <div className="card-custom p-4 mb-4">

                        <h4 className="mb-3">
                            Mis Citas Agendadas
                        </h4>

                        {citasActivas.length === 0 ? (

                            <div className="text-center py-4">

                                <i className="bi bi-calendar-x fs-1 text-muted"></i>

                                <h6 className="mt-3">
                                    No tienes citas agendadas
                                </h6>

                                <p className="text-muted small mb-0">
                                    Cuando solicites una cita,
                                    aparecerá aquí.
                                </p>
                            </div>

                        ) : (

                            <div className="table-responsive">
                                <table className="table align-middle">

                                    <thead>
                                        <tr>
                                            <th>Fecha / Estado</th>
                                            <th>Profesional</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {citasActivas.map(cita => (

                                            <tr key={cita.id}>

                                                <td>
                                                    <strong>
                                                        {formatearFecha(cita.fecha)}
                                                    </strong>

                                                    <div>
                                                        {cita.hora} hrs
                                                    </div>

                                                    <span className={`badge mt-1 ${claseEstado(cita.estado)}`}>
                                                        {cita.estado}
                                                    </span>

                                                    {cita.asistenciaConfirmada && (
                                                        <div className="mt-1">
                                                            <span className="badge bg-success">
                                                                Asistencia confirmada
                                                            </span>
                                                        </div>
                                                    )}

                                                    {cita.propuestaReprogramacion && (
                                                        <small className="d-block text-muted mt-2">
                                                            Cambio solicitado:
                                                            {' '}
                                                            {formatearFecha(
                                                                cita.propuestaReprogramacion.fecha
                                                            )}
                                                            {' '}
                                                            {cita.propuestaReprogramacion.hora}
                                                        </small>
                                                    )}
                                                </td>

                                                <td>
                                                    {cita.nutricionista}
                                                </td>

                                                <td>
                                                    <div className="d-flex flex-wrap gap-1">

                                                        {['Pendiente', 'Confirmada']
                                                            .includes(cita.estado) && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() =>
                                                                    abrirReprogramacion(cita)
                                                                }
                                                            >
                                                                Modificar
                                                            </button>
                                                        )}

                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() =>
                                                                handleCancelarCita(cita.id)
                                                            }
                                                        >
                                                            Cancelar
                                                        </button>

                                                        {cita.estado === 'Confirmada' &&
                                                            !cita.asistenciaConfirmada && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-success"
                                                                onClick={() =>
                                                                    handleConfirmarAsistencia(cita.id)
                                                                }
                                                            >
                                                                Confirmar asistencia
                                                            </button>
                                                        )}

                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* HISTORIAL DE CITAS FINALIZADAS */}

                    <div className="card-custom p-4">

                        <h4 className="mb-3">
                            Historial de Citas
                        </h4>

                        {citasFinalizadas.length === 0 ? (

                            <p className="text-muted mb-0">
                                Todavía no tienes citas finalizadas.
                            </p>

                        ) : (

                            <div className="table-responsive">

                                <table className="table table-hover align-middle">

                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Nutricionista</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {citasFinalizadas.map(cita => (
                                            <tr key={cita.id}>

                                                <td>
                                                    {formatearFecha(cita.fecha)}
                                                    <br />
                                                    <small>{cita.hora}</small>
                                                </td>

                                                <td>
                                                    {cita.nutricionista}
                                                </td>

                                                <td>
                                                    <span className={`badge ${claseEstado(cita.estado)}`}>
                                                        {cita.estado}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>

                {/* =====================================
                    COLUMNA DERECHA
                ===================================== */}

                <div className="col-md-6 mb-4">

                    <div className="card-custom p-4 h-100">

                        <h4 className="mb-3">
                            Mi Historial y Plan Alimenticio
                        </h4>

                        {/* PLAN ALIMENTICIO */}

                        <div className="mb-4 p-3 bg-light rounded border">

                            <h5 className="text-nutri">
                                Plan Alimenticio Actual
                            </h5>

                            <div className="text-center py-3">

                                <i className="bi bi-journal-medical fs-1 text-muted"></i>

                                <h6 className="mt-2">
                                    Sin plan alimenticio asignado
                                </h6>

                                <p className="small text-muted mb-0">
                                    Cuando un nutricionista registre
                                    tu plan alimenticio, podrás
                                    consultarlo desde esta sección.
                                </p>
                            </div>
                        </div>

                        {/* PROGRESO */}

                        <div className="mb-4">

                            <h5>
                                Progreso hacia mi meta
                            </h5>

                            <div className="text-center py-3 bg-light rounded border">

                                <i className="bi bi-graph-up fs-1 text-muted"></i>

                                <p className="text-muted small mt-2 mb-0">
                                    Todavía no tienes una meta
                                    nutricional registrada.
                                </p>
                            </div>
                        </div>

                        {/* MEDICIONES */}

                        <h5>
                            Evolución de Mis Mediciones
                        </h5>

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
                                        <td
                                            colSpan="5"
                                            className="text-center text-muted py-4"
                                        >
                                            <i className="bi bi-clipboard2-pulse fs-2 d-block mb-2"></i>

                                            No tienes mediciones
                                            clínicas registradas.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="alert alert-info mt-3 mb-0">

                            <i className="bi bi-info-circle me-2"></i>

                            Tu historial nutricional estará disponible
                            cuando se registren tus atenciones y
                            mediciones en el sistema.
                        </div>
                    </div>
                </div>
            </div>

            {/* =====================================
                MODAL DE REPROGRAMACIÓN
            ===================================== */}

            {citaEnModificacionId !== null && (

                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    role="dialog"
                    aria-modal="true"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.55)'
                    }}
                >

                    <div className="modal-dialog modal-dialog-centered">

                        <div className="modal-content">

                            <div className="modal-header bg-warning">

                                <h5 className="modal-title text-dark">
                                    Solicitar Reprogramación
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Cerrar"
                                    onClick={cerrarReprogramacion}
                                />
                            </div>

                            <form onSubmit={handleConfirmarReagendamiento}>

                                <div className="modal-body">

                                    <p className="text-muted small">
                                        Selecciona una nueva fecha y hora.
                                        Administración deberá aprobar el cambio.
                                    </p>

                                    <div className="mb-3">

                                        <label className="form-label fw-bold">
                                            Nueva Fecha
                                        </label>

                                        <input
                                            type="date"
                                            className="form-control"
                                            min={fechaLocal()}
                                            value={modFecha}
                                            onChange={e =>
                                                setModFecha(e.target.value)
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">

                                        <label className="form-label fw-bold">
                                            Nueva Hora
                                        </label>

                                        <select className="form-select" value={modHora} onChange={e=>setModHora(e.target.value)} required><option value="">Selecciona horario</option>{HORARIOS.map(h=><option key={h} value={h} disabled={false}>{h}</option>)}</select>
                                    </div>

                                    {error && (
                                        <div className="alert alert-danger">
                                            {error}
                                        </div>
                                    )}
                                </div>

                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={cerrarReprogramacion}
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        Solicitar Cambio
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </main>
    );
}
