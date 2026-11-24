
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const PHONE_REGEX = /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/;

// ==========================================
// VALIDACIÓN DE RUT CHILENO
// ==========================================

export function validarRut(rut) {
    if (!rut || typeof rut !== 'string') return false;

    const limpio = rut.replace(/[.\-\s]/g, '').toUpperCase();

    if (!/^\d{7,8}[0-9K]$/.test(limpio)) {
        return false;
    }

    const cuerpo = limpio.slice(0, -1);
    const dvIngresado = limpio.slice(-1);

    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += Number(cuerpo[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resultado = 11 - (suma % 11);

    const dvCalculado =
        resultado === 11 ? '0' :
        resultado === 10 ? 'K' :
        String(resultado);

    return dvIngresado === dvCalculado;
}

export function formatearRut(valor) {
    let limpio = String(valor || '')
        .replace(/[^0-9kK]/g, '')
        .toUpperCase();

    limpio = limpio.slice(0, 9);

    if (limpio.length <= 1) return limpio;

    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);

    return `${cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`;
}

// ==========================================
// TELÉFONO CHILENO
// ==========================================

export function validarTelefono(telefono) {
    if (!telefono || typeof telefono !== 'string') return false;

    const limpio = telefono.replace(/[\s()+-]/g, '');

    const numero = limpio.startsWith('56')
        ? limpio.slice(2)
        : limpio;

    return /^9\d{8}$/.test(numero);
}

export function formatearTelefono(valor) {
    let limpio = String(valor || '').replace(/\D/g, '');

    if (limpio.startsWith('56')) {
        limpio = limpio.slice(2);
    }

    limpio = limpio.slice(0, 9);

    if (!limpio) return '';

    if (limpio.length <= 1) {
        return `+56 ${limpio}`;
    }

    if (limpio.length <= 5) {
        return `+56 ${limpio.slice(0, 1)} ${limpio.slice(1)}`;
    }

    return `+56 ${limpio.slice(0, 1)} ${limpio.slice(1, 5)} ${limpio.slice(5)}`;
}

// ==========================================
// VALIDACIÓN DE CONTRASEÑAS
// ==========================================

export function validarContrasenas(clave, confirmarClave) {
    if (!clave || clave.length < 8) {
        return {
            valido: false,
            mensaje: 'La contraseña debe tener al menos 8 caracteres.'
        };
    }

    if (!confirmarClave) {
        return {
            valido: false,
            mensaje: 'Debes confirmar tu contraseña.'
        };
    }

    if (clave !== confirmarClave) {
        return {
            valido: false,
            mensaje: 'Las contraseñas no coinciden.'
        };
    }

    return {
        valido: true,
        mensaje: ''
    };
}

// ==========================================
// VALIDACIÓN DE LOGIN
// ==========================================

export function validarLogin(correo, clave) {
    const correoTrim = correo ? correo.trim() : '';

    if (!correoTrim) {
        alert('Por favor, ingrese su correo electrónico.');
        return false;
    }

    if (!EMAIL_REGEX.test(correoTrim)) {
        alert('El correo electrónico no es válido.');
        return false;
    }

    if (!clave || clave.trim().length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres.');
        return false;
    }

    return true;
}

// ==========================================
// VALIDACIÓN DE REGISTRO
// ==========================================

// Compatible con llamadas anteriores que pasan parámetros
// individuales y con llamadas que pasan un objeto.
//
// confirmarClave es opcional para mantener compatibilidad con
// otros formularios que ya usan validarRegistro().

export function validarRegistro(
    nombre,
    rut,
    correo,
    telefono,
    fechaNac,
    genero,
    clave,
    rol,
    aceptoTerminos,
    confirmarClave
) {
    if (typeof nombre === 'object' && nombre !== null) {
        const datos = nombre;

        nombre = datos.nombre;
        rut = datos.rut;
        correo = datos.correo;
        telefono = datos.telefono;
        fechaNac = datos.fechaNac;
        genero = datos.genero;
        clave = datos.clave;
        rol = datos.rol;
        aceptoTerminos = datos.aceptoTerminos;
        confirmarClave = datos.confirmarClave;
    }

    if (!nombre || nombre.trim().length < 3) {
        alert('Ingrese su nombre completo (mínimo 3 caracteres).');
        return false;
    }

    if (!validarRut(rut)) {
        alert('El RUT chileno no es válido. Revisa su dígito verificador.');
        return false;
    }

    if (!correo || !EMAIL_REGEX.test(correo.trim())) {
        alert('Ingrese un correo electrónico válido.');
        return false;
    }

    if (!telefono ||
        !validarTelefono(telefono) ||
        !PHONE_REGEX.test(telefono.trim())) {
        alert('Ingrese un teléfono móvil chileno válido.');
        return false;
    }

    if (!fechaNac) {
        alert('Seleccione su fecha de nacimiento.');
        return false;
    }

    // Comprobación de fecha real
    const partes = fechaNac.split('-').map(Number);

    if (partes.length !== 3 || partes.some(n => !Number.isInteger(n))) {
        alert('La fecha de nacimiento no es válida.');
        return false;
    }

    const [anio, mes, dia] = partes;

    const fechaNacimiento = new Date(anio, mes - 1, dia);

    if (
        fechaNacimiento.getFullYear() !== anio ||
        fechaNacimiento.getMonth() !== mes - 1 ||
        fechaNacimiento.getDate() !== dia
    ) {
        alert('La fecha de nacimiento no es válida.');
        return false;
    }

    const hoy = new Date();

    if (fechaNacimiento >= hoy) {
        alert('La fecha de nacimiento debe ser anterior a hoy.');
        return false;
    }

    let edad = hoy.getFullYear() - anio;

    const diferenciaMes = hoy.getMonth() - (mes - 1);

    if (
        diferenciaMes < 0 ||
        (diferenciaMes === 0 && hoy.getDate() < dia)
    ) {
        edad--;
    }

    if (edad < 14) {
        alert('El usuario debe tener al menos 14 años para registrarse.');
        return false;
    }

    if (!genero) {
        alert('Seleccione su género.');
        return false;
    }

    if (!clave || clave.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres.');
        return false;
    }

    // Cuando el formulario incluye confirmarClave,
    // también comprueba que las contraseñas coincidan.
    if (confirmarClave !== undefined) {
        const resultado = validarContrasenas(
            clave,
            confirmarClave
        );

        if (!resultado.valido) {
            alert(resultado.mensaje);
            return false;
        }
    }

    if (!rol) {
        alert('Seleccione el rol de usuario.');
        return false;
    }

    if (!aceptoTerminos) {
        alert('Debe aceptar los términos y condiciones.');
        return false;
    }

    return true;
}
