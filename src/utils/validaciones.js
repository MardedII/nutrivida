// Expresión regular para correo electrónico estricto
// Exige usuario, '@', dominio y una extensión válida (.com, .cl, .org, etc.)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Expresión regular para teléfono móvil chileno (ej: +56 9 1234 5678, +56912345678 o 912345678)
const PHONE_REGEX = /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/;

// RUT chileno: valida cuerpo de 7 u 8 dígitos y dígito verificador.
export function validarRut(rut) {
    if (!rut || typeof rut !== 'string') return false;

    const limpio = rut.replace(/[.\-\s]/g, '').toUpperCase();

    // 7 u 8 números + dígito verificador (0-9 o K).
    if (!/^\d{7,8}[0-9K]$/.test(limpio)) return false;

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

// Formatea un RUT mientras se escribe.
export function formatearRut(valor) {
    let limpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();

    // Máximo: 8 dígitos + dígito verificador.
    limpio = limpio.slice(0, 9);

    if (limpio.length <= 1) return limpio;

    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);

    return `${cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`;
}


/**
 * Validación estricta para Inicio de Sesión
 */
export function validarLogin(correo, clave) {
    const correoTrim = correo ? correo.trim() : '';

    if (!correoTrim) {
        alert("Por favor, ingrese su correo electrónico.");
        return false;
    }

    // Valida que no sea 'a@a' y exija un dominio real (.com, .cl, etc.)
    if (!EMAIL_REGEX.test(correoTrim)) {
        alert("El correo electrónico no es válido. Debe incluir un dominio real (ejemplo: usuario@gmail.com o contacto@nutrivida.cl).");
        return false;
    }

    if (!clave || clave.trim().length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return false;
    }

    return true;
}

/**
 * Validación estricta para Registro de Usuarios
 */
export function validarRegistro(nombre, rut, correo, telefono, fechaNac, genero, clave, rol, aceptoTerminos) {
    // Permite recibir un objeto con los campos o parámetros individuales
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
    }

    if (!nombre || nombre.trim().length < 3) {
        alert("Por favor, ingrese su nombre completo (mínimo 3 caracteres).");
        return false;
    }

    if (!validarRut(rut)) {
        alert("El RUT ingresado no es válido. Ingrese un RUT chileno real con dígito verificador (ejemplo: 12.345.678-9).");
        return false;
    }

    if (!correo || !EMAIL_REGEX.test(correo.trim())) {
        alert("Ingrese un correo electrónico válido (ejemplo: paciente@gmail.com o usuario@nutrivida.cl).");
        return false;
    }

    if (!telefono || !PHONE_REGEX.test(telefono.trim())) {
        alert("Ingrese un teléfono móvil chileno válido (ejemplo: +56 9 1234 5678 o 912345678).");
        return false;
    }

    if (!fechaNac) {
        alert("Seleccione su fecha de nacimiento.");
        return false;
    }

    // Control de fecha y edad mínima (14 años)
    const fechaNacDate = new Date(fechaNac);
    const hoy = new Date();

    // Rechaza fechas que el navegador/usuario no pueda interpretar.
    if (Number.isNaN(fechaNacDate.getTime())) {
        alert("La fecha de nacimiento no es válida.");
        return false;
    }

    if (fechaNacDate >= hoy) {
        alert("La fecha de nacimiento no puede ser la fecha actual ni una fecha futura.");
        return false;
    }

    let edad = hoy.getFullYear() - fechaNacDate.getFullYear();
    const mesDiff = hoy.getMonth() - fechaNacDate.getMonth();
    if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < fechaNacDate.getDate())) {
        edad--;
    }

    if (edad < 14) {
        alert("El usuario debe tener al menos 14 años de edad para registrarse.");
        return false;
    }

    if (!genero) {
        alert("Seleccione su género.");
        return false;
    }

    if (!clave || clave.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return false;
    }

    if (!rol) {
        alert("Seleccione el rol de usuario.");
        return false;
    }

    if (!aceptoTerminos) {
        alert("Debe aceptar los términos y condiciones para registrarse.");
        return false;
    }

    return true;
}

// Acepta celular chileno: 9 dígitos que comienzan en 9.
// También permite escribir +56.
export function validarTelefono(telefono) {
    if (!telefono) return false;

    const limpio = telefono.replace(/[\s()+-]/g, '');

    const numero = limpio.startsWith('56')
        ? limpio.slice(2)
        : limpio;

    return /^9\d{8}$/.test(numero);
}

// Formatea el celular como +56 9 1234 5678.
export function formatearTelefono(valor) {
    let limpio = valor.replace(/\D/g, '');

    if (limpio.startsWith('56')) {
        limpio = limpio.slice(2);
    }

    // El celular chileno tiene 9 dígitos.
    limpio = limpio.slice(0, 9);

    if (!limpio) return '';

    if (limpio.length <= 1) return `+56 ${limpio}`;

    if (limpio.length <= 5) {
        return `+56 ${limpio.slice(0, 1)} ${limpio.slice(1)}`;
    }

    return `+56 ${limpio.slice(0, 1)} ${limpio.slice(1, 5)} ${limpio.slice(5)}`;
}