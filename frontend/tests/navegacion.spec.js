import { esPersonal, rutaPanel, redireccionRuta } from '../src/utils/navegacion';

// null significa que la ruta solicitada se puede mostrar sin redirección.
const rutas = ['/', '/contacto', '/login', '/registro', '/agendar', '/panel-admin', '/panel-medico', '/panel-paciente', '*'];
const casos = [
    { rol: null, destinos: [null, null, null, null, '/login', '/login', '/login', '/login', '/'] },
    { rol: 'admin', destinos: ['/panel-admin', '/panel-admin', '/panel-admin', '/panel-admin', '/panel-admin', null, '/panel-admin', '/panel-admin', '/panel-admin'] },
    { rol: 'nutricionista', destinos: ['/panel-medico', '/panel-medico', '/panel-medico', '/panel-medico', '/panel-medico', '/panel-medico', null, '/panel-medico', '/panel-medico'] },
    { rol: 'paciente', destinos: [null, null, '/panel-paciente', '/panel-paciente', null, '/panel-paciente', '/panel-paciente', null, '/panel-paciente'] }
];

describe('Navegación por rol', () => {
    casos.forEach(({ rol, destinos }) => {
        const usuario = rol ? { rol } : null;
        rutas.forEach((ruta, i) => {
            it(`${rol || 'visitante'}: ${ruta}`, () => {
                expect(redireccionRuta(ruta, usuario)).toBe(destinos[i]);
                if (destinos[i]) expect(redireccionRuta(destinos[i], usuario)).toBeNull();
            });
        });
    });
    it('solo oculta Home y Footer al personal', () => {
        expect(esPersonal({ rol: 'admin' })).toBeTrue();
        expect(esPersonal({ rol: 'nutricionista' })).toBeTrue();
        expect(esPersonal({ rol: 'paciente' })).toBeFalse();
        expect(esPersonal(null)).toBeFalse();
    });
    it('no reconoce roles desconocidos', () => {
        expect(rutaPanel({ rol: 'invalido' })).toBeNull();
        expect(redireccionRuta('/panel-admin', { rol: 'invalido' })).toBe('/login');
    });
});
