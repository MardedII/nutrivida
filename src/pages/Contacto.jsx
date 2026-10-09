import React from 'react';
import Map from '../component/Map';

export default function Contacto() {
    return (
        <main className="container my-5">
            <div className="row align-items-center bg-white p-4 rounded shadow-sm">
                <div className="col-md-5 mb-4 mb-md-0">
                    <h3 className="fw-bold text-nutri mb-3">
                        <i className="bi bi-geo-alt-fill text-danger me-2"></i>Nuestra Ubicación
                    </h3>
                    <p><strong>Dirección:</strong> Av. Alemania #0855, Temuco, Región de La Araucanía, Chile</p>
                    <p><strong>Teléfono:</strong> +56 45 2 123456</p>
                    <p><strong>Correo:</strong> contacto@nutrivida.cl</p>
                    <p><strong>Horarios:</strong> Lunes a Viernes de 09:00 a 18:00 hrs.</p>
                </div>
                <div className="col-md-7">
                    <Map />
                </div>
            </div>
        </main>
    );
}