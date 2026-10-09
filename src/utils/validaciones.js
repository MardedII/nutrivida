// Expresión regular para correo electrónico estricto
// Exige usuario, '@', dominio y una extensión válida (.com, .cl, .org, etc.)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Expresión regular para teléfono móvil chileno (ej: +56 9 1234 5678, +56912345678 o 912345678)
const PHONE_REGEX = /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/;

/**
 * Valida un RUT chileno mediante el algoritmo Módulo 11
 */
export function validarRut(rut) {
    if (!rut || typeof rut !== 'string') return false;
    
    // Limpia puntos y guión
    const limpio = rut.replace(/[^0-9kK]/g, '');
    if (limpio.length < 8) return false;

    const cuerpo = limpio.slice(0, -1);
    const dvIngresado = limpio.slice(-1).toUpperCase();

    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const dvEsperadoNum = 11 - (suma % 11);
    let dvEsperado = '';
    if (dvEsperadoNum === 11) dvEsperado = '0';
    else if (dvEsperadoNum === 10) dvEsperado = 'K';
    else dvEsperado = dvEsperadoNum.toString();

    return dvIngresado === dvEsperado;
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