import React, { useState, useEffect } from 'react';

import {
    obtenerSesion,
    obtenerCitas,
    guardarCitas
} from '../utils/auth';

const NUTRICIONISTAS = [
    'Dra. María González',
    'Dr. Carlos Rojas',
    'Dra. Andrea Silva',
    'Dr. Felipe Morales'
];

const HORARIOS = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00'
];

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

    const [citas, setCitas] = useState(() => obtenerCitas());

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

    useEffect(() => {
        guardarCitas(citas);
    }, [citas]);

    const hoy = fechaLocal(new Date());

    const horariosDisponibles = HORARIOS.filter(hora => {
        if (!form.fecha) return true;

        const fechaHora = new Date(`${form.fecha}T${hora}:00`);

        return fechaHora > new Date();
    });

    const estaDisponible = (nutricionista, fecha, hora, idExcluir = null) => {
        return !citas.some(cita =>
            cita.id !== idExcluir &&
            cita.nutricionista === nutricionista &&
            cita.fecha === fecha &&
            cita.hora === hora &&
            ['Pendiente', 'Confirmada'].includes(cita.estado)
        );
    };

    const actualizarCampo = e => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();

        setMensaje('');
        setError('');

        if (!form.nutricionista || !form.fecha || !form.hora || !form.motivo.trim()) {
            setError('Completa todos los campos del formulario.');
            return;
        }

        const fechaSeleccionada = new Date(`${form.fecha}T00:00:00`);

        if (
            Number.isNaN(fechaSeleccionada.getTime()) ||
            form.fecha < hoy
        ) {
            setError('No puedes solicitar una cita en una fecha pasada.');
            return;
        }

        // La clínica atiende de lunes a viernes.
        if ([0, 6].includes(fechaSeleccionada.getDay())) {
            setError('La clínica no recibe solicitudes para sábados o domingos.');
            return;
        }

        if (!HORARIOS.includes(form.hora)) {
            setError('Selecciona un horario válido.');
            return;
        }

        if (form.fecha === hoy) {
            const fechaHora = new Date(`${form.fecha}T${form.hora}:00`);

            if (fechaHora <= new Date()) {
                setError('Selecciona una hora posterior a la hora actual.');
                return;
            }
        }

        if (!estaDisponible(form.nutricionista, form.fecha, form.hora)) {
            setError('Ese horario ya tiene una solicitud activa. Selecciona otro.');
            return;
        }

        const nuevaCita = {
            id: Date.now(),
            pacienteId: usuario.id,
            paciente: usuario.nombre,
            correoPaciente: usuario.correo,
            nutricionista: form.nutricionista,
            motivo: form.motivo.trim(),
            fecha: form.fecha,
            hora: form.hora,
            estado: 'Pendiente',
            fechaSolicitud: new Date().toISOString(),
            propuestaReprogramacion: null
        };

        setCitas(prev => [...prev, nuevaCita]);

        setForm({
            nutricionista: '',
            motivo: '',
            fecha: '',
            hora: ''
        });

        setMensaje('Tu solicitud fue enviada correctamente. Está pendiente de confirmación.');
    };

    const cancelarCita = id => {
        const confirmar = window.confirm(
            '¿Estás seguro de que deseas cancelar esta cita?'
        );

        if (!confirmar) return;

        setCitas(prev =>
            prev.map(cita =>
                cita.id === id
                    ? { ...cita, estado: 'Cancelada' }
                    : cita
            )
        );

        setMensaje('La cita fue cancelada correctamente.');
    };

    const solicitarReprogramacion = e => {
        e.preventDefault();

        const cita = citas.find(c => c.id === citaReprogramar);

        if (!cita) return;

        const fecha = new Date(`${nuevaFecha}T00:00:00`);

        if (
            !nuevaFecha ||
            !nuevaHora ||
            nuevaFecha < hoy ||
            [0, 6].includes(fecha.getDay()) ||
            !HORARIOS.includes(nuevaHora)
        ) {
            setError('Selecciona una fecha y horario válidos.');
            return;
        }

        if (nuevaFecha === hoy &&
            new Date(`${nuevaFecha}T${nuevaHora}:00`) <= new Date()) {
            setError('Selecciona una hora posterior a la hora actual.');
            return;
        }

        if (!estaDisponible(cita.nutricionista, nuevaFecha, nuevaHora, cita.id)) {
            setError('El horario seleccionado no está disponible.');
            return;
        }

        setCitas(prev =>
            prev.map(c =>
                c.id === cita.id
                    ? {
                        ...c,
                        estado: 'Reprogramación solicitada',
                        propuestaReprogramacion: {
                            fecha: nuevaFecha,
                            hora: nuevaHora
                        }
                    }
                    : c
            )
        );

        setCitaReprogramar(null);
        setNuevaFecha('');
        setNuevaHora('');
        setError('');

        setMensaje('Tu solicitud de reprogramación fue enviada para revisión.');
    };

    const misCitas = citas
        .filter(cita => cita.pacienteId === usuario.id)
        .sort((a, b) =>
            `${b.fecha} ${b.hora}`.localeCompare(`${a.fecha} ${a.hora}`)
        );

    return (
        <main className="container my-5">

            <div className="mb-4">
                <h2 className="fw-bold text-nutri">
                    Agendamiento de Citas
                </h2>

                <p className="text-muted">
                    Hola, {usuario.nombre}. Solicita y administra tus consultas nutricionales.
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
                                    value={usuario.nombre}
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

                                    {NUTRICIONISTAS.map(nombre => (
                                        <option key={nombre} value={nombre}>
                                            {nombre}
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
                                className="btn btn-nutri w-100"
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