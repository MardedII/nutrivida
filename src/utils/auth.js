
const USERS_KEY = 'nutrivida_usuarios';
const SESSION_KEY = 'nutrivida_sesion';
const APPOINTMENTS_KEY = 'nutrivida_citas';
const PERMISSIONS_KEY = 'nutrivida_permisos';
const ABSENCES_KEY = 'nutrivida_faltas';

// ==========================================
// USUARIOS PREDETERMINADOS DE NUTRIVIDA
// ==========================================

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
        especialidad: 'Pérdida de Peso',
        imagen: '/img/1nutri.jpg',
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
    },
    {
        id: 101,
        nombre: 'Dr. Carlos Rojas',
        rut: '15.432.109-8',
        correo: 'c.rojas@nutrivida.cl',
        telefono: '+56 9 8765 4321',
        clave: 'Nutri123!',
        rol: 'nutricionista',
        especialidad: 'Salud Metabólica',
        imagen: '/img/2nutri.png',
        activo: true
    },
    {
        id: 102,
        nombre: 'Dra. Andrea Silva',
        rut: '19.876.543-0',
        correo: 'a.silva@nutrivida.cl',
        telefono: '+56 9 7654 3210',
        clave: 'Nutri123!',
        rol: 'nutricionista',
        especialidad: 'Nutrición Deportiva',
        imagen: '/img/3nutri.png',
        activo: true
    },
    {
        id: 103,
        nombre: 'Dr. Felipe Morales',
        rut: '16.789.012-1',
        correo: 'f.morales@nutrivida.cl',
        telefono: '+56 9 6543 2109',
        clave: 'Nutri123!',
        rol: 'nutricionista',
        especialidad: 'Alimentación Vegana',
        imagen: '/img/nutri4.jpg',
        activo: true
    }
];

// ==========================================
// LECTURA SEGURA DE LISTAS
// ==========================================

function leerLista(clave) {
    try {
        const datos = JSON.parse(
            localStorage.getItem(clave) || '[]'
        );

        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        console.error('Error leyendo datos:', clave, error);
        return [];
    }
}

// ==========================================
// GESTIÓN DE USUARIOS
// ==========================================

export function obtenerUsuarios() {
    const guardados = localStorage.getItem(USERS_KEY);

    // Primera ejecución: crear usuarios iniciales.
    if (!guardados) {
        guardarUsuarios(usuariosIniciales);
        return [...usuariosIniciales];
    }

    let usuarios;

    try {
        usuarios = JSON.parse(guardados);

        if (!Array.isArray(usuarios)) {
            usuarios = [];
        }
    } catch (error) {
        console.error('Error leyendo usuarios:', error);
        return [];
    }

    // Agregar las nuevas cuentas predeterminadas
    // sin eliminar pacientes ni usuarios ya registrados.
    let huboCambios = false;

    const idsUtilizados = new Set(
        usuarios.map(u => String(u.id))
    );

    usuariosIniciales.forEach(inicial => {
        const existeCorreo = usuarios.some(
            u =>
                String(u.correo || '').toLowerCase() ===
                inicial.correo.toLowerCase()
        );

        const existeRut = usuarios.some(
            u =>
                String(u.rut || '')
                    .replace(/[.\-\s]/g, '')
                    .toUpperCase() ===
                inicial.rut
                    .replace(/[.\-\s]/g, '')
                    .toUpperCase()
        );

        if (!existeCorreo && !existeRut) {
            let nuevoId = inicial.id;

            
            while (idsUtilizados.has(String(nuevoId))) {
                nuevoId++;
            }
                
            usuarios.push({
                ...inicial,
                id: nuevoId
            });

            idsUtilizados.add(String(nuevoId));
            huboCambios = true;
        }
    });

    if (huboCambios) {
        guardarUsuarios(usuarios);
    }

    return usuarios;
}

export function guardarUsuarios(usuarios) {
    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(usuarios)
    );
}

// ==========================================
// SESIONES
// ==========================================

export function obtenerSesion() {
    try {
        const datos = localStorage.getItem(SESSION_KEY);

        if (!datos) return null;

        const sesion = JSON.parse(datos);

        // Comprobar que el usuario todavía exista,
        // esté activo y tenga el rol registrado.
        const usuarioActual = obtenerUsuarios().find(
            u => String(u.id) === String(sesion.id)
        );

        if (!usuarioActual || !usuarioActual.activo) {
            localStorage.removeItem(SESSION_KEY);
            return null;
        }

        return {
            id: usuarioActual.id,
            nombre: usuarioActual.nombre,
            correo: usuarioActual.correo,
            rol: usuarioActual.rol
        };

    } catch (error) {
        console.error('Error obteniendo sesión:', error);
        return null;
    }
}

export function iniciarSesion(correo, clave) {
    const usuarios = obtenerUsuarios();

    const usuario = usuarios.find(
        u =>
            String(u.correo || '').toLowerCase() ===
                String(correo || '').trim().toLowerCase() &&
            u.clave === clave &&
            u.activo === true
    );

    if (!usuario) return null;

    const sesion = {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
    };

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(sesion)
    );

    return sesion;
}

export function cerrarSesion() {
    localStorage.removeItem(SESSION_KEY);
}

// ==========================================
// REGISTRO DE PACIENTES
// ==========================================

export function registrarPaciente(datos) {
    const usuarios = obtenerUsuarios();

    const correoNormalizado =
        String(datos.correo || '').trim().toLowerCase();

    const rutNormalizado =
        String(datos.rut || '')
            .replace(/[.\-\s]/g, '')
            .toUpperCase();

    const correoExiste = usuarios.some(
        u =>
            String(u.correo || '').toLowerCase() ===
            correoNormalizado
    );

    if (correoExiste) {
        return {
            ok: false,
            mensaje: 'Este correo ya está registrado.'
        };
    }

    const rutExiste = usuarios.some(
        u =>
            String(u.rut || '')
                .replace(/[.\-\s]/g, '')
                .toUpperCase() === rutNormalizado
    );

    if (rutExiste) {
        return {
            ok: false,
            mensaje: 'Este RUT ya está registrado.'
        };
    }

    // Identificador único para el nuevo paciente.
    const idsExistentes = usuarios.map(usuario => String(usuario.id));

    let nuevoId = Date.now();

    // Comprobar que el ID no esté repetido
    while (idsExistentes.includes(String(nuevoId))) {
        nuevoId = nuevoId + 1;
}

    const nuevoPaciente = {
        id: nuevoId,
        nombre: datos.nombre.trim(),
        rut: datos.rut.trim(),
        correo: correoNormalizado,
        telefono: datos.telefono.trim(),
        fechaNac: datos.fechaNac,
        genero: datos.genero,
        clave: datos.clave,
        rol: 'paciente',
        activo: true
    };

    guardarUsuarios([
        ...usuarios,
        nuevoPaciente
    ]);

    return {
        ok: true,
        usuario: {
            id: nuevoPaciente.id,
            nombre: nuevoPaciente.nombre,
            correo: nuevoPaciente.correo,
            rol: nuevoPaciente.rol
        }
    };
}

// ==========================================
// GESTIÓN DE CITAS
// ==========================================

export function obtenerCitas() {
    return leerLista(APPOINTMENTS_KEY);
}

export function guardarCitas(citas) {
    localStorage.setItem(
        APPOINTMENTS_KEY,
        JSON.stringify(citas)
    );
}

// ==========================================
// SOLICITUDES DE PERMISOS
// ==========================================

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
