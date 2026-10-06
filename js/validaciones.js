function validarRegistro(nombre, rut, correo, telefono, fechaNac, genero, clave, rol, aceptoTerminos) {
    if (!nombre.trim() || nombre.length < 3) {
        alert("Por favor, ingrese su nombre completo.");
        return false;
    }
    if (!rut.trim() || rut.length < 7) {
        alert("Ingrese un número de RUT o documento válido.");
        return false;
    }
    if (!correo.includes("@") || !correo.includes(".")) {
        alert("Ingrese un correo electrónico válido.");
        return false;
    }
    if (!telefono.trim() || telefono.length < 8) {
        alert("Ingrese un teléfono válido para los recordatorios.");
        return false;
    }
    if (!fechaNac) {
        alert("Seleccione su fecha de nacimiento.");
        return false;
    }
    if (!genero) {
        alert("Seleccione su género.");
        return false;
    }
    if (clave.length < 6) {
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

function validarLogin(correo, clave) {
    if (!correo.includes("@")) {
        alert("Ingrese un correo válido.");
        return false;
    }
    if (!clave || clave.length < 4) {
        alert("Ingrese su contraseña.");
        return false;
    }
    return true;
}