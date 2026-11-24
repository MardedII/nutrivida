import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

// Solo para desarrollo local. No utilizar este panel con datos reales hasta añadir JWT y roles.
const configuracion = {
  pacientes: { titulo: 'Pacientes', campos: ['nombre', 'correo', 'telefono', 'activo'], inicial: { nombre: '', correo: '', telefono: '', activo: true } },
  nutricionistas: { titulo: 'Nutricionistas', campos: ['nombre', 'especialidad', 'correo', 'activo'], inicial: { nombre: '', especialidad: '', correo: '', activo: true } },
  citas: { titulo: 'Citas', campos: ['pacienteId', 'nutricionistaId', 'inicio', 'fin', 'estado', 'motivo'], inicial: { pacienteId: '', nutricionistaId: '', inicio: '', fin: '', estado: 'PENDIENTE', motivo: '' } },
  fichas: { titulo: 'Fichas clínicas', campos: ['pacienteId', 'nutricionistaId', 'fecha', 'pesoKg', 'tallaCm', 'observaciones', 'planAlimenticio'], inicial: { pacienteId: '', nutricionistaId: '', fecha: '', pesoKg: '', tallaCm: '', observaciones: '', planAlimenticio: '' } },
  usuarios: { titulo: 'Usuarios (sin login)', campos: ['correo', 'rol', 'activo'], inicial: { correo: '', rol: 'PACIENTE', activo: true } }
};
const booleanos = new Set(['activo']);
const numericos = new Set(['pacienteId', 'nutricionistaId', 'pesoKg', 'tallaCm']);
const fechas = new Set(['fecha', 'inicio', 'fin']);

function preparar(form) {
  return Object.fromEntries(Object.entries(form).map(([campo, valor]) => {
    if (numericos.has(campo)) return [campo, valor === '' ? null : Number(valor)];
    if (fechas.has(campo) && campo !== 'fecha' && valor) return [campo, valor.length === 16 ? `${valor}:00` : valor];
    return [campo, valor];
  }));
}

export default function BackendCRUD() {
  const [servicio, setServicio] = useState('pacientes');
  const [registros, setRegistros] = useState([]);
  const [form, setForm] = useState({ ...configuracion.pacientes.inicial });
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const cfg = configuracion[servicio];

  useEffect(() => {
    setForm({ ...configuracion[servicio].inicial });
    setEditando(null);
    setRegistros([]);
    setError('');
    setMensaje('');
    let vigente = true;
    setCargando(true);
    api[servicio].listar().then(datos => { if (vigente) setRegistros(datos); })
      .catch(err => { if (vigente) setError(`No se pudo conectar con ${servicio}: ${err.message}`); })
      .finally(() => { if (vigente) setCargando(false); });
    return () => { vigente = false; };
  }, [servicio]);

  async function refrescar() {
    setCargando(true);
    setError('');
    try { setRegistros(await api[servicio].listar()); }
    catch (err) { setError(err.message); }
    finally { setCargando(false); }
  }

  async function guardar(e) {
    e.preventDefault();
    setError(''); setMensaje('');
    try {
      const datos = preparar(form);
      if (editando == null) await api[servicio].crear(datos);
      else await api[servicio].actualizar(editando, datos);
      setMensaje(editando == null ? 'Registro creado en H2.' : 'Registro actualizado en H2.');
      setForm({ ...cfg.inicial });
      setEditando(null);
      await refrescar();
    } catch (err) { setError(err.message); }
  }

  async function eliminar(id) {
    if (!window.confirm(`¿Eliminar el registro ${id} de ${servicio}?`)) return;
    setError(''); setMensaje('');
    try { await api[servicio].eliminar(id); setMensaje('Registro eliminado.'); await refrescar(); }
    catch (err) { setError(err.message); }
  }

  function editar(registro) {
    setEditando(registro.id);
    setForm(Object.fromEntries(cfg.campos.map(campo => [campo,
      registro[campo] == null ? '' : (fechas.has(campo) && campo !== 'fecha' ? String(registro[campo]).slice(0, 16) : registro[campo])
    ])));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return <main className="container py-4">
    <h1>NutriVida · Conexión real con Spring Boot</h1>
    <div className="alert alert-warning">Panel técnico de desarrollo. No tiene autenticación ni autorización: úsalo solo con datos ficticios en localhost. El login y los paneles originales continúan en modo demostración local.</div>
    <label htmlFor="backend-servicio" className="form-label">Microservicio</label>
    <select id="backend-servicio" className="form-select mb-3" value={servicio} onChange={e => setServicio(e.target.value)}>
      {Object.entries(configuracion).map(([clave, valor]) => <option key={clave} value={clave}>{valor.titulo}</option>)}
    </select>
    {error && <div role="alert" className="alert alert-danger">{error}</div>}
    {mensaje && <div role="status" className="alert alert-success">{mensaje}</div>}
    <section className="card p-3 mb-4">
      <h2 className="h5">{editando == null ? 'Crear' : `Editar #${editando}`} · {cfg.titulo}</h2>
      <form onSubmit={guardar} className="row g-3">
        {cfg.campos.map(campo => <div className="col-md-6" key={campo}>
          <label className="form-label" htmlFor={`campo-${campo}`}>{campo}</label>
          {booleanos.has(campo) ? <select id={`campo-${campo}`} className="form-select" value={String(form[campo])} onChange={e => setForm(f => ({ ...f, [campo]: e.target.value === 'true' }))}><option value="true">Sí</option><option value="false">No</option></select> :
          <input id={`campo-${campo}`} className="form-control" type={fechas.has(campo) ? (campo === 'fecha' ? 'date' : 'datetime-local') : numericos.has(campo) ? 'number' : campo === 'correo' ? 'email' : 'text'} step={['pesoKg', 'tallaCm'].includes(campo) ? '0.01' : undefined} value={form[campo]} required={!['motivo', 'observaciones', 'planAlimenticio', 'pesoKg', 'tallaCm'].includes(campo)} onChange={e => setForm(f => ({ ...f, [campo]: e.target.value }))}/>
          }
        </div>)}
        <div className="col-12 d-flex gap-2"><button className="btn btn-success" type="submit">{editando == null ? 'Guardar en backend' : 'Actualizar'}</button>{editando != null && <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditando(null); setForm({ ...cfg.inicial }); }}>Cancelar edición</button>}</div>
      </form>
    </section>
    <div className="d-flex justify-content-between align-items-center mb-2"><h2 className="h5">Registros ({registros.length})</h2><button className="btn btn-outline-success" type="button" onClick={refrescar} disabled={cargando}>Actualizar desde H2</button></div>
    {cargando && <p>Cargando datos...</p>}
    <div className="table-responsive"><table className="table table-striped table-bordered"><thead><tr><th>ID</th>{cfg.campos.map(c => <th key={c}>{c}</th>)}<th>Acciones</th></tr></thead><tbody>
      {registros.map(r => <tr key={r.id}><td>{r.id}</td>{cfg.campos.map(c => <td key={c}>{typeof r[c] === 'boolean' ? (r[c] ? 'Sí' : 'No') : String(r[c] ?? '')}</td>)}<td><div className="d-flex gap-2"><button className="btn btn-sm btn-outline-primary" onClick={() => editar(r)}>Editar</button><button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(r.id)}>Eliminar</button></div></td></tr>)}
      {!cargando && registros.length === 0 && <tr><td colSpan={cfg.campos.length + 2}>Sin registros.</td></tr>}
    </tbody></table></div>
  </main>;
}
