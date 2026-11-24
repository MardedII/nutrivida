// Política de navegación del frontend. La API sigue validando los permisos reales.
const PANELES = Object.freeze({
    admin: '/panel-admin',
    nutricionista: '/panel-medico',
    paciente: '/panel-paciente'
});

export function rolSesion(usuario) {
    const rol = usuario?.rol;
    return Object.prototype.hasOwnProperty.call(PANELES, rol) ? rol : null;
}

export function rutaPanel(usuario) {
    return PANELES[rolSesion(usuario)] || null;
}

export function esPersonal(usuario) {
    const rol = rolSesion(usuario);
    return rol === 'admin' || rol === 'nutricionista';
}

export function redireccionRuta(ruta, usuario) {
    const rol = rolSesion(usuario);
    const panel = rutaPanel(usuario);

    switch (ruta) {
        case '/':
        case '/contacto':
            return esPersonal(usuario) ? panel : null;
        case '/login':
        case '/registro':
            return panel;
        case '/agendar':
            return rol === 'paciente' ? null : (panel || '/login');
        case '/panel-admin':
        case '/panel-medico':
        case '/panel-paciente':
            return panel === ruta ? null : (panel || '/login');
        default:
            return panel || '/';
    }
}
