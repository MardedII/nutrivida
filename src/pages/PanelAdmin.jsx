import React, { useState } from 'react';

export default function PanelAdmin() {
    // Lista inicial con los 4 nutricionistas y los pacientes registrados en la clínica
    const [usuarios, setUsuarios] = useState([
        { id: 1, nombre: 'Dra. María González', rut: '12.345.678-9', telefono: '+56 9 1234 5678', correo: 'm.gonzalez@nutrivida.cl', rol: 'Nutricionista', activo: true },
        { id: 2, nombre: 'Dr. Carlos Rojas', rut: '14.567.890-1', telefono: '+56 9 8765 4321', correo: 'c.rojas@nutrivida.cl', rol: 'Nutricionista', activo: true },
        { id: 3, nombre: 'Dra. Andrea Silva', rut: '15.678.901-2', telefono: '+56 9 7654 3210', correo: 'a.silva@nutrivida.cl', rol: 'Nutricionista', activo: true },
        { id: 4, nombre: 'Dr. Felipe Morales', rut: '16.789.012-3', telefono: '+56 9 6543 2109', correo: 'f.morales@nutrivida.cl', rol: 'Nutricionista', activo: true },
        { id: 5, nombre: 'Camila Silva', rut: '18.765.432-1', telefono: '+56 9 9123 4567', correo: 'camila.silva@gmail.com', rol: 'Paciente', activo: true }
    ]);

    // Estados para ausencias
    const [ausenciaNutri, setAusenciaNutri] = useState('Dra. María González');
    const [ausenciaFecha, setAusenciaFecha] = useState('');

    // Estado para el formulario del nuevo médico
    const [nuevoMedico, setNuevoMedico] = useState({
        nombre: '',
        apellido: '',
        rut: '',
        correo: '',
        telefono: ''
    });

    // Alternar estado (Activo / Inactivo)
    const alternarEstadoUsuario = (id) => {
        setUsuarios(usuarios.map(u => 
            u.id === id ? { ...u, activo: !u.activo } : u
        ));
    };

    // Registrar ausencia
    const handleRegistrarAusencia = () => {
        if (!ausenciaFecha) {
            alert('Por favor, seleccione una fecha.');
            return;
        }
        alert(`Ausencia registrada para ${ausenciaNutri} el día ${ausenciaFecha}. Las citas de los pacientes han pasado a "Reprogramación Pendiente".`);
        setAusenciaFecha('');
    };

    // Función para agregar un nuevo médico a la tabla
    const handleAgregarMedico = (e) => {
        e.preventDefault();
        const { nombre, apellido, rut, correo, telefono } = nuevoMedico;

        if (!nombre.trim() || !apellido.trim()) {
            alert('Por favor, ingrese el nombre y apellido del médico.');
            return;
        }

        if (!correo.includes('@') || !correo.includes('.')) {
            alert('Ingrese un correo electrónico válido (ejemplo: doctor@nutrivida.cl).');
            return;
        }

        const nuevoRegistro = {
            id: Date.now(),
            nombre: `Dr(a). ${nombre.trim()} ${apellido.trim()}`,
            rut: rut.trim() || 'Sin RUT',
            telefono: telefono.trim() || '+56 9 0000 0000',
            correo: correo.trim(),
            rol: 'Nutricionista',
            activo: true
        };

        setUsuarios([...usuarios, nuevoRegistro]);
        setNuevoMedico({ nombre: '', apellido: '', rut: '', correo: '', telefono: '' });
        alert(`¡El/La profesional Dr(a). ${nombre} ${apellido} ha sido registrado(a) exitosamente!`);
    };

    // Función para despedir / eliminar médico o usuario
    const handleEliminarUsuario = (id, nombre, rol) => {
        const mensajeConfirmacion = rol === 'Nutricionista' 
            ? `¿Está seguro de que desea despedir y eliminar a ${nombre} de la clínica?` 
            : `¿Está seguro de que desea eliminar al usuario ${nombre}?`;

        if (window.confirm(mensajeConfirmacion)) {
            setUsuarios(usuarios.filter(u => u.id !== id));
            alert(`${nombre} ha sido eliminado(a) del sistema.`);
        }
    };

    return (
        <main className="container my-5">
            <h3 className="mb-4">Estadísticas Globales de la Clínica (Mes Actual)</h3>
            <div className="row mb-5 text-center">
                <div className="col-md-4 mb-3">
                    <div className="card-custom p-4">
                        <h2 className="text-primary">145</h2>
                        <p className="mb-0">Atenciones por Período</p>
                        <small className="text-muted">Citas completadas este mes</small>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card-custom p-4">
                        <h2 className="text-danger">12%</h2>
                        <p className="mb-0">Tasa de Inasistencia</p>
                        <small className="text-muted">Pacientes que no se presentaron</small>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card-custom p-4">
                        <h5 className="text-success">Distribución por Nutricionista</h5>
                        <p className="mb-0 small">Dra. González (45%) | Dr. Rojas (35%) | Dra. Silva (20%)</p>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Gestión de Usuarios y Roles</h4>
                <div>
                    <button className="btn btn-warning me-2" data-bs-toggle="modal" data-bs-target="#modalAusencias">
                        <i className="bi bi-calendar-event me-1"></i> Gestionar Ausencias
                    </button>
                    <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalNuevoMedico">
                        <i className="bi bi-person-plus-fill me-1"></i> Añadir Médico
                    </button>
                </div>
            </div>

            <div className="table-responsive bg-white p-3 rounded shadow-sm">
                <table className="table table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Usuario</th>
                            <th>RUT</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Control</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((u) => (
                            <tr key={u.id}>
                                <td><strong>{u.nombre}</strong></td>
                                <td>{u.rut}</td>
                                <td>{u.correo}</td>
                                <td>{u.telefono}</td>
                                <td>
                                    <span className={`badge ${u.rol === 'Nutricionista' ? 'bg-info text-dark' : 'bg-primary'}`}>
                                        {u.rol}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${u.activo ? 'bg-success' : 'bg-secondary'} badge-status`}>
                                        {u.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td>
                                    {/* BOTÓN DESACTIVAR / ACTIVAR CON TAMAÑO HOMOGÉNEO */}
                                    <button 
                                        className={`btn btn-sm ${u.activo ? 'btn-outline-warning' : 'btn-outline-success'} me-1`}
                                        style={{ minWidth: '95px' }}
                                        onClick={() => alternarEstadoUsuario(u.id)}
                                    >
                                        {u.activo ? 'Desactivar' : 'Activar'}
                                    </button>

                                    {/* BOTÓN DESPEDIR CON EL MISMO ANCHO */}
                                    <button 
                                        className="btn btn-sm btn-outline-danger"
                                        style={{ minWidth: '95px' }}
                                        onClick={() => handleEliminarUsuario(u.id, u.nombre, u.rol)}
                                        title="Eliminar usuario del sistema"
                                    >
                                        Despedir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL 1: REGISTRAR AUSENCIAS */}
            <div className="modal fade" id="modalAusencias" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Registrar Ausencia / Reprogramar</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Nutricionista:</label>
                                <select 
                                    className="form-select"
                                    value={ausenciaNutri} 
                                    onChange={(e) => setAusenciaNutri(e.target.value)}
                                >
                                    {usuarios.filter(u => u.rol === 'Nutricionista').map(m => (
                                        <option key={m.id} value={m.nombre}>{m.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Fecha de inasistencia:</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    value={ausenciaFecha} 
                                    onChange={(e) => setAusenciaFecha(e.target.value)} 
                                />
                            </div>
                            <button className="btn btn-primary w-100" data-bs-dismiss="modal" onClick={handleRegistrarAusencia}>
                                Registrar y Liberar Agenda
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL 2: AÑADIR MÉDICO / NUTRICIONISTA */}
            <div className="modal fade" id="modalNuevoMedico" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-success text-white">
                            <h5 className="modal-title"><i className="bi bi-person-plus-fill me-2"></i>Añadir Nuevo Médico</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleAgregarMedico}>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-6 mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Ej. Roberto" 
                                            value={nuevoMedico.nombre}
                                            onChange={(e) => setNuevoMedico({ ...nuevoMedico, nombre: e.target.value })}
                                            required 
                                        />
                                    </div>
                                    <div className="col-6 mb-3">
                                        <label className="form-label">Apellido</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Ej. Morales" 
                                            value={nuevoMedico.apellido}
                                            onChange={(e) => setNuevoMedico({ ...nuevoMedico, apellido: e.target.value })}
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">RUT / Documento Identificación</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Ej. 16.789.012-3" 
                                        value={nuevoMedico.rut}
                                        onChange={(e) => setNuevoMedico({ ...nuevoMedico, rut: e.target.value })}
                                        required 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Correo Electrónico Institucional</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        placeholder="r.morales@nutrivida.cl" 
                                        value={nuevoMedico.correo}
                                        onChange={(e) => setNuevoMedico({ ...nuevoMedico, correo: e.target.value })}
                                        required 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Número Celular / Contacto</label>
                                    <input 
                                        type="tel" 
                                        className="form-control" 
                                        placeholder="+56 9 8765 4321" 
                                        value={nuevoMedico.telefono}
                                        onChange={(e) => setNuevoMedico({ ...nuevoMedico, telefono: e.target.value })}
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="submit" className="btn btn-success" data-bs-dismiss="modal">Guardar Médico</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}