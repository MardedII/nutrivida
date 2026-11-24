import React, { useState } from 'react';

import { obtenerSesion } from '../utils/auth';
import { citasApi } from '../services/api';
import { useCitas,useCatalogo,useOcupados,HORARIOS,inicioCita,horarioValido,normalizarCita } from '../utils/useDatos';

function fechaLocal(fecha) {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function obtenerEstadoColor(estado) {
    switch (estado) {
        case 'Confirmada':
            return 'success';
        case 'Pendiente':
            return 'warning text-dark';
        case 'Cancelada':
            return 'secondary';
        case 'Reprogramación solicitada':
            return 'info text-dark';
        case 'Completada':
            return 'primary';
        default:
            return 'secondary';
    }
}

export default function Agendar() {
    const usuario = obtenerSesion();



    const [form, setForm] = useState({
        nutricionista: '',
        motivo: '',
        fecha: '',
        hora: ''
    });

    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [citaReprogramar, setCitaReprogramar] = useState(null);

    const [nuevaFecha, setNuevaFecha] = useState('');
    const [nuevaHora, setNuevaHora] = useState('');

    const [citas,setCitas] = useCitas(setError);
    const nutricionistas=useCatalogo(setError);
    const ocupados=useOcupados(form.nutricionista,form.fecha,setError);
    const [guardando,setGuardando]=useState(false);
    const hoy=fechaLocal(new Date());
    const horariosDisponibles=HORARIOS.filter(hora=>!form.fecha||horarioValido(form.fecha,hora));
    const estaDisponible=(id,fecha,hora)=>!(String(id)===String(form.nutricionista)&&fecha===form.fecha&&ocupados.includes(hora));

    const actualizarCampo = e => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit=async e=>{e.preventDefault();if(guardando)return;setError('');setMensaje('');if(!form.nutricionista||!form.motivo.trim()||!horarioValido(form.fecha,form.hora)){setError('Completa los campos y selecciona un horario futuro de lunes a viernes (09:00 a 17:00).');return;}setGuardando(true);try{const c=await citasApi.crear({nutricionistaId:Number(form.nutricionista),inicio:inicioCita(form.fecha,form.hora),motivo:form.motivo.trim()});setCitas(prev=>[...prev.filter(x=>x.id!==c.id),normalizarCita(c)]);setForm({nutricionista:'',motivo:'',fecha:'',hora:''});setMensaje('Tu solicitud fue enviada correctamente.');}catch(e){setError(e.message);}finally{setGuardando(false);}};
    const accion=async(id,tipo,inicio)=>{if(guardando)return false;setGuardando(true);setError('');setMensaje('');try{const c=normalizarCita(await citasApi.accion(id,tipo,inicio));setCitas(prev=>prev.map(x=>x.id===id?c:x));return true;}catch(e){setError(e.message);return false;}finally{setGuardando(false);}};
    const cancelarCita=async id=>{if(window.confirm('¿Deseas cancelar esta cita?')&&await accion(id,'cancelar'))setMensaje('Cita cancelada.');};
    const solicitarReprogramacion=async e=>{e.preventDefault();if(!horarioValido(nuevaFecha,nuevaHora)){setError('Selecciona fecha y horario válidos.');return;}if(await accion(citaReprogramar,'reprogramar',inicioCita(nuevaFecha,nuevaHora))){setCitaReprogramar(null);setNuevaFecha('');setNuevaHora('');setMensaje('Solicitud de reprogramación enviada.');}};
    const misCitas=citas.filter(c=>c.pacienteId===usuario?.perfilId).sort((a,b)=>b.inicio.localeCompare(a.inicio));

    return (
        <main className="container my-5">

            <div className="mb-4">
                <h2 className="fw-bold text-nutri">
                    Agendamiento de Citas
                </h2>

                <p className="text-muted">
                    Hola, {usuario?.nombre}. Solicita y administra tus consultas nutricionales.
                </p>
            </div>

            {mensaje && (
                <div className="alert alert-success">
                    <i className="bi bi-check-circle me-2"></i>
                    {mensaje}
                </div>
            )}

            {error && (
                <div className="alert alert-danger">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                </div>
            )}

            <div className="row">

                {/* FORMULARIO */}
                <div className="col-lg-5 mb-4">
                    <div className="card card-custom p-4 h-100">

                        <h4 className="text-nutri mb-3">
                            <i className="bi bi-calendar-plus me-2"></i>
                            Solicitar Nueva Cita
                        </h4>

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">
                                <label className="form-label">
                                    Paciente
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={usuario?.nombre || ''}
                                    disabled
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Nutricionista preferido
                                </label>

                                <select
                                    className="form-select"
                                    name="nutricionista"
                                    value={form.nutricionista}
                                    onChange={actualizarCampo}
                                    required
                                >
                                    <option value="">
                                        Selecciona un profesional
                                    </option>

                                    {nutricionistas.map(n => (
                                        <option key={n.id} value={n.id}>
                                            {n.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Motivo de consulta
                                </label>

                                <textarea
                                    className="form-control"
                                    name="motivo"
                                    rows="3"
                                    maxLength="500"
                                    placeholder="Describe brevemente el motivo de tu consulta..."
                                    value={form.motivo}
                                    onChange={actualizarCampo}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Fecha de consulta
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    name="fecha"
                                    min={hoy}
                                    value={form.fecha}
                                    onChange={actualizarCampo}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Horario disponible
                                </label>

                                <select
                                    className="form-select"
                                    name="hora"
                                    value={form.hora}
                                    onChange={actualizarCampo}
                                    required
                                >
                                    <option value="">
                                        Selecciona una hora
                                    </option>

                                    {horariosDisponibles.map(hora => (
                                        <option
                                            key={hora}
                                            value={hora}
                                            disabled={
                                                form.nutricionista &&
                                                form.fecha &&
                                                !estaDisponible(
                                                    form.nutricionista,
                                                    form.fecha,
                                                    hora
                                                )
                                            }
                                        >
                                            {hora}
                                            {form.nutricionista &&
                                            form.fecha &&
                                            !estaDisponible(form.nutricionista, form.fecha, hora)
                                                ? ' - No disponible'
                                                : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="alert alert-info small">
                                <i className="bi bi-info-circle me-2"></i>
                                Tu solicitud quedará pendiente hasta que el profesional
                                confirme la disponibilidad.
                            </div>

                            <button
                                type="submit"
                                className="btn btn-nutri w-100" disabled={guardando}
                            >
                                <i className="bi bi-send me-2"></i>
                                Enviar Solicitud
                            </button>

                        </form>
                    </div>
                </div>

                {/* HISTORIAL */}
                <div className="col-lg-7">
                    <div className="card card-custom p-4">

                        <h4 className="text-nutri mb-3">
                            <i className="bi bi-clock-history me-2"></i>
                            Mis Solicitudes y Citas
                        </h4>

                        {misCitas.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="bi bi-calendar-x fs-1 text-muted"></i>

                                <p className="text-muted mt-3">
                                    Todavía no tienes citas registradas.
                                </p>
                            </div>
                        ) : (
                            <div className="table-responsive">

                                <table className="table table-hover align-middle">

                                    <thead className="table-light">
                                        <tr>
                                            <th>Profesional</th>
                                            <th>Fecha / Hora</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {misCitas.map(cita => (
                                            <tr key={cita.id}>

                                                <td>
                                                    <strong>{cita.nutricionista}</strong>

                                                    <div className="small text-muted">
                                                        {cita.motivo}
                                                    </div>
                                                </td>

                                                <td>
                                                    {cita.fecha}
                                                    <br />
                                                    {cita.hora}
                                                </td>

                                                <td>
                                                    <span className={`badge bg-${obtenerEstadoColor(cita.estado)}`}>
                                                        {cita.estado}
                                                    </span>

                                                    {cita.propuestaReprogramacion && (
                                                        <div className="small mt-1">
                                                            Propuesta: {cita.propuestaReprogramacion.fecha}
                                                            {' '}
                                                            {cita.propuestaReprogramacion.hora}
                                                        </div>
                                                    )}
                                                </td>

                                                <td>
                                                    {['Pendiente', 'Confirmada'].includes(cita.estado) && (
                                                        <div className="d-flex flex-column gap-1">

                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => {
                                                                    setCitaReprogramar(cita.id);
                                                                    setError('');
                                                                }}
                                                            >
                                                                Reprogramar
                                                            </button>

                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => cancelarCita(cita.id)}
                                                            >
                                                                Cancelar
                                                            </button>

                                                        </div>
                                                    )}
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* SOLICITUD DE REPROGRAMACIÓN */}
            {citaReprogramar && (
                <div
                    className="card card-custom p-4 mt-4"
                    style={{ maxWidth: '550px', marginLeft: 'auto', marginRight: 'auto' }}
                >
                    <h5 className="text-nutri">
                        Solicitar Reprogramación
                    </h5>

                    <form onSubmit={solicitarReprogramacion}>

                        <div className="mb-3">
                            <label className="form-label">
                                Nueva fecha
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                min={hoy}
                                value={nuevaFecha}
                                onChange={e => setNuevaFecha(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Nueva hora
                            </label>

                            <select
                                className="form-select"
                                value={nuevaHora}
                                onChange={e => setNuevaHora(e.target.value)}
                                required
                            >
                                <option value="">Selecciona un horario</option>

                                {HORARIOS.map(hora => (
                                    <option key={hora} value={hora}>
                                        {hora}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-success">
                                Enviar solicitud
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setCitaReprogramar(null)}
                            >
                                Volver
                            </button>
                        </div>

                    </form>
                </div>
            )}

        </main>
    );
}