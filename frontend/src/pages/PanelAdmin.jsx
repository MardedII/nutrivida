
import React, { useState, useEffect } from 'react';

import {
    obtenerPermisos,
    guardarPermisos,
    obtenerFaltas,
    guardarFaltas
} from '../utils/auth';

import { api, citasApi } from '../services/api';
import { useDatos,useCitas,normalizarCita } from '../utils/useDatos';

import {
    validarRut,
    validarTelefono,
    formatearRut,
    formatearTelefono
} from '../utils/validaciones';

const usuarioVacio = {
    nombre: '',
    rut: '',
    correo: '',
    telefono: '',
    rol: 'paciente',
    clave: '', confirmarClave: '', fechaNac: '', genero: '', especialidad: '', imagen: ''
};

const faltaVacia = {
    nutricionistaId: '',
    fecha: '',
    tipo: 'Injustificada',
    motivo: ''
};

const formatearFecha = fecha => {
    if (!fecha) return 'Sin fecha';
    const partes = String(fecha).split('-');

    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return fecha;
};

const claseEstadoCita = estado => {
    const colores = {
        Confirmada: 'bg-success',
        Pendiente: 'bg-warning text-dark',
        Cancelada: 'bg-secondary',
        Completada: 'bg-primary',
        Inasistencia: 'bg-danger',
        'Reprogramación solicitada': 'bg-info text-dark'
    };

    return colores[estado] || 'bg-secondary';
};

const claseEstadoPermiso = estado => {
    if (estado === 'Aprobado') return 'bg-success';
    if (estado === 'Rechazado') return 'bg-danger';
    return 'bg-warning text-dark';
};

