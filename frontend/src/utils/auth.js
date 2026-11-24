import { authApi } from '../services/api';
const SESSION_KEY = 'nutrivida_sesion_api';
const PERMISSIONS_KEY = 'nutrivida_permisos';
const ABSENCES_KEY = 'nutrivida_faltas';
// Los datos antiguos no se migran automáticamente: contienen contraseñas en texto plano.
function leerLista(clave) { try { const d=JSON.parse(localStorage.getItem(clave)||'[]'); return Array.isArray(d)?d:[]; } catch { return []; } }
export function obtenerSesion() { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null')?.usuario || null; } catch { return null; } }
export async function iniciarSesion(correo,clave) { const sesion=await authApi.login(correo,clave); sessionStorage.setItem(SESSION_KEY,JSON.stringify(sesion)); window.dispatchEvent(new Event('nutrivida-sesion')); return sesion.usuario; }
export function cerrarSesion() { sessionStorage.removeItem(SESSION_KEY); window.dispatchEvent(new Event('nutrivida-sesion')); }
export async function registrarPaciente(datos) { return authApi.registro(datos); }
export function obtenerPermisos() {
    return leerLista(PERMISSIONS_KEY);
}

export function guardarPermisos(permisos) {
    localStorage.setItem(
        PERMISSIONS_KEY,
        JSON.stringify(permisos)
    );
}

// ==========================================
// FALTAS LABORALES
// ==========================================

export function obtenerFaltas() {
    return leerLista(ABSENCES_KEY);
}

export function guardarFaltas(faltas) {
    localStorage.setItem(
        ABSENCES_KEY,
        JSON.stringify(faltas)
    );
}
