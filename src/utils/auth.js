
const USERS_KEY = 'nutrivida_usuarios';
const SESSION_KEY = 'nutrivida_sesion';
const APPOINTMENTS_KEY = 'nutrivida_citas';
const PERMISSIONS_KEY = 'nutrivida_permisos';
const ABSENCES_KEY = 'nutrivida_faltas';

const usuariosIniciales = [
    {
        id: 1,
        nombre: 'Administrador NutriVida',
        rut: '11.111.111-1',
        correo: 'admin@nutrivida.cl',
        telefono: '+56 9 1111 1111',
        clave: 'Admin123!',
        rol: 'admin',
        activo: true
    },
    {
        id: 2,
        nombre: 'Dra. María González',
        rut: '12.345.678-5',
        correo: 'm.gonzalez@nutrivida.cl',
        telefono: '+56 9 1234 5678',
        clave: 'Nutri123!',
        rol: 'nutricionista',
        activo: true
    },
    {
        id: 3,
        nombre: 'Camila Silva',
        rut: '18.765.432-7',
        correo: 'camila.silva@gmail.com',
        telefono: '+56 9 9123 4567',
        clave: 'Paciente123!',
        rol: 'paciente',
        activo: true
    }
];

function leerLista(clave) {
    try {
        const datos = JSON.parse(localStorage.getItem(clave) || '[]');
        return Array.isArray(datos) ? datos : [];
    } catch {
        return [];
    }
}

export function obtenerUsuarios() {
    const guardados = localStorage.getItem(USERS_KEY);

    if (!guardados) {
        guardarUsuarios(usuariosIniciales);
        return usuariosIniciales;
    }

    try {
        const usuarios = JSON.parse(guardados);
        return Array.isArray(usuarios) ? usuarios : [];
    } catch {
        return [];
    }
}

export function guardarUsuarios(usuarios) {
    localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
}

export function obtenerSesion() {
    try {
        const datos = localStorage.getItem(SESSION_KEY);
        return datos ? JSON.parse(datos) : null;
    } catch {
        return null;
    }
}

export function iniciarSesion(correo, clave) {
    const usuario = obtenerUsuarios().find(
        u =>
            u.correo.toLowerCase() === correo.trim().toLowerCase() &&
            u.clave === clave &&
            u.activo
    );

    if (!usuario) return null;

    const sesion = {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
    return sesion;
}

export function cerrarSesion() {
    localStorage.removeItem(SESSION_KEY);
}

export function registrarPaciente(datos) {
    const usuarios = obtenerUsuarios();

    const correoExiste = usuarios.some(
        u => u.correo.toLowerCase() === datos.correo.trim().toLowerCase()
    );

    const normalizarRut = rut =>
        String(rut).replace(/[.\-\s]/g, '').toUpperCase();

    const rutExiste = usuarios.some(
        u => normalizarRut(u.rut) === normalizarRut(datos.rut)
    );

    if (correoExiste) {
        return { ok: false, mensaje: 'Este correo ya está registrado.' };
    }

    if (rutExiste) {
        return { ok: false, mensaje: 'Este RUT ya está registrado.' };
    }

    const nuevoPaciente = {
        id: Date.now(),
        nombre: datos.nombre.trim(),
        rut: datos.rut.trim(),
        correo: datos.correo.trim().toLowerCase(),
        telefono: datos.telefono.trim(),
        fechaNac: datos.fechaNac,
        genero: datos.genero,
        clave: datos.clave,
        rol: 'paciente',
        activo: true
    };

    guardarUsuarios([...usuarios, nuevoPaciente]);
    return { ok: true };
}

export function obtenerCitas() {
    return leerLista(APPOINTMENTS_KEY);
}

export function guardarCitas(citas) {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(citas));
}

// SOLICITUDES DE PERMISO DE NUTRICIONISTAS

export function obtenerPermisos() {
    return leerLista(PERMISSIONS_KEY);
}

export function guardarPermisos(permisos) {
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permisos));
}

// FALTAS LABORALES REGISTRADAS POR ADMINISTRACIÓN

export function obtenerFaltas() {
    return leerLista(ABSENCES_KEY);
}

export function guardarFaltas(faltas) {
    localStorage.setItem(ABSENCES_KEY, JSON.stringify(faltas));
}