export default function PanelAdmin() {

    const [permisos, setPermisos] = useState(() => obtenerPermisos());
    const [faltas, setFaltas] = useState(() => obtenerFaltas());

    const [busqueda, setBusqueda] = useState('');
    const [filtroRol, setFiltroRol] = useState('todos');
    const [filtroEstado, setFiltroEstado] = useState('todos');

    const [usuarioEditar, setUsuarioEditar] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [form, setForm] = useState(usuarioVacio);

    const [estadisticaSeleccionada, setEstadisticaSeleccionada] = useState(null);

    const [mostrarFormularioFalta, setMostrarFormularioFalta] = useState(false);
    const [formFalta, setFormFalta] = useState(faltaVacia);
    const [filtroAsistencia, setFiltroAsistencia] = useState('todos');

    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    const [usuarios,setUsuarios]=useDatos(api.usuarios.listar,setError);
    const [citas,setCitas]=useCitas(setError);
    const [guardando,setGuardando]=useState(false);

    // Mantiene los permisos y faltas sincronizados entre pestañas.
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

    const mostrarExito = texto => {
        setMensaje(texto);
        setError('');
    };

    const mostrarError = texto => {
        setError(texto);
        setMensaje('');
    };

    // ==========================================
    // GESTIÓN DE USUARIOS
    // ==========================================

    const limpiarFormulario = () => {
        setForm({ ...usuarioVacio });
        setUsuarioEditar(null);
        setMostrarFormulario(false);
    };

    const abrirNuevoUsuario = () => {
        limpiarFormulario();
        setMostrarFormulario(true);
        setError('');
        setMensaje('');
    };

    const abrirEdicion = usuario => {
        setUsuarioEditar(usuario);

        setForm({
            nombre: usuario.nombre,
            rut: usuario.rut,
            correo: usuario.correo,
            telefono: usuario.telefono,
            rol: usuario.rol,
            clave: '', confirmarClave: '', fechaNac: usuario.fechaNac || '', genero: usuario.genero || '', especialidad: usuario.especialidad || '', imagen: usuario.imagen || ''
        });

        setMostrarFormulario(true);
        setError('');
        setMensaje('');
    };

    const actualizarCampo = e => {
        const { name, value } = e.target;
        let valorFinal = value;

        if (name === 'rut') {
            valorFinal = formatearRut(value);
        }

        if (name === 'telefono') {
            valorFinal = formatearTelefono(value);
        }

        setForm(prev => ({
            ...prev,
            [name]: valorFinal
        }));
    };

    const guardarUsuario = async e => {
        e.preventDefault();

        const { nombre, rut, correo, telefono, rol, clave } = form;

        if (!nombre.trim() || !rut.trim() ||
            !correo.trim() || !telefono.trim()) {
            mostrarError('Completa todos los campos obligatorios.');
            return;
        }

        if (!validarRut(rut)) {
            mostrarError('El RUT ingresado no es válido.');
            return;
        }

        if (!validarTelefono(telefono)) {
            mostrarError('Ingresa un celular chileno válido.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
            mostrarError('El correo electrónico no es válido.');
            return;
        }

        const correoNormalizado = correo.trim().toLowerCase();
        const rutNormalizado = rut.replace(/[.\-\s]/g, '').toUpperCase();

        const correoDuplicado = usuarios.some(
            u =>
                u.correo.toLowerCase() === correoNormalizado &&
                u.id !== usuarioEditar?.id
        );

        const rutDuplicado = usuarios.some(
            u =>
                u.rut.replace(/[.\-\s]/g, '').toUpperCase() === rutNormalizado &&
                u.id !== usuarioEditar?.id
        );

        if (correoDuplicado) {
            mostrarError('Ya existe un usuario con ese correo.');
            return;
        }

        if (rutDuplicado) {
            mostrarError('Ya existe un usuario con ese RUT.');
            return;
        }

        if ((!usuarioEditar || clave) && clave.length < 8) {
            mostrarError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        if(guardando)return;
        const datos={...form,nombre:nombre.trim(),rut:formatearRut(rut),correo:correoNormalizado,telefono:formatearTelefono(telefono),fechaNac:form.fechaNac||null,activo:usuarioEditar?usuarioEditar.activo:true};
        setGuardando(true);try{const u=usuarioEditar?await api.usuarios.actualizar(usuarioEditar.id,datos):await api.usuarios.crear(datos);setUsuarios(prev=>usuarioEditar?prev.map(x=>x.id===u.id?u:x):[...prev,u]);mostrarExito('Usuario guardado correctamente.');limpiarFormulario();}catch(e){mostrarError(e.message);}finally{setGuardando(false);}
    };
    const alternarEstadoUsuario=async id=>{const u=usuarios.find(x=>x.id===id);if(!u||guardando)return;if(u.activo&&!window.confirm(`¿Deseas desactivar la cuenta de ${u.nombre}?`))return;setGuardando(true);try{const actualizado=await api.usuarios.actualizar(id,{...u,activo:!u.activo});setUsuarios(prev=>prev.map(x=>x.id===id?actualizado:x));mostrarExito('Estado de cuenta actualizado.');}catch(e){mostrarError(e.message);}finally{setGuardando(false);}};

    const usuariosFiltrados = usuarios.filter(u => {
        const texto = busqueda.toLowerCase();

        const coincideBusqueda =
            String(u.nombre || '').toLowerCase().includes(texto) ||
            String(u.rut || '').toLowerCase().includes(texto) ||
            String(u.correo || '').toLowerCase().includes(texto);

        const coincideRol =
            filtroRol === 'todos' || u.rol === filtroRol;

        const coincideEstado =
            filtroEstado === 'todos' ||
            (filtroEstado === 'activo' && u.activo) ||
            (filtroEstado === 'inactivo' && !u.activo);

        return coincideBusqueda && coincideRol && coincideEstado;
    });

    // ==========================================
    // GESTIÓN DE CITAS
    // ==========================================

    const cambiarCita=async(id,accion)=>{if(guardando)return;setGuardando(true);try{const c=normalizarCita(await citasApi.accion(id,accion));setCitas(prev=>prev.map(x=>x.id===id?c:x));mostrarExito(`Cita actualizada: ${c.estado}.`);}catch(e){mostrarError(e.message);}finally{setGuardando(false);}};
    const actualizarEstadoCita=(id,estado)=>cambiarCita(id,({Confirmada:'confirmar',Completada:'completar',Inasistencia:'inasistencia',Cancelada:'cancelar'})[estado]);
    const aprobarReprogramacion=id=>cambiarCita(id,'aprobarReprogramacion');

    // ==========================================
    // PERMISOS DE NUTRICIONISTAS
    // ==========================================

    const nutricionistas = usuarios.filter(
        u => u.rol === 'nutricionista'
    );

    const permisosPendientes = permisos.filter(
        p => p.estado === 'Pendiente'
    );

    const aprobarORechazarPermiso = (id, nuevoEstado) => {
        const permiso = obtenerPermisos().find(p => p.id === id);

        if (!permiso || permiso.estado !== 'Pendiente') {
            mostrarError('La solicitud ya fue procesada.');
            setPermisos(obtenerPermisos());
            return;
        }

        const accion = nuevoEstado === 'Aprobado'
            ? 'aprobar'
            : 'rechazar';

        const confirmar = window.confirm(
            `¿Deseas ${accion} el permiso de ${permiso.nombre}?`
        );

        if (!confirmar) return;

        const actualizados = obtenerPermisos().map(p =>
            p.id === id
                ? {
                    ...p,
                    estado: nuevoEstado,
                    fechaResolucion: new Date().toISOString()
                }
                : p
        );

        guardarPermisos(actualizados);
        setPermisos(actualizados);

        mostrarExito(
            nuevoEstado === 'Aprobado'
                ? 'El permiso fue aprobado correctamente.'
                : 'El permiso fue rechazado correctamente.'
        );
    };

    // ==========================================
    // REGISTRO DE FALTAS LABORALES
    // ==========================================

    const registrarFalta = e => {
        e.preventDefault();

        const {
            nutricionistaId,
            fecha,
            tipo,
            motivo
        } = formFalta;

        const nutricionista = nutricionistas.find(
            n => String(n.id) === String(nutricionistaId)
        );

        if (!nutricionista) {
            mostrarError('Debes seleccionar un nutricionista.');
            return;
        }

        if (!fecha || !motivo.trim()) {
            mostrarError('Completa la fecha y las observaciones.');
            return;
        }

        const registrosActuales = obtenerFaltas();

        const duplicada = registrosActuales.some(f =>
            String(f.nutricionistaId) === String(nutricionista.id) &&
            f.fecha === fecha
        );

        if (duplicada) {
            mostrarError('Ya existe una falta registrada para ese nutricionista y fecha.');
            return;
        }

        const permisoAprobado = obtenerPermisos().some(p =>
            String(p.nutricionistaId) === String(nutricionista.id) &&
            p.estado === 'Aprobado' &&
            fecha >= p.fechaInicio &&
            fecha <= p.fechaFin
        );

        if (permisoAprobado) {
            mostrarError(
                'El nutricionista tiene un permiso aprobado para esa fecha. No corresponde registrar una falta.'
            );
            return;
        }

        const nuevaFalta = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            nutricionistaId: nutricionista.id,
            nombre: nutricionista.nombre,
            correo: nutricionista.correo,
            fecha,
            tipo,
            motivo: motivo.trim(),
            fechaRegistro: new Date().toISOString()
        };

        const actualizadas = [nuevaFalta, ...registrosActuales];

        guardarFaltas(actualizadas);
        setFaltas(actualizadas);

        setFormFalta({ ...faltaVacia });
        setMostrarFormularioFalta(false);

        mostrarExito('La falta laboral fue registrada correctamente.');
    };

    const eliminarFalta = id => {
        const confirmar = window.confirm(
            '¿Deseas eliminar este registro de falta laboral?'
        );

        if (!confirmar) return;

        const actualizadas = obtenerFaltas().filter(f => f.id !== id);

        guardarFaltas(actualizadas);
        setFaltas(actualizadas);
        mostrarExito('El registro de falta fue eliminado.');
    };

    const permisosFiltrados = permisos.filter(p =>
        filtroAsistencia === 'todos' ||
        String(p.nutricionistaId) === filtroAsistencia
    );

    const faltasFiltradas = faltas.filter(f =>
        filtroAsistencia === 'todos' ||
        String(f.nutricionistaId) === filtroAsistencia
    );

    // ==========================================
    // ESTADÍSTICAS
    // ==========================================

    const citasCompletadas = citas.filter(
        c => c.estado === 'Completada'
    );

    const citasInasistencias = citas.filter(
        c => c.estado === 'Inasistencia'
    );

    const cantidadCompletadas = citasCompletadas.length;
    const cantidadInasistencias = citasInasistencias.length;
    const citasFinalizadas = cantidadCompletadas + cantidadInasistencias;

    const porcentajeInasistencia = citasFinalizadas > 0
        ? Math.round((cantidadInasistencias / citasFinalizadas) * 100)
        : 0;

    const usuariosActivos = usuarios.filter(u => u.activo);

    const distribucion = nutricionistas
        .filter(n => n.activo)
        .map(n => ({
            nombre: n.nombre,
            cantidad: citasCompletadas.filter(
                c => c.nutricionista === n.nombre
            ).length
        }));

    const totalAtenciones = distribucion.reduce(
        (total, n) => total + n.cantidad,
        0
    );

    const abrirHistorial = (tipo, nutricionista = null) => {
        if (
            estadisticaSeleccionada?.tipo === tipo &&
            estadisticaSeleccionada?.nutricionista === nutricionista
        ) {
            setEstadisticaSeleccionada(null);
        } else {
            setEstadisticaSeleccionada({ tipo, nutricionista });
        }
    };

    const historialCitas = estadisticaSeleccionada?.tipo === 'completadas'
        ? citasCompletadas
        : estadisticaSeleccionada?.tipo === 'inasistencias'
            ? citasInasistencias
            : estadisticaSeleccionada?.tipo === 'nutricionista'
                ? citasCompletadas.filter(
                    c => c.nutricionista === estadisticaSeleccionada.nutricionista
                )
                : [];

    // ==========================================
    // INTERFAZ
    // ==========================================

    return (
        <main className="container my-5">

            <div className="mb-4">
                <h2 className="fw-bold text-nutri">
                    Panel de Administración
                </h2>
                <p className="text-muted">
                    Administración general de la Clínica NutriVida.
                </p>
            </div>

            {mensaje && (
                <div className="alert alert-success alert-dismissible fade show">
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
                <div className="alert alert-danger alert-dismissible fade show">
                    {error}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError('')}
                    />
                </div>
            )}

            {/* =====================================
                ESTADÍSTICAS DE ATENCIÓN
            ===================================== */}

            <h4 className="mb-3">Estadísticas de Atención</h4>

            <div className="row mb-4">

                <div className="col-md-4 mb-3">
                    <button
                        type="button"
                        className="card card-custom p-4 h-100 w-100 text-start"
                        onClick={() => abrirHistorial('completadas')}
                    >
                        <i className="bi bi-clipboard2-check fs-2 text-primary"></i>
                        <h2 className="fw-bold mt-2">{cantidadCompletadas}</h2>
                        <p className="mb-0">Atenciones completadas</p>
                        <small className="text-primary mt-2">
                            Ver historial de atenciones
                        </small>
                    </button>
                </div>

                <div className="col-md-4 mb-3">
                    <button
                        type="button"
                        className="card card-custom p-4 h-100 w-100 text-start"
                        onClick={() => abrirHistorial('inasistencias')}
                    >
                        <i className="bi bi-exclamation-circle fs-2 text-danger"></i>
                        <h2 className="fw-bold mt-2">
                            {porcentajeInasistencia}%
                        </h2>
                        <p className="mb-0">Tasa de inasistencia</p>
                        <small className="text-muted">
                            Sobre citas finalizadas
                        </small>
                        <small className="text-danger mt-2">
                            Ver historial de inasistencias
                        </small>
                    </button>
                </div>

                <div className="col-md-4 mb-3">
                    <button
                        type="button"
                        className="card card-custom p-4 h-100 w-100 text-start"
                        onClick={() => abrirHistorial('usuarios')}
                    >
                        <i className="bi bi-people fs-2 text-success"></i>
                        <h2 className="fw-bold mt-2">
                            {usuariosActivos.length}
                        </h2>
                        <p className="mb-0">Usuarios activos</p>
                        <small className="text-success mt-2">
                            Ver usuarios activos
                        </small>
                    </button>
                </div>
            </div>

            {/* HISTORIALES DESPLEGABLES */}

            {estadisticaSeleccionada && (
                <div className="card card-custom p-4 mb-4">
                    <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
                        <h5 className="text-nutri mb-0">
                            {estadisticaSeleccionada.tipo === 'completadas' &&
                                'Historial de Atenciones Completadas'}

                            {estadisticaSeleccionada.tipo === 'inasistencias' &&
                                'Historial de Inasistencias de Pacientes'}

                            {estadisticaSeleccionada.tipo === 'usuarios' &&
                                'Listado de Usuarios Activos'}

                            {estadisticaSeleccionada.tipo === 'nutricionista' &&
                                `Atenciones de ${estadisticaSeleccionada.nutricionista}`}
                        </h5>

                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => setEstadisticaSeleccionada(null)}
                        >
                            Cerrar
                        </button>
                    </div>

                    {estadisticaSeleccionada.tipo === 'usuarios' ? (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>Nombre</th>
                                        <th>RUT</th>
                                        <th>Correo</th>
                                        <th>Teléfono</th>
                                        <th>Rol</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuariosActivos.map(u => (
                                        <tr key={u.id}>
                                            <td>{u.nombre}</td>
                                            <td>{u.rut}</td>
                                            <td>{u.correo}</td>
                                            <td>{u.telefono}</td>
                                            <td>{u.rol}</td>
                                        </tr>
                                    ))}

                                    {usuariosActivos.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center">
                                                No hay usuarios activos.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Paciente</th>
                                        <th>Correo</th>
                                        <th>Nutricionista</th>
                                        <th>Motivo</th>
                                        <th>Fecha</th>
                                        <th>Hora</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historialCitas.map(c => (
                                        <tr key={c.id}>
                                            <td>{c.paciente}</td>
                                            <td>{c.correoPaciente || '-'}</td>
                                            <td>{c.nutricionista}</td>
                                            <td>{c.motivo || '-'}</td>
                                            <td>{formatearFecha(c.fecha)}</td>
                                            <td>{c.hora || '-'}</td>
                                            <td>
                                                <span className={`badge ${claseEstadoCita(c.estado)}`}>
                                                    {c.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}

                                    {historialCitas.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="text-center text-muted">
                                                No existen atenciones registradas.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* DISTRIBUCIÓN POR NUTRICIONISTA */}

            <div className="card card-custom p-4 mb-5">
                <h5 className="text-nutri mb-3">
                    Distribución por Nutricionista
                </h5>

                {distribucion.map(n => {
                    const porcentaje = totalAtenciones > 0
                        ? Math.round(n.cantidad / totalAtenciones * 100)
                        : 0;

                    return (
                        <button
                            key={n.nombre}
                            type="button"
                            className="btn text-start w-100 p-2 mb-2"
                            onClick={() => abrirHistorial('nutricionista', n.nombre)}
                        >
                            <div className="d-flex justify-content-between">
                                <span>{n.nombre}</span>
                                <strong>
                                    {n.cantidad} atenciones ({porcentaje}%)
                                </strong>
                            </div>

                            <div className="progress" style={{ height: '12px' }}>
                                <div
                                    className="progress-bar bg-success"
                                    style={{ width: `${porcentaje}%` }}
                                />
                            </div>

                            <small className="text-primary">
                                Consultar atenciones de este profesional
                            </small>
                        </button>
                    );
                })}

                {totalAtenciones === 0 && (
                    <p className="text-muted mb-0">
                        Todavía no existen atenciones completadas.
                    </p>
                )}
            </div>

            {/* =====================================
                GESTIÓN DE ASISTENCIA Y PERMISOS
            ===================================== */}

            <div className="mb-4">
                <h4 className="fw-bold">
                    <i className="bi bi-calendar2-check me-2"></i>
                    Gestión de Asistencia y Permisos
                </h4>
                <p className="text-muted">
                    Control de solicitudes, permisos y faltas laborales
                    de los nutricionistas.
                </p>
            </div>

            <div className="row mb-4">
                <div className="col-md-4 mb-3">
                    <div className="card card-custom p-4 h-100">
                        <i className="bi bi-hourglass-split text-warning fs-2"></i>
                        <h2 className="fw-bold mt-2">
                            {permisosPendientes.length}
                        </h2>
                        <p className="mb-0">Permisos pendientes</p>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="card card-custom p-4 h-100">
                        <i className="bi bi-calendar-check text-success fs-2"></i>
                        <h2 className="fw-bold mt-2">
                            {permisos.filter(p => p.estado === 'Aprobado').length}
                        </h2>
                        <p className="mb-0">Permisos aprobados</p>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="card card-custom p-4 h-100">
                        <i className="bi bi-person-x text-danger fs-2"></i>
                        <h2 className="fw-bold mt-2">{faltas.length}</h2>
                        <p className="mb-0">Faltas laborales registradas</p>
                    </div>
                </div>
            </div>

            {/* REGISTRAR FALTA */}

            <div className="card card-custom p-4 mb-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                    <h5 className="mb-0">
                        Registrar falta de un nutricionista
                    </h5>

                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                            setMostrarFormularioFalta(!mostrarFormularioFalta);
                            setError('');
                        }}
                    >
                        <i className="bi bi-person-dash me-2"></i>
                        {mostrarFormularioFalta
                            ? 'Cerrar formulario'
                            : 'Registrar falta'}
                    </button>
                </div>

                {mostrarFormularioFalta && (
                    <form onSubmit={registrarFalta} className="border rounded p-3">
                        <div className="row">

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Nutricionista
                                </label>
                                <select
                                    className="form-select"
                                    value={formFalta.nutricionistaId}
                                    onChange={e =>
                                        setFormFalta(prev => ({
                                            ...prev,
                                            nutricionistaId: e.target.value
                                        }))
                                    }
                                    required
                                >
                                    <option value="">
                                        Selecciona un nutricionista
                                    </option>

                                    {nutricionistas.map(n => (
                                        <option key={n.id} value={String(n.id)}>
                                            {n.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Fecha de la falta
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formFalta.fecha}
                                    onChange={e =>
                                        setFormFalta(prev => ({
                                            ...prev,
                                            fecha: e.target.value
                                        }))
                                    }
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Tipo de falta
                                </label>
                                <select
                                    className="form-select"
                                    value={formFalta.tipo}
                                    onChange={e =>
                                        setFormFalta(prev => ({
                                            ...prev,
                                            tipo: e.target.value
                                        }))
                                    }
                                >
                                    <option value="Injustificada">
                                        Injustificada
                                    </option>
                                    <option value="Justificada">
                                        Justificada
                                    </option>
                                </select>
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label">
                                    Motivo u observaciones
                                </label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    maxLength="2000"
                                    placeholder="Explica el motivo de la ausencia..."
                                    value={formFalta.motivo}
                                    onChange={e =>
                                        setFormFalta(prev => ({
                                            ...prev,
                                            motivo: e.target.value
                                        }))
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-danger">
                                Guardar falta
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setMostrarFormularioFalta(false);
                                    setFormFalta({ ...faltaVacia });
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* FILTRAR SOLICITUDES Y FALTAS */}

            <div className="card card-custom p-3 mb-4">
                <label className="form-label">
                    Filtrar historial por nutricionista
                </label>

                <select
                    className="form-select"
                    value={filtroAsistencia}
                    onChange={e => setFiltroAsistencia(e.target.value)}
                >
                    <option value="todos">Todos los nutricionistas</option>

                    {nutricionistas.map(n => (
                        <option key={n.id} value={String(n.id)}>
                            {n.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {/* SOLICITUDES DE PERMISO */}

            <h5 className="mb-3">
                <i className="bi bi-envelope-paper me-2"></i>
                Solicitudes de permisos
            </h5>

            <div className="table-responsive bg-white rounded shadow-sm p-3 mb-4">
                <table className="table table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Nutricionista</th>
                            <th>Correo</th>
                            <th>Desde</th>
                            <th>Hasta</th>
                            <th>Justificativo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {permisosFiltrados.map(p => (
                            <tr key={p.id}>
                                <td><strong>{p.nombre}</strong></td>
                                <td>{p.correo}</td>
                                <td>{formatearFecha(p.fechaInicio)}</td>
                                <td>{formatearFecha(p.fechaFin)}</td>
                                <td style={{ whiteSpace: 'pre-wrap', minWidth: 160 }}>
                                    {p.justificativo}
                                </td>
                                <td>
                                    <span className={`badge ${claseEstadoPermiso(p.estado)}`}>
                                        {p.estado}
                                    </span>
                                </td>
                                <td>
                                    {p.estado === 'Pendiente' ? (
                                        <div className="d-flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-success"
                                                onClick={() =>
                                                    aprobarORechazarPermiso(p.id, 'Aprobado')
                                                }
                                            >
                                                Aprobar
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() =>
                                                    aprobarORechazarPermiso(p.id, 'Rechazado')
                                                }
                                            >
                                                Rechazar
                                            </button>
                                        </div>
                                    ) : (
                                        <small className="text-muted">
                                            Procesado
                                        </small>
                                    )}
                                </td>
                            </tr>
                        ))}

                        {permisosFiltrados.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-4 text-muted">
                                    No existen solicitudes de permisos.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* HISTORIAL DE FALTAS */}

            <h5 className="mb-3">
                <i className="bi bi-clock-history me-2"></i>
                Historial de faltas laborales
            </h5>

            <div className="table-responsive bg-white rounded shadow-sm p-3 mb-5">
                <table className="table table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Nutricionista</th>
                            <th>Correo</th>
                            <th>Fecha</th>
                            <th>Tipo</th>
                            <th>Observaciones</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {faltasFiltradas.map(f => (
                            <tr key={f.id}>
                                <td><strong>{f.nombre}</strong></td>
                                <td>{f.correo}</td>
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
                                <td style={{ whiteSpace: 'pre-wrap' }}>
                                    {f.motivo}
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => eliminarFalta(f.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {faltasFiltradas.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-muted">
                                    No existen faltas laborales registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* =====================================
                GESTIÓN DE USUARIOS
            ===================================== */}

            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <h4 className="mb-0">
                    <i className="bi bi-people-fill me-2"></i>
                    Gestión de Usuarios
                </h4>

                <button
                    type="button"
                    className="btn btn-success"
                    onClick={abrirNuevoUsuario}
                >
                    <i className="bi bi-person-plus me-2"></i>
                    Crear Usuario
                </button>
            </div>

            {/* FORMULARIO DE CREACIÓN Y EDICIÓN */}

            {mostrarFormulario && (
                <div className="card card-custom p-4 mb-4">
                    <h5 className="text-nutri mb-3">
                        {usuarioEditar
                            ? 'Editar Usuario'
                            : 'Crear Nuevo Usuario'}
                    </h5>

                    <form onSubmit={guardarUsuario}>
                        <div className="row">

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Nombre completo
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="nombre"
                                    value={form.nombre}
                                    onChange={actualizarCampo}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">RUT</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="rut"
                                    placeholder="12.345.678-5"
                                    value={form.rut}
                                    onChange={actualizarCampo}
                                    maxLength="12"
                                    required
                                />
                                <small className="text-muted">
                                    RUT chileno con dígito verificador.
                                </small>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="correo"
                                    value={form.correo}
                                    onChange={actualizarCampo}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Teléfono</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    name="telefono"
                                    placeholder="+56 9 1234 5678"
                                    value={form.telefono}
                                    onChange={actualizarCampo}
                                    maxLength="16"
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Rol</label>
                                <select
                                    className="form-select"
                                    name="rol"
                                    value={form.rol}
                                    disabled={!!usuarioEditar}
                                    onChange={actualizarCampo}
                                    required
                                >
                                    <option value="paciente">Paciente</option>
                                    <option value="nutricionista">Nutricionista</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>

                            {(form.rol === "paciente") && <><div className="col-md-6 mb-3"><label className="form-label">Fecha de nacimiento</label><input type="date" name="fechaNac" className="form-control" value={form.fechaNac} onChange={actualizarCampo} required/></div><div className="col-md-6 mb-3"><label className="form-label">Género</label><select name="genero" className="form-select" value={form.genero} onChange={actualizarCampo} required><option value="">Selecciona</option><option>Femenino</option><option>Masculino</option><option>Otro</option></select></div></>}
                            {form.rol === "nutricionista" && <><div className="col-md-6 mb-3"><label className="form-label">Especialidad</label><input name="especialidad" className="form-control" value={form.especialidad} onChange={actualizarCampo} required/></div><div className="col-md-6 mb-3"><label className="form-label">Imagen (ruta local opcional)</label><input name="imagen" className="form-control" value={form.imagen} onChange={actualizarCampo}/></div></>}
                            {(
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        {usuarioEditar ? "Nueva contraseña (opcional)" : "Contraseña inicial"}
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="clave"
                                        value={form.clave}
                                        onChange={actualizarCampo}
                                        minLength="8"
                                        required={!usuarioEditar}
                                    />
                                </div>
                            )}
                            {(!usuarioEditar || form.clave) && <div className="col-md-6 mb-3"><label className="form-label">Confirmar contraseña</label><input type="password" className="form-control" name="confirmarClave" value={form.confirmarClave} onChange={actualizarCampo} required minLength="8"/></div>}
                        </div>

                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-success" disabled={guardando}>
                                <i className="bi bi-save me-2"></i>
                                Guardar
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={limpiarFormulario}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* FILTROS DE USUARIOS */}

            <div className="card card-custom p-3 mb-3">
                <div className="row">
                    <div className="col-md-6 mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por nombre, RUT o correo..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                        />
                    </div>

                    <div className="col-md-3 mb-2">
                        <select
                            className="form-select"
                            value={filtroRol}
                            onChange={e => setFiltroRol(e.target.value)}
                        >
                            <option value="todos">Todos los roles</option>
                            <option value="admin">Administrador</option>
                            <option value="nutricionista">Nutricionista</option>
                            <option value="paciente">Paciente</option>
                        </select>
                    </div>

                    <div className="col-md-3 mb-2">
                        <select
                            className="form-select"
                            value={filtroEstado}
                            onChange={e => setFiltroEstado(e.target.value)}
                        >
                            <option value="todos">Todos los estados</option>
                            <option value="activo">Activos</option>
                            <option value="inactivo">Inactivos</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* TABLA DE USUARIOS */}

            <div className="table-responsive bg-white rounded shadow-sm p-3 mb-5">
                <table className="table table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>RUT</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {usuariosFiltrados.map(u => (
                            <tr key={u.id}>
                                <td><strong>{u.nombre}</strong></td>
                                <td>{u.rut}</td>
                                <td>{u.correo}</td>
                                <td>{u.telefono}</td>

                                <td>
                                    <span className={`badge ${
                                        u.rol === 'admin'
                                            ? 'bg-dark'
                                            : u.rol === 'nutricionista'
                                                ? 'bg-info text-dark'
                                                : 'bg-primary'
                                    }`}>
                                        {u.rol === 'admin'
                                            ? 'Administrador'
                                            : u.rol === 'nutricionista'
                                                ? 'Nutricionista'
                                                : 'Paciente'}
                                    </span>
                                </td>

                                <td>
                                    <span className={`badge ${
                                        u.activo ? 'bg-success' : 'bg-secondary'
                                    }`}>
                                        {u.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>

                                <td>
                                    <div className="d-flex flex-wrap gap-1">

                                        {/* BOTÓN DE EDICIÓN CONSERVADO */}
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => abrirEdicion(u)}
                                            title="Editar usuario"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>

                                        <button
                                            type="button"
                                            className={`btn btn-sm ${
                                                u.activo
                                                    ? 'btn-outline-danger'
                                                    : 'btn-outline-success'
                                            }`}
                                            disabled={u.rol === 'admin' && u.id === 1}
                                            onClick={() => alternarEstadoUsuario(u.id)}
                                            title={u.activo ? 'Desactivar' : 'Activar'}
                                        >
                                            <i className={`bi ${
                                                u.activo
                                                    ? 'bi-person-x'
                                                    : 'bi-person-check'
                                            }`}></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {usuariosFiltrados.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-4 text-muted">
                                    No se encontraron usuarios.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* =====================================
                GESTIÓN DE CITAS
            ===================================== */}

            <h4 className="mb-3">
                <i className="bi bi-calendar-check me-2"></i>
                Gestión de Solicitudes y Citas
            </h4>

            <div className="table-responsive bg-white rounded shadow-sm p-3">
                <table className="table table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Paciente</th>
                            <th>Nutricionista</th>
                            <th>Motivo</th>
                            <th>Fecha / Hora</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {citas.map(cita => (
                            <tr key={cita.id}>
                                <td>
                                    <strong>{cita.paciente}</strong>
                                    <div className="small text-muted">
                                        {cita.correoPaciente}
                                    </div>
                                </td>

                                <td>{cita.nutricionista}</td>
                                <td>{cita.motivo}</td>

                                <td>
                                    {formatearFecha(cita.fecha)}
                                    <br />
                                    {cita.hora}
                                </td>

                                <td>
                                    <span className={`badge ${claseEstadoCita(cita.estado)}`}>
                                        {cita.estado}
                                    </span>

                                    {cita.propuestaReprogramacion && (
                                        <div className="small mt-2">
                                            Nueva fecha propuesta:
                                            <br />
                                            {formatearFecha(cita.propuestaReprogramacion.fecha)}
                                            {' '}
                                            {cita.propuestaReprogramacion.hora}
                                        </div>
                                    )}
                                </td>

                                <td>
                                    <div className="d-flex flex-column gap-1">
                                        {cita.estado === 'Pendiente' && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-success"
                                                onClick={() =>
                                                    actualizarEstadoCita(cita.id, 'Confirmada')
                                                }
                                            >
                                                Confirmar
                                            </button>
                                        )}

                                        {cita.estado === 'Reprogramación solicitada' && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-success"
                                                onClick={() =>
                                                    aprobarReprogramacion(cita.id)
                                                }
                                            >
                                                Aprobar cambio
                                            </button>
                                        )}

                                        {cita.estado === 'Confirmada' && (
                                            <>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() =>
                                                        actualizarEstadoCita(cita.id, 'Completada')
                                                    }
                                                >
                                                    Completada
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() =>
                                                        actualizarEstadoCita(cita.id, 'Inasistencia')
                                                    }
                                                >
                                                    Inasistencia
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {citas.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-muted">
                                    Todavía no existen solicitudes de citas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
