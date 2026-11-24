// Los puertos corresponden a los cinco proyectos Spring Boot entregados.
const bases = {
  pacientes: process.env.REACT_APP_PACIENTES_URL || 'http://localhost:8081/api/pacientes',
  nutricionistas: process.env.REACT_APP_NUTRICIONISTAS_URL || 'http://localhost:8082/api/nutricionistas',
  citas: process.env.REACT_APP_CITAS_URL || 'http://localhost:8083/api/citas',
  fichas: process.env.REACT_APP_FICHAS_URL || 'http://localhost:8084/api/fichas-clinicas',
  usuarios: process.env.REACT_APP_USUARIOS_URL || 'http://localhost:8085/api/usuarios',
  auth: process.env.REACT_APP_AUTH_URL || (process.env.REACT_APP_USUARIOS_URL || 'http://localhost:8085/api/usuarios').replace(/\/usuarios\/?$/, '/auth')
};

async function solicitar(servicio, ruta = '', opciones = {}) {
  let token;
  try { token = JSON.parse(sessionStorage.getItem('nutrivida_sesion_api') || 'null')?.token; } catch {}
  if ((servicio === 'auth' && ['/login','/registro'].includes(ruta)) || (servicio === 'nutricionistas' && ruta === '/catalogo')) token = null;
  const respuesta = await fetch(`${bases[servicio]}${ruta}`, {
    ...opciones,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...opciones.headers }
  });
  if (!respuesta.ok) {
    const contenido = await respuesta.text();
    if (respuesta.status === 401 && token && !(servicio === 'auth' && ruta === '/login')) { sessionStorage.removeItem('nutrivida_sesion_api'); window.dispatchEvent(new Event('nutrivida-sesion')); }
    let detalle; try { detalle = JSON.parse(contenido).message; } catch {}
    throw new Error(detalle || (respuesta.status === 401 ? 'Sesión inválida o credenciales incorrectas.' : respuesta.status === 403 ? 'No tienes permiso para esta operación.' : `HTTP ${respuesta.status}: ${respuesta.statusText}`));
  }
  if (respuesta.status === 204) return null;
  return respuesta.json();
}

export const api = Object.fromEntries(Object.keys(bases).map(nombre => [nombre, {
  listar: () => solicitar(nombre),
  buscar: id => solicitar(nombre, `/${id}`),
  crear: datos => solicitar(nombre, '', { method: 'POST', body: JSON.stringify(datos) }),
  actualizar: (id, datos) => solicitar(nombre, `/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
  eliminar: id => solicitar(nombre, `/${id}`, { method: 'DELETE' }),
  porPaciente: id => solicitar(nombre, `/paciente/${id}`),
  porNutricionista: id => solicitar(nombre, `/nutricionista/${id}`)
}]));

export const authApi = { login: (correo, clave) => solicitar('auth','/login',{method:'POST',body:JSON.stringify({correo,clave})}), registro: datos => solicitar('auth','/registro',{method:'POST',body:JSON.stringify(datos)}), me: () => solicitar('auth','/me') };
export const citasApi = { listar: api.citas.listar, crear: api.citas.crear, accion: (id,accion,inicio) => solicitar('citas',`/${id}/accion`,{method:'PATCH',body:JSON.stringify({accion,inicio})}), ocupados: (id,fecha) => solicitar('citas',`/ocupados?nutricionistaId=${encodeURIComponent(id)}&fecha=${encodeURIComponent(fecha)}`) };
export const catalogo = () => solicitar('nutricionistas','/catalogo');
